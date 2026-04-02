'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Flame, Target, Plus, Sparkles, ArrowRight, BarChart3 } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: string;
  target_minutes: number;
}

interface HabitLog {
  habit_id: string;
  completed: boolean;
  logged_date: string;
}

function calculateStreak(logs: HabitLog[], habitId: string): number {
  const completed = logs
    .filter(l => l.habit_id === habitId && l.completed)
    .map(l => l.logged_date)
    .sort()
    .reverse();

  if (!completed.length) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < completed.length; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (completed[i] === dateStr) streak++;
    else break;
  }
  return streak;
}

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<HabitLog[]>([]);
  const [allLogs, setAllLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [auraMsg] = useState([
    "Great habits compound into great outcomes. Keep showing up!",
    "Consistency beats perfection every single time.",
    "Your future self is watching what you do today.",
    "One more day of showing up. That's the whole game.",
  ][Math.floor(Math.random() * 4)]);

  const today = new Date().toISOString().split('T')[0];
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const fetchData = useCallback(async () => {
    const [habitsRes, logsRes] = await Promise.all([
      fetch('/api/habits'),
      fetch('/api/analytics/logs'),
    ]);
    const habitsData = await habitsRes.json();
    const logsData = await logsRes.json();
    setHabits(Array.isArray(habitsData) ? habitsData : []);
    const todayOnly = (Array.isArray(logsData) ? logsData : []).filter((l: HabitLog) => l.logged_date === today);
    setTodayLogs(todayOnly);
    setAllLogs(Array.isArray(logsData) ? logsData : []);
    setLoading(false);
  }, [today]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleHabit = async (habitId: string) => {
    const isCompleted = todayLogs.find(l => l.habit_id === habitId)?.completed;
    const optimistic: HabitLog = { habit_id: habitId, completed: !isCompleted, logged_date: today };
    setTodayLogs(prev => {
      const filtered = prev.filter(l => l.habit_id !== habitId);
      return [...filtered, optimistic];
    });
    await fetch(`/api/habits/${habitId}/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !isCompleted }),
    });
  };

  const doneToday = todayLogs.filter(l => l.completed).length;
  const totalHabits = habits.length;
  const overallStreak = habits.length > 0
    ? Math.max(...habits.map(h => calculateStreak(allLogs, h.id)))
    : 0;

  const weekDays = ['M','T','W','T','F','S','S'];
  const weekCompletion = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayDateStr = d.toISOString().split('T')[0];
    const dayLogs = allLogs.filter(l => l.logged_date === dayDateStr && l.completed);
    return habits.length ? Math.round((dayLogs.length / habits.length) * 100) : 0;
  });

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-black border-t-[#86efac] rounded-full animate-spin mx-auto mb-4" />
        <p className="font-bold text-zinc-500">Loading your flow...</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-10 items-end justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium mb-2 font-heading">
            {greeting}, <span className="text-blue-600 font-bold">champ</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg">{dateStr}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-black text-white px-6 py-3 rounded-xl border-2 border-black brutal-shadow flex items-center gap-3">
            <Flame className="text-orange-400" />
            <div>
              <div className="text-xs font-bold text-zinc-400">Best Streak</div>
              <div className="text-xl font-bold">{overallStreak} Days</div>
            </div>
          </div>
          <div className="bg-white px-6 py-3 rounded-xl border-2 border-black brutal-shadow flex items-center gap-3">
            <Target className="text-green-500" />
            <div>
              <div className="text-xs font-bold text-zinc-500">Today's Progress</div>
              <div className="text-xl font-bold">{doneToday}/{totalHabits} Done</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Habits List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold font-heading">Today's Habits</h2>
            <Link href="/dashboard/habits" className="w-10 h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center brutal-shadow brutal-hover">
              <Plus className="w-5 h-5" />
            </Link>
          </div>

          {habits.length === 0 ? (
            <div className="bg-white border-2 border-black rounded-2xl p-10 text-center brutal-shadow">
              <div className="text-6xl mb-4">🌊</div>
              <h3 className="text-xl font-bold mb-2 font-heading">No habits yet</h3>
              <p className="text-zinc-500 mb-6">Create your first habit to start building your flow.</p>
              <Link href="/dashboard/habits" className="bg-[#fde047] border-2 border-black px-6 py-3 rounded-xl font-bold brutal-shadow brutal-hover inline-block">
                Add First Habit
              </Link>
            </div>
          ) : (
            habits.map(habit => {
              const isCompleted = todayLogs.find(l => l.habit_id === habit.id)?.completed;
              const streak = calculateStreak(allLogs, habit.id);
              return (
                <div
                  key={habit.id}
                  className={`p-5 rounded-2xl border-2 border-black flex items-center gap-5 brutal-shadow-sm transition-all duration-300 ${isCompleted ? 'bg-zinc-100' : 'bg-white hover:translate-x-1'}`}
                >
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center transition-all flex-shrink-0 ${isCompleted ? 'bg-[#86efac]' : 'bg-white'}`}
                  >
                    {isCompleted && <span className="text-xs font-bold">✓</span>}
                  </button>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded border-2 border-black flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: habit.color + '40' }}>
                        {habit.icon}
                      </div>
                      <div>
                        <h3 className={`font-bold text-xl font-heading ${isCompleted ? 'line-through opacity-60' : ''}`}>{habit.name}</h3>
                        <p className="text-sm font-semibold text-zinc-500">{habit.frequency} • {habit.target_minutes}m</p>
                      </div>
                    </div>
                    {streak > 0 && (
                      <div className="font-bold text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full border border-orange-300">
                        {streak} Day Streak 🔥
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Aura AI Coach Widget */}
          <div className="bg-[#18181b] text-white p-6 rounded-2xl border-2 border-black brutal-shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full blur-xl opacity-30" />
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 relative z-10 font-heading">
              <Sparkles className="w-5 h-5 text-yellow-400" /> AI Coach
            </h2>
            <p className="text-zinc-300 font-medium text-sm mb-6 leading-relaxed relative z-10 italic">
              "{auraMsg}"
            </p>
            <Link href="/dashboard/coach" className="w-full py-3 bg-white text-black rounded-lg font-bold border-2 border-transparent hover:border-black transition-all flex items-center justify-center gap-2 relative z-10 hover:shadow-[2px_2px_0px_#86efac]">
              Chat with Aura <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Weekly View */}
          <div className="bg-white p-6 rounded-2xl border-2 border-black brutal-shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold font-heading">Weekly View</h3>
              <Link href="/dashboard/analytics" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                Full Stats <BarChart3 className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex justify-between items-end h-32 gap-2">
              {weekCompletion.map((pct, i) => {
                const isToday = i === 6;
                return (
                  <div key={i} className="w-full flex flex-col items-center gap-1">
                    <div className="w-full relative group" style={{ height: '100%' }}>
                      <div
                        className={`w-full rounded-t-md border-2 border-black ${isToday ? 'bg-[#fde047]' : pct > 0 ? 'bg-blue-400' : 'bg-zinc-100 border-dashed border-zinc-300'}`}
                        style={{ height: `${Math.max(pct, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-3 text-xs font-bold text-zinc-400">
              {weekDays.map((d, i) => (
                <span key={i} className={i === 6 ? 'text-black' : ''}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
