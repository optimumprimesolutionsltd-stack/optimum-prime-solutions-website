import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import TallyLanding from '../components/TallyLanding';
import Hero3D from '../components/Hero3D';
import TrustBanner from '../components/TrustBanner';
import Partners from '../components/Partners';
import VideoSection from '../components/VideoSection';
import Testimonials from '../components/Testimonials';
import Industries from '../components/Industries';
import Blog from '../components/Blog';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="TallyPrime Implementation & Support Kenya | Certified Partner"
        description="Official TallyPrime partner in Kenya. Get KRA eTIMS compliance, cloud hosting, and expert training for your business in Nairobi, Ruiru, and beyond."
        socialDescription="Empower your business with Kenya's trusted TallyPrime experts. From KRA eTIMS compliance to cloud hosting, we help you grow with confidence."
        canonical="/"
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
        ]}
      />
      <main id="main-content">
        {/* 1. Hero — animated particle landing */}
        <TallyLanding />

        {/* 2. Product video — moved up from position 5 so it's seen right after
            the hero instead of several scrolls down: keeps visitors engaged
            early and sits right above the CTA-heavy section that follows. */}
        <VideoSection />

        {/* 3. Value proposition + feature cards */}
        <Hero3D />

        {/* 4. Stats — 500+ businesses, 15+ years, 99.9% uptime, 1hr response */}
        <TrustBanner />

        {/* 5. Partner logos — TallyPrime, EOS, Biz Analyst, KRA */}
        <Partners />

        {/* 6. Industries — 4-column grid */}
        <Industries />

        {/* 7. Testimonials + reviews grid */}
        <Testimonials />

        {/* 8. Blog — latest 3 posts */}
        <Blog />

        {/* 9. Closing CTA banner */}
        <section className="bg-gradient-to-r from-red-700 to-red-600 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-red-200 mb-3">Ready to get started?</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Streamline your business with TallyPrime today
            </h2>
            <p className="text-red-100 text-base max-w-xl mx-auto mb-8">
              Join 2.5 million+ businesses worldwide already running on TallyPrime. Our team will have you live in 5 business days — guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact#demo-form"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-red-700 hover:bg-red-50 shadow-lg shadow-red-900/20 transition-colors"
              >
                Book a Free Demo
              </Link>
              <a
                href="https://wa.me/254727209720?text=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20TallyPrime"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-colors" style={{backgroundColor:'#25D366'}} onMouseEnter={e=>(e.currentTarget.style.backgroundColor='#1ebe5d')} onMouseLeave={e=>(e.currentTarget.style.backgroundColor='#25D366')}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.524 5.845L0 24l6.335-1.509A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.368l-.359-.213-3.72.886.925-3.62-.234-.372A9.818 9.818 0 1112 21.818z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
