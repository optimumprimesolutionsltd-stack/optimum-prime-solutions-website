import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <AfricanLaptopShowcase />
      <Features />
      <HowItWorks />
    </div>
  );
}
