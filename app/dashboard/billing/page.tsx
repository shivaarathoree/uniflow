'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, X, Zap } from 'lucide-react';
import Link from 'next/link';

declare global {
  interface Window {
    Razorpay: new (options: object) => { open: () => void };
  }
}

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [habitsUsed, setHabitsUsed] = useState(0);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);

    fetch('/api/habits').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setHabitsUsed(d.length);
    });
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await fetch('/api/billing/create-subscription', { method: 'POST' });
    const data = await res.json();

    if (res.status === 503) {
      alert('Payments coming soon! Razorpay is not configured yet.');
      setLoading(false);
      return;
    }

    if (!data.subscriptionId) {
      alert(data.error || 'Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: data.subscriptionId,
      name: 'UNIFLOW Pro',
      description: 'Unlimited habits, AI coaching, and lifetime analytics',
      theme: { color: '#fde047' },
      handler: () => {
        setIsPro(true);
        setLoading(false);
        alert('🎉 Welcome to UNIFLOW Pro! Refresh the page to see your new benefits.');
      },
    };

    if (typeof window.Razorpay === 'undefined') {
      alert('Razorpay is loading. Please try again in a moment.');
      setLoading(false);
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  const freeFeatures = [
    { text: 'Up to 3 Active Habits', included: true },
    { text: 'Basic 7-Day Analytics', included: true },
    { text: '5 AI Coach messages / day', included: true },
    { text: 'Do-or-Die Monetary Stakes', included: false },
    { text: 'Export Dashboard Data', included: false },
    { text: 'Lifetime Analytics & Heatmaps', included: false },
  ];

  const proFeatures = [
    'Unlimited Active Habits',
    'Lifetime Analytics & Heatmaps',
    'Unlimited AI Coach Messaging',
    'Do-or-Die Accountability Stakes',
    'One-Click CSV Exports',
    'Priority Support',
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#ff9ebb] border-2 border-black px-4 py-1.5 rounded-full brutal-shadow-sm mb-6 font-bold uppercase tracking-widest text-sm transform -rotate-2">
            <Zap className="w-4 h-4 fill-black" /> UNIFLOW PRO
          </div>
          <h1 className="text-4xl md:text-6xl font-medium font-heading mb-4">Unlock ultimate consistency.</h1>
          <p className="text-xl text-zinc-600 font-medium max-w-2xl mx-auto">
            {isPro
              ? 'You are on Pro! Enjoy unlimited habits, coaching, and deep analytics.'
              : `You're using the Free Tier (${habitsUsed}/3 habits). Upgrade for unlimited access.`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-end mb-16">
          {/* Free */}
          <div className="bg-white border-2 border-black p-8 rounded-3xl brutal-shadow-sm opacity-90">
            <div className="mb-6">
              <span className="text-2xl font-bold block mb-2 font-heading">Free Flow</span>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-medium">₹0</span>
                <span className="text-zinc-500 font-bold">/ forever</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 font-semibold">
              {freeFeatures.map(f => (
                <li key={f.text} className={`flex items-center gap-3 ${f.included ? 'text-black' : 'text-zinc-400'}`}>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${f.included ? 'bg-zinc-200 border-black' : 'border-zinc-300'}`}>
                    {f.included ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  </div>
                  {f.text}
                </li>
              ))}
            </ul>
            <button disabled className="w-full py-4 border-2 border-black rounded-xl font-bold bg-zinc-100 text-zinc-400 cursor-not-allowed">
              {isPro ? 'Previous Plan' : 'Current Plan'}
            </button>
          </div>

          {/* Pro */}
          <div className="bg-black text-white border-2 border-black p-8 rounded-3xl brutal-shadow-lg transform scale-105 relative z-10 shadow-[8px_8px_0px_#fde047]">
            <div className="absolute -top-4 right-6 bg-[#fde047] text-black px-4 py-1 border-2 border-black rounded-full font-bold text-sm transform rotate-3 brutal-shadow-sm">
              Most Popular ✨
            </div>
            <div className="mb-6">
              <span className="text-2xl font-bold block mb-2 text-yellow-400 font-heading">UNIFLOW Pro</span>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-medium">₹399</span>
                <span className="text-zinc-400 font-bold">/ month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 font-semibold">
              {proFeatures.map(f => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 text-black border border-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            {isPro ? (
              <div className="w-full py-4 border-2 border-[#86efac] rounded-xl font-bold bg-[#86efac] text-black text-lg text-center">
                ✅ You're Pro!
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-4 border-2 border-white rounded-xl font-bold bg-[#fde047] text-black text-lg hover:bg-yellow-300 transition-colors shadow-[4px_4px_0px_#fff] disabled:opacity-60"
              >
                {loading ? 'Loading...' : 'Upgrade to Pro'}
              </button>
            )}
            <p className="text-center text-xs text-zinc-500 mt-4 font-bold">Cancel anytime. No lock-ins.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold font-heading mb-6 text-center">Common Questions</h2>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your Razorpay dashboard or email us. You keep Pro access until the period ends.' },
            { q: 'Is my data safe?', a: 'Absolutely. We use Supabase with Row Level Security — your data is only ever accessible to you.' },
            { q: 'What payment methods are accepted?', a: 'All major Indian cards, UPI (GPay, PhonePe, Paytm), Net Banking, and wallets via Razorpay.' },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white border-2 border-black rounded-xl p-5 brutal-shadow-sm mb-4">
              <div className="font-bold mb-1">{q}</div>
              <div className="text-zinc-600 font-medium text-sm">{a}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/dashboard" className="text-sm font-bold text-zinc-500 hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
