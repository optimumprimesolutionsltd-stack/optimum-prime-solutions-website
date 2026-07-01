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
        title="Optimum Prime Solutions Ltd | TallyPrime Partner & Business Management Consultant — Ruiru, Kenya"
        description="Optimum Prime Solutions Ltd is a certified TallyPrime partner and business management consultant based in Ruiru, Kenya. We help SMEs streamline accounting, inventory, payroll, and KRA/eTIMS compliance through TallyPrime implementation, training, and support."
        canonical="/"
        keywords="TallyPrime partner Kenya, TallyPrime Ruiru, accounting software Kenya, KRA eTIMS compliance, EOS consulting Kenya, cloud hosting Kenya, business management consultant Nairobi"
      />
      <TallyLanding />
      <Hero3D />
      <EcosystemOrbit />
      <VideoSection />
      <ProcessFlow />
      <Testimonials />
      <Partners />
      <TrustBanner />
    </div>
  );
}
