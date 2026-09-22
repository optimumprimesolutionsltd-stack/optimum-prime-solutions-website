// Cookie / tracking consent.
//
// GA4 and the Meta Pixel are the only third-party tags on the site, and this
// module is the one place that decides whether either of them may track. The
// two are gated differently because the tags themselves differ:
//
//   GA4    Loaded from index.html with Google Consent Mode v2 defaulting every
//          storage type to denied. The tag is present from first paint but
//          writes no cookies and sends only cookieless pings until consent is
//          granted, so granting it later is a `consent update` call rather than
//          a script injection.
//
//   Pixel  Has no cookieless mode, and Meta's business tools terms put the duty
//          to collect consent on the site running the pixel. It is therefore
//          not fetched at all until the visitor accepts.
//
// The stored choice is read twice: once by the inline script in index.html, so
// a returning visitor who already accepted is measured from the very first hit
// rather than starting out denied, and once here when the banner mounts. Keep
// STORAGE_KEY in step with the copy in index.html.

export type ConsentChoice = 'granted' | 'denied';

const STORAGE_KEY = 'ops-consent-v1';

// Meta Pixel ID from Events Manager — the 15-16 digit number shown next to the
// pixel's name, not the ad account or business ID. Empty until the pixel is
// created, and an empty ID means loadMetaPixel() does nothing, so the site
// behaves exactly as it does today until this is filled in.
export const META_PIXEL_ID = '';

type FbqFn = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded?: boolean;
  version?: string;
  push?: unknown;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

/** The visitor's stored choice, or null if they have not answered yet. */
export function readConsent(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { choice } = JSON.parse(raw) as { choice?: string };
    return choice === 'granted' || choice === 'denied' ? choice : null;
  } catch {
    // Private-mode Safari and blocked-storage browsers throw on access. No
    // stored choice means the banner asks again, which is the safe fallback.
    return null;
  }
}

/**
 * Records the choice and acts on it. The timestamp is kept because the Data
 * Protection Act expects us to be able to show when consent was given.
 */
export function setConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ choice, ts: new Date().toISOString() })
    );
  } catch {
    // Storage unavailable — honour the choice for this page view anyway.
  }
  applyConsent(choice);
}

/**
 * Applies a choice to the tags. Declining needs no call: index.html already
 * defaults every storage type to denied and the pixel is only ever injected
 * from here.
 */
export function applyConsent(choice: ConsentChoice): void {
  if (choice !== 'granted') return;

  window.gtag?.('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  });

  loadMetaPixel();
}

/**
 * The Meta base pixel, written out rather than pasted as Meta's minified
 * snippet. Same behaviour: stub fbq() so calls made before fbevents.js arrives
 * are queued, then replay once it loads.
 *
 * Meta's snippet also ships a <noscript> tracking pixel. That is deliberately
 * omitted — it would fire for every visitor who has JavaScript disabled, which
 * is precisely the case where no consent can have been collected.
 */
function loadMetaPixel(): void {
  if (!META_PIXEL_ID || window.fbq) return;

  const fbq: FbqFn = Object.assign(
    (...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    },
    { queue: [] as unknown[], loaded: true, version: '2.0' }
  );
  fbq.push = fbq;
  window.fbq = fbq;
  window._fbq = window._fbq ?? fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
}

/**
 * A pixel PageView for a client-side route change. The site prerenders every
 * route, so the first page a visitor lands on is a real document load that the
 * base pixel covers; every navigation after that happens in React and would
 * otherwise go uncounted.
 *
 * No-ops until the pixel is loaded, which only happens after consent.
 */
export function trackPixelPageView(): void {
  window.fbq?.('track', 'PageView');
}
