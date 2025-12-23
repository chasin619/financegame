import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { runId, month, decisions } = await request.json();
    
    console.log('Saving decisions:', {
      runId,
      month,
      temptations: decisions.temptations,
      car: decisions.car,
      payment: decisions.creditCardPayment,
    });
    
    const decisionsToInsert = [];
    
    // Save temptation decisions
    for (const temptation of decisions.temptations || []) {
      decisionsToInsert.push({
        run_id: runId,
        month_number: month,
        actor: 'player',
        decision_type: 'temptation',
        payload: temptation,
      });
    }
    
    // Save car decision
    if (decisions.car) {
      decisionsToInsert.push({
        run_id: runId,
        month_number: month,
        actor: 'player',
        decision_type: 'car',
        payload: decisions.car,
      });
    }
    
    // Save payment decision
    if (decisions.creditCardPayment) {
      decisionsToInsert.push({
        run_id: runId,
        month_number: month,
        actor: 'player',
        decision_type: 'payment',
        payload: decisions.creditCardPayment,
      });
    }
    
    console.log('Inserting decisions:', decisionsToInsert);
    
    if (decisionsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('decisions')
        .insert(decisionsToInsert);
      
      if (insertError) {
        console.error('Decision insert error:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Save decisions error:', error);
    return NextResponse.json({ error: 'Failed to save decisions' }, { status: 500 });
  }
}