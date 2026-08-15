import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="TallyPrime & Cloud Hosting Services | Optimum Prime"
        description="Explore our services: TallyPrime installation, payroll, KRA compliance, and cloud hosting for Kenyan businesses."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Features solutions for your business in Ruiru and beyond."
        canonical="/features"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Services', item: 'https://www.optimumprimesolutions.co.ke/features/' },
        ]}
      />
      <AfricanLaptopShowcase
        tag="Our Services"
        title="TallyPrime Implementation & Cloud Hosting Services"
        description="From TallyPrime installation and KRA compliance to secure cloud hosting — we provide the full stack of tools and systems your business needs to grow."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Features solutions for your business in Ruiru and beyond."
        features={['TallyPrime Silver, Gold & Enterprise setup', 'Cloud hosting & remote access', 'Business automation solutions', 'KRA, eTIMS & payroll compliance']}
        theme="features"
      />
      <Features />
      <HowItWorks />
    </main>
  );
}
