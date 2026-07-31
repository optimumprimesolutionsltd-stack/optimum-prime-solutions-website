import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileCheck, BarChart3, Clock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';

export default function KraEtimsCompliancePage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="KRA eTIMS Compliance Software Kenya | TallyPrime Setup"
        description="Ensure KRA eTIMS compliance with TallyPrime. Automated VAT, e-invoicing, and tax filing setup in 5 days. Expert implementation in Ruiru and Nairobi."
        canonical="/kra-etims-compliance"
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'KRA Compliance', item: 'https://www.optimumprimesolutions.co.ke/kra-etims-compliance/' },
        ]}
      />
      <Breadcrumb />
      <section className="bg-gradient-to-br from-red-950 via-red-900 to-red-950 py-20 text-white">
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">KRA eTIMS Compliance Made Simple</h1>
          <p className="text-lg text-red-100 mb-8">Stay 100% compliant with Kenya's e-invoicing mandate. TallyPrime handles automated VAT, eTIMS transmission, and tax filing.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-red-700 hover:bg-red-50">
              Book Consultation <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="https://wa.me/254727209720?text=KRA%20eTIMS%20compliance%20help" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-bold text-white border-2 border-white hover:bg-red-800">WhatsApp</a>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Compliance Checklist</h2>
          <div className="grid gap-4">
            {['Automated VAT (16% standard, 0% exempt)', 'Real-time eTIMS invoice transmission', 'Digital signatures and audit trail', 'Monthly VAT return filing', 'PAYE, NSSF, SHIF deduction tracking', 'Income tax return preparation'].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Why TallyPrime?</h2>
          <div className="grid gap-8">
            {[
              { icon: FileCheck, title: 'Built-in eTIMS', desc: 'Every invoice automatically formatted for KRA transmission.' },
              { icon: BarChart3, title: 'Automated Calculations', desc: 'VAT, PAYE, NSSF calculated correctly per Kenyan rates.' },
              { icon: Clock, title: 'Real-Time Filing Ready', desc: 'Records organized for immediate iTax submission.' },
              { icon: Shield, title: 'Complete Audit Trail', desc: 'Every transaction logged—KRA audits become straightforward.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex gap-4">
                <item.icon className="h-8 w-8 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Our 5-Day Setup Process</h2>
          <div className="space-y-6">
            {[
              { day: '1', title: 'Assessment & Setup', desc: 'Review system, configure TallyPrime, set up chart of accounts.' },
              { day: '2', title: 'Tax Configuration', desc: 'Configure VAT rates and statutory deduction rules.' },
              { day: '3', title: 'Data Migration', desc: 'Migrate data from old system. Verify accuracy.' },
              { day: '4', title: 'eTIMS Activation', desc: 'Connect to KRA iTax. Test transmission with sample data.' },
              { day: '5', title: 'Training & Go-Live', desc: 'Train team. Go live with real transactions.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 pb-6 border-b border-slate-200 last:border-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 font-bold">{item.day}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-r from-red-700 to-red-600 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Be KRA Compliant?</h2>
          <p className="text-red-100 mb-8">Fully compliant within 5 business days. No penalties, no stress.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact#demo-form" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-red-700 hover:bg-red-50">Book Consultation</Link>
            <a href="https://wa.me/254727209720?text=KRA%20compliance%20help" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-bold text-white border-2 border-white hover:bg-red-800">WhatsApp</a>
          </div>
        </div>
      </section>
    </main>
  );
}
