import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import SEO from '../components/SEO';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[®©™]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useSite();
  const navigate = useNavigate();

  const post = data.blogs.find((b) => slugify(b.title) === slug);

  useEffect(() => {
    if (!post && data.blogs.length > 0) {
      navigate('/blog', { replace: true });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post, data.blogs.length, navigate]);

  if (!post) return null;

  const BASE_URL = 'https://www.optimumprimesolutions.co.ke';

  return (
    <>
      <SEO
        title={`${post.title} | Optimum Prime Solutions`}
        description={post.excerpt}
        canonical={`/blog/${slugify(post.title)}`}
        ogType="article"
        ogImage={`${BASE_URL}/og-image.png`}
        keywords={`${post.category}, TallyPrime Kenya, KRA compliance, ${post.title}`}
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

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center text-white">
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
    </>
  );
}
