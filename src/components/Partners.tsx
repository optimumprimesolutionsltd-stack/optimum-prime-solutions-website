import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const partners = [
  {
    name: 'TallyPrime',
    logo: '/partner-tallyprime.png',
    description: 'We are Kenya\'s certified TallyPrime reseller and implementation partner. TallyPrime is the leading business management software for accounting, inventory, payroll, and KRA compliance — trusted by millions of businesses worldwide.',
    badge: 'Certified Partner',
    badgeColor: 'bg-blue-100 text-blue-700',
    url: 'https://tallysolutions.com',
    logoClass: 'h-10 object-contain',
  },
  {
    name: 'EOS Worldwide',
    logo: '/partner-eos.png',
    description: 'We apply EOS® (Entrepreneurial Operating System) principles to help leadership teams get aligned, gain traction, and achieve their vision. EOS® strengthens the Six Key Components of any business: Vision, People, Data, Issues, Process, and Traction. EOS® is a registered trademark of EOS Worldwide, LLC.',
    badge: 'EOS-Inspired Consulting',
    badgeColor: 'bg-orange-100 text-orange-700',
    url: 'https://www.eosworldwide.com',
    logoClass: 'h-10 object-contain',
  },
  {
    name: 'Biz Analyst',
    logo: '/partner-biz-analyst.png',
    description: 'Biz Analyst is the official TallyPrime mobile app that brings your accounting data to your fingertips. Monitor sales, expenses, inventory, and KRA compliance in real-time from your phone — no computer needed.',
    badge: 'Mobile App Partner',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    url: 'https://www.bizanalyst.in',
    logoClass: 'h-10 object-contain',
  },
  {
    name: 'TSplus',
    logo: '/partner-tsplus.png',
    description: 'TSplus enables secure remote desktop access to TallyPrime from any device, anywhere. We deploy and manage TSplus infrastructure so your team can access business data remotely without complex VPN setups or expensive Citrix licensing.',
    badge: 'Deployment Partner',
    badgeColor: 'bg-slate-100 text-slate-300',
    url: 'https://tsplus.net',
    logoClass: 'h-10 object-contain',
  },
];

export default function Partners() {
  return (
    <section className="bg-slate-800 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600 mb-3">
            Technology Partners
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Powered by the Best in the Industry
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
            We partner with world-class technology providers to deliver complete, integrated solutions for your business.
          </p>
        </div>

        {/* Partner cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner, i) => (
            <motion.a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-slate-900 p-6 hover:border-red-200 hover:bg-red-50/30 hover:shadow-md transition-all duration-200"
            >
              {/* Logo */}
              <div className="flex items-center justify-center h-16 mb-4">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className={partner.logoClass}
                  width={160}
                  height={64}
                  loading="lazy"
                />
              </div>

              {/* Badge */}
              <div className="flex justify-center mb-3">
                <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${partner.badgeColor}`}>
                  {partner.badge}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-slate-400 flex-1">
                {partner.description}
              </p>

              {/* Link */}
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-red-600 group-hover:text-red-700">
                Learn more
                <ExternalLink className="h-3 w-3" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-12 rounded-2xl bg-slate-900 border border-white/10 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex -space-x-3">
              {partners.map((p) => (
                <div key={p.name} className="h-10 w-10 rounded-full bg-slate-800 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                  <img src={p.logo} alt={p.name} className="h-7 w-7 object-contain" width={28} height={28} loading="lazy" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-white">Certified across 4 platforms.</span>{' '}
              One trusted partner to implement, integrate, and support them all for your business.
            </p>
          </div>
          <Link
            to="/contact#demo-form"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-500 shadow-md shadow-red-600/30 transition-colors shrink-0"
          >
            Talk to Our Team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
