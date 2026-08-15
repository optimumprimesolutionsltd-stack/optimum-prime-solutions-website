/**
 * Zawadi AI — powered by Optimum Prime Solutions' Render backend.
 * Calls the /chat endpoint on the Render server which uses a real LLM with
 * a comprehensive Zawadi system prompt covering all products and Kenya context.
 *
 * Includes retry logic to handle Render free-tier cold starts (server sleeps
 * after 15 min inactivity and takes up to 50s to wake up on first request).
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply?: string;
  handoff?: boolean;
  name?: string;
  phone?: string;
  interest?: string;
  whatsapp_url?: string;
  /** Set when the reply is a local fallback because the backend was unreachable. */
  offline?: boolean;
}

const CHAT_API_URL = 'https://optimum-prime-lead-notifier.onrender.com/chat';
// Timeout per attempt in milliseconds
const TIMEOUT_MS = 50000; // 50 seconds — covers Render cold start
const MAX_RETRIES = 2;

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export async function getChatResponse(
  userText: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  // Build message history — include full conversation for context
  const messages: ChatMessage[] = [
    ...history.filter(m => m.content && m.content.trim()),
  ];

  // Ensure the latest user message is at the end (avoid duplicates)
  const lastMsg = messages[messages.length - 1];
  if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== userText) {
    messages.push({ role: 'user', content: userText });
  }

  const body = JSON.stringify({ messages });
  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  };

  let lastError: unknown;
  // Tracks whether the server answered at all. A status code means the service is
  // reachable but refusing to serve (down/suspended/erroring) — not a cold start.
  let lastStatus: number | undefined;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(CHAT_API_URL, fetchOptions, TIMEOUT_MS);

      if (!response.ok) {
        lastStatus = response.status;
        throw new Error(`Chat API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      console.warn(`Zawadi attempt ${attempt} failed:`, error);
      // A 4xx is a request we got wrong — retrying sends the same body again.
      if (lastStatus && lastStatus >= 400 && lastStatus < 500) {
        break;
      }
      // Short pause before retry
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  console.error('Zawadi chat error after retries:', lastError);
  return {
    reply: lastStatus
      ? "Sorry — I'm offline at the moment while our team sorts out a technical issue on our side. 🙏 You'll get a faster answer on WhatsApp right now — tap below, and a real person will reply."
      : "Sorry — I can't reach our servers from your connection right now. 🙏 Do try again in a moment, or tap below to reach us on WhatsApp instead.",
    handoff: false,
    offline: true,
  };
}

// Legacy wrapper for backward compatibility
export async function getChatGPTReply(
  userText: string,
  _siteData: unknown,
  history: ChatMessage[] = [],
  _leadProfile?: Record<string, string | undefined>
): Promise<string> {
  const result = await getChatResponse(userText, history);
  return result.reply || "I'm sorry, I didn't get a response. Please try again or reach us on WhatsApp at +254 727 209 720.";
}
