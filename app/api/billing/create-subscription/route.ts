import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const planId = process.env.RAZORPAY_PLAN_ID;

  if (!keyId || !keySecret || !planId) {
    return NextResponse.json({ error: 'Billing not configured yet. Add Razorpay keys to .env.local.' }, { status: 503 });
  }

  try {
    // Dynamic import so it doesn't crash at build time with missing keys
    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      quantity: 1,
      total_count: 12,
      notes: { user_id: user.id, email: user.email || '' },
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (err: unknown) {
    console.error('Razorpay error:', err);
    const error = err as { message?: string };
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
