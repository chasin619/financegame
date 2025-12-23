import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GameState } from '@/types/game';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ runId: string }> }
) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // FIXED: Await params
    const params = await context.params;
    const runId = params.runId;
    
    // Get run
    const { data: run, error: runError } = await supabase
      .from('runs')
      .select('*')
      .eq('id', runId)
      .eq('user_id', user.id)
      .single();
    
    if (runError || !run) {
      return NextResponse.json({ error: 'Run not found' }, { status: 404 });
    }
    
    // Get current state
    const { data: currentState, error: stateError } = await supabase
      .from('month_states')
      .select('*')
      .eq('run_id', runId)
      .eq('month_number', run.current_month)
      .single();
    
    if (stateError || !currentState) {
      return NextResponse.json({ error: 'State not found' }, { status: 404 });
    }
    
    // Ensure states have purchaseHistory
    const playerState = currentState.player_state as GameState;
    const guruState = currentState.guru_state as GameState;
    
    if (!playerState.purchaseHistory || !Array.isArray(playerState.purchaseHistory)) {
      playerState.purchaseHistory = [];
    }
    if (!guruState.purchaseHistory || !Array.isArray(guruState.purchaseHistory)) {
      guruState.purchaseHistory = [];
    }
    
    return NextResponse.json({
      run,
      currentState: {
        player: playerState,
        guru: guruState,
        offers: currentState.offers,
        guruExplanations: [],
      },
    });
    
  } catch (error) {
    console.error('Get state error:', error);
    return NextResponse.json({ error: 'Failed to get state' }, { status: 500 });
  }
}