/**
 * Zawadi AI — powered by Optimum Prime Solutions' Render backend.
 * Calls the /chat endpoint on the Render server which uses a real LLM with
 * a comprehensive Zawadi system prompt covering all products and Kenya context.
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_API_URL = 'https://optimum-prime-lead-notifier.onrender.com/chat';

export async function getChatGPTReply(
  userText: string,
  _siteData: unknown,
  history: ChatMessage[] = [],
  _leadProfile?: Record<string, string | undefined>
): Promise<string> {
  // Build message history — include full conversation for context
  const messages: ChatMessage[] = [
    ...history.filter(m => m.content && m.content.trim()),
  ];

  // Ensure the latest user message is at the end (avoid duplicates)
  const lastMsg = messages[messages.length - 1];
  if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== userText) {
    messages.push({ role: 'user', content: userText });
  }

  try {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.reply ||
      "I'm sorry, I didn't get a response. Please try again or reach us on WhatsApp at +254 116 246 074."
    );
  } catch (error) {
    console.error('Zawadi chat error:', error);
    return (
      "I'm having a little trouble connecting right now. You can reach us directly on WhatsApp at **+254 116 246 074** or visit **www.optimumprimesolutions.co.ke** 😊"
    );
  }
}
