import TallyLanding from '../components/TallyLanding';
import Hero3D from '../components/Hero3D';
import TrustBanner from '../components/TrustBanner';
import Partners from '../components/Partners';
import SEO from '../components/SEO';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Optimum Prime Solutions | Kenya's Certified TallyPrime Partner"
        description="Kenya's certified TallyPrime partner. We sell, implement & support TallyPrime Silver, Gold & Enterprise — plus secure cloud hosting, KRA compliance, payroll, and EOS® consulting for growing Kenyan businesses."
        canonical="/"
        keywords="TallyPrime Kenya, Tally partner Kenya, TallyPrime reseller Nairobi, accounting software Kenya, KRA compliance software, eTIMS Kenya, cloud hosting TallyPrime, EOS consulting Kenya"
      />
      <TallyLanding />
      <Hero3D />
      <Partners />
      <TrustBanner />
    </div>
  );
}
