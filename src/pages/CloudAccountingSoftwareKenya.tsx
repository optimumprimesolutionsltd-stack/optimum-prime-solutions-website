import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Lock, Users, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';

export default function CloudAccountingSoftwareKenya() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Cloud Accounting Software Kenya | TallyPrime Cloud Hosting"
        description="Access your accounting data anywhere with TallyPrime cloud hosting in Kenya. Secure, real-time access for your team from any device, any location."
        canonical="/cloud-accounting-software-kenya"
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Cloud Accounting', item: 'https://www.optimumprimesolutions.co.ke/cloud-accounting-software-kenya/' },
        ]}
      />
      <Breadcrumb />
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 py-20 text-white">
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Cloud Accounting for Kenya Businesses</h1>
          <p className="text-lg text-blue-100 mb-8">Access your accounting data from anywhere. TallyPrime in the cloud means your team can work remotely without compromising security or real-time reporting.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact#demo-form" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 hover:bg-blue-50">
              See It In Action <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="https://wa.me/254727209720?text=Cloud%20accounting%20software%20Kenya" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-bold text-white border-2 border-white hover:bg-blue-800">WhatsApp</a>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Why Cloud Accounting?</h2>
          <div className="grid gap-6">
            {[
              { icon: Globe, title: 'Access From Anywhere', desc: 'Your accountant at the office. Sales manager in the field. You at a client meeting. Everyone has real-time access.' },
              { icon: Lock, title: 'Bank-Level Security', desc: 'Encrypted data transmission. Daily automated backups. 99.9% uptime SLA.' },
              { icon: Users, title: 'Team Collaboration', desc: 'Multiple team members work simultaneously without conflicts. Real-time data synchronization.' },
              { icon: Zap, title: 'No IT Headaches', desc: 'No servers to maintain. No software updates to install. We handle everything.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex gap-4">
                <item.icon className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">What's Included in Cloud Hosting?</h2>
          <div className="grid gap-4">
            {[
              'KES 3,000/month — fully managed cloud server',
              '99.9% uptime SLA with automatic failover',
              'Daily automated backups (30-day retention)',
              'Unlimited concurrent users',
              'Multi-location access for branch managers',
              'SSL encryption for all data transmission',
              'Email support + monthly health checks',
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 bg-white rounded-lg border border-slate-200">
                <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Perfect For</h2>
          <div className="grid gap-6">
            {[
              { title: 'Multi-Location Businesses', desc: 'Branch managers enter data in real time. Head office gets consolidated reporting instantly.' },
              { title: 'Remote Teams', desc: 'Post-COVID flexible work means staff works from home. Cloud accounting keeps everyone synced.' },
              { title: 'Growing Companies', desc: 'As you scale, cloud hosting scales with you. No expensive server upgrades needed.' },
              { title: 'Distributors & Wholesalers', desc: 'Sales reps on the road need instant inventory and pricing. Cloud data keeps field teams current.' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-r from-blue-700 to-blue-600 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Move Your Accounting to the Cloud Today</h2>
          <p className="text-blue-100 mb-8">Setup in 2 business days. No downtime. Your team gets instant access.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact#demo-form" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 hover:bg-blue-50">See Demo</Link>
            <a href="https://wa.me/254727209720?text=Cloud%20accounting%20setup" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-bold text-white border-2 border-white hover:bg-blue-800">WhatsApp</a>
          </div>
        </div>
      </section>
    </main>
  );
}
