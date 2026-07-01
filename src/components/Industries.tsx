import { motion } from 'framer-motion';
import { ShoppingBag, Truck, Factory, Landmark, Wrench, Heart, ShoppingCart, GraduationCap, type LucideIcon } from 'lucide-react';
import { useSite } from '../context/SiteContext';
const iconMap:Record<string,LucideIcon>={ShoppingBag,Truck,Factory,Landmark,Wrench,Heart,ShoppingCart,GraduationCap};
export default function Industries() {
  const { data } = useSite();
  return (
    <section id="industries" className="py-24 bg-navy-50/50 dark:bg-navy-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-yellow-600">Industries</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white">Solutions for Every Industry</h2>
          <p className="mt-4 text-navy-600 dark:text-navy-300">We've tailored TallyPrime for the unique needs of Kenyan businesses across all sectors.</p>
        </motion.div>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.industries.map((ind,i)=>{const Ic=iconMap[ind.icon]||ShoppingBag;return(
            <motion.div key={ind.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}}
              className="group rounded-2xl border border-navy-100 dark:border-navy-700 bg-slate-800 dark:bg-navy-800/50 p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center mb-4 group-hover:bg-yellow-400/20 transition"><Ic className="h-7 w-7 text-yellow-600"/></div>
              <h3 className="text-base font-bold text-navy-900 dark:text-white">{ind.name}</h3>
              <p className="mt-2 text-sm text-navy-600 dark:text-navy-600">{ind.desc}</p>
            </motion.div>
          );})}
        </div>
      </div>
    </section>
  );
}
