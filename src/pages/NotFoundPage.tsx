import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Home, Search } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  const location = useLocation();

  // The real 404 HTTP status is set by vercel.json (routes[] catch-all,
  // status: 404, serving the prerendered dist/404.html) — status codes
  // can't be set via meta tags, browsers/crawlers only honor them as
  // actual HTTP response headers. `noIndex` below (via react-helmet-async)
  // is what actually keeps this page out of the index.

  return (
    <main className="min-h-screen">
      <SEO
        title="Page Not Found — 404 | Optimum Prime Solutions"
        description="The page you are looking for does not exist. Return to the Optimum Prime Solutions homepage or contact us for help."
        socialDescription="The page you're looking for doesn't exist. Return to Optimum Prime Solutions — Kenya's TallyPrime partner."
        canonical={location.pathname}
        noIndex={true}
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Page Not Found', item: 'https://www.optimumprimesolutions.co.ke' + location.pathname + '/' },
        ]}
      />
      <section id="main-content" className="min-h-[80vh] flex items-center bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 border border-red-200 mb-6">
              <Search className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-2">404</h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-2">
              We're sorry, but the page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-slate-500 mb-8">
              If you typed the URL, please check the spelling. If you followed a link, it may be outdated.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                <Home className="h-4 w-4" /> Go to Homepage
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 hover:border-slate-400 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-4">Popular pages you might be looking for:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: 'TallyPrime Solutions', href: '/tallyprime' },
                  { label: 'Industries', href: '/industries' },
                  { label: 'Pricing', href: '/pricing' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'FAQ', href: '/faq' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:border-red-300 hover:text-red-600 transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
