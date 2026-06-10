import Products from '../components/Products';

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-sky-50 text-slate-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-red-200/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-sky-200/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-700 ring-1 ring-red-200">
                TallyPrime · Cloud · EOS®
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950">
                TallyPrime Editions, Cloud Hosting & EOS® Consulting Packages
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Kenya's certified TallyPrime partner. Choose from Silver, Gold, or Enterprise editions. Add cloud hosting for remote access, or engage us for EOS® (Entrepreneurial Operating System) consulting to strengthen your leadership team.
              </p>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {[
                  'Official TallyPrime Silver, Gold & Enterprise',
                  'Cloud hosting from KES 8,000/month',
                  'EOS® implementation by certified implementer',
                  'KRA & eTIMS compliance built in',
                ].map((feature) => (
                  <div key={feature} className="rounded-3xl bg-red-50 border border-red-100 px-4 py-4 text-sm text-slate-700 ring-1 ring-red-100/50">
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-2xl shadow-slate-200/40 ring-1 ring-slate-200/70 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Certified TallyPrime Partner</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">Official TallyPrime reseller · Cloud · EOS®</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  We are Kenya's certified TallyPrime partner and licensed EOS® implementer. Contact us for the right package for your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Products />
    </div>
  );
}
