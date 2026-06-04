import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <AfricanLaptopShowcase
        tag="Core features"
        title="See the features that help one person run things faster"
        description="From inventory control to invoicing, this single-laptop view highlights the capabilities that make Tally Prime essential for modern Kenyan business."
        features={['Real-time reporting', 'Mobile-ready access', 'Inventory and bank reconciliation', 'Custom workflows for small teams']}
        theme="features"
      />
      <Features />
      <HowItWorks />
    </div>
  );
}
