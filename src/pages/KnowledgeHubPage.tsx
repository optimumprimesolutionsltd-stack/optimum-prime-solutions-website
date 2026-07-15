import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, HelpCircle, PlayCircle, Users, BookMarked } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';

const resources = [
  {
    icon: BookOpen,
    title: 'Blog',
    desc: 'TallyPrime tips, KRA compliance updates, cloud hosting guides, and business management insights.',
    href: '/blog',
    cta: 'Read the Blog',
    color: 'bg-red-50 text-red-600',
    badge: 'Latest Articles',
  },
  {
    icon: FileText,
    title: 'Implementation Guides',
    desc: 'Step-by-step guides for TallyPrime setup, configuration, KRA eTIMS integration, and cloud migration.',
    href: '/knowledge-hub/guides',
    cta: 'View Guides',
    color: 'bg-blue-50 text-blue-600',
    badge: 'Coming Soon',
  },
  {
    icon: HelpCircle,
    title: 'FAQ & Troubleshooting',
    desc: 'Answers to the most common TallyPrime, cloud hosting, KRA compliance, and EOS® questions.',
    href: '/faq',
    cta: 'Browse FAQs',
    color: 'bg-orange-50 text-orange-600',
    badge: 'Live',
  },
  {
    icon: Users,
    title: 'Case Studies',
    desc: 'Real stories from Kenyan businesses that transformed their operations with TallyPrime.',
    href: '/knowledge-hub/case-studies',
    cta: 'Read Case Studies',
    color: 'bg-purple-50 text-purple-600',
    badge: 'Coming Soon',
  },
  {
    icon: PlayCircle,
    title: 'Video Tutorials',
    desc: 'Official TallyPrime tutorials covering eTIMS, getting started, accounting & inventory, and invoicing.',
    href: '/knowledge-hub/videos',
    cta: 'Watch Videos',
    color: 'bg-pink-50 text-pink-600',
    badge: 'Live',
  },
  {
    icon: BookMarked,
    title: 'Webinars',
    desc: 'Live and recorded webinars on TallyPrime features, KRA compliance deadlines, and business management.',
    href: '/webinar',
    cta: 'View Webinars',
    color: 'bg-teal-50 text-teal-600',
    badge: 'Live — 15 July',
  },
];

const featuredTopics = [
  'TallyPrime Silver vs Gold — Which Edition Is Right for You?',
  'KRA eTIMS Compliance: What Every Kenyan Business Must Know',
  'How to Set Up TallyPrime Cloud Hosting in Kenya',
  'TallyPrime Payroll: PAYE, NHIF, NSSF & Housing Levy Guide',
  'What Is EOS® and Why Kenyan Businesses Are Adopting It',
  'TallyPrime 7.1 — New Features and What They Mean for Your Business',
];

export default function KnowledgeHubPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Knowledge Hub — TallyPrime Guides, Blog, FAQs & Resources Kenya"
        description="Your central TallyPrime learning resource. Access blog articles, implementation guides, video tutorials, FAQs, case studies, and downloadable templates from Kenya's certified TallyPrime partner."
        socialDescription="Access guides, templates, case studies, and resources for TallyPrime and business management in Kenya."
        canonical="/knowledge-hub"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Knowledge Hub', item: 'https://www.optimumprimesolutions.co.ke/knowledge-hub/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-600/20 border border-purple-500/30 px-4 py-1.5 text-sm font-semibold text-purple-400 mb-6">
              Kenya's TallyPrime Learning Centre
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Knowledge Hub —<br />
              <span className="text-red-400">Learn TallyPrime</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Everything you need to get the most from TallyPrime. Guides, tutorials, FAQs, case studies, and resources — all in one place, built specifically for Kenyan businesses.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Read the Blog <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"
              >
                Browse FAQs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              All Learning Resources
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              From quick answers to deep-dive guides — find the resource that matches where you are in your TallyPrime journey.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource) => {
              const Icon = resource.icon;
              const isComingSoon = resource.badge === 'Coming Soon';
              const cardContent = (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${resource.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${
                      resource.badge === 'Live' || resource.badge === 'Latest Articles' || resource.badge.startsWith('Live')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {resource.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-grow">{resource.desc}</p>
                  {!isComingSoon && (
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-red-600 group-hover:gap-2 transition-all">
                      {resource.cta} <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </>
              );

              // "Coming Soon" resources aren't built yet — render as a non-clickable
              // teaser instead of a Link, so search engines don't discover/index
              // pages that don't exist yet.
              if (isComingSoon) {
                return (
                  <div
                    key={resource.href}
                    className="flex flex-col rounded-3xl bg-white border border-slate-200 p-6 shadow-sm opacity-70"
                  >
                    {cardContent}
                  </div>
                );
              }

              return (
                <Link
                  key={resource.href}
                  to={resource.href}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group flex flex-col rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Popular Topics
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Start with our most-read guides and articles — covering the questions Kenyan businesses ask most about TallyPrime.
              </p>
              <ul className="space-y-3">
                {featuredTopics.map((topic) => (
                  <li key={topic}>
                    <Link
                      to="/blog"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="flex items-start gap-3 group"
                    >
                      <span className="mt-1 h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <ArrowRight className="h-3 w-3" />
                      </span>
                      <span className="text-sm text-slate-700 group-hover:text-red-600 transition-colors leading-relaxed">
                        {topic}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  to="/blog"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white transition"
                >
                  View All Blog Articles <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Need a Direct Answer?</h3>
              <p className="text-sm text-slate-600 mb-6">
                Can't find what you're looking for? Our certified TallyPrime specialists are available Monday–Saturday to answer your questions.
              </p>
              <div className="space-y-3">
                <Link
                  to="/faq"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center justify-between rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:border-red-200 hover:text-red-600 transition"
                >
                  Browse FAQs <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact#demo-form"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center justify-between rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:border-red-200 hover:text-red-600 transition"
                >
                  Contact Our Team <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://wa.me/254116246074?text=Hi,%20I%20have%20a%20TallyPrime%20question"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100 transition"
                >
                  WhatsApp Us Now <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Implement TallyPrime?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Knowledge is the first step. Let our certified team handle the implementation so you can focus on running your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact#demo-form"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition"
            >
              Book a Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
