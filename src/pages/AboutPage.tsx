import About from '../components/About';
import FeatureShowcase from '../components/FeatureShowcase';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AfricanLaptopShowcase />
      <About />
      <FeatureShowcase />
    </div>
  );
}
