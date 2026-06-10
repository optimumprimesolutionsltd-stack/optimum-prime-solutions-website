import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Services | TallyPrime Installation, Cloud Hosting & EOS® Consulting Kenya"
        description="Explore Optimum Prime Solutions' services: TallyPrime installation & setup, inventory management, payroll (PAYE/NHIF/NSSF), KRA compliance, cloud hosting, and EOS® business consulting for Kenyan businesses."
        canonical="/features"
        keywords="TallyPrime installation Kenya, TallyPrime setup Nairobi, cloud hosting Kenya, KRA compliance accounting, payroll software Kenya, PAYE NHIF NSSF Kenya, EOS consulting Kenya, inventory management Kenya"
      />
      <AfricanLaptopShowcase
        tag="Our Services"
        title="TallyPrime Implementation, Cloud Hosting & EOS® Consulting"
        description="From TallyPrime installation and KRA compliance to secure cloud hosting and Entrepreneurial Operating System (EOS®) implementation — we provide the full stack of tools and systems your business needs to grow."
        features={['TallyPrime Silver, Gold & Enterprise setup', 'Cloud hosting & remote access', 'EOS® business operating system', 'KRA, eTIMS & payroll compliance']}
        theme="features"
      />
      <Features />
      <HowItWorks />
    </div>
  );
}
