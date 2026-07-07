import { Link } from 'react-router-dom';
import { ArrowRight, Download, Cloud, GraduationCap, Headphones, Code2, Database, CheckCircle2, Layers } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';

const services = [
  {
    icon: Layers,
    title: 'TallyPrime Overview',
    desc: 'Discover what TallyPrime can do for your business — accounting, inventory, payroll, KRA compliance and more.',
    href: '/tallyprime',
    cta: 'Explore TallyPrime',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: CheckCircle2,
    title: 'Implementation',
    desc: 'End-to-end TallyPrime setup, configuration, data migration, and go-live support for your business.',
    href: '/tallyprime/implementation',
    cta: 'View Implementation',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Download,
    title: 'Licensing',
    desc: 'Genuine TallyPrime Silver, Gold & Enterprise licences at competitive prices with full local support.',
    href: '/tallyprime/licensing',
    cta: 'View Licensing',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Cloud,
    title: 'Cloud Hosting',
    desc: 'Secure, always-on cloud access to your TallyPrime data from any device, anywhere in Kenya.',
    href: '/tallyprime/cloud-hosting',
    cta: 'View Cloud Hosting',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: GraduationCap,
    title: 'Training',
    desc: 'Hands-on user training, admin workshops, and ongoing coaching for your team — on-site or remote.',
    href: '/tallyprime/training',
    cta: 'View Training',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Headphones,
    title: 'Support & Maintenance',
    desc: '24/7 remote assistance plus scheduled on-site visits. Average response time under 1 hour.',
    href: '/tallyprime/support',
    cta: 'View Support',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Code2,
    title: 'Customization (TDL)',
    desc: 'Custom Tally Definition Language development to tailor TallyPrime to your exact business workflows.',
    href: '/tallyprime/customization',
    cta: 'View Customization',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: Database,
    title: 'Data Migration',
    desc: 'Seamless migration of your existing data from any accounting system into TallyPrime.',
    href: '/tallyprime/data-migration',
    cta: 'View Data Migration',
    color: 'bg-teal-50 text-teal-600',
  },
];

export default function TallyPrimePage() {
  return (
    <>
      <SEO
        title="TallyPrime Solutions Kenya — Implementation, Licensing, Cloud, Training & Support"
        description="Kenya's certified TallyPrime partner. We offer TallyPrime implementation, licensing, cloud hosting, training, support, customization, and data migration. Serving businesses across Nairobi, Ruiru and all of Kenya."
        canonical="/tallyprime"
        keywords="TallyPrime Kenya, TallyPrime implementation Kenya, TallyPrime licensing Kenya, TallyPrime cloud hosting Kenya, TallyPrime training Kenya, TallyPrime support Kenya"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-600/20 border border-red-500/30 px-4 py-1.5 text-sm font-semibold text-red-400 mb-6">
              <img src="/tally-solutions-new-logo.png" alt="TallyPrime" className="h-4 w-auto brightness-200 opacity-80" />
              Official TallyPrime Partner — Kenya
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              TallyPrime Solutions<br />
              <span className="text-red-400">Built for Kenya</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              From licensing and implementation to cloud hosting, training, and ongoing support — we are your single certified TallyPrime partner for every stage of your business journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                View Pricing <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact#demo-form"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"
              >
                Book a Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything TallyPrime, Under One Roof
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Choose the service you need or let us design a complete TallyPrime package tailored to your business.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.href}
                  to={service.href}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group flex flex-col rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${service.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-grow">{service.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-red-600 group-hover:gap-2 transition-all">
                    {service.cta} <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Strip */}
      <section className="bg-white border-y border-slate-100 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
            {[
              { value: '500+', label: 'Businesses Served' },
              { value: '15+', label: 'Years Experience' },
              { value: '99.9%', label: 'Cloud Uptime SLA' },
              { value: '< 1hr', label: 'Support Response' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-red-600 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Talk to our certified TallyPrime specialists. We'll recommend the right solution for your business and budget.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact#demo-form"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition"
            >
              Book a Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
