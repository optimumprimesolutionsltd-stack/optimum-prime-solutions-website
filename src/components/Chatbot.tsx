import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Sparkles, RotateCcw } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence } from 'framer-motion';
import DemoRequestModal from './DemoRequestModal';
import KraLogo from './KraLogo';
import { getChatGPTReply } from '../utils/chatgpt';
import type { SiteData } from '../data/siteData';

interface Msg {
  id: string;
  role: 'bot' | 'user';
  text: string;
  time: string;
  action?: 'demo' | 'contact';
  badge?: 'kra';
}

const getTime = () =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

function getBotResponse(q: string, d: SiteData): Msg {
  const lc = q.toLowerCase();
  const time = getTime();

  const responses: Array<{ pattern: RegExp; message: string; action?: Msg['action']; badge?: Msg['badge']; }> = [
    {
      pattern: /^(hi|hello|hey|jambo|habari|sasa|hallo)/,
      message: `Hello! 👋 Welcome to ${d.company.name}. How can I assist you today? I can help with:\n\n✦ Services & solutions\n✦ Pricing, editions & integrations\n✦ KRA compliance and payroll\n✦ Remote access and training\n✦ Demo requests and FAQs`,
    },
    {
      pattern: /demo|trial|test|try/,
      message: `🎯 Perfect! I'd love to help you schedule a demo.\n\nClick the demo button below to request one, or:\n\n📞 ${d.contact.phones[0]}\n📧 ${d.contact.emails[0]}\n💬 WhatsApp: wa.me/${d.contact.whatsapp}`,
      action: 'demo',
    },
    {
      pattern: /price|cost|how much|silver|gold|edition/,
      message: `**Tally Prime Pricing:**\n\n${d.products.map((p) => `• **${p.name} ${p.edition}**: ${p.price} (${p.period})`).join('\n')}\n\nContact us for volume discounts and training packages!`,
    },
    {
      pattern: /service|what (do|can) you|offer|provide/,
      message: `🚀 **Our Services:**\n\n${d.services.map((s) => `• **${s.title}**: ${s.desc}`).join('\n')}\n\nWhich service interests you?`,
    },
    {
      pattern: /edition|compare|silver|gold|plus|enterprise/,
      message: `**Tally Prime Editions:**\n\n• **Silver**: Single user accounting, ideal for small businesses.\n• **Multi-user**: Multi-user access with remote login.\n• **Plus / Enterprise**: Scalable operations, branch workflows, and cloud-ready deployment.\n\nI can recommend the best edition for your business.`,
    },
    {
      pattern: /integrat|api|pos|bank|third-party|payment/,
      message: `🔗 **Integrations:**\n\nWe connect Tally Prime with POS, banking, payment, and other systems using custom TDL and supported APIs. This keeps accounting, inventory, and bank feeds synchronized.\n\nTell me which systems you want to link.`,
    },
    {
      pattern: /train|training|staff|users|onboard/,
      message: `👥 **Training & Onboarding**\n\nWe offer practical training for finance, operations, and management teams. Training can be on-site or remote and covers Tally Prime workflows, reporting, payroll, and compliance.\n\nAsk for a training plan that fits your team.`,
    },
    {
      pattern: /support package|support plan|after-sales|maintenance|support options/,
      message: `🛠️ **Support Plans**\n\nChoose from remote support, health checks, software updates, and on-site visits. Our response time is typically under 1 hour for urgent issues.\n\nWe can set up a support plan suited to your business size.`,
    },
    {
      pattern: /remote|cloud|access|online|work anywhere|multi-branch/,
      message: `☁️ **Remote Access & Cloud**\n\nTally Prime supports secure remote access. We also offer cloud hosting options so your team can access centralized Tally Prime data from anywhere.\n\nPerfect for multi-branch and remote teams.`,
    },
    {
      pattern: /kra|tax|vat|etims|compliance|e-filing/,
      message: `📋 **KRA & eTIMS Compliance**\n\nWe configure Tally Prime for 100% KRA compliance:\n✓ VAT computation & filing\n✓ PAYE calculations\n✓ Income tax reports\n✓ eTIMS integration\n✓ iTax e-Filing setup\n\nNever miss a deadline!`,
      badge: 'kra',
    },
    {
      pattern: /payroll|salary|paye|nhif|nssf|housing|staff/,
      message: `💰 **Payroll Management**\n\nOur payroll module handles:\n✓ Auto salary processing\n✓ PAYE, NHIF, NSSF, Housing Levy\n✓ Payslip generation\n✓ Leave management\n✓ Loan deductions\n\nFully configured for Kenya!`,
    },
    {
      pattern: /inventor|stock|inventory|product|item|batch/,
      message: `📦 **Inventory Management**\n\nReal-time stock tracking:\n✓ Multi-location support\n✓ Batch & expiry management\n✓ Reorder point alerts\n✓ Barcode integration\n✓ Stock transfers\n\nPerfect for retail, wholesale & manufacturing!`,
    },
    {
      pattern: /manufactur|produc|bom|bill|cost|quality/,
      message: `🏭 **Manufacturing Solutions**\n\nStreamline production with:\n✓ Bill of Materials (BOM)\n✓ Production orders\n✓ Work-in-progress tracking\n✓ Cost analysis\n✓ Quality control\n\nIncrease efficiency & reduce costs!`,
    },
    {
      pattern: /contact|reach|phone|call|email|where|location|address|ruiru/,
      message: `📞 **Contact Us:**\n\n${d.contact.phones.map((p) => `📱 ${p}`).join('\n')}\n${d.contact.emails.map((e) => `📧 ${e}`).join('\n')}\n📍 ${d.contact.location}\n\n🕐 ${d.contact.workingHours.join(' | ')}`,
    },
    {
      pattern: /support|help|troubleshoot|issue|problem|urgent/,
      message: `🔧 **24/7 Support Available**\n\n✓ Remote assistance\n✓ On-site visits\n✓ Software updates\n✓ Training sessions\n✓ Response time: < 1 hour\n\n📞 ${d.contact.phones[0]}`,
    },
    {
      pattern: /tdl|custom|report|integrat|api|automat/,
      message: `⚙️ **TDL Customization**\n\nCustom Tally Definition Language:\n✓ Custom reports & invoices\n✓ Workflow automation\n✓ Third-party integrations\n✓ API development\n\nPricing starts from KES 25,000 per project.`,
    },
    {
      pattern: /about|company|who|mission|vision|history|team/,
      message: `🏢 **${d.company.name}**\n\n${d.company.about[0]}\n\n${d.company.stats.map((s) => `${s.label}: ${s.value}`).join(' | ')}`,
    },
    {
      pattern: /thank|bye|asante|goodbye|see you|ciao|tata/,
      message: `You're welcome! 😊 Feel free to reach out anytime.\n\n📞 ${d.contact.phones[0]}\n💬 wa.me/${d.contact.whatsapp}`,
    },
  ];

  for (const { pattern, message, action, badge } of responses) {
    if (pattern.test(lc)) {
      return { id: Date.now().toString(), role: 'bot', text: message, time, action: action as any, badge };
    }
  }

  const faq = d.faqs.find((f) => {
    const words = lc.split(/\s+/).filter((x) => x.length > 3);
    return (
      words.filter((x) => f.q.toLowerCase().includes(x) || f.a.toLowerCase().includes(x))
        .length >= 2
    );
  });

  if (faq) {
    return {
      id: Date.now().toString(),
      role: 'bot',
      text: `📋 **${faq.q}**\n\n${faq.a}`,
      time,
    };
  }

  return {
    id: Date.now().toString(),
    role: 'bot',
    text: `Thanks for your question! 🤔 Our team can help you directly:\n\n📞 ${d.contact.phones[0]}\n📧 ${d.contact.emails[0]}\n💬 wa.me/${d.contact.whatsapp}\n\nOr ask about: services, pricing, KRA, payroll, demo`,
    time,
  };
}

