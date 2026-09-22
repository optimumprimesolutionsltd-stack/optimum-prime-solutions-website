import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { useSite } from '../context/SiteContext';
import { readConsent, setConsent, type ConsentChoice } from '../lib/consent';

/**
 * Lets a visitor see and change the choice they made in the consent banner —
 * the withdrawal route the banner itself has no room for. Reloads on change
 * because tags already loaded into the current page cannot be unloaded.
 */
function CookiePreferences() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);

  // localStorage is read after mount so the prerendered HTML does not bake in
  // one visitor's answer for everyone.
  useEffect(() => setChoice(readConsent()), []);

  const change = (next: ConsentChoice) => {
    setConsent(next);
    window.location.reload();
  };

  const label =
    choice === 'granted'
      ? 'You currently allow analytics and advertising cookies.'
      : choice === 'denied'
      ? 'You currently decline analytics and advertising cookies.'
      : 'You have not made a choice yet.';

  return (
    <div className="not-prose rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm text-slate-700">{label}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => change('granted')}
          disabled={choice === 'granted'}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Allow cookies
        </button>
        <button
          type="button"
          onClick={() => change('denied')}
          disabled={choice === 'denied'}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Decline cookies
        </button>
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const { data } = useSite();
  const email = data.contact.emails[0] || 'info@optimumprimesolutions.co.ke';
  const phone = data.contact.phones[0] || '+254 116 246 074';

  return (
    <main className="min-h-screen bg-white">
      <SEO
        title="Privacy Policy | Optimum Prime Solutions"
        description="How Optimum Prime Solutions collects, uses, and protects your personal data across our website, WhatsApp communications, and services."
        canonical="/privacy-policy"
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Privacy Policy', item: 'https://www.optimumprimesolutions.co.ke/privacy-policy/' },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumb className="mb-8" />

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: 29 August 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <p>
              Optimum Prime Solutions Ltd ("we", "us", "our") is Kenya's Certified TallyPrime Partner,
              also providing cloud hosting, and business analytics services. This
              policy explains what personal information we collect, how we use it, and the choices you
              have.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">Information We Collect</h2>
            <p>When you use our website or contact us, we may collect:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Name, company name, and business type</li>
              <li>Phone number and WhatsApp number</li>
              <li>Email address</li>
              <li>Details of your enquiry, demo preferences, or messages you send us</li>
              <li>Website reviews or testimonials you choose to submit</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>To respond to demo requests, consultations, and general enquiries</li>
              <li>To send booking confirmations and reminders via WhatsApp, email, or phone</li>
              <li>To notify our team internally so we can follow up with you promptly</li>
              <li>To send newsletter updates, if you subscribe (you can unsubscribe anytime)</li>
              <li>To improve our website, products, and customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">Cookies and Tracking</h2>
            <p>
              We ask before setting any analytics or advertising cookie. Until you accept, the
              only storage we use is what the site needs to function, and the tools below are
              either dormant or running without cookies:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong>Google Analytics 4</strong> — tells us which pages visitors read and how
                they reached us. Without your consent it records nothing that can be tied back to
                you across visits.
              </li>
              <li>
                <strong>Meta Pixel</strong> — measures which of our Facebook and Instagram ads
                lead to enquiries. It is not loaded at all unless you accept.
              </li>
            </ul>
            <p>
              Declining does not limit anything on this site. You can change your mind at any
              time:
            </p>
            <CookiePreferences />
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">WhatsApp Communications</h2>
            <p>
              We use the WhatsApp Business Platform (provided by Meta) to send you demo confirmations,
              reminders, and replies to enquiries you submit. Messages sent through WhatsApp are subject
              to WhatsApp's own privacy policy in addition to this one. You can stop receiving messages
              from us at any time by telling us directly on WhatsApp or by contacting us using the
              details below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">How We Store Your Data</h2>
            <p>
              Your information is stored securely using Firebase (Google Cloud infrastructure). We use
              third-party services to help deliver our services, including Google Meet and Google
              Calendar (for scheduling demos), and Resend (for transactional email). These providers
              only receive the information necessary to perform their function.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">Data Sharing</h2>
            <p>
              We do not sell your personal information. We only share it with the service providers
              listed above, as needed to operate our business, or where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">Your Rights</h2>
            <p>
              You can ask us to access, correct, or delete the personal information we hold about you at
              any time by contacting us using the details below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or how we handle your data, contact
              us at{' '}
              <a href={`mailto:${email}`} className="text-red-600 hover:underline">{email}</a>{' '}
              or {phone}.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
