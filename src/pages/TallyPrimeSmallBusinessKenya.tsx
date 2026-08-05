import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Receipt, Wallet, Boxes, TrendingUp, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';

const painPoints = [
  {
    icon: Receipt,
    title: 'eTIMS Invoicing Without the Panic',
    desc: 'Raise a compliant invoice in seconds and let it transmit to KRA automatically. No spreadsheets, no manual re-keying at month end.',
  },
  {
    icon: Wallet,
    title: 'Know Exactly Who Owes You',
    desc: 'Receivables and payables ageing at a glance, so you chase the right customer before cash flow becomes a crisis.',
  },
  {
    icon: Boxes,
    title: 'Stock That Matches Reality',
    desc: 'Track what came in, what sold, and what is sitting on the shelf — including negative-stock warnings before they distort your margins.',
  },
  {
    icon: TrendingUp,
    title: 'Reports You Actually Use',
    desc: 'Profit & loss, balance sheet, and cash flow on demand — the numbers your bank, your landlord, and your accountant keep asking for.',
  },
];

const included = [
  'TallyPrime licensing advice — Silver for a single user, Gold when your team grows',
  'Company setup and a chart of accounts that fits how you actually trade',
  'KRA eTIMS configuration and test transmission before you go live',
  'VAT, PAYE, NSSF, SHIF and Housing Levy set up at current Kenyan rates',
  'Opening balances and stock brought over from your books or spreadsheets',
  'Hands-on training for you and your staff, on your own data',
  'WhatsApp support after go-live, so a stuck invoice never stops your day',
];

const steps = [
  { n: '1', title: 'Free Consultation', desc: 'We look at how you trade today — invoices, stock, staff, and what KRA expects of you.' },
  { n: '2', title: 'Right-Sized Setup', desc: 'We configure only what a small business needs. No enterprise complexity you will never touch.' },
  { n: '3', title: 'Training & Go-Live', desc: 'Your team learns on your own data, then starts issuing real invoices with us on standby.' },
];

const faqs = [
  {
    q: 'Is TallyPrime affordable for a small business in Kenya?',
    a: 'Yes. TallyPrime is a one-time licence rather than a per-user monthly subscription, which is why it works out cheaper than most cloud accounting tools once you have more than one person using it. Silver covers a single user and Gold covers unlimited users on your network. We will quote you for the edition that matches your team size rather than the biggest one.',
  },
  {
    q: 'Do I need an accountant to use TallyPrime?',
    a: 'No. Most of our small-business clients run day-to-day invoicing, payments and stock themselves, and bring in an accountant monthly or at year end. We set the system up so that ordinary transactions are simple, and your accountant can pull the reports they need without disturbing you.',
  },
  {
    q: 'Will TallyPrime keep me compliant with KRA eTIMS?',
    a: 'Yes. TallyPrime generates eTIMS-compliant invoices and transmits them to KRA. We configure and test the connection during setup so your first live invoice goes through cleanly, and we show your team what to do if KRA ever rejects one.',
  },
  {
    q: 'How long does setup take for a small business?',
    a: 'For a typical small business — one location, one or two users — we are usually live within a week, including training. Businesses with a lot of historical data or stock to migrate take a little longer, and we tell you that up front rather than after we start.',
  },
  {
    q: 'Can I start small and add users later?',
    a: 'Yes. You can begin on Silver and upgrade to Gold when you take on more staff. Your data carries over — you are not starting again or paying twice for the same setup.',
  },
];

export default function TallyPrimeSmallBusinessKenya() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime for Small Business Kenya | Affordable Accounting Software"
        description="Affordable accounting software for small businesses in Kenya. TallyPrime handles KRA eTIMS invoicing, VAT, stock and cash flow — set up and supported from Ruiru and Nairobi."
        socialDescription="Running a small business in Kenya? Get TallyPrime set up properly — eTIMS invoicing, VAT, stock and cash flow, with training and WhatsApp support."
        canonical="/tallyprime-small-business-kenya"
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'TallyPrime for Small Business', item: 'https://www.optimumprimesolutions.co.ke/tallyprime-small-business-kenya/' },
        ]}
        faqs={faqs}
      />
      <Breadcrumb />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 py-20 text-white">
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Accounting Software Built for Kenya's Small Businesses</h1>
          <p className="text-lg text-emerald-100 mb-8">
            You did not start a business to fight with spreadsheets and KRA deadlines. TallyPrime gives you compliant invoicing,
            clear cash flow, and honest stock figures — without the cost or complexity of enterprise software.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-emerald-800 hover:bg-emerald-50">
              Get a Free Consultation <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://wa.me/254727209720?text=Hi%2C%20I%20run%20a%20small%20business%20and%20I%27d%20like%20to%20know%20about%20TallyPrime"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-bold text-white border-2 border-white hover:bg-emerald-800"
            >
              <MessageSquare className="h-5 w-5" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">What Changes for You</h2>
          <div className="grid gap-8">
            {painPoints.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex gap-4">
                <item.icon className="h-8 w-8 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">What a Small Business Setup Includes</h2>
          <div className="grid gap-4">
            {included.map((item, i) => (
              <div key={i} className="flex gap-3 p-4 bg-white rounded-lg border border-slate-200">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-600">
            Not sure which edition you need?{' '}
            <Link to="/pricing" className="font-semibold text-emerald-700 hover:underline">See TallyPrime pricing</Link>{' '}
            or ask us — we will quote for the size you are, not the size we wish you were.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">How We Get You Started</h2>
          <div className="space-y-6">
            {steps.map((item, i) => (
              <div key={i} className="flex gap-4 pb-6 border-b border-slate-200 last:border-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 font-bold flex-shrink-0">{item.n}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Small Business FAQs</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-600 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Get Your Books in Order</h2>
          <p className="text-emerald-100 mb-8">
            Tell us what you sell and how many people touch the books. We will tell you honestly whether TallyPrime is right for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact#demo-form" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-emerald-800 hover:bg-emerald-50">
              Book a Free Consultation
            </Link>
            <a href="tel:+254116246074" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-bold text-white border-2 border-white hover:bg-emerald-800">
              <Phone className="h-5 w-5" /> +254 116 246 074
            </a>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-white py-14 border-t border-slate-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Related Pages</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'KRA eTIMS Compliance', href: '/kra-etims-compliance' },
              { label: 'Cloud Accounting', href: '/cloud-accounting-software-kenya' },
              { label: 'Implementation', href: '/tallyprime/implementation' },
              { label: 'Training', href: '/tallyprime/training' },
              { label: 'Pricing', href: '/pricing' },
            ].map((s) => (
              <Link key={s.href} to={s.href} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:border-emerald-300 hover:text-emerald-700 px-4 py-2 text-sm font-medium text-slate-700 transition">
                {s.label} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
