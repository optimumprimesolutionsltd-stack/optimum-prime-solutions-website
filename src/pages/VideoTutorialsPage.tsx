import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Play } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';

interface Video {
  title: string;
  desc: string;
  url: string;
}

function getYouTubeId(url: string): string {
  if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split(/[?&]/)[0];
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : '';
}

function getThumbnail(url: string): string {
  const id = getYouTubeId(url);
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

interface VideoCategory {
  title: string;
  intro: string;
  videos: Video[];
}

const categories: VideoCategory[] = [
  {
    title: 'Kenya Compliance — eTIMS',
    intro: 'How TallyPrime connects to the KRA eTIMS portal.',
    videos: [
      {
        title: 'Send Transaction Details to the eTIMS Portal',
        desc: 'How to update transaction details on the eTIMS Portal while recording entries in TallyPrime Edit Log, and how to send master details such as Ledgers and Stock Items to eTIMS.',
        url: 'https://youtu.be/Fn4hOQy2gVI',
      },
    ],
  },
  {
    title: 'Getting Started',
    intro: 'New to TallyPrime? Start here — installation, navigation, and everyday shortcuts.',
    videos: [
      {
        title: 'Get Started with TallyPrime',
        desc: 'Installation, license activation, creating your company, recording your first transaction, and viewing reports.',
        url: 'https://www.youtube.com/watch?v=st036Km_Lfk',
      },
      {
        title: 'Navigate Using Go To in TallyPrime',
        desc: 'Quickly access reports, transactions, and create new vouchers from any screen using the Go To feature.',
        url: 'https://www.youtube.com/watch?v=IYSRM1XOOZM',
      },
      {
        title: 'Use the Right Buttons in TallyPrime to Work Faster',
        desc: 'A tour of the most commonly used buttons and where to find them.',
        url: 'https://www.youtube.com/watch?v=Ia1jds3vJTE',
      },
      {
        title: 'Use Keyboard Shortcuts in TallyPrime',
        desc: 'Speed up daily data entry with TallyPrime\'s keyboard shortcuts.',
        url: 'https://www.youtube.com/watch?v=zJpVaaCe4Lo',
      },
      {
        title: 'Use TallyPrime Features for Your Business',
        desc: 'An overview of the product layout, the Gateway of Tally menu, and configuring transactions for your business.',
        url: 'https://www.youtube.com/watch?v=zHt73DGF1WQ',
      },
    ],
  },
  {
    title: 'Accounting & Inventory',
    intro: 'Core bookkeeping and stock management tasks every business needs.',
    videos: [
      {
        title: 'Create Ledgers in TallyPrime',
        desc: 'Set up ledger accounts through vouchers or masters — the foundation of your books.',
        url: 'https://www.youtube.com/watch?v=leyl5w8GAmo',
      },
      {
        title: 'Create Stock Group and Stock Items',
        desc: 'Organise your inventory by grouping stock and creating individual stock items.',
        url: 'https://www.youtube.com/watch?v=1MHWbYNDirc',
      },
      {
        title: 'Specify Opening/Closing Stock Value',
        desc: 'Use the Stock-In-Hand Ledger to record and value your opening and closing inventory.',
        url: 'https://www.youtube.com/watch?v=vgEBFUNLNLM',
      },
      {
        title: 'Record Transactions in Different Currencies',
        desc: 'Set up foreign currencies and record multi-currency transactions — useful for import/export businesses.',
        url: 'https://www.youtube.com/watch?v=uA8XUMLBbos',
      },
      {
        title: 'Specify Barcodes in Stock Items',
        desc: 'Attach barcodes to stock items to speed up billing and transaction entry.',
        url: 'https://www.youtube.com/watch?v=YG5NinpLEWA',
      },
      {
        title: 'View Outstandings Report',
        desc: 'Track receivables and payables for a specific period at a glance.',
        url: 'https://www.youtube.com/watch?v=7YyQpOoDkMk',
      },
      {
        title: 'Apply Filters to Reports',
        desc: 'Use basic, multi, and advanced filters to get exactly the report view you need.',
        url: 'https://www.youtube.com/watch?v=bcglMK5vy1c',
      },
    ],
  },
  {
    title: 'Sales, Purchase & Invoicing',
    intro: 'Configure and print professional, VAT-ready invoices.',
    videos: [
      {
        title: 'Configure and Print Invoices with Bank Details and Company Logo',
        desc: 'Add your bank details and company logo to printed invoices for a professional look.',
        url: 'https://www.youtube.com/watch?v=WervRTGFb_M',
      },
      {
        title: 'Print Rate Inclusive of Tax in Sales Invoice',
        desc: 'Configure items and invoices to display VAT-inclusive rates when printing sales documents.',
        url: 'https://www.youtube.com/watch?v=NMNbhZ3Mrhg',
      },
      {
        title: 'Record Sales Invoice Inclusive of Tax',
        desc: 'Enter sales invoices where the rate already includes tax, instead of adding it separately.',
        url: 'https://www.youtube.com/watch?v=659v2xdsb_0',
      },
      {
        title: 'Optimise Page Size While Printing Invoices',
        desc: 'Save paper by configuring which invoice details print and which repeat across pages.',
        url: 'https://www.youtube.com/watch?v=myS_ycX6uY0',
      },
    ],
  },
];

const featuredVideo: Video = categories[1].videos[0]; // "Get Started with TallyPrime"
const totalVideoCount = categories.reduce((sum, c) => sum + c.videos.length, 0);

export default function VideoTutorialsPage() {
  const [playing, setPlaying] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const featuredId = getYouTubeId(featuredVideo.url);

  const libraryRef = useRef<HTMLDivElement>(null);
  const [libraryHeight, setLibraryHeight] = useState('0px');

  useEffect(() => {
    const recalc = () => {
      if (libraryRef.current) setLibraryHeight(showAll ? `${libraryRef.current.scrollHeight}px` : '0px');
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [showAll]);

  return (
    <main className="min-h-screen">
      <SEO
        title="Video Tutorials — TallyPrime Walkthroughs for Kenyan Businesses"
        description="Watch official TallyPrime video tutorials covering KRA eTIMS integration, getting started, accounting & inventory, and VAT-ready invoicing — curated for Kenyan businesses."
        socialDescription="Free TallyPrime video tutorials for Kenyan businesses — eTIMS, invoicing, accounting & inventory, and more."
        canonical="/knowledge-hub/videos"
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Knowledge Hub', item: 'https://www.optimumprimesolutions.co.ke/knowledge-hub/' },
          { name: 'Video Tutorials', item: 'https://www.optimumprimesolutions.co.ke/knowledge-hub/videos/' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-600/20 border border-pink-500/30 px-4 py-1.5 text-sm font-semibold text-pink-400 mb-6">
              Video Tutorials
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Learn TallyPrime —<br />
              <span className="text-red-400">One Video at a Time</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Official TallyPrime tutorials covering everyday tasks — from KRA eTIMS integration to invoicing and inventory — picked for what Kenyan businesses actually use.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact#demo-form"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Book a Free Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"
              >
                Browse FAQs
              </Link>
              <a
                href="https://wa.me/254727209720?text=Hi,%20I%20have%20a%20question%20about%20a%20TallyPrime%20tutorial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 hover:bg-green-500/20 px-6 py-3 text-sm font-semibold text-green-400 transition"
              >
                WhatsApp Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video — plays inline, no click-away required */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-red-600 mb-6">
            Start Here
          </p>
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
            {!playing ? (
              <>
                <img
                  src={getThumbnail(featuredVideo.url)}
                  alt={featuredVideo.title}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-900/30 hover:bg-slate-900/10 transition-colors" />
                <button
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label={`Play ${featuredVideo.title}`}
                >
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-600 shadow-xl hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                  </div>
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/90 to-transparent px-6 pt-12 pb-5">
                  <h2 className="text-lg sm:text-xl font-bold text-white">{featuredVideo.title}</h2>
                  <p className="text-sm text-slate-300 mt-1 max-w-2xl">{featuredVideo.desc}</p>
                </div>
              </>
            ) : (
              <iframe
                className="w-full aspect-video"
                src={`https://www.youtube.com/embed/${featuredId}?autoplay=1&rel=0`}
                title={featuredVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              aria-expanded={showAll}
            >
              {showAll ? 'Hide Full Library' : `Browse All ${totalVideoCount} Tutorials`}
              <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Video Categories — collapsed until "Browse All" is clicked. Stays mounted (height-animated
          via measured scrollHeight, not conditionally rendered) so the full tutorial library is still
          present in the prerendered HTML for SEO, even though it's visually hidden by default. */}
      <section
        style={{ height: libraryHeight, opacity: showAll ? 1 : 0 }}
        className="bg-slate-50 overflow-hidden transition-[height,opacity] duration-500 ease-in-out"
        aria-hidden={!showAll}
      >
        <div ref={libraryRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 space-y-16">
          {categories.map((category, index) => (
            <div key={category.title}>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{category.title}</h2>
              <p className="text-slate-600 mb-8 max-w-2xl">{category.intro}</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.videos.map((video) => (
                  <a
                    key={video.url}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden"
                  >
                    <div className="relative aspect-video bg-slate-200 overflow-hidden">
                      <img
                        src={getThumbnail(video.url)}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow p-6">
                      <h3 className="text-base font-bold text-slate-900 mb-2">{video.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed flex-grow">{video.desc}</p>
                      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-red-600 group-hover:gap-2 transition-all">
                        Watch on YouTube <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Mid-page conversion CTA — after the 2nd category */}
              {index === 1 && (
                <div className="mt-12 rounded-3xl bg-slate-900 px-6 py-10 sm:px-10 text-center">
                  <h3 className="text-2xl font-bold text-white mb-3">Rather Have a Human Walk You Through It?</h3>
                  <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                    Skip the trial and error — our certified TallyPrime specialists can set this up for you or train your team directly.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      to="/contact#demo-form"
                      className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
                    >
                      Book a Free Demo <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/tallyprime/training"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"
                    >
                      Explore Training Services
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Source note */}
      <section className="bg-white border-t border-slate-100 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">
            These are official TallyPrime tutorial videos published by Tally Solutions. For the full library, visit{' '}
            <a
              href="https://help.tallysolutions.com/tallyhelp-videos/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:underline"
            >
              help.tallysolutions.com
            </a>
            . Need help applying any of this to your business? Our certified team can walk you through it directly.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Prefer a Live Walkthrough?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Our certified TallyPrime specialists can train your team directly, tailored to your business and Kenyan compliance requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact#demo-form"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition"
            >
              Book a Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/254727209720?text=Hi,%20I%20have%20a%20question%20about%20a%20TallyPrime%20tutorial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 hover:bg-green-500/20 px-8 py-3 text-sm font-semibold text-green-400 transition"
            >
              WhatsApp Us Now
            </a>
            <Link
              to="/knowledge-hub"
              className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 px-8 py-3 text-sm font-semibold text-white transition"
            >
              Back to Knowledge Hub
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
