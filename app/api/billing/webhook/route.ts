import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-razorpay-signature');
  const secret = process.env.RAZORPAY_KEY_SECRET!;

  // Verify webhook signature
  const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex');
  if (signature !== expectedSig) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);
  const { event: eventType, payload } = event;

  if (eventType === 'subscription.activated') {
    const sub = payload.subscription.entity;
    const userId = sub.notes?.user_id;
    if (userId) {
      await supabaseAdmin.from('subscriptions').upsert({
        user_id: userId,
        plan: 'pro',
        razorpay_subscription_id: sub.id,
        status: 'active',
        current_period_end: new Date(sub.current_end * 1000).toISOString(),
      }, { onConflict: 'user_id' });
    }
  }

  if (eventType === 'subscription.cancelled' || eventType === 'subscription.halted') {
    const sub = payload.subscription.entity;
    const userId = sub.notes?.user_id;
    if (userId) {
      await supabaseAdmin.from('subscriptions').update({ plan: 'free', status: 'cancelled' }).eq('user_id', userId);
    }
  }

  return NextResponse.json({ received: true });
}
