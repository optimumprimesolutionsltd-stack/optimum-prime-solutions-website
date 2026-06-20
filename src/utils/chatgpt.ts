export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Mock AI responses database - conversational, inquisitive, and broad
const mockResponses: Record<string, (history: ChatMessage[], leadProfile?: Record<string, string | undefined>) => string> = {
  greeting: () => `Hey there! 👋 Welcome to Optimum Prime Solutions — Kenya's certified TallyPrime partner. I'm **Zawadi**, your business solutions guide.

I'm here to help you find the right accounting software, cloud hosting, or business consulting solution for your needs. What brings you here today?`,

  pricing: (history, leadProfile) => {
    const hasTeamSize = leadProfile?.teamSize;
    if (!hasTeamSize) {
      return `Great question! Our pricing depends on what you need:

**TallyPrime Silver:** KES 57,600 +VAT (single user, full accounting & invoicing)
**TallyPrime Gold:** KES 172,800 +VAT (unlimited multi-user, priority support)
**Cloud Hosting:** From KES 3,000/month (99.9% uptime, remote access)
**EOS® Consulting:** Custom quote based on engagement scope

Quick question: How many people on your team would be using the software? That'll help me recommend the best fit.`;
    }
    return `Perfect! With ${leadProfile.teamSize} team members, **TallyPrime Gold** would be ideal — it gives unlimited multi-user access, priority support, and on-site training. That's KES 172,800 +VAT.

You can also add **Cloud Hosting** (KES 3,000/month) for remote access from anywhere. Are you currently using any accounting software, or would this be a fresh start?`;
  },

  payroll: (history, leadProfile) => {
    return `Absolutely! We handle full **Payroll Automation** configured for Kenya's requirements:
- PAYE, NHIF, NSSF, Housing Levy calculations
- Payslip generation & e-filing
- Leave & loan tracking
- Multi-branch support

This comes built into TallyPrime Silver and Gold. Do you have any specific payroll challenges right now — like managing multiple branches or complex deductions?`;
  },

  kra: () => `We're 100% **KRA & eTIMS compliant**. We handle:
- Automated VAT calculations
- eTIMS integration for invoice submission
- PAYE, NHIF, NSSF withholding
- Income tax compliance
- Real-time audit trails

Are you currently struggling with eTIMS compliance, or just looking to streamline your tax filing process?`,

  cloud: () => `Our **Cloud Hosting** is built for Kenyan businesses:
- KES 3,000/month starting price
- 99.9% uptime SLA
- Secure remote access from any device
- Automated daily backups
- Multi-user concurrent access

Perfect if your team works from different locations. Are you looking to move your TallyPrime to the cloud, or is this for a different system?`,

  eos: () => `We're **Certified EOS® Implementers**. EOS (Entrepreneurial Operating System) helps leadership teams:
- Clarify vision & traction
- Align on priorities (Rocks & 90-day plans)
- Run effective L10 meetings
- Improve accountability & execution

It's ideal for growing businesses (5–50+ employees). Is your leadership team looking to improve alignment and execution?`,

  services: (history) => {
    const lastUserMessage = history.filter(m => m.role === 'user').pop()?.content.toLowerCase() || '';
    const isRecommendation = lastUserMessage.includes('recommend') || lastUserMessage.includes('advice') || lastUserMessage.includes('guide');
    
    const baseMessage = `We offer a full range of services:
- **TallyPrime Setup & Implementation** (24-hour turnaround)
- **Inventory Management** (real-time tracking, batch/expiry)
- **Payroll Automation** (PAYE, NHIF, NSSF configured)
- **Manufacturing Solutions** (BOM, production tracking)
- **KRA & eTIMS Compliance**
- **Cloud Hosting** (secure remote access)
- **EOS® Consulting** (leadership alignment)
- **Training & Support** (on-site, remote, video)`;

    if (isRecommendation) {
      return `If you're looking for a recommendation, I'd suggest starting with **TallyPrime Silver or Gold** if you need robust accounting and KRA compliance. 

If your team is working remotely, our **Cloud Hosting** is a game-changer. For larger teams (5+ employees) looking for growth, **EOS® Consulting** is highly recommended.

Which of these sounds most relevant to your current situation?`;
    }

    return `${baseMessage}\n\nWhat's your biggest business challenge right now?`;
  },

  contact: () => `You can reach us anytime:
📞 **Phone:** +254 116 246 074 | +254 727 209 720
📧 **Email:** optimumprimesolutionsltd@gmail.com
📍 **Location:** Ruiru, Kenya
💬 **WhatsApp:** +254 116 246 074

Or I can help you book a free consultation right now. What works best for you?`,

  smalltalk: () => `Doing great, thanks for asking! 😊 I'm here to help Kenyan businesses streamline their operations with TallyPrime, cloud hosting, and smart business consulting.

How can I help you today? Are you looking to improve your accounting, manage inventory better, or explore new business solutions?`,

  default: (history, leadProfile) => {
    const lastUserMessage = history.filter(m => m.role === 'user').pop()?.content.toLowerCase() || '';
    
    // Detect intent from last message
    if (lastUserMessage.includes('thanks') || lastUserMessage.includes('thank you')) {
      return `You're welcome! 😊 Feel free to ask me anything else about TallyPrime, cloud hosting, payroll, KRA compliance, or EOS consulting. I'm here to help!`;
    }
    
    if (lastUserMessage.includes('help') || lastUserMessage.includes('support')) {
      return `Absolutely, I'm here to help! 💪 To point you in the right direction, could you describe what you're working on or what's not working smoothly right now?`;
    }
    
    // Check if we've already asked for business needs recently to avoid repetition
    const assistantMessages = history.filter(m => m.role === 'assistant');
    const lastAssistantMessage = assistantMessages[assistantMessages.length - 1]?.content || '';
    const isRepetitive = lastAssistantMessage.includes("tell me more about your business needs");

    if (isRepetitive) {
      return `I want to make sure I give you the best advice. Since you asked for a recommendation, here's how we usually help businesses like yours:
      
1. **Accounting & Invoicing:** TallyPrime is the gold standard for Kenyan businesses.
2. **Remote Operations:** Our Cloud Hosting allows your team to work from anywhere.
3. **Leadership Alignment:** EOS® helps you get more from your business.

Which of these areas is your top priority right now?`;
    }

    return `That sounds interesting! To help you better, could you tell me more about your business needs? For example, are you looking to improve accounting, streamline operations, or strengthen your leadership team?`;
  },
};

