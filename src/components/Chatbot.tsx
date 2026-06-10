import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Bot, User, Minimize2, RotateCcw } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import WhatsAppButton from './WhatsAppButton';
import { useSite } from '../context/SiteContext';
import { fbSet, fbGet } from '../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import DemoRequestModal from './DemoRequestModal';
import { getChatGPTReply, type ChatMessage } from '../utils/chatgpt';
import type { SiteData } from '../data/siteData';

interface Msg {
  id: string;
  role: 'bot' | 'user';
  text: string;
  time: string;
  action?: 'demo' | 'contact' | 'whatsapp';
  quickReplies?: string[];
}

// Conversation stages for lead qualification
type Stage =
  | 'greeting'
  | 'ask_name'
  | 'ask_business'
  | 'ask_challenge'
  | 'ask_users'
  | 'ask_current_software'
  | 'ask_timeline'
  | 'recommend'
  | 'free';

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

// Detect intent from user message
function detectIntent(text: string): string {
  const lc = text.toLowerCase();
  if (/^(hi|hello|hey|jambo|habari|sasa|hallo|good morning|good afternoon|good evening)\b/.test(lc)) return 'greeting';
  if (/price|cost|how much|pricing|quote|budget|afford/.test(lc)) return 'pricing';
  if (/kra|etims|tax|vat|compliance|filing|pin/.test(lc)) return 'kra';
  if (/payroll|salary|paye|nhif|nssf|housing levy|staff|employee/.test(lc)) return 'payroll';
  if (/inventory|stock|warehouse|product|sku|barcode|batch/.test(lc)) return 'inventory';
  if (/cloud|remote|access|anywhere|hosting|vpn/.test(lc)) return 'cloud';
  if (/hubspot|crm|customer|sales pipeline|lead|contact management/.test(lc)) return 'hubspot';
  if (/eos|entrepreneurial|operating system|gino wickman|traction|rocks|l10|visionary|integrator/.test(lc)) return 'eos';
  if (/demo|book|schedule|appointment|meeting|call|consultation/.test(lc)) return 'demo';
  if (/migrat|switch|move from|upgrade|import|legacy/.test(lc)) return 'migration';
  if (/bank|mpesa|reconcil|payment|cheque/.test(lc)) return 'banking';
  if (/report|dashboard|analysis|insight|forecast/.test(lc)) return 'reporting';
  if (/manufactur|production|bom|bill of material/.test(lc)) return 'manufacturing';
  if (/branch|multi-branch|location|chain|franchise/.test(lc)) return 'branch';
  if (/train|workshop|learn|course|onboard/.test(lc)) return 'training';
  if (/tsplus|ts plus|remote desktop|terminal server/.test(lc)) return 'tsplus';
  return 'unknown';
}

