import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { completed, notes } = await request.json();
  const today = new Date().toISOString().split('T')[0];

  // Upsert — one log per habit per day
  const { data, error } = await supabase.from('habit_logs').upsert({
    habit_id: params.id,
    user_id: user.id,
    logged_date: today,
    completed: completed ?? true,
    notes: notes || null,
    logged_at: new Date().toISOString(),
  }, { onConflict: 'habit_id,logged_date' }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Last 90 days
  const since = new Date();
  since.setDate(since.getDate() - 90);

  const { data, error } = await supabase.from('habit_logs')
    .select('*')
    .eq('habit_id', params.id)
    .eq('user_id', user.id)
    .gte('logged_date', since.toISOString().split('T')[0])
    .order('logged_date', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
