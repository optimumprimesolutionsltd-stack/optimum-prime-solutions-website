import TallyLanding from '../components/TallyLanding';
import Hero3D from '../components/Hero3D';
import TrustBanner from '../components/TrustBanner';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <TallyLanding />
      <Hero3D />
      <TrustBanner />
    </div>
  );
}
