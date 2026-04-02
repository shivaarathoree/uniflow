import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Enforce free tier limit (3 habits)
  const { data: sub } = await supabase.from('subscriptions').select('plan').eq('user_id', user.id).single();
  const isPro = sub?.plan === 'pro';

  if (!isPro) {
    const { count } = await supabase.from('habits').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).eq('is_archived', false);
    if ((count || 0) >= 3) {
      return NextResponse.json({ error: 'Free tier limit: upgrade to Pro for unlimited habits.' }, { status: 403 });
    }
  }

  const body = await request.json();
  const { name, icon, color, frequency, target_minutes } = body;

  const { data, error } = await supabase.from('habits').insert([{
    user_id: user.id, name, icon: icon || '⭐', color: color || '#fde047',
    frequency: frequency || 'daily', target_minutes: target_minutes || 30,
    is_archived: false,
  }]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
