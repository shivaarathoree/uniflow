'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layers, Github } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push('/dashboard');
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setMessage('Check your email to confirm your account!');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen bg-[#fffdf7] antialiased selection:bg-yellow-200 selection:text-black">
      {/* Nav */}
      <nav className="fixed w-full z-50 top-0 border-b-2 border-black bg-[#fffdf7]/95 backdrop-blur-sm">
        <div className="flex h-20 max-w-7xl mx-auto px-6 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#86efac] rounded-lg border-2 border-black flex items-center justify-center brutal-shadow-sm group-hover:rotate-6 transition-transform">
              <Layers className="w-6 h-6 stroke-[1.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading">UNIFLOW</span>
          </Link>
        </div>
      </nav>

      <div className="absolute inset-0 bg-grid-pattern -z-20 pointer-events-none mt-20" />

      <section className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#ff9ebb] rounded-full filter blur-3xl opacity-50 mix-blend-multiply" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#86efac] rounded-full filter blur-3xl opacity-50 mix-blend-multiply" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white border-2 border-black p-8 rounded-2xl brutal-shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 font-heading">{isLogin ? 'Welcome Back' : 'Join UNIFLOW'}</h1>
              <p className="text-zinc-600 font-medium">
                {isLogin ? 'Continue your streak today.' : 'Start building honest habits.'}
              </p>
            </div>

            {/* Social Auth */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleGoogleLogin}
                className="flex-1 py-3 px-4 border-2 border-black rounded-xl font-bold brutal-shadow flex items-center justify-center gap-2 bg-white hover:-translate-y-1 transition-transform"
              >
                {/* Google SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                onClick={handleGithubLogin}
                className="flex-1 py-3 px-4 border-2 border-black rounded-xl font-bold brutal-shadow flex items-center justify-center gap-2 bg-white hover:-translate-y-1 transition-transform"
              >
                <Github className="w-5 h-5 text-black" />
                GitHub
              </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-0.5 flex-1 bg-black" />
              <span className="text-sm font-bold uppercase text-zinc-500">OR</span>
              <div className="h-0.5 flex-1 bg-black" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 transition-shadow font-medium"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 transition-shadow font-medium"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-bold">Password</label>
                  {isLogin && <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot?</a>}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-200 transition-shadow font-medium"
                  required
                  minLength={6}
                />
              </div>

              {error && <p className="text-red-600 text-sm font-bold bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
              {message && <p className="text-green-700 text-sm font-bold bg-green-50 p-3 rounded-lg border border-green-200">{message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#fde047] text-black py-4 rounded-xl font-bold text-lg border-2 border-black brutal-shadow brutal-hover transition-all mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : isLogin ? 'Jump In' : 'Start Tracking Free'}
              </button>
            </form>

            <p className="text-center mt-6 text-sm font-medium">
              {isLogin ? (
                <>New here?{' '}<button onClick={() => setIsLogin(false)} className="font-bold underline text-blue-600">Start Tracking Free</button></>
              ) : (
                <>Already have an account?{' '}<button onClick={() => setIsLogin(true)} className="font-bold underline text-blue-600">Jump In</button></>
              )}
            </p>
          </div>

          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-300 rounded-full border-2 border-black -z-10" />
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-yellow-300 rounded-xl border-2 border-black rotate-12 -z-10" />
        </div>
      </section>
    </div>
  );
}
