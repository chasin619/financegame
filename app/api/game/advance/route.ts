import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processMonth } from '@/lib/simulation/engine';
import { GameState, PlayerDecision } from '@/types/game';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { runId, currentMonth } = await request.json();
    
    // Get current state
    const { data: currentState, error: stateError } = await supabase
      .from('month_states')
      .select('*')
      .eq('run_id', runId)
      .eq('month_number', currentMonth)
      .single();
    
    if (stateError || !currentState) {
      console.error('State fetch error:', stateError);
      return NextResponse.json({ error: 'State not found' }, { status: 404 });
    }
    
    // Get player decisions
    const { data: playerDecisionsData, error: decisionsError } = await supabase
      .from('decisions')
      .select('*')
      .eq('run_id', runId)
      .eq('month_number', currentMonth)
      .eq('actor', 'player');
    
    if (decisionsError) {
      console.error('Decisions fetch error:', decisionsError);
      return NextResponse.json({ error: 'Decisions not found' }, { status: 404 });
    }
    
    // Reconstruct player decisions
    const playerDecisions: PlayerDecision = {
      temptations: [],
      creditCardPayment: { type: 'minimum' },
    };
    
    for (const d of playerDecisionsData || []) {
      if (d.decision_type === 'temptation') {
        playerDecisions.temptations.push(d.payload);
      } else if (d.decision_type === 'car') {
        playerDecisions.car = d.payload;
      } else if (d.decision_type === 'payment') {
        playerDecisions.creditCardPayment = d.payload;
      }
    }
    
    // Make sure states are properly typed with defaults
    const playerState = currentState.player_state as GameState;
    const guruState = currentState.guru_state as GameState;
    
    // CRITICAL: Ensure purchaseHistory exists and is an array
    if (!playerState.purchaseHistory || !Array.isArray(playerState.purchaseHistory)) {
      playerState.purchaseHistory = [];
    }
    if (!guruState.purchaseHistory || !Array.isArray(guruState.purchaseHistory)) {
      guruState.purchaseHistory = [];
    }
    
    const offers = currentState.offers;
    
    console.log('Processing month with states:', {
      playerHasCredit: !!playerState.creditCard,
      guruHasCredit: !!guruState.creditCard,
      playerCash: playerState.cash,
      guruCash: guruState.cash,
      playerPurchaseCount: playerState.purchaseHistory.length,
      guruPurchaseCount: guruState.purchaseHistory.length,
    });
    
    // Process the month
    const result = processMonth(
      playerState,
      guruState,
      playerDecisions,
      offers,
      runId
    );
    
    const nextMonth = currentMonth + 1;
    
    console.log('After processing:', {
      playerPurchaseCount: result.newPlayerState.purchaseHistory.length,
      guruPurchaseCount: result.newGuruState.purchaseHistory.length,
    });
    
    // Save new state
    const { error: newStateError } = await supabase
      .from('month_states')
      .insert({
        run_id: runId,
        month_number: nextMonth,
        player_state: result.newPlayerState,
        guru_state: result.newGuruState,
        offers: result.newOffers,
      });
    
    if (newStateError) {
      console.error('New state save error:', newStateError);
      return NextResponse.json({ error: 'Failed to save state' }, { status: 500 });
    }
    
    // Update run
    const { error: runUpdateError } = await supabase
      .from('runs')
      .update({ 
        current_month: nextMonth,
        updated_at: new Date().toISOString(),
      })
      .eq('id', runId);
    
    if (runUpdateError) {
      console.error('Run update error:', runUpdateError);
    }
    
    return NextResponse.json({
      newState: {
        player: result.newPlayerState,
        guru: result.newGuruState,
        offers: result.newOffers,
        guruExplanations: result.guruExplanations,
      },
    });
    
  } catch (error) {
    console.error('Advance error:', error);
    return NextResponse.json({ 
      error: 'Failed to advance',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}