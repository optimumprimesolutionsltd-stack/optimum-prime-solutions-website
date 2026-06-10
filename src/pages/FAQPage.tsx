import FAQ from '../components/FAQ';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="FAQ | TallyPrime Kenya — Pricing, Licensing & KRA Compliance Questions"
        description="Answers to the most common questions about TallyPrime Kenya pricing, licensing, KRA & eTIMS compliance, cloud hosting, remote access, payroll setup, and EOS® consulting."
        canonical="/faq"
        keywords="TallyPrime FAQ Kenya, TallyPrime price Kenya, TallyPrime licence questions, KRA compliance FAQ, eTIMS questions Kenya, cloud hosting FAQ Kenya, EOS FAQ Kenya"
      />
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
