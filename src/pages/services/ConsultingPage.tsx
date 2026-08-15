import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

export default function ConsultingPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Business Consulting Services"
        description="Optimum Prime Solutions offers TallyPrime implementation and business solutions for Kenyan businesses."
        canonical="/tallyprime/consulting"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Business Solutions
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              We are Kenya's certified TallyPrime partner, focused on helping businesses streamline their operations through TallyPrime implementation, cloud hosting, and comprehensive business automation solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact#demo-form"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Book a Free Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/tallyprime"
                className="inline-flex items-center gap-2 rounded-full bg-slate-700 hover:bg-slate-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Explore TallyPrime Solutions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Core Services</h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✓</span>
                  <span><strong>TallyPrime Implementation</strong> - Installation, configuration, and training for Silver, Gold, and Enterprise editions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✓</span>
                  <span><strong>Cloud Hosting</strong> - Secure remote access and automated backups from KES 3,000/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✓</span>
                  <span><strong>KRA Compliance</strong> - Full eTIMS integration and VAT compliance setup</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✓</span>
                  <span><strong>Payroll Processing</strong> - Automated payroll with PAYE, NHIF, NSSF, and Housing Levy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✓</span>
                  <span><strong>Support & Training</strong> - Business-hours remote support with under 1-hour response time</span>
                </li>
              </ul>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ready to Get Started?</h3>
              <p className="text-slate-600 mb-6">
                Contact our team today to discuss which TallyPrime solution is right for your business.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-sm font-semibold">
                  Book Free Demo <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/tallyprime" className="inline-flex items-center gap-2 rounded-full border border-slate-300 hover:border-red-400 text-slate-700 hover:text-red-600 px-6 py-3 text-sm font-semibold">
                  Explore All Services <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'TallyPrime Solutions', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/' },
          { name: 'Consulting', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/consulting/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/20 border border-emerald-500/30 px-4 py-1.5 text-sm font-semibold text-emerald-400 mb-6">
              <Target className="h-4 w-4" />
              EOS®-Informed Consulting — Kenya
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Get Your Business<br />
              <span className="text-emerald-400">Running on a System</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Most Kenyan businesses are run on the founder's instincts. EOS® (Entrepreneurial Operating System) gives your leadership team a proven set of tools to get aligned, build accountability, and execute your vision — consistently, quarter after quarter.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact?type=consultation#demo-form"
                className="inline-flex items-center gap-2 rounded-full bg-purple-600 hover:bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Book a Free Introductory Session <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/254727209720?text=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20EOS%20business%20consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"
              >
                <MessageSquare className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="bg-amber-50 border-y border-amber-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Is This You?</h2>
              <p className="text-slate-600 text-sm mb-6">EOS® is for entrepreneurial businesses that are growing but feel like something is holding them back.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {whoIsItFor.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Six Components */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">The Six Key Components of EOS®</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Every business has six components. EOS® strengthens all six — simultaneously — so your business runs like a well-oiled machine.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sixComponents.map((comp, i) => {
              const Icon = comp.icon;
              return (
                <motion.div
                  key={comp.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{comp.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{comp.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EOS Tools */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3 block">The EOS Toolbox</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Practical Tools, Not Theory
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                EOS® is not a consulting engagement where you pay for a report that sits on a shelf. Every tool is practical, immediately usable, and designed to be run by your leadership team — not by consultants.
              </p>
              <ul className="space-y-3">
                {eosTools.map((tool) => (
                  <li key={tool} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Start with a Free 90-Minute Session</h3>
              <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
                We offer a complimentary 90-minute introductory session where we walk your leadership team through the EOS model and assess whether it's the right fit for your business. No commitment required.
              </p>
              <div className="space-y-3">
                <Link
                  to="/contact?type=consultation#demo-form"
                  className="flex items-center justify-center gap-2 rounded-full bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-6 py-3 text-sm transition w-full"
                >
                  Book Your Free Session <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="tel:+254116246074"
                  className="flex items-center justify-center gap-2 rounded-full border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 text-sm transition w-full"
                >
                  <Phone className="h-4 w-4" /> Call +254 116 246 074
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">EOS® FAQs</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="bg-slate-50 py-14 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Related Services</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'TallyPrime Implementation', href: '/tallyprime/implementation' },
              { label: 'Cloud Hosting', href: '/tallyprime/cloud-hosting' },
              { label: 'Training', href: '/tallyprime/training' },
              { label: 'View All Services', href: '/tallyprime' },
            ].map((s) => (
              <Link key={s.href} to={s.href} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:border-red-300 hover:text-red-600 px-4 py-2 text-sm font-medium text-slate-700 transition">
                {s.label} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
