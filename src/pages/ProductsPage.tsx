import Products from '../components/Products';

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1181636/pexels-photo-1181636.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600"
            alt="Team working together on laptops"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/45" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full bg-cyan-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200 ring-1 ring-cyan-200/20">
                Product packages
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Choose the right Tally Prime edition for your business
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                One business owner with a laptop can see everything clearly with the right product plan—Silver, Gold, Plus and Enterprise packages built for real operations.
              </p>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {[
                  'Clear pricing for one-user workflows',
                  'Add-on support and remote access',
                  'Ideal for single-person accounting',
                  'Scales when you grow',
                ].map((feature) => (
                  <div key={feature} className="rounded-3xl bg-white/10 px-4 py-4 text-sm text-slate-100 ring-1 ring-white/10">
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-300">Real workforce imagery</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Laptop and team visuals restored</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  The products page now prominently features the original laptop/team scene for a stronger product story.
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
