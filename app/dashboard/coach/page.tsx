'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Send, Mic, Sparkles, Flame } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [limitError, setLimitError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  const fetchHistory = useCallback(async () => {
    const res = await fetch('/api/coach');
    const data = await res.json();
    if (Array.isArray(data)) setMessages(data);
    setLoadingHistory(false);
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);
  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    setLimitError('');
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    const sent = input.trim();
    setInput('');
    setLoading(true);

    const res = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: sent }),
    });
    const data = await res.json();

    if (res.status === 429) {
      setLimitError(data.error);
      setLoading(false);
      return;
    }

    if (data.reply) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const quickPrompts = [
    "How am I doing this week?",
    "What habit should I focus on today?",
    "Give me an honest assessment",
    "I just completed my workout!",
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Chat Header */}
      <div className="h-20 border-b-2 border-black bg-white flex items-center px-6 shrink-0 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-black rounded-full flex items-center justify-center font-bold text-white text-lg">A</div>
          <div>
            <h2 className="font-bold text-xl font-heading">Coach Aura</h2>
            <p className="text-xs font-bold text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
              Online • Powered by Grok AI
            </p>
          </div>
        </div>
        <button className="text-xs font-bold bg-[#ff9ebb] border-2 border-black px-3 py-1.5 rounded brutal-shadow-sm flex items-center gap-2 brutal-hover">
          <Flame className="w-4 h-4" /> Roast Mode
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 chat-scroll bg-[#fffdf7]">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 w-full">

          {loadingHistory ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-black border-t-indigo-500 rounded-full animate-spin mx-auto" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full border-2 border-black mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 font-heading">Hey! I'm Aura 🌊</h3>
              <p className="text-zinc-500 font-medium mb-8">Your honest AI habit coach. Ask me anything about your habits, streaks, or progress.</p>
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {quickPrompts.map(p => (
                  <button key={p} onClick={() => setInput(p)}
                    className="bg-white border-2 border-black rounded-xl px-4 py-3 text-sm font-bold text-left brutal-shadow-sm brutal-hover hover:bg-[#fde047]">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="text-center py-2">
                <span className="bg-white border-2 border-black text-xs font-bold px-3 py-1 rounded-full text-zinc-500 inline-block">Chat History</span>
              </div>
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-bold shrink-0 mt-1 ${msg.role === 'assistant' ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white text-sm' : 'bg-gradient-to-br from-pink-300 to-purple-400'}`}>
                    {msg.role === 'assistant' ? 'A' : ''}
                  </div>
                  <div>
                    <div className={`border-2 border-black p-4 font-medium text-black max-w-lg mb-1 inline-block ${
                      msg.role === 'assistant'
                        ? 'bg-indigo-100 rounded-2xl rounded-tl-sm brutal-shadow-sm'
                        : 'bg-white rounded-2xl rounded-tr-sm brutal-shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                    <div className={`text-xs font-bold text-zinc-400 ${msg.role === 'user' ? 'text-right pr-2' : 'pl-2'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 text-sm">A</div>
              <div className="bg-indigo-100 border-2 border-black p-4 rounded-2xl rounded-tl-sm brutal-shadow-sm">
                <div className="flex gap-1">
                  {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            </div>
          )}

          {limitError && (
            <div className="bg-red-50 border-2 border-red-400 p-4 rounded-xl text-red-700 font-bold text-sm text-center">
              {limitError}{' '}
              <a href="/dashboard/billing" className="underline text-blue-600">Upgrade to Pro →</a>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-black bg-white p-4 shrink-0">
        <div className="max-w-3xl mx-auto flex items-end gap-3 w-full">
          <button className="w-12 h-12 bg-zinc-100 border-2 border-black rounded-xl flex items-center justify-center brutal-hover brutal-shadow-sm transition-transform shrink-0">
            <Mic className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell Aura what you've done, or ask anything..."
              className="w-full bg-zinc-50 border-2 border-black rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#fde047] font-medium resize-none overflow-hidden"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              onInput={e => {
                const t = e.currentTarget;
                t.style.height = '';
                t.style.height = t.scrollHeight + 'px';
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-12 h-12 bg-[#86efac] border-2 border-black rounded-xl flex items-center justify-center brutal-hover brutal-shadow-sm transition-transform shrink-0 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-2 text-center text-xs font-bold text-zinc-400">
          Aura is powered by Grok AI • Press Enter to send
        </div>
      </div>
    </div>
  );
}
