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
        title="Optimum Prime Solutions Ltd | Official TallyPrime Partner in Kenya | Business Automation"
        description="Optimum Prime Solutions is Kenya's official TallyPrime partner. Buy genuine TallyPrime licences, get expert implementation, hands-on training, KRA eTIMS compliance setup, and secure cloud hosting. Serving Ruiru, Nairobi and all of Kenya."
        canonical="/"
        keywords="TallyPrime Kenya, buy TallyPrime Kenya, official Tally partner Kenya, TallyPrime implementation Kenya, TallyPrime training Kenya, TallyPrime reseller Kenya, KRA eTIMS compliance Kenya, TallyPrime cloud hosting Kenya, accounting software Kenya, TallyPrime Ruiru, TallyPrime Nairobi, EOS consulting Kenya"
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
