import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Send, Loader2, User, Bot, BotOff } from 'lucide-react';
import { fbSubscribe, fbSet } from '../../firebase/config';

const BACKEND_URL = 'https://optimum-prime-lead-notifier.onrender.com';

interface WaMessage {
  direction: 'in' | 'out';
  text: string;
  timestamp: string;
  messageId?: string;
}

interface WaThread {
  phone: string;
  name?: string;
  lastMessage: string;
  lastMessageAt: string;
  lastDirection: 'in' | 'out';
  unread: boolean;
  botPaused: boolean;
  messages: WaMessage[];
}

type RawConvos = Record<string, {
  meta?: { phone?: string; name?: string; lastMessage?: string; lastMessageAt?: string; lastDirection?: 'in' | 'out'; unread?: boolean; botPaused?: boolean };
  messages?: Record<string, WaMessage>;
}>;

function parseThreads(raw: RawConvos | null): WaThread[] {
  if (!raw) return [];
  return Object.entries(raw).map(([phoneDigits, node]) => {
    const messages = node.messages
      ? Object.values(node.messages).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      : [];
    return {
      phone: node.meta?.phone || `+${phoneDigits}`,
      name: node.meta?.name,
      lastMessage: node.meta?.lastMessage || '',
      lastMessageAt: node.meta?.lastMessageAt || '',
      lastDirection: node.meta?.lastDirection || 'in',
      unread: !!node.meta?.unread,
      botPaused: !!node.meta?.botPaused,
      messages,
    };
  }).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export default function WhatsAppManager() {
  const [threads, setThreads] = useState<WaThread[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = fbSubscribe('whatsapp_conversations', (raw: RawConvos | null) => {
      setThreads(parseThreads(raw));
    });
    return unsubscribe;
  }, []);

  const active = useMemo(() => threads.find(t => t.phone === selected) || null, [threads, selected]);
  const unreadCount = threads.filter(t => t.unread).length;

  const openThread = (phone: string) => {
    setSelected(phone);
    setError('');
    const digits = phone.replace(/[^0-9]/g, '');
    fbSet(`whatsapp_conversations/${digits}/meta/unread`, false).catch(() => {});
  };

  const toggleBot = (phone: string, paused: boolean) => {
    const digits = phone.replace(/[^0-9]/g, '');
    fbSet(`whatsapp_conversations/${digits}/meta/botPaused`, paused).catch(() => {});
  };

  const sendReply = async () => {
    if (!active || !reply.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/whatsapp/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: active.phone, message: reply.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Send failed');
      setReply('');
    } catch {
      setError('Failed to send. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">WhatsApp Conversations</h2>
        <p className="text-sm text-slate-500 mt-0.5">Zawadi (our AI assistant) replies automatically. Send a message yourself to take over a conversation, or use the toggle to switch back.</p>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
          <MessageCircle className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">No conversations yet</p>
          <p className="mt-1 text-xs text-slate-400">Incoming WhatsApp messages will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          {/* Thread list */}
          <div className="space-y-2">
            {threads.map(t => (
              <button
                key={t.phone}
                onClick={() => openThread(t.phone)}
                className={`w-full text-left rounded-2xl border p-4 transition ${
                  selected === t.phone ? 'border-accent bg-accent/5' : 'border-slate-200 bg-white hover:border-accent/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 truncate">{t.name || t.phone}</p>
                      {t.unread && <span className="h-2 w-2 rounded-full bg-accent animate-pulse shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {t.lastDirection === 'out' ? 'You: ' : ''}{t.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active thread */}
          <div className="rounded-2xl border border-slate-200 bg-white flex flex-col overflow-hidden" style={{ minHeight: '480px' }}>
            {!active ? (
              <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
                Select a conversation to view messages
              </div>
            ) : (
              <>
                <div className="border-b border-slate-100 px-5 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{active.name || active.phone}</p>
                    <p className="text-xs text-slate-500">{active.phone}</p>
                  </div>
                  <button
                    onClick={() => toggleBot(active.phone, !active.botPaused)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
                      active.botPaused ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                    title={active.botPaused ? 'Zawadi is paused — you are replying manually' : 'Zawadi is replying automatically'}
                  >
                    {active.botPaused ? <><BotOff className="h-3.5 w-3.5" /> Zawadi paused</> : <><Bot className="h-3.5 w-3.5" /> Zawadi active</>}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {active.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.direction === 'out' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.direction === 'out' ? 'bg-accent text-white' : 'bg-slate-50 text-slate-800'
                      }`}>
                        <p className="whitespace-pre-wrap">{m.text}</p>
                        <p className={`mt-1 text-[10px] ${m.direction === 'out' ? 'text-white/70' : 'text-slate-400'}`}>
                          {new Date(m.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 p-4">
                  {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
                  <div className="flex items-center gap-2">
                    <input
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !sending) sendReply(); }}
                      placeholder="Type a reply..."
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-accent"
                    />
                    <button
                      onClick={sendReply}
                      disabled={sending || !reply.trim()}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {unreadCount === 0 && threads.length > 0 && (
        <p className="mt-4 text-xs text-slate-400">All conversations read.</p>
      )}
    </div>
  );
}
