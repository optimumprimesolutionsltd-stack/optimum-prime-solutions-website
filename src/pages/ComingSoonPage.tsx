import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';

// Map of known coming-soon paths to human-readable titles
const pageTitles: Record<string, { title: string; desc: string; parent: string; parentHref: string }> = {
  '/tallyprime/implementation': { title: 'TallyPrime Implementation', desc: 'End-to-end TallyPrime setup, configuration, data migration, and go-live support.', parent: 'TallyPrime Solutions', parentHref: '/tallyprime' },
  '/tallyprime/licensing': { title: 'TallyPrime Licensing', desc: 'Genuine TallyPrime Silver, Gold & Enterprise licences at competitive prices.', parent: 'TallyPrime Solutions', parentHref: '/tallyprime' },
  '/tallyprime/cloud-hosting': { title: 'TallyPrime Cloud Hosting', desc: 'Secure, always-on cloud access to your TallyPrime data from any device.', parent: 'TallyPrime Solutions', parentHref: '/tallyprime' },
  '/tallyprime/training': { title: 'TallyPrime Training', desc: 'Hands-on user training, admin workshops, and ongoing coaching for your team.', parent: 'TallyPrime Solutions', parentHref: '/tallyprime' },
  '/tallyprime/support': { title: 'TallyPrime Support & Maintenance', desc: '24/7 remote assistance plus scheduled on-site visits.', parent: 'TallyPrime Solutions', parentHref: '/tallyprime' },
  '/tallyprime/customization': { title: 'TallyPrime Customization (TDL)', desc: 'Custom Tally Definition Language development to tailor TallyPrime to your workflows.', parent: 'TallyPrime Solutions', parentHref: '/tallyprime' },
  '/tallyprime/data-migration': { title: 'TallyPrime Data Migration', desc: 'Seamless migration of your existing data from any accounting system into TallyPrime.', parent: 'TallyPrime Solutions', parentHref: '/tallyprime' },
  '/industries/retail': { title: 'TallyPrime for Retail', desc: 'POS billing, stock management, and KRA eTIMS compliance for retail businesses.', parent: 'Industries', parentHref: '/industries' },
  '/industries/distribution': { title: 'TallyPrime for Distribution', desc: 'Route sales, multi-location inventory, and distributor management.', parent: 'Industries', parentHref: '/industries' },
  '/industries/manufacturing': { title: 'TallyPrime for Manufacturing', desc: 'BOM, production orders, work-in-progress tracking, and cost analysis.', parent: 'Industries', parentHref: '/industries' },
  '/industries/construction': { title: 'TallyPrime for Construction', desc: 'Project costing, contract management, and subcontractor billing.', parent: 'Industries', parentHref: '/industries' },
  '/industries/hardware': { title: 'TallyPrime for Hardware & Wholesale', desc: 'Bulk inventory management, trade discounts, and credit control.', parent: 'Industries', parentHref: '/industries' },
  '/industries/ngos': { title: 'TallyPrime for NGOs', desc: 'Fund accounting, donor management, and grant tracking.', parent: 'Industries', parentHref: '/industries' },
  '/industries/schools': { title: 'TallyPrime for Schools', desc: 'Fee collection, payroll, and financial reporting for educational institutions.', parent: 'Industries', parentHref: '/industries' },
  '/industries/saccos': { title: 'TallyPrime for SACCOs', desc: 'Member accounts, loan tracking, and dividend calculations.', parent: 'Industries', parentHref: '/industries' },
  '/knowledge-hub/guides': { title: 'TallyPrime Implementation Guides', desc: 'Step-by-step guides for TallyPrime setup and configuration.', parent: 'Knowledge Hub', parentHref: '/knowledge-hub' },
  '/knowledge-hub/downloads': { title: 'Downloads & Templates', desc: 'Free TallyPrime templates, checklists, and resources.', parent: 'Knowledge Hub', parentHref: '/knowledge-hub' },
  '/knowledge-hub/case-studies': { title: 'Case Studies', desc: 'Real stories from Kenyan businesses that transformed with TallyPrime.', parent: 'Knowledge Hub', parentHref: '/knowledge-hub' },
  '/knowledge-hub/videos': { title: 'Video Tutorials', desc: 'TallyPrime tutorials, feature walkthroughs, and implementation demos.', parent: 'Knowledge Hub', parentHref: '/knowledge-hub' },
  '/knowledge-hub/webinars': { title: 'Webinars', desc: 'Live and recorded webinars on TallyPrime and business management.', parent: 'Knowledge Hub', parentHref: '/knowledge-hub' },
  '/knowledge-hub/templates': { title: 'Templates Library', desc: 'Ready-to-use TallyPrime report templates and business document templates.', parent: 'Knowledge Hub', parentHref: '/knowledge-hub' },
  '/why-choose-us': { title: 'Why Choose Optimum Prime Solutions', desc: 'What makes us Kenya\'s most trusted TallyPrime partner.', parent: 'Home', parentHref: '/' },
  '/features': { title: 'TallyPrime Features', desc: 'Explore the full range of TallyPrime features for your business.', parent: 'TallyPrime Solutions', parentHref: '/tallyprime' },
};

export default function ComingSoonPage() {
  const location = useLocation();
  const info = pageTitles[location.pathname] || {
    title: 'Page Coming Soon',
    desc: 'This page is currently being prepared. Check back soon.',
    parent: 'Home',
    parentHref: '/',
  };

  return (
    <>
      <SEO
        title={`${info.title} — Coming Soon | Optimum Prime Solutions`}
        description={info.desc}
        canonical={location.pathname}
        noIndex={true}
      />

      <section className="min-h-[70vh] flex items-center bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
          <Breadcrumb className="mb-8" />
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-200 px-4 py-1.5 text-sm font-semibold text-amber-700 mb-6">
              <Clock className="h-4 w-4" /> Content Coming Soon
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">{info.title}</h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">{info.desc}</p>
            <p className="text-slate-500 mb-8">
              This page is being prepared as part of our Phase 1 content development. In the meantime, our team is ready to answer your questions directly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact#demo-form"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Talk to Our Team <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={info.parentHref}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 hover:border-slate-400 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition"
              >
                Back to {info.parent}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
