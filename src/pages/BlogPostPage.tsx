import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import SEO from '../components/SEO';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, ArrowLeft, User, ArrowRight, Mail } from 'lucide-react';
import { getPostSlug } from '../utils/slugify';
import NotFoundPage from './NotFoundPage';

// Keep the <title> tag within Google's ~60-char display budget even though
// article H1s run longer — truncates only the meta title, never the
// on-page heading.
// Cuts at the last full word before maxLength rather than mid-word, so
// truncated snippets don't end on something like "Tally P…".
function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const slice = text.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(' ');
  return `${(lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}

const SEO_TITLE_SUFFIX = ' | Optimum Prime';
function truncateTitle(title: string): string {
  return truncateAtWord(title, 60 - SEO_TITLE_SUFFIX.length);
}

// Same idea for the meta description — the visible excerpt on the page is
// left untouched, only the <meta name="description"> gets capped.
function truncateDescription(excerpt: string): string {
  return truncateAtWord(excerpt, 160);
}

// Per-post contextual related resources
const RELATED_RESOURCES: Record<string, { label: string; href: string; desc: string }[]> = {
  'why-every-kenyan-business-needs-tally-prime-in-2025': [
    { label: 'TallyPrime Implementation', href: '/tallyprime/implementation', desc: 'Go live in 5 business days with full setup & training.' },
    { label: 'KRA eTIMS Compliance', href: '/tallyprime/licensing', desc: 'Stay 100% compliant with automated VAT & e-filing.' },
    { label: 'View Pricing', href: '/pricing', desc: 'Transparent pricing — Silver, Gold & Enterprise editions.' },
  ],
  'complete-guide-to-kra-e-filing-with-tally-prime': [
    { label: 'KRA eTIMS & Compliance', href: '/tallyprime/licensing', desc: 'Automated VAT, PAYE, and e-filing built into TallyPrime.' },
    { label: 'TallyPrime for Retail', href: '/industries/retail', desc: 'See how retailers use TallyPrime for KRA compliance.' },
    { label: 'Book a Free Demo', href: '/contact#demo-form', desc: 'See the e-filing workflow live — no obligation.' },
  ],
  'tally-prime-silver-vs-gold-which-edition-is-right-for-you': [
    { label: 'TallyPrime Licensing', href: '/tallyprime/licensing', desc: 'Official Silver, Gold & Enterprise licences in Kenya.' },
    { label: 'View Pricing', href: '/pricing', desc: 'Compare edition prices side by side.' },
    { label: 'Cloud Hosting', href: '/tallyprime/cloud-hosting', desc: 'Host Gold on the cloud — access from anywhere.' },
  ],
  'what-is-eos-and-why-kenyan-businesses-are-adopting-it': [
    { label: 'EOS® Business Consulting', href: '/tallyprime/consulting', desc: 'EOS®-informed consulting in Kenya.' },
    { label: 'Why Choose Us', href: '/why-choose-us', desc: 'See why Kenyan businesses choose Optimum Prime Solutions.' },
    { label: 'Book a Free Session', href: '/contact#demo-form', desc: 'Free introductory EOS® session — no commitment.' },
  ],
  'tallyprime-cloud-hosting-access-your-business-data-from-anywhere': [
    { label: 'Cloud Hosting Plans', href: '/tallyprime/cloud-hosting', desc: 'KES 3,000/mo — 99.9% uptime, daily backups included.' },
    { label: 'TallyPrime for Distribution', href: '/industries/distribution', desc: 'Multi-location access for distributors & wholesalers.' },
    { label: 'View Pricing', href: '/pricing', desc: 'Compare cloud hosting packages and bundles.' },
  ],
  'tallyprime-71-is-here-whats-new-and-what-it-means-for-your-business': [
    { label: 'TallyPrime Licensing', href: '/tallyprime/licensing', desc: 'Upgrade to TallyPrime 7.1 — official licences in Kenya.' },
    { label: 'TallyPrime Implementation', href: '/tallyprime/implementation', desc: 'Upgrade & migrate with zero downtime.' },
    { label: 'View Pricing', href: '/pricing', desc: 'See upgrade and new licence pricing.' },
  ],
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useSite();

  const post = data.blogs.find((b) => getPostSlug(b) === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post]);

  if (!post) {
    // Post not found (e.g. a stale/old URL) — render a proper not-found
    // state instead of silently redirecting, so it doesn't look like the
    // requested article is the /blog listing page to users or crawlers.
    return <NotFoundPage />;
  }

  const BASE_URL = 'https://www.optimumprimesolutions.co.ke';

  return (
    <main className="min-h-screen">
      <SEO
        title={`${truncateTitle(post.title)}${SEO_TITLE_SUFFIX}`}
        description={truncateDescription(post.excerpt)}
        canonical={`/blog/${getPostSlug(post)}`}
        ogType="article"
        ogImage={`${BASE_URL}/og-image.png`}
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Blog', item: 'https://www.optimumprimesolutions.co.ke/blog/' },
          { name: post.title, item: `${BASE_URL}/blog/${getPostSlug(post)}/` },
        ]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 text-white">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_65%)]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <span className="inline-block rounded-full bg-gradient-to-r from-red-500 to-orange-400 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg mb-4">
            {post.category}
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mt-2">
            {post.title}
          </h1>

          <p className="mt-4 text-lg text-slate-300 leading-relaxed">{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('en-KE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} read
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              Optimum Prime Solutions Team
            </span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <article className="prose prose-slate prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-slate-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-slate-700 prose-p:leading-relaxed
            prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-900
            prose-ul:text-slate-700 prose-li:my-1
            prose-blockquote:border-l-red-500 prose-blockquote:text-slate-600">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>

          {/* Share — shown after the article, not pushed on readers before they've read it */}
          <div className="mt-10 flex items-center justify-center">
            <a
              href={`mailto:?subject=${encodeURIComponent('You might like this')}&body=${encodeURIComponent(
                `I think you'd love this newsletter: ${BASE_URL}/blog/${getPostSlug(post)}`
              )}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:border-red-300 hover:text-red-600 transition"
            >
              <Mail className="h-4 w-4" />
              Enjoyed this? Share it with a friend
            </a>
          </div>

          {/* Related Resources */}
          {(() => {
            const resources = RELATED_RESOURCES[slug || ''];
            if (!resources) return null;
            return (
              <div className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-base font-bold text-slate-900 mb-4">Related Resources</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {resources.map((r) => (
                    <Link
                      key={r.href}
                      to={r.href}
                      className="group flex flex-col gap-1 rounded-xl border border-slate-200 bg-white hover:border-red-300 p-4 transition"
                    >
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-red-600 flex items-center gap-1">
                        {r.label} <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition" />
                      </span>
                      <span className="text-xs text-slate-500 leading-relaxed">{r.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* CTA */}
          <div className="mt-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center text-white">
            <h3 className="text-xl font-bold">Ready to get started?</h3>
            <p className="mt-2 text-slate-300 text-sm">
              Talk to Kenya's certified TallyPrime partner today — free consultation, no obligation.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact#demo-form"
                className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors"
              >
                Book a Free Demo
              </Link>
              <Link
                to="/blog"
                className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                More Articles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
