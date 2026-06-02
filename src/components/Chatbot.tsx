import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Bot, User, Minimize2, Sparkles, RotateCcw } from 'lucide-react';
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
      message: `Hello! 👋 Welcome to ${d.company.name}. I can help with:\n\n✦ KRA & eTIMS compliance\n✦ Payroll & PAYE setup\n✦ Banking integrations\n✦ Inventory management\n✦ Collections & receivables\n✦ Audit readiness\n✦ System migration\n\nWhat can I help you with?`,
    },
    {
      pattern: /demo|trial|test|try/,
      message: `🎯 Perfect! Let me schedule a demo for you.\n\nClick "Open Demo Form" or contact directly:\n📞 ${d.contact.phones[0]}\n📧 ${d.contact.emails[0]}\n💬 WhatsApp: wa.me/${d.contact.whatsapp}`,
      action: 'demo',
    },
    {
      pattern: /price|cost|how much|silver|gold|edition|investment|budget/,
      message: `💰 **Tally Prime Pricing:**\n\n${d.products.map((p) => `• **${p.name} ${p.edition}**: ${p.price} (${p.period})\n  ${p.features[0]}`).join('\n\n')}\n\n✓ Volume discounts available\n✓ Custom TDL from KES 25,000\n✓ Training included\n\nLet's find the right fit!`,
    },
    {
      pattern: /service|what.*offer|provide|do you/,
      message: `🚀 **Our Services:**\n\n${d.services.slice(0, 8).map((s, i) => `${i+1}. **${s.title}**\n   ${s.desc}`).join('\n\n')}\n\nWhich interests you most?`,
    },
    {
      pattern: /kra|etims|e-filing|tax|vat|compliance|excise|cdf|pin|filing/,
      message: `📋 **KRA & eTIMS Compliance**\n\nWe configure 100% KRA compliance:\n✓ VAT computation & e-filing\n✓ PAYE auto-calculation\n✓ Income tax reporting\n✓ eTIMS integration\n✓ iTax e-Filing\n✓ Excise duty tracking\n✓ Certificate of Tax Compliance\n✓ Deadline alerts\n\nNever miss a deadline! Ready to set up?`,
      badge: 'kra',
    },
    {
      pattern: /payroll|salary|paye|nhif|nssf|housing|staff|employee|wage|deduction|leave|advance/,
      message: `💰 **Payroll Management**\n\nAutomate payroll processing:\n✓ Auto salary calculation\n✓ PAYE withholding\n✓ NHIF deductions\n✓ NSSF contributions\n✓ Housing Levy (3%)\n✓ Leave tracking\n✓ Loan deductions\n✓ Advance settlements\n\n📊 **Reports:**\n• Individual payslips\n• Bank transfer lists\n• PAYE schedules\n• NHIF/NSSF remittance\n\nFully Kenya compliant!`,
    },
    {
      pattern: /bank|payment|gateway|mpesa|reconcil|cash|cheque|transfer|account/,
      message: `🏦 **Banking & Payment Integration**\n\nSeamless banking workflows:\n✓ Bank reconciliation automation\n✓ M-Pesa payment tracking\n✓ Cheque management\n✓ Payment gateway integration\n✓ Cash flow forecasting\n✓ Multi-bank account support\n✓ Real-time bank feeds\n\n💳 **Supported Banks:**\n• KCB, Equity, I&M, Absa, Standard Chartered\n• M-Pesa for business\n• PayPal & Stripe for e-commerce\n\nSetup takes < 1 hour!`,
    },
    {
      pattern: /collections|receivable|invoice|credit|customer|debtors|aging|recovery|dso|cash flow/,
      message: `📲 **Collections & Receivables**\n\nMaximize cash collection:\n✓ Credit limit management\n✓ Invoice aging reports\n✓ Dunning automation\n✓ Payment reminders\n✓ Customer statements\n✓ Collection tracking\n✓ Bad debt provisioning\n\n📈 **Improve Cash Flow:**\n• Automated follow-up\n• Credit scoring\n• Early payment discounts\n• Late payment penalties\n\nReduce DSO by 30-40%!`,
    },
    {
      pattern: /inventor|stock|warehouse|product|item|sku|batch|expiry|reorder|location|distribution/,
      message: `📦 **Inventory Management**\n\nReal-time stock control:\n✓ Multi-location warehousing\n✓ Batch & serial tracking\n✓ Expiry date management\n✓ Barcode scanning\n✓ Auto reorder alerts\n✓ Stock transfers\n✓ Consignment tracking\n\n🎯 **Features:**\n• Safety stock calculations\n• FIFO/LIFO valuation\n• Stock loss reporting\n• Inventory cycles\n• Cost analysis\n\nWorks for retail, wholesale, manufacturing & F&B!`,
    },
    {
      pattern: /branch|multi-branch|distributed|location|site|head office|regional|chain|franchise/,
      message: `🏢 **Multi-Branch Accounting**\n\nCentralized control, local autonomy:\n✓ Branch-wise P&L\n✓ Consolidated reporting\n✓ Inter-branch transfers\n✓ Central bank account\n✓ Shared master data\n✓ Branch expense tracking\n✓ Performance comparison\n\n📊 **Reports:**\n• Financial statements by branch\n• Variance analysis\n• Sales by location\n• Expense allocation\n\nPerfect for retail chains, service providers & franchises!`,
    },
    {
      pattern: /migrat|upgrade|import|data|legacy|transfer|move from|switch|convert|import data/,
      message: `🔄 **System Migration & Data Transfer**\n\nSmooth transition to Tally Prime:\n✓ Data import from legacy systems\n✓ Opening balance migration\n✓ Customer/supplier mapping\n✓ Inventory balance transfer\n✓ Historical data archival\n✓ Zero data loss guarantee\n✓ Parallel run support\n\n⚙️ **Our Process:**\n1. Data audit & validation\n2. Mapping & transformation\n3. Test migration\n4. Live cutover\n5. Post-migration support\n\n🎯 Typically 2-4 weeks with training!`,
    },
    {
      pattern: /manufactur|production|bom|bill of material|process|wip|work in progress|cost|labor|batch|waste/,
      message: `🏭 **Manufacturing Solutions**\n\nStreamline production:\n✓ Bill of Materials (BOM)\n✓ Production orders\n✓ Work-in-progress tracking\n✓ Job costing\n✓ Quality control\n✓ Labor allocation\n✓ Batch tracking\n✓ Waste management\n\n📊 **Analysis:**\n• Cost per unit\n• Production efficiency\n• Material usage variance\n• Timeline tracking\n\nGreat for food, pharma, textiles & heavy manufacturing!`,
    },
    {
      pattern: /audit|audit trail|internal control|risk|fraud|sox|sarbanes|compliance check|regulatory/,
      message: `🔐 **Audit Readiness & Controls**\n\nMeet regulatory requirements:\n✓ Complete audit trail\n✓ User access controls\n✓ Approval workflows\n✓ Exception reporting\n✓ Document retention\n✓ Balance sheet reconciliation\n✓ Fraud detection\n\n📋 **For Auditors:**\n• General ledger with drill-down\n• Journal entries with approvals\n• User activity logs\n• System snapshots\n• Compliance checklist\n\nPrepare for audits in hours, not weeks!`,
    },
    {
      pattern: /train|training|staff|onboard|workshop|cert|skill|learn|course|education/,
      message: `👥 **Training & Onboarding**\n\nBuild capability in your team:\n✓ On-site training sessions\n✓ Remote workshops\n✓ One-on-one coaching\n✓ Video tutorials\n✓ User manuals\n✓ Role-based training\n✓ Certification programs\n\n📚 **Topics:**\n• Daily operations\n• Reporting & analysis\n• KRA compliance\n• Banking & collections\n• Inventory management\n• Advanced features\n\nTraining included in all packages!`,
    },
    {
      pattern: /remote|cloud|access|online|work from|anywhere|mobile|app|vpn/,
      message: `☁️ **Remote Access & Cloud Hosting**\n\nAccess Tally Prime anywhere, anytime:\n✓ Secure cloud infrastructure\n✓ Multi-device support\n✓ VPN integration\n✓ Mobile app access\n✓ Automatic hourly backups\n✓ Disaster recovery\n✓ ISO 27001 compliance\n\n🔒 **Security:**\n• 256-bit encryption\n• Multi-factor authentication\n• Regular security audits\n\nPerfect for remote teams & hybrid work!`,
    },
    {
      pattern: /integrat|api|connector|plugin|third-party|sync|webhook|automat|pos|crm|erp|hr/,
      message: `🔗 **Integrations & API Solutions**\n\nConnect Tally Prime with your ecosystem:\n✓ POS system integration\n✓ E-commerce platform sync\n✓ CRM integration\n✓ HR software link\n✓ Email & document automation\n✓ Custom API development\n✓ Workflow automation\n\n💼 **Common Integrations:**\n• Shopify & WooCommerce\n• LinkedIn & ATS\n• Google Workspace\n• Slack notifications\n• Power BI dashboards\n\nCustom TDL & API from KES 25,000!`,
    },
    {
      pattern: /report|dashboard|analysis|insight|forecast|budget|projection|kpi|metric/,
      message: `📊 **Advanced Reporting & Analytics**\n\nTurn data into decisions:\n✓ Real-time dashboards\n✓ Financial reports\n✓ Budget vs. actual\n✓ Cash flow forecast\n✓ KPI tracking\n✓ Variance analysis\n✓ Custom reports\n✓ Data export (Excel/PDF)\n\n🎯 **Key Reports:**\n• P&L statements\n• Balance sheets\n• Cash flow analysis\n• Profitability by product\n• Customer/supplier analysis\n• Tax reports\n\nMake data-driven decisions daily!`,
    },
    {
      pattern: /support|help|issue|problem|error|troubleshoot|bug|urgent|sla|response|maintenance|update/,
      message: `🛠️ **24/7 Support & Maintenance**\n\nWe're always here for you:\n✓ Phone support (24 hours)\n✓ Email ticketing system\n✓ Remote troubleshooting\n✓ On-site visits available\n✓ Software updates\n✓ Preventive maintenance\n✓ Performance optimization\n\n⚡ **Service Levels:**\n• Critical: <1 hour response\n• High: <4 hours response\n• Medium: <24 hours response\n• Low: <48 hours response\n\n📞 ${d.contact.phones[0]}`,
    },
    {
      pattern: /edition|silver|gold|plus|enterprise|compare|difference|choose|which|best/,
      message: `📦 **Tally Prime Editions**\n\n**Silver** - Small businesses\n✓ Single-user\n✓ Basic inventory\n✓ Multi-currency\n• Best for: Startups, sole traders\n\n**Gold** - Growing businesses\n✓ Multi-user (up to 5)\n✓ Advanced inventory\n✓ Remote access\n• Best for: SMEs, branches\n\n**Plus** - Mid-market\n✓ Multi-location\n✓ Manufacturing\n✓ Advanced reporting\n• Best for: 50-200 employees\n\n**Enterprise** - Large organizations\n✓ Unlimited users\n✓ Full customization\n✓ API access\n• Best for: 200+ employees\n\nNeed help choosing?`,
    },
    {
      pattern: /contact|reach|phone|call|email|location|address|office|visit|meeting|where/,
      message: `📞 **Contact & Office Information**\n\n${d.contact.phones.map((p) => `📱 ${p}`).join('\n')}\n${d.contact.emails.map((e) => `📧 ${e}`).join('\n')}\n📍 ${d.contact.location}\n\n🕐 **Working Hours:**\n${d.contact.workingHours.map((h) => `• ${h}`).join('\n')}\n\nSchedule a meeting or get a quote!`,
    },
    {
      pattern: /about|company|who|mission|vision|history|team|background|credential|expert|partner/,
      message: `🏢 **About Optimum Prime Solutions**\n\n${d.company.about[0]}\n\n📈 **By the Numbers:**\n${d.company.stats.map((s) => `• ${s.label}: ${s.value}`).join('\n')}\n\n✓ Certified Tally Gold Partner\n✓ KRA Compliance Experts\n✓ Trusted by 500+ businesses in Kenya\n✓ 10+ years of implementation experience\n\nLet's help your business grow!`,
    },
    {
      pattern: /thank|bye|asante|goodbye|see you|ciao|tata|cheers|exit/,
      message: `You're welcome! 😊 Feel free to reach out anytime.\n\n📞 ${d.contact.phones[0]}\n💬 wa.me/${d.contact.whatsapp}\n\nHave a great day! 🚀`,
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
    text: `Great question! 🤔 I didn't catch all the details, but our team can help:\n\n📞 ${d.contact.phones[0]}\n📧 ${d.contact.emails[0]}\n💬 wa.me/${d.contact.whatsapp}\n\nOr try asking about:\n✓ KRA compliance\n✓ Payroll setup\n✓ Banking integrations\n✓ Collections management\n✓ Inventory control\n✓ System migration`,
    time,
  };
}

