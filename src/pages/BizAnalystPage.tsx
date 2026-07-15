import { Link } from 'react-router-dom';
import { Smartphone, BarChart3, TrendingUp, Shield, Zap, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';

const features = [
  {
    icon: BarChart3,
    title: 'Real-Time Financial Dashboard',
    desc: 'View your P&L, balance sheet, cash flow and receivables/payables in real-time — no computer needed.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: TrendingUp,
    title: 'Sales & Revenue Tracking',
    desc: 'Monitor daily sales, track outstanding invoices, and get instant visibility into your revenue pipeline.',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Smartphone,
    title: 'Works with TallyPrime',
    desc: 'Seamlessly syncs with your existing TallyPrime installation. All data stays on your Tally server — Biz Analyst just reads it.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Shield,
    title: 'KRA Compliance',
    desc: 'Monitor eTIMS compliance, VAT returns, and tax obligations directly from your phone. Stay ahead of KRA deadlines.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: Zap,
    title: 'Instant Alerts & Notifications',
    desc: 'Get notified about overdue payments, low stock levels, and unusual transactions as they happen.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Users,
    title: 'Multi-User Access',
    desc: 'Grant access to partners, accountants, or managers with role-based permissions. Everyone sees what they need.',
    color: 'bg-purple-50 text-purple-600',
  },
];

const benefits = [
  'Access your business data from anywhere — home, office, or on the road',
  'No separate server or cloud setup needed — works with your existing TallyPrime',
  'Official partner of Tally Solutions and Khatabook',
  'Secure data — your financial records never leave your Tally server',
  'Available on Android and iOS devices',
  'Free trial available for new users',
];

export default function BizAnalystPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Biz Analyst — TallyPrime On Your Phone | Optimum Prime"
        description="Biz Analyst is the official TallyPrime mobile app. Monitor sales, expenses, inventory, and KRA compliance in real-time from your phone."
        socialDescription="Access your TallyPrime accounting data on your phone — anytime, anywhere. Biz Analyst by Khatabook brings real-time business intelligence to your fingertips."
        canonical="/biz-analyst"
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Biz Analyst', item: 'https://www.optimumprimesolutions.co.ke/biz-analyst/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/30">
        <div className="absolute inset-0 bg-[url('/og-image.png')] opacity-5 bg-cover bg-center" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
                <Smartphone className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Mobile App</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Biz Analyst
                <span className="block text-2xl md:text-3xl text-slate-300 font-medium mt-2">
                  Your TallyPrime Data, On Your Phone
                </span>
              </h1>
              <p className="text-lg text-slate-300 mb-8">
                Monitor your business in real-time — sales, expenses, inventory, KRA compliance, and financial reports — all from your smartphone. No computer needed.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://play.google.com/store/apps/details?id=in.bizanalyst"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <img
                    src="/badge-google-play.png"
                    alt="Get it on Google Play"
                    className="h-12 w-auto hover:opacity-90 transition"
                  />
                </a>
                <a
                  href="https://apps.apple.com/in/app/biz-analyst-app-for-tally-user/id1164789740"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <img
                    src="/badge-app-store.png"
                    alt="Download on the App Store"
                    className="h-12 w-auto hover:opacity-90 transition"
                  />
                </a>
                <Link
                  to="/contact?type=bizanalyst"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square max-w-sm mx-auto rounded-3xl bg-gradient-to-br from-emerald-500/20 to-slate-700/30 border border-emerald-500/20 p-8 flex items-center justify-center">
                <img
                  src="/partner-biz-analyst.png"
                  alt="Biz Analyst by Khatabook logo"
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Biz Analyst' },
        ]}
      />

      {/* Features Grid */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything Your Business Needs, On Your Phone
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Biz Analyst connects directly to your TallyPrime server and delivers real-time business intelligence to your mobile device.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 hover:border-emerald-500/30 transition">
                <div className={`inline-flex p-3 rounded-xl ${f.color} mb-4`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Biz Analyst */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Why Choose Biz Analyst?
              </h2>
              <p className="text-slate-400 mb-8">
                Biz Analyst is developed by Khatabook — one of India's fastest-growing fintech companies — and is an official partner of Tally Solutions. Optimum Prime Solutions is your certified deployment and support partner in Kenya.
              </p>
              <div className="space-y-4">
                {benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-slate-700/30 border border-emerald-500/20 p-8">
              <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <p className="text-white font-semibold">Install Biz Analyst on your phone</p>
                    <p className="text-sm text-slate-400">Download from Google Play or Apple App Store</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <p className="text-white font-semibold">Connect to your TallyPrime server</p>
                    <p className="text-sm text-slate-400">We set up the Biz Analyst connector on your Tally server</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <p className="text-white font-semibold">Access your business data instantly</p>
                    <p className="text-sm text-slate-400">View reports, track sales, monitor KRA compliance — all from your phone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Access Your Business Data on Your Phone?
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            We handle the full setup — from installing Biz Analyst to connecting it with your TallyPrime server. Get started today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact?type=bizanalyst"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-emerald-700 font-semibold hover:bg-emerald-50 transition"
            >
              Book a Free Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+254700000000"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500 mb-6">Official Partners</p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            <img src="/partner-tallyprime.png" alt="TallyPrime" className="h-10 object-contain opacity-60 hover:opacity-100 transition" />
            <img src="/partner-biz-analyst.png" alt="Biz Analyst" className="h-12 object-contain" />
          </div>
        </div>
      </section>
    </main>
  );
}
