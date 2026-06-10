export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function getChatGPTReply(
  userText: string,
  siteData: any,
  history: ChatMessage[] = [],
  leadProfile?: Record<string, string | undefined>
) {
  const key = import.meta.env.VITE_OPENAI_KEY;
  if (!key) {
    throw new Error('MISSING_OPENAI_KEY');
  }

  // Build a rich system prompt that includes site context and any known lead info
  const leadContext = leadProfile && Object.keys(leadProfile).some((k) => leadProfile[k])
    ? `\n\nKnown information about this visitor:\n${Object.entries(leadProfile)
        .filter(([, v]) => v)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n')}`
    : '';

  const system = `You are Aurora, the friendly and knowledgeable AI assistant for Optimum Prime Solutions — Kenya's certified TallyPrime partner, cloud hosting provider, and EOS® consulting firm.

Your role is to help visitors understand how TallyPrime, cloud hosting, HubSpot CRM integration, and EOS® can benefit their business. You qualify leads by asking about their business type, challenges, team size, and current software. You are warm, professional, and conversational.

Key facts about Optimum Prime Solutions:
- Certified TallyPrime partner (Silver KES 57,600 +VAT, Gold KES 172,800 +VAT)
- Cloud Hosting from KES 8,000/month
- EOS® Implementation (certified implementers, custom quote)
- HubSpot CRM integration with TallyPrime
- KRA & eTIMS compliant
- Based in Ruiru, Kenya
- Phone: +254 116 246 074 | +254 727 209 720
- Email: optimumprimesolutionsltd@gmail.com

Always remember what the user has already told you in this conversation and refer back to it naturally. Never ask for information the user has already provided. Keep responses concise (under 150 words unless detail is needed) and always end with a relevant follow-up question or a call to action.${leadContext}

Site data for reference: ${JSON.stringify(siteData).slice(0, 3000)}`;

  // Build the messages array: system prompt + full conversation history + current user message
  const messages: ChatMessage[] = [
    { role: 'system', content: system },
    ...history,
    { role: 'user', content: userText },
  ];

  const body = {
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.5,
    max_tokens: 500,
  };

  // Add a reasonable timeout so the chat falls back if the API is slow
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }

  const json = await res.json();
  const msg = json?.choices?.[0]?.message?.content;
  if (!msg) throw new Error('No response from OpenAI');
  return msg as string;
}
