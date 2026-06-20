import { motion } from 'framer-motion';
import { Target, Eye, Zap, Users, Award, Shield } from 'lucide-react';
import { useSite } from '../context/SiteContext';
const icons = [Users, Award, Target, Shield];
const fade = { hidden:{opacity:0,y:30}, visible:(i:number)=>({opacity:1,y:0,transition:{delay:i*0.1}}) };
export default function About() {
  const { data } = useSite();
  const c = data.company;
  return (
    <section id="about" className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={{visible:{transition:{staggerChildren:0.15}}}}>
            <motion.span
              variants={fade}
              custom={0}
              className="inline-block rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-cyan-200/30"
            >
              About Optimum Prime Solutions
            </motion.span>
            <motion.h2 variants={fade} custom={1} className="mt-4 text-3xl sm:text-4xl font-bold text-white">Systems That Help Businesses Grow</motion.h2>
            <motion.p variants={fade} custom={2} className="mt-4 text-slate-300 leading-relaxed">Optimum Prime Solutions is Kenya's certified TallyPrime partner — selling, implementing, and supporting TallyPrime Silver, Gold, and Enterprise editions across East Africa. We also provide secure cloud hosting so your team can access TallyPrime from anywhere, and we are licensed EOS® implementers helping leadership teams run their businesses on the Entrepreneurial Operating System by Gino Wickman.</motion.p>
            <motion.p variants={fade} custom={3} className="mt-4 text-slate-400 leading-relaxed">EOS® strengthens the Six Key Components of any business: Vision, People, Data, Issues, Process, and Traction. Combined with TallyPrime's financial intelligence, our clients gain both the numbers and the management system to grow with confidence and accountability.</motion.p>
            <motion.div variants={fade} custom={4} className="mt-8 grid grid-cols-2 gap-5">
              {c.stats.map((s:{label:string;value:string},i:number)=>{const I=icons[i%icons.length];return(
                <div key={s.label} className="rounded-3xl bg-slate-800/90 border border-white/10 p-4 shadow-sm flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-sky-100 flex items-center justify-center shrink-0"><I className="h-5 w-5 text-sky-700"/></div>
                  <div><p className="text-sm font-bold text-white">{s.value}</p><p className="text-xs text-slate-400">{s.label}</p></div>
                </div>
              );})}
            </motion.div>
          </motion.div>
          <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} className="relative">
            {/* Stock photo — swap for real company photo when available. */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
              <img 
                src="/images/about-team-collaboration.webp" 
                alt="Optimum Prime Solutions professional business office environment" 
                className="w-full h-full object-cover aspect-[4/3]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-slate-950/20 mix-blend-multiply pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="space-y-4">
                  {[{icon:Target,title:'Our Mission',text:c.mission},{icon:Eye,title:'Our Vision',text:c.vision},{icon:Zap,title:'Why Choose Us',text:'Kenya\'s certified TallyPrime reseller, licensed EOS® implementer, and cloud hosting provider — with 24/7 support and solutions built for the Kenyan market.'}].map(({icon:Ic,title,text})=>(
                    <div key={title} className="flex items-start gap-4 bg-slate-900/40 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                      <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-lg shadow-cyan-200/30"><Ic className="h-4 w-4"/></div>
                      <div><h4 className="text-sm font-bold text-white">{title}</h4><p className="mt-1 text-xs text-slate-300 leading-relaxed line-clamp-2">{text}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
