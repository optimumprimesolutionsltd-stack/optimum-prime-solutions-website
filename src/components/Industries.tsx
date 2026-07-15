import { motion } from 'framer-motion';
import { ShoppingBag, Truck, Factory, Landmark, Wrench, Heart, ShoppingCart, GraduationCap, ArrowRight, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

const iconMap: Record<string, LucideIcon> = { ShoppingBag, Truck, Factory, Landmark, Wrench, Heart, ShoppingCart, GraduationCap };

export default function Industries() {
  const { data } = useSite();
  return (
    <section id="industries" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">Industries</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">Solutions for Every Industry</h2>
          <p className="mt-4 text-slate-500">We have tailored TallyPrime for the unique needs of Kenyan businesses across all sectors.</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.industries.map((ind, i) => {
            const Ic = iconMap[ind.icon] || ShoppingBag;
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center hover:-translate-y-1 hover:border-red-200 hover:shadow-md transition-all duration-200"
              >
                <div className="mx-auto h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center mb-3 group-hover:bg-red-100 transition">
                  <Ic className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{ind.name}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{ind.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/industries"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
          >
            Explore your industry solution <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact#demo-form"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-colors"
          >
            Book a Free Demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
