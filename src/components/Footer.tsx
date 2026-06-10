import { ArrowRight, ArrowUp, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import Logo from './Logo';

const links = [
  { l: 'Home', h: '/' },
  { l: 'About', h: '/about' },
  { l: 'Services', h: '/features' },
  { l: 'Products', h: '/products' },
  { l: 'Blog', h: '/blog' },
  { l: 'FAQ', h: '/faq' },
  { l: 'Contact', h: '/contact' },
];

export default function Footer() {
  const { data } = useSite();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const c = data.contact;

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      window.alert('Please enter a valid email address to join.');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(`/contact?email=${encodeURIComponent(newsletterEmail)}&subject=${encodeURIComponent('Newsletter Signup — Please add me to your mailing list')}`);
    }, 1200);
  };

  return (
    <footer className="bg-gradient-to-br from-slate-50 via-sky-50 to-white text-slate-900">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-4xl bg-white/90 p-8 grid gap-8 lg:grid-cols-[1.4fr_0.9fr_0.9fr_1fr] shadow-2xl shadow-slate-200/20 ring-1 ring-slate-200/70">
          <div className="space-y-5">
            <div className="flex flex-col items-start gap-4">
              <div className="w-full max-w-[160px]">
                <img
                  src="/tally-solutions-new-logo.png"
                  alt="Tally Solutions logo"
                  className="h-auto w-full max-h-14 object-contain object-left"
                />
              </div>
              <Logo className="h-12 w-auto" />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              {data.company.tagline}. Kenya's certified TallyPrime reseller, cloud hosting provider & EOS® implementer.
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
                href="https://www.instagram.com/optimumprimesolutions"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow us on Instagram"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white shadow-md hover:scale-110 transition-transform"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="https://www.facebook.com/optimumprimesolutions"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow us on Facebook"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-[#1877F2] text-white shadow-md hover:scale-110 transition-transform"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <span className="text-xs text-slate-400">Follow us</span>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-8">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-700">
              {links.map((link) => (
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

          <div className="rounded-3xl bg-slate-50 p-8">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 mb-5">Services</h4>
            <ul className="space-y-3 text-sm text-slate-700">
              {data.services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/features#service-${service.id}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="block rounded-2xl px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-red-600"
                  >
                    <div className="font-semibold">{service.title}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">{service.desc}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-slate-50 p-8">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 mb-5">Stay updated</h4>
            <p className="text-sm text-slate-700 mb-4">Receive TallyPrime tips, cloud hosting guides, and EOS® business insights.</p>
            {submitted ? (
              <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-4 text-sm text-green-700 font-medium text-center">
                ✓ Got it! Redirecting you to our contact page...
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email"
                  className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* TallyPrime 7.1 Coming Soon Banner */}
        <div className="rounded-4xl border border-amber-200 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-2xl bg-amber-400 text-white shadow-md">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white">Coming Soon</span>
                  <span className="text-xs text-amber-700 font-semibold">Early Access Beta Available Now</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">TallyPrime 7.1 — The Next Generation of Business Management</h4>
                <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                  Tally Solutions has released TallyPrime 7.1 Beta with powerful new features: <strong>8 professional invoice templates</strong>, <strong>connected banking with ICICI, Axis, SBI & Kotak</strong>, <strong>HSN/SAC online validation</strong>, <strong>Schedule III financial statements</strong>, <strong>IMS reconciliation upgrades</strong>, and <strong>auto-wrap text</strong> for cleaner reports. As your certified TallyPrime partner, we will upgrade and support your transition seamlessly.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <a
                href="https://tallysolutions.com/download-tallyprime-7-1-beta/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 hover:bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition"
              >
                Explore 7.1 Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-white hover:bg-amber-50 px-6 py-3 text-sm font-semibold text-amber-700 transition"
              >
                Book an Upgrade Consultation
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-4xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <img
                src="/tally-solutions-new-logo.png"
                alt="Tally Solutions logo"
                className="h-16 w-auto rounded-2xl bg-white/10 p-2 shadow-lg shadow-black/10"
              />
              <span className="max-w-xl text-sm font-semibold leading-6 text-white">
                Try TallyPrime free — Education Mode. Or contact us for official Silver, Gold & Enterprise licensing.
              </span>
            </div>
            <a
              href="https://tallysolutions.com/ssa/download/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition hover:bg-slate-100"
            >
              Download Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>

      <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {data.company.name}. All rights reserved.</p>
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
