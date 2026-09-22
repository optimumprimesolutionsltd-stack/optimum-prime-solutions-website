import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applyConsent, readConsent, setConsent, type ConsentChoice } from '../lib/consent';

/**
 * Asks for tracking consent before GA4 gets its cookies and before the Meta
 * Pixel is loaded at all. See src/lib/consent.ts for what each choice does.
 *
 * Nothing renders on the first pass: the decision needs localStorage, and
 * reading it during render would both break the prerender (which runs with an
 * empty profile) and flash the banner at visitors who have already answered.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      // index.html has already told GA4 about a stored 'granted'; this call is
      // what loads the pixel for a returning visitor.
      applyConsent(stored);
      return;
    }
    setVisible(true);
  }, []);

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      data-consent-ui
      role="dialog"
      aria-labelledby="consent-heading"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm p-4 sm:p-5 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.35)] sm:flex sm:items-center sm:gap-6">
        <div className="flex-1">
          <h2 id="consent-heading" className="text-sm font-semibold text-slate-900">
            Cookies on this site
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            We use Google Analytics and Meta advertising cookies to see which pages help
            businesses find us and to measure our ads. Decline and we will only keep what the
            site needs to work.{' '}
            <Link to="/privacy-policy" className="text-red-600 hover:underline">
              Read our privacy policy
            </Link>
            .
          </p>
        </div>
        <div className="mt-4 flex gap-3 sm:mt-0 sm:shrink-0">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="flex-1 sm:flex-none rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="flex-1 sm:flex-none rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
