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
    <footer className="bg-slate-50 text-slate-700">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr_0.9fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Logo className="h-8 w-auto" variant="icon" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-950">Optimum Prime</p>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Solutions</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-600">
              {data.company.tagline}. Your trusted Tally Prime partner in Kenya.
            </p>
            <div className="grid gap-3 text-sm">
              <a href={`tel:${c.phones[0]?.replace(/\s/g, '')}`} className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition">
                <Phone className="h-4 w-4" /> {c.phones[0]}
              </a>
              <a href={`mailto:${c.emails[0]}`} className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition">
                <Mail className="h-4 w-4" /> {c.emails[0]}
              </a>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="h-4 w-4" /> {c.location}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              {links.map((link) => (
                <li key={link.h}>
                  <Link to={link.h} className="hover:text-slate-950 transition">
                    {link.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 mb-5">Services</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              {data.services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link to="/features" className="hover:text-slate-950 transition">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 mb-5">Stay updated</h4>
            <p className="text-sm text-slate-600 mb-4">Receive practical TallyPrime and business automation insights.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
              <button className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {data.company.name}. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-slate-600 transition hover:text-slate-950"
          >
            <ArrowUp className="h-4 w-4" /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
