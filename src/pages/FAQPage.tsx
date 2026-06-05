import FAQ from '../components/FAQ';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AfricanLaptopShowcase
        tag="Support & answers"
        title="One person, one laptop, one trusted source for FAQ answers"
        description="The FAQ page is built around practical questions from business owners who need fast answers while working with Tally Prime."
        features={['Common setup questions', 'Training and compliance guidance', 'Remote access help', 'Billing and support clarity']}
        theme="faq"
      />
      <FAQ />
    </div>
  );
}
