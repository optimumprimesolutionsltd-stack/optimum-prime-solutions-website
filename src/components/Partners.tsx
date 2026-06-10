import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

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
    description: 'We are certified EOS® Implementers helping leadership teams run their businesses on the Entrepreneurial Operating System by Gino Wickman. EOS strengthens the Six Key Components of any business: Vision, People, Data, Issues, Process, and Traction.',
    badge: 'Certified Implementer',
    badgeColor: 'bg-orange-100 text-orange-700',
    url: 'https://www.eosworldwide.com',
    logoClass: 'h-10 object-contain',
  },
  {
    name: 'HubSpot',
    logo: '/partner-hubspot.png',
    description: 'We integrate HubSpot CRM with TallyPrime to give your business a complete view of sales, collections, and customer relationships. HubSpot powers your pipeline, follow-ups, and marketing — while TallyPrime handles the financials.',
    badge: 'Integration Partner',
    badgeColor: 'bg-orange-100 text-orange-700',
    url: 'https://www.hubspot.com',
    logoClass: 'h-8 object-contain',
  },
  {
    name: 'TSplus',
    logo: '/partner-tsplus.png',
    description: 'TSplus enables secure remote desktop access to TallyPrime from any device, anywhere. We deploy and manage TSplus infrastructure so your team can access business data remotely without complex VPN setups or expensive Citrix licensing.',
    badge: 'Deployment Partner',
    badgeColor: 'bg-slate-100 text-slate-700',
    url: 'https://tsplus.net',
    logoClass: 'h-10 object-contain',
  },
];

export default function Partners() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600 mb-3">
            Technology Partners
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Powered by the Best in the Industry
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
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
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 hover:border-red-200 hover:bg-red-50/30 hover:shadow-md transition-all duration-200"
            >
              {/* Logo */}
              <div className="flex items-center justify-center h-16 mb-4">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className={partner.logoClass}
                />
              </div>

              {/* Badge */}
              <div className="flex justify-center mb-3">
                <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${partner.badgeColor}`}>
                  {partner.badge}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-slate-600 flex-1">
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
        <div className="mt-12 rounded-2xl bg-slate-50 border border-slate-200 px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="flex -space-x-3">
            {partners.map((p) => (
              <div key={p.name} className="h-10 w-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                <img src={p.logo} alt={p.name} className="h-7 w-7 object-contain" />
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Certified across 4 platforms.</span>{' '}
            One trusted partner to implement, integrate, and support them all for your business.
          </p>
        </div>
      </div>
    </section>
  );
}
