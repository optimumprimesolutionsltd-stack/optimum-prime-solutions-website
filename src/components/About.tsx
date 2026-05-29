import { motion } from 'framer-motion';
import { Target, Eye, Zap, Users, Award, Shield } from 'lucide-react';
import { useSite } from '../context/SiteContext';
const icons = [Users, Award, Target, Shield];
const fade = { hidden:{opacity:0,y:30}, visible:(i:number)=>({opacity:1,y:0,transition:{delay:i*0.1}}) };
export default function About() {
  const { data } = useSite();
  const c = data.company;
  return (
    <section id="about" className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50 to-white text-slate-950">
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
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
            <motion.h2 variants={fade} custom={1} className="mt-4 text-3xl sm:text-4xl font-bold text-slate-950">Systems That Help Businesses Grow</motion.h2>
            <motion.p variants={fade} custom={2} className="mt-4 text-slate-700 leading-relaxed">Optimum Prime Solutions combines technology implementation, secure cloud infrastructure, and operational consulting to deliver financial clarity, centralized reporting, and scalable systems for multi-branch businesses.</motion.p>
            <motion.p variants={fade} custom={3} className="mt-4 text-slate-600 leading-relaxed">We move companies beyond basic accounting into reliable systems that improve decision-making, accountability, and operational efficiency — from implementation and training to ongoing optimization and support.</motion.p>
            <motion.div variants={fade} custom={4} className="mt-8 grid grid-cols-2 gap-5">
              {c.stats.map((s:{label:string;value:string},i:number)=>{const I=icons[i%icons.length];return(
                <div key={s.label} className="rounded-3xl bg-white/90 border border-slate-200 p-4 shadow-sm flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-sky-100 flex items-center justify-center shrink-0"><I className="h-5 w-5 text-sky-700"/></div>
                  <div><p className="text-sm font-bold text-slate-950">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                </div>
              );})}
            </motion.div>
          </motion.div>
          <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-white to-slate-100 p-8 lg:p-10 shadow-2xl shadow-slate-200 ring-1 ring-slate-200/60">
              <div className="space-y-7">
                {[{icon:Target,title:'Our Mission',text:c.mission},{icon:Eye,title:'Our Vision',text:c.vision},{icon:Zap,title:'Why Choose Us',text:'Certified Tally experts, rapid implementation, 24/7 support, and solutions customized for the Kenyan market.'}].map(({icon:Ic,title,text})=>(
                  <div key={title} className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-lg shadow-cyan-200/30"><Ic className="h-5 w-5"/></div>
                    <div><h4 className="text-base font-bold text-slate-950">{title}</h4><p className="mt-1 text-sm text-slate-600 leading-relaxed">{text}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
