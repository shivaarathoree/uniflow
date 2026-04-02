'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Calendar, Target } from 'lucide-react';

interface HabitLog {
  habit_id: string;
  completed: boolean;
  logged_date: string;
}
interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
}

function getIntensity(count: number, max: number) {
  if (count === 0) return 'bg-zinc-100 border-zinc-200';
  const pct = count / max;
  if (pct < 0.25) return 'bg-green-200 border-green-300';
  if (pct < 0.5) return 'bg-green-400 border-green-500';
  if (pct < 0.75) return 'bg-green-500 border-green-600';
  return 'bg-green-700 border-green-800';
}

export default function AnalyticsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    const [hr, lr] = await Promise.all([fetch('/api/habits'), fetch('/api/analytics/logs')]);
    const h = await hr.json();
    const l = await lr.json();
    setHabits(Array.isArray(h) ? h : []);
    setLogs(Array.isArray(l) ? l : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  // Build 90-day heatmap
  const heatmapData = Array.from({ length: 90 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (89 - i));
    const dateStr = d.toISOString().split('T')[0];
    const count = logs.filter(l => l.logged_date === dateStr && l.completed).length;
    return { date: dateStr, count, label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) };
  });
  const maxCount = Math.max(...heatmapData.map(d => d.count), 1);

  // Stats
  const totalCompleted = logs.filter(l => l.completed).length;
  const uniqueDays = new Set(logs.filter(l => l.completed).map(l => l.logged_date)).size;
  const last7 = logs.filter(l => {
    const d = new Date(l.logged_date);
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
    return d >= cutoff && l.completed;
  });
  const weekRate = habits.length > 0 ? Math.round((last7.length / (habits.length * 7)) * 100) : 0;

  // Per-habit completion
  const habitStats = habits.map(h => {
    const hLogs = logs.filter(l => l.habit_id === h.id && l.completed);
    const pct = logs.filter(l => l.habit_id === h.id).length > 0
      ? Math.round((hLogs.length / Math.max(logs.filter(l => l.habit_id === h.id).length, 1)) * 100) : 0;
    return { ...h, completed: hLogs.length, pct };
  });

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-black border-t-[#86efac] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-medium font-heading mb-2">Analytics</h1>
        <p className="text-zinc-500 font-medium mb-8">Your 90-day consistency overview</p>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Completions', value: totalCompleted, icon: Target, color: 'bg-[#86efac]' },
            { label: 'Consistent Days', value: uniqueDays, icon: Calendar, color: 'bg-[#bfdbfe]' },
            { label: 'This Week Rate', value: `${weekRate}%`, icon: TrendingUp, color: 'bg-[#fde047]' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`${color} p-6 rounded-2xl border-2 border-black brutal-shadow`}>
              <Icon className="w-6 h-6 mb-3" />
              <div className="text-3xl font-bold font-heading mb-1">{value}</div>
              <div className="text-sm font-semibold text-zinc-700">{label}</div>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 brutal-shadow mb-8">
          <h2 className="text-xl font-bold font-heading mb-6">90-Day Heatmap</h2>
          <div className="flex flex-wrap gap-1.5">
            {heatmapData.map(d => (
              <div
                key={d.date}
                title={`${d.label}: ${d.count} habits completed`}
                className={`w-4 h-4 rounded border cursor-pointer hover:scale-125 transition-transform ${getIntensity(d.count, maxCount)}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-zinc-500">
            <span>Less</span>
            {['bg-zinc-100','bg-green-200','bg-green-400','bg-green-500','bg-green-700'].map(c => (
              <div key={c} className={`w-4 h-4 rounded border border-zinc-200 ${c}`} />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Per-Habit Breakdown */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 brutal-shadow">
          <h2 className="text-xl font-bold font-heading mb-6">Habit Breakdown</h2>
          {habitStats.length === 0 ? (
            <p className="text-zinc-500 font-medium text-center py-8">No habits tracked yet.</p>
          ) : (
            <div className="space-y-5">
              {habitStats.map(h => (
                <div key={h.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{h.icon}</span>
                      <span className="font-bold">{h.name}</span>
                    </div>
                    <span className="font-bold text-sm">{h.completed} done ({h.pct}%)</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-3 rounded-full overflow-hidden border border-black">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${h.pct}%`, backgroundColor: h.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
