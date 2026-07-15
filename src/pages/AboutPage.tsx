import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Award, Target, Eye, MapPin, Phone, ArrowRight,
  CheckCircle, Users, Clock, Zap, Shield, BookOpen,
} from 'lucide-react';
import SEO from '../components/SEO';
import About from '../components/About';
import { useSite } from '../context/SiteContext';

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

const certifications = [
  {
    icon: Award,
    title: 'Certified TallyPrime Partner',
    body: "Authorised by Tally Solutions Africa — Kenya's official reseller for TallyPrime Silver, Gold, and Enterprise editions.",
    color: '#e53e3e',
  },
  {
    icon: Target,
    title: 'Licensed EOS\u00ae Implementer',
    body: 'Certified to implement the Entrepreneurial Operating System (EOS\u00ae) by Gino Wickman — helping leadership teams get aligned and gain traction.',
    color: '#3182ce',
  },
  {
    icon: Shield,
    title: 'KRA eTIMS Approved',
    body: "Recognised by the Kenya Revenue Authority as an approved eTIMS solution provider — ensuring full compliance with Kenya's 2026 e-invoicing mandate.",
    color: '#38a169',
  },
  {
    icon: BookOpen,
    title: 'Biz Analyst Partner',
    body: 'Official Biz Analyst mobile app partner — giving your team real-time TallyPrime data on their phones, anytime, anywhere.',
    color: '#dd6b20',
  },
];

const values = [
  { icon: Users, title: 'Client-First', body: 'Every engagement starts with understanding your business — not selling software.' },
  { icon: CheckCircle, title: 'Certified Expertise', body: 'Our team holds official certifications from Tally Solutions Africa and the EOS\u00ae Worldwide network.' },
  { icon: Clock, title: 'Responsive Support', body: 'Sub-1-hour support response during business hours. We are always reachable when you need us.' },
  { icon: Zap, title: 'Fast Delivery', body: 'Most implementations go live within 5 business days — minimal disruption, maximum impact.' },
];

export default function AboutPage() {
  const { data } = useSite();
  const c = data.company;

  return (
    <main className="min-h-screen bg-slate-50">
      <SEO
        title="About Us | Optimum Prime Solutions — TallyPrime Kenya"
        description="Optimum Prime Solutions is a certified TallyPrime partner in Ruiru, Kenya, helping SMEs with accounting, KRA eTIMS compliance, and cloud hosting."
        socialDescription="Based in Ruiru, Kenya, we are your trusted TallyPrime partner. From implementation to cloud hosting, we help Kenyan businesses thrive."
        canonical="/about"
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'About Us', item: 'https://www.optimumprimesolutions.co.ke/about/' },
        ]}
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
              <Award className="h-3.5 w-3.5" /> About Optimum Prime Solutions
            </span>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {"Kenya's Trusted "}
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Business Technology Partner
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              {c.tagline}
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="h-4 w-4 text-red-400" />
              <span>Ruiru, Kiambu County — serving businesses across Kenya and East Africa</span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/contact#demo-form"
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-red-900/40 transition-all hover:scale-105 hover:bg-red-500 active:scale-95"
              >
                <Phone className="h-4 w-4" /> Book a Free Demo
              </Link>
              <Link
                to="/tally-prime-kenya"
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10 active:scale-95"
              >
                Our Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-red-600 py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {c.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-red-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <span className="inline-block rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">
                Our Story
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Built for Kenyan Businesses
              </h2>
              {c.about.map((para, i) => (
                <p key={i} className="mt-4 text-base leading-7 text-slate-600">
                  {para}
                </p>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {values.map((v) => (
                <div key={v.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                    <v.icon className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-900">{v.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{v.body}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
            <span className="inline-block rounded-full bg-red-600/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400 ring-1 ring-red-500/30">
              Purpose &amp; Direction
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Mission &amp; Vision
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-slate-800/60 p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/20">
                <Target className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">Our Mission</h3>
              <p className="mt-3 text-base leading-7 text-slate-300">{c.mission}</p>
            </motion.div>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-slate-800/60 p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600/20">
                <Eye className="h-6 w-6 text-sky-400" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">Our Vision</h3>
              <p className="mt-3 text-base leading-7 text-slate-300">{c.vision}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── About component (team photo + stats grid) ── */}
      <About />

      {/* ── Certifications ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
            <span className="inline-block rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">
              Credentials
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Certifications &amp; Partnerships
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
              Our credentials represent rigorous training, ongoing compliance, and a commitment to delivering world-class solutions to Kenyan businesses.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.title}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${cert.color}18` }}
                >
                  <cert.icon className="h-6 w-6" style={{ color: cert.color }} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900">{cert.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{cert.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Office Location ── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <span className="inline-block rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">
                Find Us
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Our Office in Ruiru
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                We are based in Ruiru, Kiambu County — conveniently located for businesses across Nairobi, Thika, and the greater Central Kenya region. We also serve clients nationwide through remote support and online sessions.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: MapPin, text: 'Ruiru, Kiambu County, Kenya' },
                  { icon: Phone, text: '+254 116 246 074' },
                  { icon: Clock, text: 'Mon \u2013 Fri: 8 AM \u2013 5 PM \u00b7 Sat: 8 AM \u2013 12 PM' },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-sm text-slate-600">
                    <item.icon className="h-4 w-4 shrink-0 text-red-500" />
                    {item.text}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href={data.contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:scale-105 hover:bg-red-700 active:scale-95"
                >
                  <MapPin className="h-4 w-4" /> Get Directions
                </a>
                <a
                  href={`https://wa.me/${data.contact.whatsapp}?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20your%20services`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:scale-105 hover:border-red-300 hover:text-red-600 active:scale-95"
                >
                  WhatsApp Us
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg"
            >
              <iframe
                title="Optimum Prime Solutions Office Location — Ruiru, Kiambu County"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15954.5!2d36.96!3d-1.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f3f5e9e5e9e5f%3A0x0!2sRuiru%2C%20Kiambu%20County%2C%20Kenya!5e0!3m2!1sen!2ske!4v1"
                width="100%"
                height="360"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to Transform Your Business?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-red-100">
              Book a free demo today and see how TallyPrime and EOS\u00ae can help your business get organised, compliant, and growing — with Kenya's most trusted business technology partner.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/contact#demo-form"
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-red-600 shadow-lg transition-all hover:scale-105 hover:bg-red-50 active:scale-95"
              >
                <Phone className="h-4 w-4" /> Book a Free Demo
              </Link>
              <Link
                to="/contact"
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
