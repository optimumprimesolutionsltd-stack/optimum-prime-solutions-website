import About from '../components/About';
import FeatureShowcase from '../components/FeatureShowcase';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="About Us | Optimum Prime Solutions Ltd — TallyPrime Partner &amp; Business Management Consultant, Ruiru Kenya"
        description="Learn about Optimum Prime Solutions Ltd — a certified TallyPrime partner and business management consultant based in Ruiru, Kenya. We help SMEs with accounting, payroll, KRA/eTIMS compliance, cloud hosting, and business systems consulting."
        canonical="/about"
        keywords="about Optimum Prime Solutions Ltd, TallyPrime partner Ruiru, business management consultant Kenya, software company Ruiru, certified Tally reseller Kenya, business consulting Kenya"
      />
      <AfricanLaptopShowcase
        tag="Kenya's Certified TallyPrime Partner"
        title="TallyPrime Sales, Cloud Hosting & EOS® Consulting in Kenya"
        description="Optimum Prime Solutions Ltd is a certified TallyPrime partner and business management consultant based in Ruiru, Kenya. We help small and medium businesses streamline accounting, inventory, payroll, and KRA/eTIMS tax compliance through TallyPrime implementation, training, and support."
        features={['Certified TallyPrime reseller — Silver, Gold & Enterprise', 'Secure cloud hosting & remote access setup', 'Licensed EOS® implementer (Gino Wickman framework)', 'KRA & eTIMS compliance built in']}
        theme="about"
      />
      <About />
      <FeatureShowcase />
    </div>
  );
}
