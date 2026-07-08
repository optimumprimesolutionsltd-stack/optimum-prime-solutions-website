import About from '../components/About';
import FeatureShowcase from '../components/FeatureShowcase';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="About Us | Optimum Prime Solutions Ltd — TallyPrime Partner & Business Automation, Ruiru Kenya"
        description="Learn about Optimum Prime Solutions Ltd — a certified TallyPrime partner and business automation consultancy based in Ruiru, Kenya. We help SMEs with accounting, payroll, KRA/eTIMS compliance, cloud hosting, and business systems consulting."
        canonical="/about"
        keywords="about Optimum Prime Solutions Ltd, TallyPrime partner Ruiru, business automation consultancy Kenya, software company Ruiru, certified Tally reseller Kenya, business consulting Kenya"
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'About Us', item: 'https://www.optimumprimesolutions.co.ke/about/' },
        ]}
      />
      <AfricanLaptopShowcase
        tag="Kenya's Certified TallyPrime Partner"
        title="TallyPrime Sales, Cloud Hosting & EOS® Consulting in Kenya"
        description="Optimum Prime Solutions Ltd is a certified TallyPrime partner and business automation consultancy based in Ruiru, Kenya. We help small and medium businesses streamline accounting, inventory, payroll, and KRA/eTIMS tax compliance through TallyPrime implementation, training, and support."
        features={['Certified TallyPrime reseller — Silver, Gold & Enterprise', 'Secure cloud hosting & remote access setup', 'Licensed EOS® implementer (Gino Wickman framework)', 'KRA & eTIMS compliance built in']}
        theme="about"
      />
      <About />
      <FeatureShowcase />
    </main>
  );
}
