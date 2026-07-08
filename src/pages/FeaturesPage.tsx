import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Services | TallyPrime Installation, Cloud Hosting & EOS Consulting Kenya"
        description="Explore Optimum Prime Solutions' services: TallyPrime installation & setup, inventory management, payroll (PAYE/NHIF/NSSF), KRA compliance, cloud hosting, and EOS business consulting for Kenyan businesses."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Features solutions for your business in Ruiru and beyond."
        canonical="/features"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Services', item: 'https://www.optimumprimesolutions.co.ke/features/' },
        ]}
      />
      <AfricanLaptopShowcase
        tag="Our Services"
        title="TallyPrime Implementation, Cloud Hosting & EOS® Consulting"
        description="From TallyPrime installation and KRA compliance to secure cloud hosting and Entrepreneurial Operating System (EOS®) implementation — we provide the full stack of tools and systems your business needs to grow."
        socialDescription="Optimum Prime Solutions — Kenya's trusted TallyPrime partner. Features solutions for your business in Ruiru and beyond."
        features={['TallyPrime Silver, Gold & Enterprise setup', 'Cloud hosting & remote access', 'EOS® business operating system', 'KRA, eTIMS & payroll compliance']}
        theme="features"
      />
      <Features />
      <HowItWorks />
    </main>
  );
}
