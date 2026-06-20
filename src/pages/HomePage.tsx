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