function FormatMessage({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const formatted = parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j} className="font-semibold text-slate-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{part}</span>
          )
        );

        if (!line.trim()) return <br key={i} />;
        if (line.trim().startsWith('•') || line.trim().startsWith('✓') || line.trim().startsWith('✦')) {
          const symbol = line.trim()[0];
          return (
            <div key={i} className="ml-1 flex gap-1.5">
              <span className="text-sky-500">{symbol}</span>
              <span>{formatted.slice(1)}</span>
            </div>
          );
        }
        return <div key={i}>{formatted}</div>;
      })}
    </>
  );
}

export default function Chatbot() {
  const { data } = useSite();
  const defaultQuickLinks = [
    'Request a demo',
    'Pricing & editions',
    'KRA compliance',
    'Remote access',
    'Training & onboarding',
    'Cloud hosting',
    'Support plans',
    'Implementation',
  ];
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: '0',
      role: 'bot',
      text: `👋 Hello! I'm the Optimum Prime Assistant. I can help you with services, pricing, compliance, remote access, demos and training. Choose a quick link below or type your question.`,
      time: getTime(),
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  useEffect(() => {
    scroll();
  }, [msgs, typing, scroll]);

  const send = (txt: string) => {
    if (!txt.trim()) return;

    const userMsg: Msg = {
      id: Date.now().toString(),
      role: 'user',
      text: txt.trim(),
      time: getTime(),
    };

    const trimmedText = txt.trim();
    const isGreeting = /^(hi|hello|hey|jambo|habari|sasa|hallo)\b/i.test(trimmedText);
    const kraQueryRegex = /\b(kra|etims|e-filing|tax|vat|compliance)\b/i;
    const replyBadge = kraQueryRegex.test(trimmedText) ? 'kra' : undefined;

    setMsgs((p) => [...p, userMsg]);
    setInput('');

    if (isGreeting) {
      const botMsg = getBotResponse(trimmedText, data);
      if (botMsg.action === 'demo') setDemoOpen(true);
      setMsgs((p) => [...p, botMsg]);
      return;
    }

    setTyping(true);

    (async () => {
      try {
        const reply = await getChatGPTReply(trimmedText, data);
        if (!reply?.trim()) throw new Error('EMPTY_REPLY');

        const botMsg: Msg = {
          id: Date.now().toString(),
          role: 'bot',
          text: reply,
          time: getTime(),
          badge: replyBadge,
        };

        setMsgs((p) => [...p, botMsg]);
      } catch (err) {
        const botMsg = getBotResponse(trimmedText, data);
        if (botMsg.action === 'demo') setDemoOpen(true);
        setMsgs((p) => [...p, { ...botMsg, badge: botMsg.badge || replyBadge }]);
      } finally {
        setTyping(false);
      }
    })();
  };

  const handleClear = () => {
    if (confirm('Clear all messages?')) {
      setMsgs([
        {
          id: '0',
          role: 'bot',
          text: `👋 Chat cleared! How can I help you today?`,
          time: getTime(),
        },
      ]);
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
            className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-600/40 hover:scale-110 transition-all flex items-center justify-center gap-2 px-3 group"
            aria-label="Chat"
          >
            <WhatsAppIcon className="h-4 w-4 text-green-400" />
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <MessageCircle className="h-6 w-6" />
            </motion.div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-500 opacity-75" />
              <span className="relative h-4 w-4 rounded-full bg-sky-500" />
            </span>
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
                ? 'bottom-6 right-6 h-14 w-72'
                : 'bottom-0 right-0 sm:bottom-6 sm:right-6 h-[100dvh] w-full sm:h-[600px] sm:w-[420px]'
            } flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-2xl sm:rounded-2xl`}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
                    <Bot className="h-4 w-4 text-sky-300" />
                  </motion.div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-green-400" />
                </div>
                  {/* WhatsApp quick link */}
                  <a
                    href={`https://wa.me/${data.contact.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 ml-1"
                    title="Chat on WhatsApp"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon className="h-5 w-5 text-green-400" />
                  </a>
                {!min && (
                  <div>
                    <p className="text-sm font-semibold text-white">Optimum Assistant</p>
                    <p className="text-[10px] text-green-300">● Online & Ready</p>
                  </div>
                )}
                {min && <p className="text-sm font-semibold text-white">Optimum Assistant</p>}
              </div>
              <div className="flex gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClear}
                  className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition"
                  title="Clear chat"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMin(!min)}
                  className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setOpen(false);
                    setMin(false);
                  }}
                  className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </div>

            {!min && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-100 dark:bg-slate-950">
                  {msgs.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                          m.role === 'bot'
                            ? 'bg-slate-900'
                            : 'bg-gradient-to-br from-sky-500 to-blue-600'
                        }`}
                      >
                        {m.role === 'bot' ? (
                          <Bot className="h-3.5 w-3.5 text-sky-300" />
                        ) : (
                          <User className="h-3.5 w-3.5 text-white" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                          m.role === 'bot'
                            ? 'rounded-tl-sm bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700'
                            : 'rounded-tr-sm bg-gradient-to-br from-sky-500 to-blue-600 text-white'
                        }`}
                      >
                        {m.badge === 'kra' && (
                          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                            <KraLogo className="h-4 w-4" />
                            <span>KRA / eTIMS</span>
                          </div>
                        )} <FormatMessage text={m.text} />
                        {m.role === 'bot' && m.id === '0' && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {defaultQuickLinks.slice(0, 6).map((s) => (
                              <motion.button
                                key={s}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => send(s)}
                                className="rounded-full border border-sky-300/20 bg-sky-400/5 px-3 py-1 text-[12px] font-medium text-sky-600 hover:bg-sky-400/10 transition"
                              >
                                {s}
                              </motion.button>
                            ))}
                          </div>
                        )}
                        {m.action === 'demo' && (
                          <motion.button
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setDemoOpen(true)}
                            className="mt-2 inline-block rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                          >
                            <Sparkles className="h-3 w-3 inline mr-1" />
                            Open Demo Form
                          </motion.button>
                        )}
                        <p
                          className={`mt-1 text-[9px] ${
                            m.role === 'bot'
                              ? 'text-slate-600'
                              : 'text-white/40'
                          }`}
                        >
                          {m.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {typing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center">
                        <Bot className="h-3.5 w-3.5 text-sky-300" />
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-slate-900 px-4 py-3 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ y: [0, -4, 0] }}
                              transition={{ delay: i * 0.15, duration: 0.6, repeat: Infinity }}
                              className="h-1.5 w-1.5 rounded-full bg-slate-400"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={endRef} />
                </div>

                {/* Quick Questions */}
                        {msgs.length <= 2 && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 shrink-0">
                    <p className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-slate-600">
                      Quick questions
                    </p>
                    <div className="flex flex-wrap gap-1">
                              {[
                                'Services & pricing',
                                'Request a demo',
                                'KRA compliance',
                                'Remote access',
                                'Training options',
                                'Cloud hosting',
                                'Support plan',
                                'Implementation',
                              ].map((s) => (
                        <motion.button
                          key={s}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => send(s)}
                          className="rounded-full border border-sky-300/20 bg-sky-400/5 px-2.5 py-1 text-[10px] font-medium text-sky-600 hover:bg-sky-400/10 transition"
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <form onSubmit={(e) => {e.preventDefault(); send(input);}} className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 shrink-0">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-3.5 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 caret-sky-600"
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <DemoRequestModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        companyPhone={data.contact.phones[0]}
        companyEmail={data.contact.emails[0]}
        companyWhatsapp={data.contact.whatsapp}
      />
    </>
  );
}
