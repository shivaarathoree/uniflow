import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth');

  // Get subscription status — default to free if no row exists yet
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .maybeSingle();  // use maybeSingle so no error if row doesn't exist

  // If no subscription row yet, create one for this user (handles edge case)
  if (!sub) {
    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      plan: 'free',
      status: 'active',
    }, { onConflict: 'user_id' });
  }

  const isPro = sub?.plan === 'pro';
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="flex h-screen overflow-hidden bg-[#fffdf7]">
      <Sidebar userName={userName} isPro={isPro} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
