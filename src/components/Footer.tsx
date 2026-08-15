import { ArrowRight, ArrowUp, Calculator, FileCheck, Mail, MapPin, Package, Phone, Sparkles, Wallet } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { fbSet, fbSubscribe } from '../firebase/config';
import { DEFAULT_WORKSHOP, parseWorkshops, pickActiveWorkshop, isRegistrationClosed as isWorkshopOver, type WorkshopEvent } from '../data/workshopEvent';
import { DEFAULT_WEBINAR, parseWebinars, pickActiveWebinar, isRegistrationClosed as isWebinarOver, type WebinarEvent } from '../data/webinarEvent';
import { isValidEmail } from '../utils/validation';
import Logo from './Logo';

const quickLinks = [
  { l: 'Home', h: '/' },
  { l: 'About', h: '/about' },
  { l: 'TallyPrime Solutions', h: '/tallyprime' },
  { l: 'Industries', h: '/industries' },
  { l: 'Biz Analyst', h: '/biz-analyst' },
  { l: 'Knowledge Hub', h: '/knowledge-hub' },
  { l: 'Video Tutorials', h: '/knowledge-hub/videos' },
  { l: 'Pricing', h: '/pricing' },
  { l: 'Blog', h: '/blog' },
  { l: 'FAQ', h: '/faq' },
  { l: 'Contact', h: '/contact' },
];

const tallyPrimeLinks = [
  { l: 'Implementation', h: '/tallyprime/implementation' },
  { l: 'Licensing', h: '/tallyprime/licensing' },
  { l: 'Cloud Hosting', h: '/tallyprime/cloud-hosting' },
  { l: 'Training', h: '/tallyprime/training' },
  { l: 'Support', h: '/tallyprime/support' },
  { l: 'Customization (TDL)', h: '/tallyprime/customization' },
  { l: 'Data Migration', h: '/tallyprime/data-migration' },
  { l: 'Business Consulting', h: '/tallyprime/consulting' },
];

const coreServices = [
  { icon: Calculator, label: 'Accounting & Bookkeeping' },
  { icon: Package, label: 'Inventory Management' },
  { icon: Wallet, label: 'Payroll Processing' },
  { icon: FileCheck, label: 'KRA eTIMS Compliance' },
];

