import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
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
