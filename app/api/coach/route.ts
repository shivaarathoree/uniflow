import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const todayDate = new Date().toISOString().split('T')[0];

  // Check daily message limit for free users
  const { data: sub } = await supabase.from('subscriptions').select('plan').eq('user_id', user.id).single();
  const isPro = sub?.plan === 'pro';

  if (!isPro) {
    const { count } = await supabase.from('coach_messages')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('role', 'user')
      .gte('created_at', todayDate);
    if ((count || 0) >= 10) {
      return NextResponse.json({
        error: 'Daily limit reached. Upgrade to Pro for unlimited AI coaching.',
        limitReached: true,
      }, { status: 429 });
    }
  }

  const { message } = await request.json();
  if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 });

  // Get user's habits + today's completion
  const { data: habits } = await supabase.from('habits').select('*').eq('user_id', user.id).eq('is_archived', false);
  const { data: todayLogs } = await supabase.from('habit_logs').select('*').eq('user_id', user.id).eq('logged_date', todayDate);

  // Build habit context
  const habitContext = habits?.map(h => {
    const log = todayLogs?.find(l => l.habit_id === h.id);
    return `- ${h.name} (${h.frequency}): ${log?.completed ? '✅ Done today' : '⏳ Not done yet'}`;
  }).join('\n') || 'No habits set up yet.';

  // Get recent chat history (last 10 messages)
  const { data: history } = await supabase.from('coach_messages')
    .select('role, content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    {
      role: 'system',
      content: `You are Aura, an honest and motivating AI habit coach for UNIFLOW. You are direct, warm but never cheesy. You have access to the user's habit data.

TODAY'S HABITS:
${habitContext}

Today's date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Rules:
- Be concise (2-4 sentences max unless asked for detail)
- Be honest and direct — no toxic positivity
- Reference their actual habit data when relevant
- If they say they did a habit, acknowledge it and log it explicitly
- Celebrate streaks but don't be annoying about it
- Use "🌊 flow" language occasionally (UNIFLOW's brand)`,
    },
    ...(history?.reverse().map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })) || []),
    { role: 'user', content: message },
  ];

  try {
    const completion = await gemini.chat.completions.create({
      model: 'gemini-2.5-flash',
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "I'm having trouble right now. Try again in a moment.";

    // Save user message + reply to DB
    await supabase.from('coach_messages').insert([
      { user_id: user.id, role: 'user', content: message },
      { user_id: user.id, role: 'assistant', content: reply },
    ]);

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error('Gemini API error:', err);
    const error = err as { message?: string };
    return NextResponse.json({ error: error.message || 'AI service error' }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase.from('coach_messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(50);

  return NextResponse.json(data || []);
}
