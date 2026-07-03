import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Truck, Factory, HardHat, Wrench, Heart, GraduationCap, Building2 } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';

const industries = [
  {
    icon: ShoppingCart,
    title: 'Retail',
    desc: 'POS billing, stock management, customer loyalty, and KRA eTIMS compliance for retail businesses of all sizes.',
    href: '/industries/retail',
    color: 'bg-red-50 text-red-600',
    tags: ['POS & Billing', 'Stock Control', 'eTIMS Compliant'],
  },
  {
    icon: Truck,
    title: 'Distribution',
    desc: 'Route sales, multi-location inventory, van sales tracking, and distributor management powered by TallyPrime.',
    href: '/industries/distribution',
    color: 'bg-blue-50 text-blue-600',
    tags: ['Route Sales', 'Multi-location', 'Van Sales'],
  },
  {
    icon: Factory,
    title: 'Manufacturing',
    desc: 'Bill of Materials, production orders, work-in-progress tracking, and real-time cost analysis.',
    href: '/industries/manufacturing',
    color: 'bg-orange-50 text-orange-600',
    tags: ['BOM Management', 'Production Orders', 'Cost Tracking'],
  },
  {
    icon: HardHat,
    title: 'Construction',
    desc: 'Project costing, contract management, subcontractor billing, and equipment tracking for construction firms.',
    href: '/industries/construction',
    color: 'bg-yellow-50 text-yellow-600',
    tags: ['Project Costing', 'Contract Billing', 'Equipment Tracking'],
  },
  {
    icon: Wrench,
    title: 'Hardware & Wholesale',
    desc: 'Bulk inventory management, trade discounts, credit control, and multi-branch operations for hardware stores.',
    href: '/industries/hardware',
    color: 'bg-slate-100 text-slate-700',
    tags: ['Bulk Inventory', 'Trade Discounts', 'Credit Control'],
  },
  {
    icon: Heart,
    title: 'NGOs & Non-Profits',
    desc: 'Fund accounting, donor management, grant tracking, and statutory reporting for NGOs and charities.',
    href: '/industries/ngos',
    color: 'bg-pink-50 text-pink-600',
    tags: ['Fund Accounting', 'Donor Reports', 'Grant Tracking'],
  },
  {
    icon: GraduationCap,
    title: 'Schools & Education',
    desc: 'Fee collection, payroll, supplier payments, and financial reporting for schools and educational institutions.',
    href: '/industries/schools',
    color: 'bg-purple-50 text-purple-600',
    tags: ['Fee Management', 'Payroll', 'Financial Reports'],
  },
  {
    icon: Building2,
    title: 'SACCOs & Finance',
    desc: 'Member accounts, loan tracking, dividend calculations, and compliance reporting for SACCOs and cooperatives.',
    href: '/industries/saccos',
    color: 'bg-green-50 text-green-600',
    tags: ['Member Accounts', 'Loan Tracking', 'Dividends'],
  },
];

export default function IndustriesPage() {
  return (
    <>
      <SEO
        title="TallyPrime Industry Solutions Kenya — Retail, Manufacturing, NGOs, Schools & More"
        description="Optimum Prime Solutions delivers TallyPrime solutions tailored for your industry. Serving retail, distribution, manufacturing, construction, hardware, NGOs, schools, and SACCOs across Kenya."
        canonical="/industries"
        keywords="TallyPrime for retail Kenya, TallyPrime for manufacturing Kenya, TallyPrime for NGOs Kenya, TallyPrime for schools Kenya, TallyPrime industry solutions Kenya"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-500/30 px-4 py-1.5 text-sm font-semibold text-blue-400 mb-6">
              Industry-Specific TallyPrime Solutions
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Solutions Built for<br />
              <span className="text-red-400">Your Industry</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Every industry has unique challenges. We configure TallyPrime specifically for your sector — so you get software that works the way your business works, not the other way around.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Talk to an Industry Specialist <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/tallyprime"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"
              >
                View All TallyPrime Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Industries We Serve
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              From retail shops to manufacturing plants, we have implemented TallyPrime across Kenya's most dynamic sectors.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <Link
                  key={industry.href}
                  to={industry.href}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group flex flex-col rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${industry.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{industry.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-grow">{industry.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {industry.tags.map((tag) => (
                      <span key={tag} className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-red-600 group-hover:gap-2 transition-all">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Industry-Specific Matters */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Why Industry-Specific Configuration Matters
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                A generic TallyPrime setup works — but an industry-configured setup transforms your operations. We pre-configure TallyPrime with the workflows, reports, and compliance settings specific to your sector, so your team is productive from day one.
              </p>
              <ul className="space-y-3">
                {[
                  'Pre-built industry-specific chart of accounts',
                  'Sector-relevant reports and dashboards',
                  'Compliance settings for your regulatory environment',
                  'Workflows that match how your team actually works',
                  'Training tailored to your industry terminology',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 text-xs font-bold">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Businesses Implemented' },
                { value: '8+', label: 'Industries Served' },
                { value: '15+', label: 'Years in Kenya' },
                { value: '< 1hr', label: 'Support Response' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl bg-slate-50 border border-slate-100 p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Don't See Your Industry?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            We work with businesses across all sectors. Talk to us and we'll design a TallyPrime solution that fits your specific needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition"
            >
              Book a Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/tallyprime"
              className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition"
            >
              Explore TallyPrime Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
