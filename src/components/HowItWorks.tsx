import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PhoneCall, Settings, Rocket, HeadphonesIcon } from 'lucide-react';
import Logo from './Logo';
import TallyLogo from './TallyLogo';

const steps = [
  { icon: PhoneCall, num: '01', title: 'Free Consultation', desc: 'Tell us about your business. We\'ll analyze your needs and recommend the right Tally Prime solution — Silver, Gold, Plus, Enterprise, or Custom TDL.', color: 'from-yellow-400 to-blue-400' },
  { icon: Settings, num: '02', title: 'Setup & Migration', desc: 'Our certified team installs Tally Prime, migrates your data from Excel, QuickBooks, or Sage, and configures KRA/eTIMS compliance.', color: 'from-blue-500 to-cyan-400' },
  { icon: Rocket, num: '03', title: 'Training & Go Live', desc: 'Comprehensive hands-on training for your team — accounting, inventory, payroll, and reporting. Go live with confidence.', color: 'from-purple-500 to-pink-400' },
  { icon: HeadphonesIcon, num: '04', title: 'Ongoing Support', desc: '24/7 remote support with < 1 hour response time. Regular updates, health checks, and on-site visits when you need them.', color: 'from-amber-500 to-orange-400' },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden bg-white text-slate-950">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-100/40 blur-3xl" />
      <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-slate-100/60 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-red-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-700">Our Process</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-950">
From Discovery to Operational Traction — Our 4-Step Implementation Approach
          </h2>
          <p className="mt-4 text-slate-600">
We implement TallyPrime, set up cloud hosting, and help your leadership team adopt EOS® — delivering faster reporting, accountability, and scalable operations across all your locations.
          </p>
        </motion.div>

        <div className="mt-16 relative">
          {/* Connecting Line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-yellow-400/20 via-accent/40 to-yellow-600/20" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="relative text-center group overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-cyan-200/30">
                  <div className="absolute inset-x-0 top-0 h-1 bg-red-600" />
                  <div className="relative mx-auto mb-6 mt-6 h-24 w-24 rounded-[28px] bg-slate-900 p-1 shadow-xl">
                    <div className="h-full w-full rounded-[26px] bg-white flex items-center justify-center">
                      <Icon className="h-10 w-10 text-slate-900" />
                    </div>
                  </div>
                  <div className="absolute -top-3 left-3 flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-sm">
                    <span>{step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA like Tally's "Ready to fall in love" */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-20 rounded-3xl bg-slate-900 p-10 lg:p-14 text-center relative overflow-hidden text-white shadow-2xl shadow-slate-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.22),transparent_60%)]" />
          <div className="relative">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Ready to transform your business? 🚀
            </h3>
            <p className="mt-3 text-slate-100 max-w-xl mx-auto">
Join 500+ Kenyan businesses already running smarter with TallyPrime, cloud hosting, and EOS®. Get a free, personalized demo from Kenya's certified TallyPrime partner.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="rounded-xl bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-xl shadow-slate-300/30 hover:bg-slate-100 transition-all hover:scale-105">
                Request Free Demo
              </Link>
              <a href="https://tallysolutions.com/ssa/download/" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/90 px-6 py-4 text-sm font-bold text-slate-900 backdrop-blur-sm hover:bg-slate-100 transition-all">
                <TallyLogo className="h-5 w-auto" />
                Download TallyPrime
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-white/80">
              <Logo className="h-6 w-auto text-white" variant="icon" />
              <span>Powered by Optimum Prime Solutions</span>
            </div>
            <p className="mt-6 text-xs text-slate-100">
              ✓ Certified TallyPrime Partner · ✓ Cloud Hosting Available · ✓ EOS® Consulting · ✓ KRA & eTIMS Ready
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
