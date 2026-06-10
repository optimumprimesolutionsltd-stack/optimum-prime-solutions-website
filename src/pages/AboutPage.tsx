import About from '../components/About';
import FeatureShowcase from '../components/FeatureShowcase';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="About Us | Optimum Prime Solutions — Kenya's TallyPrime Partner"
        description="Learn about Optimum Prime Solutions — Kenya's certified TallyPrime reseller and licensed EOS® implementer based in Ruiru. We help Kenyan businesses grow with TallyPrime, cloud hosting, and operational consulting."
        canonical="/about"
        keywords="about Optimum Prime Solutions, TallyPrime partner Kenya, EOS implementer Kenya, certified Tally reseller Nairobi, business consulting Kenya"
      />
      <AfricanLaptopShowcase
        tag="Kenya's Certified TallyPrime Partner"
        title="TallyPrime Sales, Cloud Hosting & EOS® Consulting in Kenya"
        description="Optimum Prime Solutions is Kenya's certified TallyPrime partner and licensed EOS® implementer. We sell TallyPrime, set up cloud hosting, and help leadership teams run their businesses on the Entrepreneurial Operating System by Gino Wickman."
        features={['Certified TallyPrime reseller — Silver, Gold & Enterprise', 'Secure cloud hosting & remote access setup', 'Licensed EOS® implementer (Gino Wickman framework)', 'KRA & eTIMS compliance built in']}
        theme="about"
      />
      <About />
      <FeatureShowcase />
    </div>
  );
}