// Detect user intent from message
function detectIntent(userText: string): string {
  const text = userText.toLowerCase();
  
  if (text.match(/^(hi|hello|hey|greetings?|what's up)/)) return 'greeting';
  if (text.match(/price|cost|how much|budget|affordable/)) return 'pricing';
  if (text.match(/payroll|salary|paye|nhif|nssf/)) return 'payroll';
  if (text.match(/kra|etims|tax|compliance|invoice/)) return 'kra';
  if (text.match(/cloud|hosting|remote|access|server/)) return 'cloud';
  if (text.match(/eos|leadership|vision|traction|alignment/)) return 'eos';
  if (text.match(/service|offer|do you|what do you|capabilities|recommend|what should i|advice|guide/) && !text.includes('how much')) return 'services';
  if (text.match(/contact|call|phone|email|reach|whatsapp/)) return 'contact';
  if (text.match(/how.*day|how are you|how's it going|how are things|what's up|how you doing/)) return 'smalltalk';
  
  return 'default';
}

export async function getChatGPTReply(
  userText: string,
  siteData: any,
  history: ChatMessage[] = [],
  leadProfile?: Record<string, string | undefined>
) {
  // Detect intent
  const intent = detectIntent(userText);
  
  // Get mock response
  const responseGenerator = mockResponses[intent] || mockResponses['default'];
  const response = responseGenerator(history, leadProfile);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return response;
}
