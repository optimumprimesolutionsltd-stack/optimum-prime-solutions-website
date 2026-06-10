import FAQ from '../components/FAQ';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AfricanLaptopShowcase
        tag="Frequently Asked Questions"
        title="TallyPrime, Cloud Hosting & EOS® — Your Questions Answered"
        description="Find answers to common questions about TallyPrime licensing, KRA compliance, cloud hosting, remote access, and the Entrepreneurial Operating System (EOS®) by Gino Wickman."
        features={['TallyPrime editions & pricing', 'Cloud hosting & remote access', 'EOS® implementation process', 'KRA compliance & eTIMS setup']}
        theme="faq"
      />
      <FAQ />
    </div>
  );
}
