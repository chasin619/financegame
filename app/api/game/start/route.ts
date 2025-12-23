import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createInitialState, NORMAL_MODE, HARD_MODE } from '@/lib/simulation/config';
import { generateOffers } from '@/lib/simulation/offers';
import { makeGuruDecisions } from '@/lib/simulation/guru';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('Auth check:', { user: user?.id, authError });
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mode } = await request.json();
    
    console.log('Creating run for user:', user.id);
    
    const config = mode === 'hard' ? HARD_MODE : NORMAL_MODE;
    const initialState = createInitialState(config);
    
    const { data: run, error: runError } = await supabase
      .from('runs')
      .insert({
        user_id: user.id,
        mode,
        status: 'active',
        current_month: 0,
        config: config,
      })
      .select()
      .single();
    
    if (runError) {
      console.error('Run creation error:', runError);
      return NextResponse.json({ error: runError.message }, { status: 500 });
    }
    
    console.log('Run created:', run.id);
    
    const offers = generateOffers(initialState, run.id);
    const guruResult = makeGuruDecisions(initialState, offers);
    
    console.log('Guru result:', guruResult);
    
    const { error: stateError } = await supabase
      .from('month_states')
      .insert({
        run_id: run.id,
        month_number: 0,
        player_state: initialState,
        guru_state: initialState,
        offers: offers,
      });
    
    if (stateError) {
      console.error('State creation error:', stateError);
      return NextResponse.json({ error: stateError.message }, { status: 500 });
    }
    
    // Only insert decisions if there are temptations
    if (guruResult.decisions && guruResult.decisions.temptations && guruResult.decisions.temptations.length > 0) {
      const decisionsToInsert = guruResult.decisions.temptations.map((d, idx) => ({
        run_id: run.id,
        month_number: 0,
        actor: 'guru',
        decision_type: 'temptation',
        payload: d,
        explanation: guruResult.explanations[idx] || '',
      }));
      
      const { error: decisionsError } = await supabase
        .from('decisions')
        .insert(decisionsToInsert);
      
      if (decisionsError) {
        console.error('Decisions creation error:', decisionsError);
      }
    }
    
    return NextResponse.json({ 
      runId: run.id,
      initialState,
      offers,
      guruExplanations: guruResult.explanations || [],
    });
    
  } catch (error) {
    console.error('Start game error:', error);
    return NextResponse.json({ 
      error: 'Failed to start game',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}