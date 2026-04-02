import Link from 'next/link';
import { Layers, Eye, ArrowRight, PlayCircle, CheckCircle, Bot, BarChart2, Award, Watch, Calendar, BookOpen, Flame } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b-2 border-black bg-[#fffdf7]/95 backdrop-blur-sm">
        <div className="flex h-20 max-w-7xl mr-auto ml-auto pr-6 pl-6 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#86efac] rounded-lg border-2 border-black flex items-center justify-center brutal-shadow-sm group-hover:rotate-6 transition-transform">
              <Layers className="w-6 h-6 stroke-[1.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading">UNIFLOW</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
            <a href="#features" className="hover:underline decoration-2 underline-offset-4">Features</a>
            <a href="#ai" className="hover:underline decoration-2 underline-offset-4">AI Assistant</a>
            <a href="#analytics" className="hover:underline decoration-2 underline-offset-4">Analytics</a>
            <Link href="/auth" className="hover:underline decoration-2 underline-offset-4">Login</Link>
          </div>
          <Link href="/auth" className="bg-black text-white px-6 py-2.5 text-sm font-bold rounded-lg border-2 border-black brutal-shadow brutal-hover">
            Start UNIFLOW Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern -z-20" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-black bg-[#fde047] brutal-shadow-sm mb-8 transform -rotate-1">
              <Eye className="w-4 h-4 stroke-[1.5]" />
              <span className="text-xs font-bold tracking-wide uppercase">Honest Tracking. Zero Noise.</span>
            </div>
            <h1 className="text-5xl md:text-7xl tracking-tight leading-[1] mb-8 font-medium font-heading">
              Master your routine.{' '}
              <span className="relative inline-block px-2">
                <span className="absolute inset-0 bg-[#ff9ebb] -rotate-2 border-2 border-black rounded-lg brutal-shadow-sm -z-10" />
                With pure clarity.
              </span>
            </h1>
            <p className="text-xl text-zinc-600 mb-10 leading-relaxed font-medium">
              Track tasks, workflow, and goals in one unified space. Chat with your AI Coach Aura to log progress honestly. Build consistency without the noise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth" className="px-8 py-4 bg-black text-white rounded-xl font-bold border-2 border-black brutal-shadow brutal-hover flex items-center justify-center gap-3">
                Get Started <ArrowRight className="w-5 h-5 stroke-[1.5]" />
              </Link>
              <Link href="/auth" className="px-8 py-4 bg-white text-black rounded-xl font-bold border-2 border-black brutal-shadow brutal-hover flex items-center justify-center gap-3">
                <PlayCircle className="w-5 h-5 stroke-[1.5]" /> Watch Demo
              </Link>
            </div>
          </div>

          {/* Hero Visual Cards */}
          <div className="relative h-[500px] hidden lg:flex items-center justify-center">
            <div className="relative w-[400px]">
              <div className="absolute -top-8 -right-4 w-72 bg-white p-5 rounded-xl border-2 border-black rotate-3 brutal-shadow-lg z-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full border-2 border-black flex items-center justify-center">
                      <Flame className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Morning Run</div>
                      <div className="text-xs text-zinc-500">Just now • Central Park</div>
                    </div>
                  </div>
                  <div className="font-bold text-green-600">+ 45m</div>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-black">
                  <div className="bg-purple-400 h-full w-3/4" />
                </div>
                <div className="flex justify-between mt-2 text-xs font-bold text-zinc-500">
                  <span>Daily Flow</span><span>75% Done</span>
                </div>
              </div>

              <div className="absolute top-24 -left-8 w-72 bg-[#bfdbfe] p-5 rounded-xl border-2 border-black -rotate-3 brutal-shadow-lg z-20">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-lg">Consistency</div>
                  <div className="bg-green-400 text-black text-xs font-bold px-2 py-1 border border-black rounded">Top 10%</div>
                </div>
                <div className="h-24 flex items-end justify-between gap-1 mb-2">
                  {[40,60,80,90,100].map((h, i) => (
                    <div key={i} className="w-full bg-blue-400 border border-black" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="text-xs font-bold text-center">Current Flow: 12 Days</div>
              </div>

              <div className="absolute top-[280px] left-1/2 -translate-x-1/2 w-80 bg-[#18181b] text-white p-4 rounded-xl border-2 border-black z-30 flex items-center gap-3 brutal-shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0 border border-white/20" />
                <div>
                  <div className="text-xs text-zinc-400 mb-1">Aura AI Coach</div>
                  <div className="text-sm font-medium">"Your workflow today was exactly on track."</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white border-y-2 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-3 block">Clear Honest Interface</span>
            <h2 className="text-4xl md:text-5xl tracking-tight font-medium font-heading">Everything you need for a unified flow</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            <div className="bg-[#fde047] p-8 rounded-2xl border-2 border-black brutal-shadow flex flex-col hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-white rounded-lg border-2 border-black flex items-center justify-center mb-6"><Bot className="w-6 h-6 stroke-[1.5]" /></div>
              <h3 className="text-xl font-bold mb-4 font-heading">Transparent AI Coach</h3>
              <p className="font-medium text-zinc-800 mb-6 flex-1">Chat with Aura (powered by Grok AI) to log routines naturally. "Read for 30 mins" is all you need to say.</p>
              <ul className="space-y-3 text-sm font-semibold">
                {['Voice Logging','Smart Reminders','Honest Motivation'].map(f => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#86efac] p-8 rounded-2xl border-2 border-black brutal-shadow flex flex-col hover:-translate-y-1 transition-transform relative z-10 md:-translate-y-6">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1.5 rounded-md border-2 border-black text-xs font-bold uppercase tracking-wider brutal-shadow-sm">Deep Insights</div>
              <div className="w-12 h-12 bg-white rounded-lg border-2 border-black flex items-center justify-center mb-6"><BarChart2 className="w-6 h-6 stroke-[1.5]" /></div>
              <h3 className="text-xl font-bold mb-4 font-heading">Flow Analytics</h3>
              <p className="font-medium text-zinc-800 mb-6 flex-1">Visualize your progress with heatmaps and charts. Track completion rates and personal alignment.</p>
              <ul className="space-y-3 text-sm font-semibold">
                {['GitHub-style Heatmap','Weekly Reports','Trend Analysis'].map(f => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#ff9ebb] p-8 rounded-2xl border-2 border-black brutal-shadow flex flex-col hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-white rounded-lg border-2 border-black flex items-center justify-center mb-6"><Award className="w-6 h-6 stroke-[1.5]" /></div>
              <h3 className="text-xl font-bold mb-4 font-heading">Unified Goals</h3>
              <p className="font-medium text-zinc-800 mb-6 flex-1">Set clear targets for routines like Gym or Reading. Understand your alignment without over-gamification.</p>
              <ul className="space-y-3 text-sm font-semibold">
                {['Personal Milestones','Accountability Pledges','Growth System'].map(f => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-24 px-6 bg-[#fffdf7]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block bg-black text-white border-2 border-black px-4 py-1.5 rounded-md brutal-shadow-sm mb-6">
            <span className="text-xs font-bold uppercase tracking-widest">Meet Aura</span>
          </div>
          <h2 className="text-4xl md:text-5xl tracking-tight mb-16 font-medium font-heading">Your Intelligent AI Coach</h2>
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="bg-white p-8 rounded-2xl border-2 border-black brutal-shadow h-full">
              <div className="w-16 h-16 bg-blue-100 rounded-full border-2 border-black mb-6 mx-auto flex items-center justify-center"><Bot className="w-8 h-8 stroke-[1.5]" /></div>
              <h3 className="text-2xl text-center mb-6 font-medium font-heading">Aura Connects</h3>
              <div className="bg-zinc-100 p-4 rounded-xl border border-zinc-300 text-sm font-medium italic text-zinc-600 text-center">"How was my reading consistency last week?"</div>
            </div>
            <div className="bg-indigo-600 p-8 rounded-2xl border-2 border-black brutal-shadow-lg scale-110 z-10 h-full flex flex-col justify-center text-white">
              <div className="text-center mb-6">
                <div className="inline-flex bg-white text-black p-2 rounded-lg border-2 border-black mb-2 animate-pulse"><Bot className="w-8 h-8 stroke-[1.5]" /></div>
                <h3 className="text-2xl font-medium font-heading">Aura Analyzes</h3>
              </div>
              <ul className="space-y-3">
                {['Scans daily logs','Filters timeframes','Calculates metrics','100% Private'].map(i => (
                  <li key={i} className="flex items-center gap-2 font-bold text-indigo-100"><CheckCircle className="w-4 h-4" />{i}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl border-2 border-black brutal-shadow h-full">
              <div className="w-16 h-16 bg-green-100 rounded-full border-2 border-black mb-6 mx-auto flex items-center justify-center"><Award className="w-8 h-8 stroke-[1.5]" /></div>
              <h3 className="text-2xl text-center mb-6 font-medium font-heading">Aura Answers</h3>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-sm font-bold text-green-900 text-center">"You read 4 days out of 7. That's a solid foundation. Let's aim for 5 this week."</div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl mb-12 font-medium font-heading">Integrate with your life</h2>
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[{icon: Watch, label:'Health', color:'text-purple-600'},{icon: Calendar, label:'Calendar', color:'text-orange-500'},{icon: CheckCircle, label:'Tasks', color:'text-blue-500'},{icon: BookOpen, label:'Journal', color:'text-green-600'}].map(({icon:Icon,label,color}) => (
              <div key={label} className="bg-white border-2 border-black rounded-xl px-8 py-4 flex items-center gap-3 brutal-shadow hover:-translate-y-1 transition-all cursor-default min-w-[160px]">
                <Icon className={`w-6 h-6 ${color}`} />
                <span className="font-bold text-lg">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-zinc-50 border-b-2 border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl leading-none tracking-tight mb-16 text-center font-medium font-heading">From clutter to clarity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {num:'01',title:'Sign Up Free',desc:'Create your secure account. Row Level Security ensures your data is yours alone.',border:'border-[#fde047]'},
              {num:'02',title:'Define Flow',desc:'Use the dashboard or tell Aura: "I want to drink water every hour". Set up routines instantly.',border:'border-[#86efac]'},
              {num:'03',title:'Build Consistency',desc:'Watch your dashboard update in real-time. Export reports to understand your true alignment.',border:'border-[#ff9ebb]'},
            ].map(({num,title,desc,border}) => (
              <div key={num} className="bg-white border-2 border-black rounded-xl p-8 min-h-[320px] flex flex-col justify-between brutal-shadow hover:-translate-y-1 transition-transform">
                <div>
                  <span className="text-6xl text-black/10 block mb-6 font-bold font-heading">{num}</span>
                  <h3 className="text-2xl leading-tight mb-4 font-bold font-heading">{title}</h3>
                  <p className={`font-medium border-l-2 ${border} pl-3`}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 bg-yellow-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl tracking-tight mb-6 leading-[1.1] font-medium font-heading">Find your clarity.</h2>
          <p className="text-xl font-bold text-black/80 mb-12 max-w-2xl mx-auto">
            Join thousands of achievers building consistent workflows with UNIFLOW. Powered by Grok AI.
          </p>
          <Link href="/auth" className="bg-black text-white text-xl px-12 py-5 rounded-xl border-2 border-white font-bold brutal-shadow brutal-hover-lift transition-all inline-block">
            Create Free Account
          </Link>
          <p className="mt-8 text-black font-bold text-sm tracking-wide">Open Source • No credit card required • Secure</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-black py-12 px-6 border-t-2 border-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#86efac] rounded-lg border-2 border-black flex items-center justify-center"><Layers className="w-5 h-5 stroke-[1.5]" /></div>
            <span className="font-bold text-xl font-heading">UNIFLOW</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 font-semibold text-sm">
            <a href="#" className="hover:text-zinc-600">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-600">Terms of Service</a>
            <a href="https://github.com/shivaarathoree/uniflow" target="_blank" rel="noreferrer" className="hover:text-zinc-600">GitHub</a>
            <a href="#" className="hover:text-zinc-600">Contact</a>
          </div>
          <div className="text-zinc-500 text-sm font-medium">© 2025 UNIFLOW. Built with ❤️</div>
        </div>
      </footer>
    </div>
  );
}