export default function Footer() {
  const { data } = useSite();
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const c = data.contact;

  // Show the currently-active workshop and webinar in the footer, but only if
  // they are genuinely UPCOMING — an event with a date that hasn't passed.
  // Past events (and undated placeholders) auto-archive, so we never advertise
  // something that already happened.
  const [workshop, setWorkshop] = useState<WorkshopEvent>(DEFAULT_WORKSHOP);
  const [webinar, setWebinar] = useState<WebinarEvent>(DEFAULT_WEBINAR);
  useEffect(() => {
    const unsubW = fbSubscribe('workshops', (raw: Record<string, any> | null) => {
      setWorkshop(pickActiveWorkshop(parseWorkshops(raw)));
    });
    const unsubWeb = fbSubscribe('webinars', (raw: Record<string, any> | null) => {
      setWebinar(pickActiveWebinar(parseWebinars(raw)));
    });
    return () => { unsubW(); unsubWeb(); };
  }, []);
  const upcomingEvents = [
    ...(webinar.calendarStart && !isWebinarOver(webinar)
      ? [{ l: webinar.title, h: '/webinar', badge: webinar.date }] : []),
    ...(workshop.calendarStart && !isWorkshopOver(workshop)
      ? [{ l: workshop.title, h: '/workshop-rsvp', badge: workshop.date }] : []),
  ];

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail(newsletterEmail)) {
      window.alert('Please enter a valid email address to join.');
      return;
    }

    const name = newsletterName.trim();
    setSubscribing(true);
    const saved = await fbSet(`newsletter_subscribers/${Date.now()}`, {
      email: newsletterEmail,
      ...(name ? { name } : {}),
      subscribedAt: new Date().toISOString(),
      status: 'active',
    });

    setSubscribing(false);

    if (!saved) {
      window.alert('Something went wrong subscribing you. Please try again in a moment.');
      return;
    }

    // Notify team via WhatsApp (fire-and-forget)
    fetch('https://optimum-prime-lead-notifier.onrender.com/newsletter-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newsletterEmail, name }),
    }).catch(() => {});

    setSubmitted(true);
    setNewsletterName('');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-gradient-to-br from-slate-50 via-sky-50 to-white text-slate-900">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-4xl bg-white/90 p-8 grid gap-8 lg:grid-cols-[1.4fr_1.6fr_0.9fr] shadow-2xl shadow-slate-200/20 ring-1 ring-slate-200/70">
          {/* Brand Column */}
          <div className="space-y-5">
            <div className="flex flex-col items-start gap-4">
              <div className="w-full max-w-[160px]">
                <img
                  src="/tally-solutions-new-logo.png"
                  alt="TallyPrime accounting software logo — official partner Optimum Prime Solutions Kenya"
                  className="h-auto w-full max-h-14 object-contain object-left"
                  width={160}
                  height={56}
                  loading="lazy"
                />
              </div>
              <Logo className="h-12 w-auto" loading="lazy" />
              <span className="h-0.5 w-7 rounded-full bg-blue-600" aria-hidden="true" />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              {data.company.tagline}. Kenya's certified TallyPrime reseller, cloud hosting provider & business systems consultant.
            </p>
            <div className="grid gap-3 text-sm">
              <a href={`tel:${c.phones[0]?.replace(/\s/g, '')}`} className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition">
                <Phone className="h-4 w-4" /> {c.phones[0]}
              </a>
              <a href={`mailto:${c.emails[0]}`} className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition">
                <Mail className="h-4 w-4" /> {c.emails[0]}
              </a>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4" /> {c.location}
              </div>
            </div>
            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/optimumprimesolutionsltd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-[#1877F2] text-white shadow-md hover:scale-110 transition-transform"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a
                href="https://www.instagram.com/optimumprimesolutionsltd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white shadow-md hover:scale-110 transition-transform"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
              <a
                href="https://www.linkedin.com/company/optimumprimesolutionsltd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on LinkedIn"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-[#0A66C2] text-white shadow-md hover:scale-110 transition-transform"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.66 4.78 6.11V21h-4v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.93V21H9z"/></svg>
              </a>
              <span className="text-xs text-slate-400">Follow us</span>
            </div>

            {/* Core Services Summary */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {coreServices.map((service) => (
                <div key={service.label} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                  <service.icon className="h-3.5 w-3.5 shrink-0 text-red-600" />
                  <span className="text-xs text-slate-600 leading-tight">{service.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links + TallyPrime Services — side by side */}
          <div className="rounded-3xl bg-slate-50 p-8 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 mb-5">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {quickLinks.map((link) => (
                  <li key={link.h}>
                    <Link
                      to={link.h}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="block rounded-2xl px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-red-600"
                    >
                      {link.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 mb-5">TallyPrime Services</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {tallyPrimeLinks.map((link) => (
                  <li key={link.h}>
                    <Link
                      to={link.h}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="block rounded-2xl px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-red-600"
                    >
                      {link.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Upcoming Events + Newsletter stacked */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-slate-50 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 mb-4">Upcoming Events</h3>
              <ul className="space-y-2 text-sm">
                {upcomingEvents.length === 0 && (
                  <li className="px-3 py-2 text-sm text-slate-500">
                    No upcoming events right now — check back soon.
                  </li>
                )}
                {upcomingEvents.map((event) => (
                  <li key={event.h}>
                    <Link
                      to={event.h}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="block rounded-2xl px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-red-600"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span>{event.l}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-600/10 px-2 py-0.5 text-[11px] font-semibold text-red-600 border border-red-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                          {event.badge}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <Link
                    to="/knowledge-hub"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="block rounded-2xl px-3 py-2 text-slate-500 text-xs transition hover:bg-slate-100 hover:text-red-600"
                  >
                    View all events & webinars →
                  </Link>
                </li>
              </ul>
            </div>

          {/* Newsletter */}
          <div className="rounded-3xl bg-slate-50 p-6 flex-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 mb-5">Stay updated</h3>
            <p className="text-sm text-slate-700 mb-4">Receive TallyPrime tips, cloud hosting guides, and practical business insights.</p>
            {submitted ? (
              <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-4 text-sm text-green-700 font-medium text-center">
                🎉 Congratulations — you're subscribed! We'll be in touch with updates.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3" aria-label="Newsletter signup">
                <label htmlFor="newsletter-name" className="sr-only">Your name (optional)</label>
                <input
                  id="newsletter-name"
                  name="newsletter-name"
                  type="text"
                  value={newsletterName}
                  onChange={(e) => setNewsletterName(e.target.value)}
                  placeholder="Your name (optional)"
                  aria-label="Your name (optional)"
                  className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 placeholder:text-slate-500"
                />
                <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
                <input
                  id="newsletter-email"
                  name="newsletter-email"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  aria-label="Enter your email address for the newsletter"
                  className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                  aria-label="Subscribe to newsletter"
                >
                  {subscribing ? 'Joining...' : 'Join'}
                </button>
              </form>
            )}
          </div>
          </div>
        </div>

        {/* TallyPrime 7.1 Banner */}
        <div className="rounded-4xl border border-amber-200 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-2xl bg-amber-400 text-white shadow-md">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">TallyPrime 7.1 — The Next Generation of Business Management</p>
                <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                  Tally Solutions has released TallyPrime 7.1 with powerful new features: <strong>8 professional invoice print templates</strong>, <strong>auto wrap text</strong>, <strong>scheduled auto backup</strong>, <strong>eTIMS-ready compliance</strong>, and more. As your certified TallyPrime partner in Kenya, we will upgrade and support your transition seamlessly.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <a
                href="https://tallysolutions.com/download-tallyprime-7-1-beta/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 hover:bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition"
              >
                Explore 7.1 Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <Link
                to="/contact#demo-form"
                className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-white hover:bg-amber-50 px-6 py-3 text-sm font-semibold text-amber-700 transition"
              >
                Book an Upgrade Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Download Banner */}
        <div className="rounded-4xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <img
                src="/tally-solutions-new-logo.png"
                alt="TallyPrime accounting software logo — official partner Optimum Prime Solutions Kenya"
                className="h-16 w-auto rounded-xl object-contain bg-white/10 p-2 shadow-lg shadow-black/10"
                width={64}
                height={64}
                loading="lazy"
              />
              <span className="max-w-xl text-sm font-semibold leading-6 text-white">
                Try TallyPrime free — Education Mode. Or contact us for official Silver, Gold & Enterprise licensing.
              </span>
            </div>
            <a
              href="https://tallysolutions.com/ssa/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition hover:bg-slate-100"
            >
              Download Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} {data.company.name}. All rights reserved.</span>
            <Link to="/privacy-policy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-red-600 transition-colors">
              Privacy Policy
            </Link>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-slate-700 transition hover:text-red-600"
          >
            <ArrowUp className="h-4 w-4" /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