function buildBotResponse(
  intent: string,
  lead: LeadProfile,
  stage: Stage,
  userText: string,
  data: SiteData
): { text: string; action?: Msg['action']; quickReplies?: string[]; nextStage?: Stage } {
  const firstName = lead.name ? lead.name.split(' ')[0] : '';
  const greet = firstName ? `${firstName}, ` : '';

  switch (intent) {
    case 'greeting':
      return {
        text: `Hey there! 👋 Welcome to **Optimum Prime Solutions** — Kenya's certified TallyPrime partner.\n\nI'm **Aurora**, your business solutions guide. I'm here to help you find the right tools to grow your business.\n\nBefore we dive in — what's your name? I'd love to make this feel a bit more personal! 😊`,
        nextStage: 'ask_name',
      };

    case 'pricing':
      return {
        text: `Great question, ${greet}pricing really depends on what fits your business best! 💡\n\nHere's a quick overview:\n\n• **TallyPrime Silver** — KES 57,600 +VAT *(single user, perfect for small businesses)*\n• **TallyPrime Gold** — KES 172,800 +VAT *(multi-user, growing teams)*\n• **Cloud Hosting** — From KES 8,000/month *(access from anywhere)*\n• **EOS® Implementation** — Custom quote *(transform how your business runs)*\n\nTo give you the most accurate recommendation — **how many people will need to use the system?** 👥`,
        quickReplies: ['Just me (1 user)', '2–5 users', '6–15 users', '15+ users'],
        nextStage: 'ask_users',
      };

    case 'kra':
      return {
        text: `Absolutely, ${greet}KRA compliance is something we take very seriously! 📋\n\nWith TallyPrime, you get:\n✓ eTIMS integration — invoices sent directly to KRA\n✓ VAT computation & e-filing\n✓ PAYE auto-calculation\n✓ iTax e-Filing support\n✓ Deadline alerts so you never miss a filing\n\nWe've helped dozens of Kenyan businesses become 100% compliant.\n\n**Are you currently using eTIMS, or is this something you're setting up for the first time?** 🤔`,
        quickReplies: ['Setting up for the first time', 'Already on eTIMS but need help', 'Not sure what I need'],
        nextStage: 'free',
      };

    case 'payroll':
      return {
        text: `Payroll can be such a headache — but it doesn't have to be! 😅\n\nWith TallyPrime, ${greet}you can automate:\n✓ Salary calculations\n✓ PAYE withholding\n✓ NHIF & NSSF deductions\n✓ Housing Levy (3%)\n✓ Leave & loan tracking\n✓ Payslip generation\n\nMost businesses save 5–10 hours every month after switching.\n\n**How many employees are you currently running payroll for?** 👥`,
        quickReplies: ['1–10 employees', '11–50 employees', '51–200 employees', '200+ employees'],
        nextStage: 'free',
      };

    case 'inventory':
      return {
        text: `Stock management is one of the biggest pain points we hear about! 📦\n\nTallyPrime gives you ${greet}:\n✓ Real-time stock levels across all locations\n✓ Batch & expiry date tracking\n✓ Auto reorder alerts\n✓ Barcode scanning support\n✓ FIFO/LIFO valuation\n\nWe've helped retail shops, wholesalers, and manufacturers get full visibility.\n\n**Are you managing inventory across one location or multiple?** 📍`,
        quickReplies: ['One location', 'Multiple locations/branches', 'Warehouse + retail', 'Manufacturing + stock'],
        nextStage: 'free',
      };

    case 'cloud':
      return {
        text: `Great timing — cloud hosting is one of our most popular services right now! ☁️\n\nWith our TallyPrime Cloud Hosting, ${greet}you get:\n✓ Access your accounts from anywhere — laptop, phone, tablet\n✓ Automatic daily backups\n✓ 99.9% uptime SLA\n✓ Secure 256-bit encryption\n✓ No IT infrastructure needed\n\nStarting from **KES 8,000/month** — less than one employee's daily wage!\n\n**Do you have a team working remotely or from multiple locations?** 🌍`,
        quickReplies: ['Yes, remote team', 'Multiple office locations', 'Just want backup & security', 'Tell me more'],
        nextStage: 'free',
      };

    case 'hubspot':
      return {
        text: `Excellent — HubSpot + TallyPrime is a powerful combination! 🚀\n\nHere's how they work together for ${greet}your business:\n\n**HubSpot CRM** handles:\n✓ Lead tracking & sales pipeline\n✓ Customer communication history\n✓ Email sequences & follow-ups\n✓ Deal management\n\n**TallyPrime** handles:\n✓ Invoicing & collections\n✓ Inventory & stock\n✓ KRA compliance & tax\n✓ Financial reporting\n\nTogether, you get a **360° view** — from first contact to final payment. No more data silos!\n\n**Are you currently using any CRM, or would this be your first?** 💼`,
        quickReplies: ['First CRM', 'Moving from another CRM', 'Already on HubSpot', 'Just exploring'],
        nextStage: 'free',
      };

    case 'eos':
      return {
        text: `Oh, I love this question! EOS® is a game-changer for growing businesses. 🎯\n\nThe **Entrepreneurial Operating System** by Gino Wickman gives your company a simple, proven framework built on **6 Key Components**:\n\n1. **Vision** — Everyone knows where you're going\n2. **People** — Right people, right seats\n3. **Data** — Run on numbers, not gut feel\n4. **Issues** — Solve problems permanently\n5. **Process** — Document your way of doing things\n6. **Traction** — Execute with discipline\n\nWe're certified EOS® implementers — we run quarterly sessions, L10 meetings, and help you build your V/TO (Vision/Traction Organizer).\n\n**Have you read Traction by Gino Wickman, or is EOS® new to you?** 📚`,
        quickReplies: ["Yes, I've read Traction", 'Heard of it, want to learn more', 'Brand new to EOS®', 'Already running EOS®'],
        nextStage: 'free',
      };

    case 'demo':
      return {
        text: `Fantastic — a demo is the best way to see if we're the right fit! 🎉\n\nOur demos are:\n✓ 30–45 minutes, tailored to your industry\n✓ Live walkthrough of TallyPrime, Cloud, and/or EOS®\n✓ Q&A session with our team\n✓ Zero obligation\n\n${greet}I'll connect you with our team right away. You can also reach us directly on WhatsApp for a faster response! 📱`,
        action: 'demo',
        quickReplies: ['Book via form', 'WhatsApp us directly'],
        nextStage: 'free',
      };

    case 'migration':
      return {
        text: `Switching systems can feel daunting — but we make it smooth! 🔄\n\nOur migration process for ${greet}:\n1. **Data audit** — we review what you have\n2. **Mapping** — match your data to TallyPrime structure\n3. **Test migration** — verify everything before go-live\n4. **Live cutover** — switch with zero data loss\n5. **Post-migration support** — we stay with you\n\nTypically takes **2–4 weeks** including training.\n\n**What system are you currently using?** (e.g. QuickBooks, Sage, Excel, custom system)`,
        quickReplies: ['QuickBooks', 'Sage / Pastel', 'Excel / manual', 'Custom/other system'],
        nextStage: 'free',
      };

    case 'banking':
      return {
        text: `Bank reconciliation is one of those things that eats hours every month — we fix that! 🏦\n\nWith TallyPrime, ${greet}you get:\n✓ Automated bank reconciliation\n✓ M-Pesa payment tracking\n✓ Multi-bank account support\n✓ Real-time bank feeds\n✓ Cheque management\n✓ Cash flow forecasting\n\nSupported banks: KCB, Equity, I&M, Absa, Standard Chartered, and more.\n\n**Which bank(s) do you primarily use for your business?** 🏛️`,
        quickReplies: ['KCB', 'Equity Bank', 'Absa / Barclays', 'Multiple banks'],
        nextStage: 'free',
      };

    case 'tsplus':
      return {
        text: `TSplus is our preferred tool for secure remote desktop access to TallyPrime! 💻\n\nWith TSplus, ${greet}your team can:\n✓ Access TallyPrime from any device, anywhere\n✓ Work on a secure, isolated session\n✓ No need for expensive VPN setups\n✓ Works on Windows, Mac, iOS, and Android\n\nWe bundle TSplus with our **Cloud Hosting** package for a seamless remote experience.\n\n**How many users would need remote access?** 👥`,
        quickReplies: ['1–3 users', '4–10 users', '10+ users', 'Tell me about pricing'],
        nextStage: 'free',
      };

    case 'manufacturing':
      return {
        text: `Manufacturing businesses have unique needs — and TallyPrime handles them well! 🏭\n\nFor ${greet}your production operations:\n✓ Bill of Materials (BOM) management\n✓ Production order tracking\n✓ Work-in-progress (WIP) visibility\n✓ Job costing & labour allocation\n✓ Batch tracking & quality control\n✓ Waste management reporting\n\n**What type of manufacturing does your business do?** (e.g. food, pharma, textiles, metal fabrication)`,
        quickReplies: ['Food & beverage', 'Pharmaceuticals', 'Textiles / garments', 'Other manufacturing'],
        nextStage: 'free',
      };

    case 'reporting':
      return {
        text: `Good data = good decisions. Let's get you there! 📊\n\nTallyPrime gives ${greet}your business:\n✓ Real-time P&L statements\n✓ Balance sheets & cash flow\n✓ Budget vs. actual analysis\n✓ Customer & supplier ageing\n✓ Profitability by product/branch\n✓ KPI dashboards\n✓ Export to Excel & PDF\n\n**What reporting challenge are you trying to solve?** For example — are you spending too long pulling reports manually, or struggling to understand your cash position?`,
        quickReplies: ['Manual reports take too long', 'Need real-time visibility', 'Board/investor reporting', 'KRA compliance reports'],
        nextStage: 'free',
      };

    case 'training':
      return {
        text: `Training is included in all our packages — we don't just install and leave! 👥\n\nFor ${greet}your team, we offer:\n✓ On-site training sessions\n✓ Remote workshops via Zoom/Teams\n✓ Role-based training (accounts, sales, warehouse)\n✓ Video tutorials & user manuals\n✓ Ongoing support after go-live\n\n**How many staff members would need training?** And do you prefer on-site or remote sessions?`,
        quickReplies: ['1–3 people, on-site', '4–10 people, on-site', 'Remote training preferred', 'Mix of both'],
        nextStage: 'free',
      };

    default: {
      // Contextual fallback based on stage
      if (stage === 'ask_name') {
        const name = userText.trim().split(' ')[0];
        return {
          text: `Nice to meet you, **${name}**! 😊\n\nSo, tell me — what kind of business do you run? Knowing your industry helps me point you to exactly the right solution.\n\nFor example: retail, wholesale, manufacturing, services, NGO, hospitality...`,
          quickReplies: ['Retail / Shop', 'Wholesale / Distribution', 'Manufacturing', 'Services / Consulting', 'NGO / Non-profit', 'Hospitality / F&B'],
          nextStage: 'ask_business',
        };
      }

      if (stage === 'ask_business') {
        return {
          text: `Interesting! ${greet}${userText} businesses often come to us with a few common challenges.\n\nOut of these, **which one is your biggest pain point right now?** 🎯`,
          quickReplies: ['KRA & tax compliance', 'Slow or manual invoicing', 'Inventory going out of control', 'Payroll taking too long', 'No visibility into cash flow', 'Growing team, need better systems'],
          nextStage: 'ask_challenge',
        };
      }

      if (stage === 'ask_challenge') {
        return {
          text: `That's a really common challenge — and honestly, one we solve every week! 💪\n\nJust so I can give you the most relevant recommendation: **how many people currently work in your business?**`,
          quickReplies: ['Just me', '2–10 people', '11–50 people', '50+ people'],
          nextStage: 'ask_users',
        };
      }

      if (stage === 'ask_users') {
        return {
          text: `Perfect. And one more thing — **what software or system are you currently using** to manage your accounts or business operations?\n\nEven if it's just Excel or WhatsApp groups — no judgment! 😄`,
          quickReplies: ['Excel / manual', 'QuickBooks', 'Sage / Pastel', 'Another system', 'Nothing yet'],
          nextStage: 'ask_current_software',
        };
      }

      if (stage === 'ask_current_software') {
        return {
          text: `Got it! Based on everything you've shared, I have a clear picture of what you need. 🎯\n\nHere's what I'd recommend:\n\n${lead.users && parseInt(lead.users) <= 2
            ? '• **TallyPrime Silver** — perfect for your team size, KES 57,600 +VAT'
            : '• **TallyPrime Gold** — multi-user access, KES 172,800 +VAT'}\n• **Cloud Hosting** — so your team can access from anywhere, from KES 8,000/month\n${lead.challenge?.includes('cash flow') || lead.challenge?.includes('grow') ? '• **EOS® Implementation** — to build the operating system your business needs to scale\n' : ''}• **HubSpot CRM** — to manage your sales pipeline and customer relationships\n\nThe best next step is a **free 30-minute demo** where we show you exactly how this works for a business like yours.\n\n**Would you like to book that demo now?** 📅`,
          action: 'demo',
          quickReplies: ['Yes, book a demo!', 'Send me more info first', 'WhatsApp me instead'],
          nextStage: 'recommend',
        };
      }

      // Generic helpful fallback
      return {
        text: `That's a great point! 🤔 Let me make sure I understand what you need.\n\nWe specialise in:\n✦ **TallyPrime** — accounting, inventory, payroll & KRA compliance\n✦ **Cloud Hosting** — access your data from anywhere\n✦ **HubSpot CRM** — manage your sales pipeline & customers\n✦ **EOS®** — run your business on a proven operating system\n\nCould you tell me a bit more about what you're trying to solve? Or if it's easier, let's just **book a quick call** and we'll figure it out together! 😊`,
        quickReplies: ['Book a call', 'Tell me about TallyPrime', 'What is EOS®?', 'HubSpot + TallyPrime'],
        nextStage: 'free',
      };
    }
  }
}

