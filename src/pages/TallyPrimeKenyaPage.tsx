import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Award, CheckCircle, Cloud, BookOpen, Wrench, Phone,
  ArrowRight, Star, Shield, Users, BarChart3, Zap, MapPin
} from 'lucide-react';
import SEO from '../components/SEO';
import { useSite } from '../context/SiteContext';

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

export default function TallyPrimeKenyaPage() {
  const { data } = useSite();

  const services = [
    {
      icon: Award,
      title: 'Official TallyPrime Partner Kenya',
      description:
        'Optimum Prime Solutions is a certified TallyPrime partner authorised by Tally Solutions Africa. We sell genuine licences, provide official support, and ensure your software is always up to date with the latest KRA and eTIMS requirements.',
      keyword: 'official tally partner kenya',
    },
    {
      icon: Wrench,
      title: 'TallyPrime Implementation Kenya',
      description:
        'Our implementation service covers everything from needs assessment and data migration to full configuration, customisation, and go-live support. We have implemented TallyPrime for businesses in manufacturing, retail, wholesale, pharmacy, hospitality, and professional services across Kenya.',
      keyword: 'tally implementation kenya',
    },
    {
      icon: BookOpen,
      title: 'TallyPrime Training Kenya',
      description:
        'We offer structured TallyPrime training programmes for end users, accountants, and administrators. Training is available on-site at your premises, at our Ruiru office, or online via remote sessions — tailored to your team\'s level and pace.',
      keyword: 'tally training kenya',
    },
    {
      icon: Cloud,
      title: 'TallyPrime Cloud Hosting Kenya',
      description:
        'Access your TallyPrime company data securely from any device, anywhere in Kenya. Our cloud hosting service provides dedicated server resources, daily backups, 99.9% uptime, and 24/7 technical support — starting from KES 3,000 per month.',
      keyword: 'tallyprime cloud hosting kenya',
    },
    {
      icon: Shield,
      title: 'KRA eTIMS Compliance Setup',
      description:
        'TallyPrime is a KRA-approved eTIMS solution. We handle the full eTIMS integration setup — connecting your TallyPrime to KRA\'s electronic tax invoice management system so your business is compliant with Kenya\'s 2026 e-invoicing mandate.',
      keyword: 'kra etims tallyprime kenya',
    },
    {
      icon: BarChart3,
      title: 'TallyPrime Support & Upgrades',
      description:
        'Our Annual Maintenance Contract (AMC) keeps your TallyPrime installation running smoothly. We handle version upgrades, troubleshooting, data repair, user additions, and remote support — so your team is never stuck.',
      keyword: 'tallyprime support kenya',
    },
  ];

  const editions = [
    {
      name: 'TallyPrime Silver',
      tagline: 'Single-user accounting',
      features: ['Full accounting & invoicing', 'Inventory management', 'KRA eTIMS compliant', 'Payroll module', 'GST/VAT reports'],
      cta: 'Get Silver Pricing',
      highlight: false,
    },
    {
      name: 'TallyPrime Gold',
      tagline: 'Multi-user with advanced features',
      features: ['Everything in Silver', 'Unlimited concurrent users', 'Multi-branch management', 'Advanced reporting', 'Remote access ready'],
      cta: 'Get Gold Pricing',
      highlight: true,
    },
    {
      name: 'TallyPrime Enterprise',
      tagline: 'Large organisations & groups',
      features: ['Everything in Gold', 'TallyPrime Server included', 'Centralised data management', 'Group company consolidation', 'Priority support'],
      cta: 'Talk to Us',
      highlight: false,
    },
  ];

  const faqs = [
    {
      q: 'Where can I buy TallyPrime in Kenya?',
      a: 'You can buy genuine TallyPrime licences directly from Optimum Prime Solutions, Kenya\'s certified TallyPrime partner. We serve clients in Ruiru, Nairobi, and across Kenya. Contact us via phone, WhatsApp, or our online form for a quote.',
    },
    {
      q: 'What is the price of TallyPrime in Kenya?',
      a: 'TallyPrime pricing in Kenya depends on the edition (Silver, Gold or Enterprise) and the number of users. Contact us for current pricing — we offer competitive rates and flexible payment options for Kenyan businesses.',
    },
    {
      q: 'Is TallyPrime approved by KRA for eTIMS?',
      a: 'Yes. TallyPrime is a KRA-approved eTIMS solution. Optimum Prime Solutions handles the full eTIMS integration setup as part of our implementation service, ensuring your business is fully compliant with Kenya\'s e-invoicing requirements.',
    },
    {
      q: 'Do you offer TallyPrime training in Kenya?',
      a: 'Yes. We provide hands-on TallyPrime training for end users, accountants, and system administrators. Training is available on-site, at our Ruiru office, or online. We tailor every session to your team\'s specific needs.',
    },
    {
      q: 'What does TallyPrime implementation involve?',
      a: 'Our implementation service covers requirements gathering, software installation, company setup, chart of accounts configuration, opening balance migration, user training, and go-live support. We ensure your team is fully operational from day one.',
    },
    {
      q: 'Can I access TallyPrime from anywhere in Kenya?',
      a: 'Yes. With our TallyPrime cloud hosting service, you and your team can securely access your company data from any device — laptop, desktop, or tablet — from anywhere in Kenya with an internet connection.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="TallyPrime Kenya | Buy, Implement & Train — Official Tally Partner"
        description="Buy genuine TallyPrime in Kenya from the official certified partner. Expert TallyPrime implementation, training, KRA eTIMS compliance setup, and cloud hosting. Serving Ruiru, Nairobi and all of Kenya. Call +254 116 246 074."
        canonical="/tally-prime-kenya"
        keywords="TallyPrime Kenya, buy TallyPrime Kenya, official Tally partner Kenya, TallyPrime implementation Kenya, TallyPrime training Kenya, TallyPrime price Kenya, TallyPrime reseller Nairobi, KRA eTIMS TallyPrime, TallyPrime cloud hosting Kenya, TallyPrime Silver Gold Kenya, TallyPrime Ruiru"
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" animate="show"
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-red-600/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-400 ring-1 ring-red-500/30">
              <Award className="h-3.5 w-3.5" /> Certified TallyPrime Partner · Kenya
            </span>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              TallyPrime Kenya —{' '}
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Buy, Implement &amp; Train
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Optimum Prime Solutions is Kenya's official TallyPrime partner. We sell genuine TallyPrime licences (Silver, Gold &amp; Enterprise), deliver end-to-end implementation, provide hands-on training, set up KRA eTIMS compliance, and host your data securely in the cloud — all under one roof, with full local support.
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="h-4 w-4 text-red-400" />
              <span>Based in Ruiru, Kiambu County — serving businesses across Kenya</span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/contact#demo-form"
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-red-900/40 transition-all hover:scale-105 hover:bg-red-500 active:scale-95"
              >
                <Phone className="h-4 w-4" /> Get a Free Quote
              </Link>
              <Link
                to="/products"
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10 active:scale-95"
              >
                View Pricing <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap gap-4">
              {['Certified Tally Partner', 'KRA eTIMS Approved', '24/7 Support', 'Ruiru & Nationwide'].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
            <span className="inline-block rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">
              What We Do
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              TallyPrime Services in Kenya
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
              From buying your first TallyPrime licence to full implementation, training, compliance, and ongoing support — we cover every stage of your TallyPrime journey.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <s.icon className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{s.description}</p>
                <Link
                  to="/contact#demo-form"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                >
                  Enquire <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <span className="inline-block rounded-full bg-red-600/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400 ring-1 ring-red-500/30">
                Why Optimum Prime Solutions
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Kenya's Trusted TallyPrime Partner
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                We are not just a software reseller — we are a full-service business technology partner. When you buy TallyPrime from us, you get a team that understands Kenyan business, KRA compliance, and the operational challenges that SMEs face every day.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: Award, text: 'Certified by Tally Solutions Africa — authorised partner status' },
                  { icon: Shield, text: 'KRA-approved eTIMS integration — fully compliant with 2026 mandate' },
                  { icon: Users, text: 'Dedicated account manager for every client' },
                  { icon: Zap, text: 'Fast implementation — most businesses go live within 5 business days' },
                  { icon: MapPin, text: 'Local presence in Ruiru with nationwide service delivery' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                    <span className="text-sm text-slate-300">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  to="/about"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:scale-105"
                >
                  About Us <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '100+', label: 'Businesses Served', sub: 'Across Kenya' },
                  { value: '5+', label: 'Years Experience', sub: 'TallyPrime & EOS®' },
                  { value: '99.9%', label: 'Cloud Uptime', sub: 'Guaranteed SLA' },
                  { value: '< 4hrs', label: 'Support Response', sub: 'Business hours' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-800/60 p-6 text-center">
                    <p className="text-3xl font-extrabold text-red-400">{stat.value}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{stat.label}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Testimonial snippet */}
              {data.testimonials.length > 0 && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-800/60 p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: data.testimonials[0].rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm italic leading-6 text-slate-300">"{data.testimonials[0].text.slice(0, 160)}…"</p>
                  <p className="mt-3 text-xs font-semibold text-slate-400">— {data.testimonials[0].name}, {data.testimonials[0].company}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Editions / Buy Section ── */}
      <section className="bg-white py-20" id="buy-tallyprime-kenya">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
            <span className="inline-block rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">
              Buy TallyPrime Kenya
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Choose Your TallyPrime Edition
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
              All editions include genuine licences, KRA eTIMS compliance, and full local support from Kenya's certified TallyPrime partner. Contact us for current pricing.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {editions.map((ed, i) => (
              <motion.div
                key={ed.name}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  ed.highlight
                    ? 'border-red-500 bg-gradient-to-br from-red-600 to-red-700 text-white shadow-red-200'
                    : 'border-slate-200 bg-white text-slate-900'
                }`}
              >
                {ed.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-slate-900">
                    Most Popular
                  </span>
                )}
                <h3 className={`text-xl font-bold ${ed.highlight ? 'text-white' : 'text-slate-900'}`}>{ed.name}</h3>
                <p className={`mt-1 text-sm ${ed.highlight ? 'text-red-100' : 'text-slate-500'}`}>{ed.tagline}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {ed.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 ${ed.highlight ? 'text-red-200' : 'text-emerald-500'}`} />
                      <span className={ed.highlight ? 'text-red-50' : 'text-slate-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact#demo-form"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:scale-105 active:scale-95 ${
                    ed.highlight
                      ? 'bg-white text-red-600 hover:bg-red-50'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {ed.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
            <span className="inline-block rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">
              Common Questions
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              TallyPrime Kenya — FAQs
            </h2>
          </motion.div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-sm font-bold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to Buy TallyPrime in Kenya?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-red-100">
              Contact Kenya's official TallyPrime partner today. We will help you choose the right edition, handle the full implementation, and make sure your team is trained and confident from day one.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/contact#demo-form"
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-red-600 shadow-lg transition-all hover:scale-105 hover:bg-red-50 active:scale-95"
              >
                <Phone className="h-4 w-4" /> Contact Us Now
              </Link>
              <a
                href={`https://wa.me/${data.contact.whatsapp}?text=Hi,%20I%20would%20like%20to%20buy%20TallyPrime%20in%20Kenya`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
              >
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
