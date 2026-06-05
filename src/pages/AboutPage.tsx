import About from '../components/About';
import FeatureShowcase from '../components/FeatureShowcase';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AfricanLaptopShowcase
        tag="About Optimum Prime"
        title="A single expert partner supporting your business growth"
        description="Our story is built around one dedicated Tally Prime specialist who helps Kenyan firms manage accounts, inventory and compliance with confidence."
        features={['Local accounting expertise', 'One-to-one implementation support', 'Tailored process improvement', 'Practical training and handover']}
        theme="about"
      />
      <About />
      <FeatureShowcase />
    </div>
  );
}
