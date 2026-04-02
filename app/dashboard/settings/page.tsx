'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const supabase = createClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setName(user.user_metadata?.full_name || '');
        setEmail(user.email || '');
      }
    });
  }, [supabase.auth]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.updateUser({ data: { full_name: name } });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-medium font-heading mb-2">Settings</h1>
        <p className="text-zinc-500 font-medium mb-8">Manage your profile and preferences</p>

        {/* Profile */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 brutal-shadow mb-6">
          <h2 className="text-xl font-bold font-heading mb-6">Profile</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-black bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white font-bold text-2xl">
                {name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-bold">{name || 'Your Name'}</p>
                <p className="text-sm text-zinc-500">{email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Email Address</label>
              <input type="email" value={email} disabled
                className="w-full px-4 py-3 border-2 border-black rounded-xl font-medium bg-zinc-50 text-zinc-400 cursor-not-allowed" />
              <p className="text-xs text-zinc-400 mt-1 font-medium">Email cannot be changed here</p>
            </div>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 bg-[#fde047] border-2 border-black px-6 py-3 rounded-xl font-bold brutal-shadow brutal-hover disabled:opacity-60">
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : saved ? '✅ Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Preferences */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 brutal-shadow mb-6">
          <h2 className="text-xl font-bold font-heading mb-6">Preferences</h2>
          <div className="flex items-center justify-between p-4 bg-zinc-50 border-2 border-zinc-200 rounded-xl">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <div className="font-bold">Dark Mode</div>
                <div className="text-sm text-zinc-500 font-medium">Toggle app theme</div>
              </div>
            </div>
            <button onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full border-2 border-black transition-colors ${darkMode ? 'bg-[#86efac]' : 'bg-zinc-200'}`}>
              <div className={`w-4 h-4 bg-black rounded-full transition-transform mx-1 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white border-2 border-red-400 rounded-2xl p-6">
          <h2 className="text-xl font-bold font-heading mb-2 text-red-600">Danger Zone</h2>
          <p className="text-zinc-500 font-medium text-sm mb-4">These actions are permanent and cannot be undone.</p>
          <button className="bg-red-50 border-2 border-red-400 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
