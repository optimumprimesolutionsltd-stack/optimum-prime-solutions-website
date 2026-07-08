import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import Products from '../components/Products';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <SEO
        title="TallyPrime Pricing Kenya — Silver, Gold, Cloud Hosting & Enterprise Editions"
        description="View TallyPrime pricing in Kenya. Official Silver, Gold & Enterprise licences, cloud hosting packages, and implementation bundles. Competitive prices with full local support from Kenya's certified TallyPrime partner."
        socialDescription="Transparent pricing for TallyPrime in Kenya. Get genuine licences, cloud hosting, and expert support — no hidden fees."
        canonical="/pricing"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Pricing', item: 'https://www.optimumprimesolutions.co.ke/pricing/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-600/20 border border-green-500/30 px-4 py-1.5 text-sm font-semibold text-green-400 mb-6">
              Official TallyPrime Pricing — Kenya
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Transparent Pricing.<br />
              <span className="text-red-400">No Hidden Costs.</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              Genuine TallyPrime licences at competitive Kenyan prices. All editions include full implementation support, training, and ongoing assistance from our certified team.
            </p>
          </div>
        </div>
      </section>

      {/* Products / Pricing Component */}
      <Products />
    </main>
  );
}