export default function Chatbot() {
  const { data } = useSite();
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [stage, setStage] = useState<Stage>('greeting');
  const [lead, setLead] = useState<LeadProfile>({});
  const sessionId = useRef<string>(Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: '0',
      role: 'bot',
      text: `Hey there! 👋 Welcome to **Optimum Prime Solutions** — Kenya's certified TallyPrime partner.\n\nI'm **Aurora**, your business solutions guide. Whether you need help with accounting, KRA compliance, cloud hosting, HubSpot CRM, or running your business on EOS® — I'm here to help.\n\nWhat's your name? I'd love to make this feel a bit more personal! 😊`,
      time: getTime(),
      quickReplies: [],
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  // Log chatbot session start to Firebase when chat is opened
  useEffect(() => {
    if (open) {
      const sessionData = {
        sessionId: sessionId.current,
        startedAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        week: getWeekKey(),
        messageCount: 0,
        topics: [] as string[],
        leadCaptured: false,
      };
      fbSet(`chatbot_sessions/${sessionId.current}`, sessionData).catch(() => {});
    }
  }, [open]);

  // Log each interaction topic and lead status to Firebase
  const logChatEvent = useCallback((intent: string, isLead: boolean) => {
    const path = `chatbot_sessions/${sessionId.current}`;
    fbGet(path).then((existing: any) => {
      if (!existing) return;
      const topics: string[] = existing.topics || [];
      if (intent !== 'unknown' && !topics.includes(intent)) topics.push(intent);
      fbSet(path, {
        ...existing,
        messageCount: (existing.messageCount || 0) + 1,
        topics,
        leadCaptured: isLead || existing.leadCaptured,
        lastMessageAt: new Date().toISOString(),
        leadName: lead.name || existing.leadName || '',
        leadBusiness: lead.business || existing.leadBusiness || '',
      }).catch(() => {});
    }).catch(() => {});
  }, [lead]);

  const scroll = useCallback(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  useEffect(() => {
    scroll();
  }, [msgs, typing, scroll]);

  // Extract lead info from user message
  const extractLeadInfo = (txt: string, currentStage: Stage): Partial<LeadProfile> => {
    const updates: Partial<LeadProfile> = {};
    if (currentStage === 'ask_name') {
      updates.name = txt.trim().split(/\s+/).slice(0, 2).join(' ');
    }
    if (currentStage === 'ask_business' || /retail|wholesale|manufactur|service|ngo|hospitality|farm|school|clinic/i.test(txt)) {
      updates.business = txt.trim();
      if (/retail|shop|store/i.test(txt)) updates.industry = 'retail';
      else if (/wholesale|distribut/i.test(txt)) updates.industry = 'wholesale';
      else if (/manufactur|factory|production/i.test(txt)) updates.industry = 'manufacturing';
      else if (/service|consult|agency/i.test(txt)) updates.industry = 'services';
    }
    if (currentStage === 'ask_challenge') updates.challenge = txt.trim();
    if (currentStage === 'ask_users' || /(\d+)\s*(user|person|people|staff|employee)/i.test(txt)) {
      const m = txt.match(/(\d+)/);
      if (m) updates.users = m[1];
      else updates.users = txt.trim();
    }
    if (currentStage === 'ask_current_software') updates.currentSoftware = txt.trim();
    return updates;
  };

  const send = (txt: string) => {
    if (!txt.trim() || typing) return;

    const trimmedText = txt.trim();
    const userMsg: Msg = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmedText,
      time: getTime(),
    };

    // Update lead profile — extract name immediately and synchronously
    const leadUpdates = extractLeadInfo(trimmedText, stage);
    // If we are in ask_name stage and no name yet, extract it right away
    if (stage === 'ask_name' && !leadUpdates.name) {
      const possibleName = trimmedText.trim().split(/\s+/).slice(0, 2).join(' ');
      if (possibleName) leadUpdates.name = possibleName;
    }
    const updatedLead = { ...lead, ...leadUpdates };
    // Flush name to state immediately so all subsequent renders have it
    if (leadUpdates.name && leadUpdates.name !== lead.name) {
      setLead(updatedLead);
    } else {
      setLead((prev) => ({ ...prev, ...leadUpdates }));
    }
    setMsgs((p) => [...p, userMsg]);
    setInput('');
    setTyping(true);
    setShowTypingIndicator(true);

    // Determine intent
    const intent = detectIntent(trimmedText);
    // Log to Firebase
    const isLead = intent === 'demo' || stage === 'recommend' || stage === 'ask_current_software';
    logChatEvent(intent, isLead);

    // Determine next stage
    let nextStage: Stage = stage;
    if (stage === 'greeting' || intent === 'greeting') nextStage = 'ask_name';
    else if (stage === 'ask_name') nextStage = 'ask_business';
    else if (stage === 'ask_business') nextStage = 'ask_challenge';
    else if (stage === 'ask_challenge') nextStage = 'ask_users';
    else if (stage === 'ask_users') nextStage = 'ask_current_software';
    else if (stage === 'ask_current_software') nextStage = 'recommend';
    else nextStage = 'free';

    // Build conversation history for the AI (exclude the initial bot greeting to save tokens)
    // Include the current user message so the AI has full context including the name just given
    const aiHistory: ChatMessage[] = msgs
      .slice(1) // skip the initial greeting message
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

    // Always pass the fully updated lead (with name) to the AI
    const leadForAI = { ...updatedLead };

    // --- DIRECT NAME HANDLER ---
    // When the bot just asked for the user's name (stage is 'greeting' or 'ask_name'),
    // handle it directly without sending to the AI — the AI tends to treat name
    // introductions as topic statements and responds with things like "That's a great point!"
    // The initial stage is 'greeting' and the bot's first message asks for the name,
    // so ANY first user message should be treated as a name response.
    const isNameStage = stage === 'ask_name' || stage === 'greeting';
    // Extract name from message — handle "My name is Brian", "I'm Brian", "Brian", etc.
    const nameMatch = trimmedText.match(/(?:my name is|i(?:'m| am)|call me)\s+([A-Za-z]+)/i);
    const extractedFirstName = nameMatch ? nameMatch[1] : trimmedText.trim().split(/\s+/)[0];
    const cleanName = extractedFirstName.replace(/[^A-Za-z]/g, '');
    if (isNameStage && cleanName.length >= 2) {
      // Update lead with the correctly extracted name
      const nameOnly = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
      setLead((prev) => ({ ...prev, name: nameOnly }));
      const nameReply = `Nice to meet you, **${nameOnly}**! 😊\n\nTo help you find the right solution, could you tell me a bit about your business? What type of business do you run?`;
      const botMsg: Msg = {
        id: Date.now().toString(),
        role: 'bot',
        text: nameReply,
        time: getTime(),
      };
      setTimeout(() => {
        setMsgs((p) => [...p, botMsg]);
        setShowTypingIndicator(false);
        setTyping(false);
        setStage('ask_business');
      }, 700);
      return;
    }

    // --- MID-CONVERSATION NAME CORRECTION HANDLER ---
    // Detects when a user corrects their name at any stage, e.g.:
    // "Actually my name is James", "Call me James", "It's James", "not Brian, it's James"
    const nameCorrectionMatch = trimmedText.match(
      /(?:actually(?:\s+my\s+name\s+is)?|my\s+name\s+is\s+(?:actually|not\s+\w+,?\s+it'?s?)|call\s+me|it'?s?\s+(?:actually\s+)?|not\s+\w+,?\s+(?:it'?s?\s+)?|my\s+(?:real\s+)?name\s+is)\s*([A-Za-z]{2,})/i
    );
    if (!isNameStage && nameCorrectionMatch) {
      const correctedName = nameCorrectionMatch[1].charAt(0).toUpperCase() + nameCorrectionMatch[1].slice(1).toLowerCase();
      setLead((prev) => ({ ...prev, name: correctedName }));
      const correctionReply = `Got it, **${correctedName}**! 😊 I've updated that. Now, where were we?`;
      const botMsg: Msg = {
        id: Date.now().toString(),
        role: 'bot',
        text: correctionReply,
        time: getTime(),
      };
      setTimeout(() => {
        setMsgs((p) => [...p, botMsg]);
        setShowTypingIndicator(false);
        setTyping(false);
      }, 600);
      return;
    }

    if (stage === 'ask_name' && updatedLead.name) {
      const firstName = updatedLead.name.split(' ')[0];
      const nameReply = `Nice to meet you, **${firstName}**! 😊\n\nTo help you find the right solution, could you tell me a bit about your business? What type of business do you run?`;
      const botMsg: Msg = {
        id: Date.now().toString(),
        role: 'bot',
        text: nameReply,
        time: getTime(),
      };
      setTimeout(() => {
        setMsgs((p) => [...p, botMsg]);
        setShowTypingIndicator(false);
        setTyping(false);
        setStage(nextStage);
      }, 700);
      return;
    }

    // Try AI reply first, fall back to rule-based
    (async () => {
      try {
        const aiReply = await getChatGPTReply(trimmedText, data, aiHistory, leadForAI as Record<string, string | undefined>);
        if (!aiReply?.trim()) throw new Error('EMPTY_REPLY');

        // Inject a follow-up question if the AI reply doesn't already have one
        const hasQuestion = aiReply.includes('?');
        const followUps: Record<string, string> = {
          ask_name: '\n\nWhat\'s your name so I can personalise this for you? 😊',
          ask_business: '\n\nWhat industry or type of business are you in?',
          ask_challenge: '\n\nWhat\'s your biggest challenge right now?',
          ask_users: '\n\nHow many people will need access to the system?',
          ask_current_software: '\n\nWhat are you currently using to manage your accounts?',
        };

        const enrichedReply = hasQuestion
          ? aiReply
          : aiReply + (followUps[nextStage] || '\n\nWhat else can I help you with?');

        const botMsg: Msg = {
          id: Date.now().toString(),
          role: 'bot',
          text: enrichedReply,
          time: getTime(),
        };

        setTimeout(() => {
          setMsgs((p) => [...p, botMsg]);
          setShowTypingIndicator(false);
          setTyping(false);
          setStage(nextStage);
        }, 800);
      } catch {
        // Rule-based fallback
        const response = buildBotResponse(intent, updatedLead, stage, trimmedText, data);
        if (response.action === 'demo') {
          setTimeout(() => setDemoOpen(true), 1200);
        }
        const botMsg: Msg = {
          id: Date.now().toString(),
          role: 'bot',
          text: response.text,
          time: getTime(),
          action: response.action,
          quickReplies: response.quickReplies,
        };

        setTimeout(() => {
          setMsgs((p) => [...p, botMsg]);
          setShowTypingIndicator(false);
          setTyping(false);
          if (response.nextStage) setStage(response.nextStage);
          else setStage(nextStage);
        }, 900);
      }
    })();
  };

  const handleClear = () => {
    if (confirm('Start a fresh conversation?')) {
      setMsgs([
        {
          id: '0',
          role: 'bot',
          text: `Hey! 👋 Let's start fresh. I'm **Aurora** from Optimum Prime Solutions.\n\nWhat's your name? 😊`,
          time: getTime(),
        },
      ]);
      setLead({});
      setStage('greeting');
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
            aria-label="Chat with Aurora"
            title="Chat with Aurora — AI Assistant"
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
                ? 'bottom-6 right-6 h-14 w-72'
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
                  <span className="text-white font-semibold text-sm">Aurora — Optimum Assistant</span>
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
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          <p className={`text-xs mt-1.5 ${msg.role === 'user' ? 'text-white/70 text-right' : 'text-slate-400'}`}>
                            {msg.time}
                          </p>
                        </div>

                        {/* Quick reply buttons */}
                        {msg.role === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {msg.quickReplies.map((qr) => (
                              <button
                                key={qr}
                                onClick={() => send(qr)}
                                disabled={typing}
                                className="px-3 py-1.5 bg-white border border-red-200 text-red-700 text-xs font-medium rounded-full hover:bg-red-50 hover:border-red-400 transition-colors disabled:opacity-50 whitespace-nowrap"
                              >
                                {qr}
                              </button>
                            ))}
                          </div>
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
                      <span className="text-xs text-slate-400 ml-1">Aurora is typing...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={endRef} />
              </div>
            )}

            {/* Minimised state */}
            {min && (
              <div className="flex-1 flex items-center px-4">
                <span className="text-sm text-slate-600">Chat with Aurora — tap to expand</span>
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
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
                  className="flex-1 px-3 py-2 bg-slate-100 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || typing}
                  className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-40 transition-colors"
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
