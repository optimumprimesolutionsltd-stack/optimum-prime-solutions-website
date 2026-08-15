import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime & Cloud Hosting Services | Optimum Prime"
        description="Explore our TallyPrime services: implementation, training, support, KRA eTIMS compliance, cloud hosting and customisation for Kenyan businesses."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Features solutions for your business in Ruiru and beyond."
        canonical="/features"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Services', item: 'https://www.optimumprimesolutions.co.ke/features/' },
        ]}
      />
      <AfricanLaptopShowcase
        tag="Our Services"
        title="TallyPrime Implementation, Cloud Hosting & Support"
        description="From TallyPrime implementation and KRA eTIMS compliance to secure cloud hosting, training and ongoing support, we help Kenyan businesses run better operations."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Features solutions for your business in Ruiru and beyond."
        features={['TallyPrime Silver, Gold & Enterprise setup', 'Cloud hosting & remote access', 'Training, support & data migration', 'KRA, eTIMS & payroll compliance']}
        theme="features"
      />
      <Features />
      <HowItWorks />
    </main>
  );
}
