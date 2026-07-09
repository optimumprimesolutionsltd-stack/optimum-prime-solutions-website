import { motion } from 'framer-motion';
import { ShoppingBag, Truck, Factory, Landmark, Wrench, Heart, ShoppingCart, GraduationCap, type LucideIcon } from 'lucide-react';
import { useSite } from '../context/SiteContext';
const iconMap:Record<string,LucideIcon>={ShoppingBag,Truck,Factory,Landmark,Wrench,Heart,ShoppingCart,GraduationCap};
export default function Industries() {
  const { data } = useSite();
  return (
    <section id="industries" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">Industries</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">Solutions for Every Industry</h2>
          <p className="mt-4 text-slate-500">We have tailored TallyPrime for the unique needs of Kenyan businesses across all sectors.</p>
        </motion.div>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.industries.map((ind,i)=>{const Ic=iconMap[ind.icon]||ShoppingBag;return(
            <motion.div key={ind.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center hover:-translate-y-1 hover:border-red-200 hover:shadow-md transition-all duration-200">
              <div className="mx-auto h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center mb-3 group-hover:bg-red-100 transition"><Ic className="h-5 w-5 text-red-600"/></div>
              <h3 className="text-sm font-bold text-slate-900">{ind.name}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">{ind.desc}</p>
            </motion.div>
          );})}        </div>
      </div>
    </section>
  );
}
