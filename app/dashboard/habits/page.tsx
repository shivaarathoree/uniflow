'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Check, X, Lock } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: string;
  target_minutes: number;
}

const ICONS = ['📚','💪','🏃','💧','🧘','✍️','🎸','🌿','🏊','🥗','😴','💻'];
const COLORS = ['#fde047','#86efac','#ff9ebb','#bfdbfe','#c4b5fd','#fed7aa','#fca5a5','#6ee7b7'];
const FREQUENCIES = ['daily','weekdays','weekends','3x/week','4x/week','custom'];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [limitError, setLimitError] = useState('');
  const [form, setForm] = useState({ name: '', icon: '📚', color: '#fde047', frequency: 'daily', target_minutes: 30 });

  const fetch_ = useCallback(async () => {
    const res = await fetch('/api/habits');
    const data = await res.json();
    setHabits(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const resetForm = () => {
    setForm({ name: '', icon: '📚', color: '#fde047', frequency: 'daily', target_minutes: 30 });
    setEditingId(null);
    setShowForm(false);
    setLimitError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLimitError('');
    if (editingId) {
      await fetch(`/api/habits/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.status === 403) {
        const data = await res.json();
        setLimitError(data.error);
        return;
      }
    }
    await fetch_();
    resetForm();
  };

  const deleteHabit = async (id: string) => {
    if (!confirm('Archive this habit?')) return;
    await fetch(`/api/habits/${id}`, { method: 'DELETE' });
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const startEdit = (h: Habit) => {
    setForm({ name: h.name, icon: h.icon, color: h.color, frequency: h.frequency, target_minutes: h.target_minutes });
    setEditingId(h.id);
    setShowForm(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-medium font-heading">All Habits</h1>
            <p className="text-zinc-500 font-medium mt-1">{habits.length} active habits</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditingId(null); setLimitError(''); }}
            className="flex items-center gap-2 bg-[#fde047] border-2 border-black px-5 py-3 rounded-xl font-bold brutal-shadow brutal-hover"
          >
            <Plus className="w-5 h-5" /> New Habit
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border-2 border-black rounded-2xl p-6 brutal-shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-6 font-heading">{editingId ? 'Edit Habit' : 'Create New Habit'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2">Habit Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Read 30 minutes"
                  className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map(icon => (
                      <button key={icon} type="button"
                        onClick={() => setForm(p => ({ ...p, icon }))}
                        className={`w-10 h-10 rounded-lg border-2 text-xl transition-all ${form.icon === icon ? 'border-black brutal-shadow-sm bg-[#fde047]' : 'border-zinc-200'}`}
                      >{icon}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(c => (
                      <button key={c} type="button"
                        onClick={() => setForm(p => ({ ...p, color: c }))}
                        className={`w-8 h-8 rounded-lg border-2 ${form.color === c ? 'border-black scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Frequency</label>
                  <select value={form.frequency} onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 font-medium bg-white">
                    {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Target (minutes)</label>
                  <input type="number" value={form.target_minutes}
                    onChange={e => setForm(p => ({ ...p, target_minutes: +e.target.value }))}
                    min={1} max={480}
                    className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 font-medium" />
                </div>
              </div>

              {limitError && (
                <div className="bg-red-50 border-2 border-red-300 p-4 rounded-xl text-red-700 font-bold text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4" /> {limitError}{' '}
                  <a href="/dashboard/billing" className="underline text-blue-600">Upgrade →</a>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-black text-white py-3 rounded-xl font-bold border-2 border-black brutal-shadow brutal-hover flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Create Habit'}
                </button>
                <button type="button" onClick={resetForm} className="px-4 py-3 border-2 border-black rounded-xl font-bold brutal-shadow-sm brutal-hover flex items-center gap-2">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Habits List */}
        {loading ? (
          <div className="text-center py-20"><div className="w-8 h-8 border-4 border-black border-t-[#86efac] rounded-full animate-spin mx-auto" /></div>
        ) : habits.length === 0 ? (
          <div className="bg-white border-2 border-black rounded-2xl p-16 text-center brutal-shadow">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2 font-heading">No habits yet</h3>
            <p className="text-zinc-500">Click "New Habit" to start building your flow.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map(habit => (
              <div key={habit.id} className="bg-white border-2 border-black rounded-2xl p-5 brutal-shadow-sm flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
                <div className="w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: habit.color + '60' }}>
                  {habit.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg font-heading truncate">{habit.name}</h3>
                  <p className="text-sm text-zinc-500 font-medium">{habit.frequency} • {habit.target_minutes} minutes/session</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(habit)} className="w-9 h-9 border-2 border-black rounded-lg flex items-center justify-center brutal-shadow-sm brutal-hover hover:bg-[#fde047]">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteHabit(habit.id)} className="w-9 h-9 border-2 border-black rounded-lg flex items-center justify-center brutal-shadow-sm brutal-hover hover:bg-red-100">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
