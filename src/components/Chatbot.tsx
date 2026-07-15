import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Bot, User, Minimize2, RotateCcw } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import WhatsAppButton from './WhatsAppButton';
import { useSite } from '../context/SiteContext';
import { fbSet, fbGet } from '../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import DemoRequestModal from './DemoRequestModal';
import { getChatResponse, type ChatMessage } from '../utils/chatgpt';

interface Msg {
  id: string;
  role: 'bot' | 'user';
  text: string;
  time: string;
  action?: 'demo' | 'contact' | 'whatsapp';
  quickReplies?: string[];
}

interface LeadProfile {
  name?: string;
  business?: string;
  industry?: string;
  challenge?: string;
  users?: string;
  currentSoftware?: string;
  timeline?: string;
}

const getWeekKey = () => {
  const d = new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
};

const getTime = () =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const VISITOR_ID_KEY = 'ops_visitor_id';

const getVisitorId = () => {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private browsing, etc.) — fall back to a per-tab id
    return `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [lead, setLead] = useState<LeadProfile>({});
  const [demoOpen, setDemoOpen] = useState(false);
  const [visitorId] = useState(() => getVisitorId());

  const { data } = useSite();
  const endRef = useRef<HTMLDivElement>(null);

  // Listen for external 'zawadi:open' event (fired by Talk to an Expert buttons)
  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      setMin(false);
    };
    window.addEventListener('zawadi:open', handleOpen);
    return () => window.removeEventListener('zawadi:open', handleOpen);
  }, []);

  const botGreeting = `Hey there! 👋 Welcome to **Optimum Prime Solutions** — Kenya's certified TallyPrime partner.\n\nI'm **Zawadi**, your business solutions guide. I'm here to help you find the right tools to grow your business.\n\nWhat's your name? I'd love to make this feel a bit more personal! 😊`;

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [msgs, open]);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([
        {
          id: '0',
          role: 'bot',
          text: botGreeting,
          time: getTime(),
        },
      ]);
    }
    // Load conversation history and lead profile from Firebase
    const loadHistory = async () => {
      const weekKey = getWeekKey();
      const historyPath = `chatHistory/${weekKey}/${visitorId}`;
      const leadPath = `leadProfiles/${weekKey}/${visitorId}`;
      const savedMsgs = await fbGet(historyPath);
      const savedLead = await fbGet(leadPath);
      if (savedMsgs) setMsgs(savedMsgs);
      if (savedLead) setLead(savedLead);
      else {
        setMsgs([
          {
            id: '0',
            role: 'bot',
            text: botGreeting,
            time: getTime(),
          },
        ]);
      }
    };
    loadHistory();
  }, [open]);

  // Save conversation history and lead profile to Firebase
  useEffect(() => {
    if (msgs.length > 0) {
      const weekKey = getWeekKey();
      const historyPath = `chatHistory/${weekKey}/${visitorId}`;
      const leadPath = `leadProfiles/${weekKey}/${visitorId}`;
      fbSet(historyPath, msgs);
      fbSet(leadPath, lead);
    }
  }, [msgs, lead, visitorId]);

  const handleSend = useCallback(async (message: string) => {
    const trimmedText = message.trim();
    if (!trimmedText) return;

    setInput('');
    setTyping(true);
    setShowTypingIndicator(true);

    const userMsg: Msg = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmedText,
      time: getTime(),
    };
    setMsgs((prev) => [...prev, userMsg]);

    // Build the full conversation history for the AI.
    // Include ALL prior messages (both user and bot) so Gemini has complete context
    // and never re-asks questions the user already answered.
    // Exclude only the static bot greeting (it is not part of the real conversation).
    const aiHistory: ChatMessage[] = [
      ...msgs
        .filter(msg => msg.text !== botGreeting)
        .map((msg) => ({
          role: msg.role === 'bot' ? ('assistant' as const) : ('user' as const),
          content: msg.text,
        })),
      // Append the new user message at the end
      { role: 'user' as const, content: trimmedText },
    ];

    try {
      const chatResult = await getChatResponse(trimmedText, aiHistory);

      // Handle smart handoff
      if (chatResult.handoff && chatResult.name && chatResult.phone) {
        const handoffMsg: Msg = {
          id: Date.now().toString(),
          role: 'bot',
          text: `Great news, ${chatResult.name}! 🎉 Our team has been notified and will reach out to you on **${chatResult.phone}** shortly.\n\nYou can also start a WhatsApp chat with us right now — tap the button below! 👇`,
          time: getTime(),
          action: 'whatsapp',
        };
        setTimeout(() => {
          setMsgs((p) => [...p, handoffMsg]);
          setShowTypingIndicator(false);
          setTyping(false);
          // Auto-open WhatsApp after a short delay
          if (chatResult.whatsapp_url) {
            setTimeout(() => window.open(chatResult.whatsapp_url, '_blank'), 1500);
          }
        }, 900);
        return;
      }

      const aiReplyContent = chatResult.reply || "I'm sorry, I didn't get a response. Please try again.";

      const botMsg: Msg = {
        id: Date.now().toString(),
        role: 'bot',
        text: aiReplyContent,
        time: getTime(),
      };

      setTimeout(() => {
        setMsgs((p) => [...p, botMsg]);
        setShowTypingIndicator(false);
        setTyping(false);
      }, 900);

    } catch (error) {
      console.error('AI reply error:', error);
      const errorMsg: Msg = {
        id: Date.now().toString(),
        role: 'bot',
        text: "Oops! I'm having a little trouble connecting right now. Please try again in a moment, or you can reach us directly on WhatsApp at +254 116 246 074.",
        time: getTime(),
      };
      setMsgs((p) => [...p, errorMsg]);
      setShowTypingIndicator(false);
      setTyping(false);
    }
  }, [msgs, lead, botGreeting]);

  const handleClear = () => {
    if (confirm('Start a fresh conversation?')) {
      setMsgs([
        {
          id: '0',
          role: 'bot',
          text: botGreeting,
          time: getTime(),
        },
      ]);
      setLead({});
    }
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-6 sm:bottom-6 z-40 h-16 w-16 rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40 hover:scale-110 transition-all flex items-center justify-center"
            aria-label="Chat with Zawadi"
            title="Chat with Zawadi — AI Assistant"
          >
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <WhatsAppIcon className="h-8 w-8 text-white" />
            </motion.div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/30 opacity-60" />
              <span className="relative h-4 w-4 rounded-full bg-white/60" />
            </span>
            <span className="absolute -bottom-2 -left-2 bg-white text-[#25D366] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">✓</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed z-50 transition-all duration-300 ${
              min
                ? 'bottom-24 right-6 sm:bottom-6 h-14 w-72'
                : 'bottom-0 right-0 sm:bottom-6 sm:right-6 h-[100dvh] w-full sm:h-[620px] sm:w-[420px]'
            } flex flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl sm:rounded-2xl`}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 rounded-full bg-[#25D366] flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-sm">Zawadi — Optimum Assistant</span>
                  <span className="text-green-300 text-xs">● Online · Typically replies instantly</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setMin(!min)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" aria-label="Minimize">
                  <Minimize2 className="h-4 w-4 text-white" />
                </button>
                <button onClick={handleClear} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" aria-label="Clear chat">
                  <RotateCcw className="h-4 w-4 text-white" />
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" aria-label="Close chat">
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!min && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                <AnimatePresence>
                  {msgs.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'bot' && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center mt-1">
                          <Bot className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col gap-2 max-w-[80%]">
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-[#25D366] text-white rounded-br-sm'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                              part.startsWith('**') && part.endsWith('**')
                                ? <strong key={i}>{part.slice(2, -2)}</strong>
                                : part
                            )}
                          </p>
                          <p className={`text-xs mt-1.5 ${msg.role === 'user' ? 'text-white/70 text-right' : 'text-slate-400'}`}>
                            {msg.time}
                          </p>
                        </div>

                        {/* Quick reply buttons - AI should suggest these if needed */}
                        {msg.role === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {msg.quickReplies.map((qr) => (
                              <button
                                key={qr}
                                onClick={() => handleSend(qr)}
                                disabled={typing}
                                className="px-3 py-1.5 bg-white border border-red-200 text-red-700 text-xs font-medium rounded-full hover:bg-red-50 hover:border-red-400 transition-colors disabled:opacity-50 whitespace-nowrap"
                              >
                                {qr}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* WhatsApp handoff button */}
                        {msg.role === 'bot' && msg.action === 'whatsapp' && (
                          <motion.a
                            href="https://wa.me/254116246074?text=Hi%2C%20I%27d%20like%20to%20speak%20to%20an%20expert%20about%20TallyPrime"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm rounded-2xl shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105 active:scale-95 mt-1"
                          >
                            <WhatsAppIcon className="h-5 w-5 text-white" />
                            Chat on WhatsApp
                          </motion.a>
                        )}
                      </div>

                      {msg.role === 'user' && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center mt-1">
                          <User className="h-3.5 w-3.5 text-slate-600" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {showTypingIndicator && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 items-start">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-2 h-2 bg-slate-400 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                      <span className="text-xs text-slate-400 ml-1">Zawadi is typing...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={endRef} />
              </div>
            )}

            {/* Minimised state */}
            {min && (
              <div className="flex-1 flex items-center px-4">
                <span className="text-sm text-slate-600">Chat with Zawadi — tap to expand</span>
              </div>
            )}

            {/* Input */}
            {!min && (
              <div className="flex gap-2 p-3 border-t border-slate-100 bg-white shrink-0">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(input)}
                  className="flex-1 px-3 py-2 bg-slate-100 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || typing}
                  className="p-2.5 bg-[#25D366] text-white rounded-xl hover:bg-[#1ebe5d] disabled:opacity-50 transition-colors"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
                <WhatsAppButton message={`Hi, I need help with: ${input || 'Optimum Prime Solutions'}`} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {demoOpen && <DemoRequestModal open={demoOpen} onOpenChange={setDemoOpen} />}
    </>
  );
}
