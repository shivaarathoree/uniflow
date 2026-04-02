'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Layers, LayoutDashboard, ListTodo, Bot, PieChart, Settings, Zap, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SidebarProps {
  userName: string;
  isPro: boolean;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/habits', label: 'All Habits', icon: ListTodo },
  { href: '/dashboard/coach', label: 'AI Coach', icon: Bot },
  { href: '/dashboard/analytics', label: 'Analytics', icon: PieChart },
];

export default function Sidebar({ userName, isPro }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
    router.refresh();
  };

  return (
    <aside className="w-64 border-r-2 border-black bg-white flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        <div className="h-20 border-b-2 border-black flex items-center px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#86efac] rounded border-2 border-black flex items-center justify-center brutal-shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading">UNIFLOW</span>
          </Link>
        </div>
        <nav className="p-4 flex flex-col gap-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#fde047] border-black brutal-shadow-sm font-bold text-black'
                    : 'border-transparent hover:border-black text-zinc-600 hover:text-black hover:bg-zinc-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${label === 'AI Coach' && !isActive ? 'text-indigo-500' : ''}`} />
                {label}
              </Link>
            );
          })}

          {!isPro && (
            <Link
              href="/dashboard/billing"
              className="flex items-center justify-between px-4 py-3 bg-[#fde047] rounded-xl border-2 border-black brutal-shadow-sm font-bold text-black mt-4 group"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                Upgrade to Pro
              </div>
            </Link>
          )}
        </nav>
      </div>

      <div className="p-4 border-t-2 border-black">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-semibold transition-colors ${
            pathname === '/dashboard/settings'
              ? 'bg-[#fde047] border-black'
              : 'border-transparent hover:border-black text-zinc-600 hover:text-black hover:bg-zinc-50'
          }`}
        >
          <Settings className="w-5 h-5" /> Settings
        </Link>
        <div className="mt-4 flex items-center gap-3 px-4">
          <div className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate">{userName || 'User'}</div>
            <div className="text-xs text-zinc-500 font-medium">{isPro ? 'Pro Plan' : 'Free Tier'}</div>
          </div>
          <button onClick={handleLogout} className="text-zinc-400 hover:text-red-500 transition-colors" title="Log out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
