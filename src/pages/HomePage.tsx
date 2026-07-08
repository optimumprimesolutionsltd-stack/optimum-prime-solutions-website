import SEO from '../components/SEO';
import TallyLanding from '../components/TallyLanding';
import Hero3D from '../components/Hero3D';
import TrustBanner from '../components/TrustBanner';
import Partners from '../components/Partners';
import EcosystemOrbit from '../components/EcosystemOrbit';
import VideoSection from '../components/VideoSection';
import ProcessFlow from '../components/ProcessFlow';
import Testimonials from '../components/Testimonials';

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
        <TallyLanding />
        <Hero3D />
      <EcosystemOrbit />
      <VideoSection />
      <ProcessFlow />
      <Testimonials />
      <Partners />
      <TrustBanner />
      </main>
    </div>
  );
}
