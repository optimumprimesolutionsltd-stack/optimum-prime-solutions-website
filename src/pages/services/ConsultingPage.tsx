import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ClipboardCheck, Database, Gauge, Phone, Settings, Users } from 'lucide-react';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

const engagementAreas = [
  { icon: ClipboardCheck, title: 'Process assessment', desc: 'We review your accounting, inventory, invoicing and reporting workflow before recommending a practical TallyPrime setup.' },
  { icon: Settings, title: 'Configuration plan', desc: 'Get a clearly scoped plan for masters, security, vouchers, reports, eTIMS readiness and the roles your team needs.' },
  { icon: Database, title: 'Migration readiness', desc: 'We assess data from Excel, QuickBooks, Sage or an existing Tally installation and agree a safe migration approach.' },
  { icon: Users, title: 'Training plan', desc: 'We map training to your accountants, store teams, managers and administrators so adoption is built into go-live.' },
  { icon: Gauge, title: 'Management reporting', desc: 'Set up the accounting, stock and operational reports that help owners and managers make faster decisions.' },
];

const faqs = [
  { q: 'What happens in a TallyPrime consultation?', a: 'We discuss your current workflow, users, stock locations, reporting needs and compliance requirements. You leave with a practical recommendation for licensing, implementation, migration, training and ongoing support.' },
  { q: 'Can you help us plan a multi-branch TallyPrime setup?', a: 'Yes. We assess how branches, warehouses, users and reporting should work together, then recommend the appropriate TallyPrime edition, remote-access approach and implementation plan.' },
  { q: 'Do we need a consultation before implementation?', a: 'For a straightforward single-user setup, a short discovery call may be enough. For migration, customisation, inventory-heavy or multi-branch work, a structured consultation reduces risk and avoids rework.' },
];

export default function ConsultingPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime Business Consulting Kenya"
        description="Plan a practical TallyPrime rollout in Kenya. Get expert advice on licensing, implementation, data migration, inventory workflows, eTIMS and user training."
        socialDescription="Talk to a Kenyan TallyPrime specialist about implementation, migration, inventory, multi-branch reporting and eTIMS readiness."
        service={{
          name: 'TallyPrime Business Systems Consulting',
          description: 'TallyPrime consulting in Kenya for implementation planning, workflow configuration, data migration, inventory management, multi-branch reporting and user adoption.',
          serviceType: 'TallyPrime business systems consulting',
        }}
        canonical="/tallyprime/consulting"
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'TallyPrime Solutions', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/' },
          { name: 'Consulting', item: 'https://www.optimumprimesolutions.co.ke/tallyprime/consulting/' },
        ]}
        faqs={faqs}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-600/20 px-4 py-1.5 text-sm font-semibold text-emerald-400">
              <ClipboardCheck className="h-4 w-4" /> TallyPrime Consulting — Kenya
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Plan a TallyPrime setup that fits <span className="text-emerald-400">how your business works</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Before implementation, we help you define the right licence, workflow, migration path, inventory structure, eTIMS requirements and training plan for your Kenyan business.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-500">
                Request a TallyPrime Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:+254116246074" className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-400 hover:bg-white/10">
                <Phone className="h-4 w-4" /> Call +254 116 246 074
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 border-y border-amber-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">When a consultation is most useful</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {['You are moving from Excel, QuickBooks, Sage or a legacy Tally setup.', 'You need better control of inventory, branches, warehouses or user access.', 'You need an implementation plan that includes KRA eTIMS and staff training.', 'Your current reports do not give management the visibility it needs.', 'You need custom TDL, a POS connection or another workflow adaptation.', 'You want to scope costs and responsibilities before committing to go-live.'].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center"><h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">What we help you decide</h2><p className="mt-4 text-lg text-slate-600">A good implementation begins with a clear scope—not a generic software demonstration.</p></div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {engagementAreas.map(({ icon: Icon, title, desc }) => <div key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6"><div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><Icon className="h-5 w-5" /></div><h3 className="font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20"><div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"><h2 className="text-center text-3xl font-bold text-slate-900">Consulting FAQs</h2><div className="mt-10 space-y-5">{faqs.map((faq) => <div key={faq.q} className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="font-bold text-slate-900">{faq.q}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.a}</p></div>)}</div></div></section>

      <section className="border-t border-slate-100 bg-white py-14"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h2 className="text-lg font-bold text-slate-900">Related TallyPrime services</h2><div className="mt-6 flex flex-wrap gap-3">{[{ label: 'Implementation', href: '/tallyprime/implementation' }, { label: 'Data Migration', href: '/tallyprime/data-migration' }, { label: 'Customization', href: '/tallyprime/customization' }, { label: 'Training', href: '/tallyprime/training' }, { label: 'Cloud Hosting', href: '/tallyprime/cloud-hosting' }].map((service) => <Link key={service.href} to={service.href} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-red-300 hover:text-red-600">{service.label}<ArrowRight className="h-3.5 w-3.5" /></Link>)}</div></div></section>
    </main>
  );
}
