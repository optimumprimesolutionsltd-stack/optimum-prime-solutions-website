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
        title="Official TallyPrime Partner Kenya | Optimum Prime Solutions Ruiru"
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

        {/* 2. Value proposition + feature cards */}
        <Hero3D />

        {/* 3. Stats — 500+ businesses, 15+ years, 99.9% uptime, 1hr response */}
        <TrustBanner />

        {/* 4. Partner logos — TallyPrime, EOS, Biz Analyst, KRA */}
        <Partners />

        {/* 5. Product video */}
        <VideoSection />

        {/* 6. Industries — 4-column grid */}
        <Industries />

        {/* 7. Testimonials */}
        <Testimonials />

        {/* 8. Blog — latest 3 posts */}
        <Blog />
      </main>
    </div>
  );
}