function FormatMessage({ text }: { text: string }) {
  const formatInline = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, j) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={j} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={j}>{part}</span>
      )
    );
  };

  return (
    <>
      {text.split('\n').map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <br key={i} />;

        const bulletMatch = trimmed.match(/^([•✓✦])\s*(.*)$/);
        if (bulletMatch) {
          const [, symbol, rest] = bulletMatch;
          return (
            <div key={i} className="ml-1 flex gap-1.5">
              <span className="text-sky-500">{symbol}</span>
              <span>{formatInline(rest)}</span>
            </div>
          );
        }

        return <div key={i}>{formatInline(line)}</div>;
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
    'Payroll setup',
    'Banking integrations',
    'Inventory management',
    'Branch accounting',
    'System migration',
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
            className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40 hover:scale-110 transition-all flex items-center justify-center"
            aria-label="Open chat and WhatsApp"
            title="Open chat and WhatsApp"
          >
            <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 shadow-sm">
              <WhatsAppIcon className="h-4 w-4 text-white" />
            </div>
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <WhatsAppIcon className="h-8 w-8 text-white" />
            </motion.div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/30 opacity-60" />
              <span className="relative h-4 w-4 rounded-full bg-white/60" />
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
                  <div className="relative h-8 w-8 rounded-full bg-[#25D366] flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
                      <WhatsAppIcon className="h-4 w-4 text-white" />
                    </motion.div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-white/80" />
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
                                'KRA compliance',
                                'Payroll setup',
                                'Banking integrations',
                                'Collections',
                                'Inventory control',
                                'System migration',
                                'Audit readiness',
                                'Request a demo',
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
