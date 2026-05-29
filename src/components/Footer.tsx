import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useSite } from '../context/SiteContext';

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
  const c = data.contact;

  return (
    <footer className="bg-gradient-to-br from-slate-50 via-sky-50 to-white text-slate-900">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-4xl bg-white/90 p-8 grid gap-8 lg:grid-cols-[1.4fr_0.9fr_0.9fr_1fr] shadow-2xl shadow-slate-200/20 ring-1 ring-slate-200/70">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Logo className="h-14 w-auto" variant="full" />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              {data.company.tagline}. Your trusted Tally Prime partner in Kenya.
            </p>
            <div className="grid gap-3 text-sm">
              <a href={`tel:${c.phones[0]?.replace(/\s/g, '')}`} className="flex items-center gap-2 text-slate-600 hover:text-sky-700 transition">
                <Phone className="h-4 w-4" /> {c.phones[0]}
              </a>
              <a href={`mailto:${c.emails[0]}`} className="flex items-center gap-2 text-slate-600 hover:text-sky-700 transition">
                <Mail className="h-4 w-4" /> {c.emails[0]}
              </a>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4" /> {c.location}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-8">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-700">
              {links.map((link) => (
                <li key={link.h}>
                  <Link
                    to={link.h}
                    className="block rounded-2xl px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-sky-700"
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
                    to="/features"
                    className="block rounded-2xl px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-sky-700"
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
            <p className="text-sm text-slate-700 mb-4">Receive practical TallyPrime and business automation insights.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 placeholder:text-slate-500"
              />
              <button className="rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-sky-700 hover:to-cyan-600">
                Join
              </button>
            </form>

            <div className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200 min-h-[180px] sm:min-h-[200px]">
              <img
                src="/tally-cloud-banner.svg"
                alt="Tally 7.0 logo and banner"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {data.company.name}. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-slate-700 transition hover:text-sky-700"
          >
            <ArrowUp className="h-4 w-4" /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
