import FAQ from '../components/FAQ';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';
import { useSite } from '../context/SiteContext';

export default function FAQPage() {
  const { data } = useSite();
  return (
    <main className="min-h-screen bg-slate-900">
      <SEO
        title="TallyPrime Kenya FAQ | Optimum Prime"
        description="Answers to common questions about TallyPrime Kenya pricing, licensing, KRA eTIMS compliance, cloud hosting, and EOS® consulting."
        socialDescription="Got questions about TallyPrime in Kenya? Find answers to the most common questions about implementation, pricing, and KRA compliance."
        canonical="/faq"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'FAQ', item: 'https://www.optimumprimesolutions.co.ke/faq/' },
        ]}
        faqs={data.faqs.map(f => ({ q: f.q, a: f.a }))}
      />
      <AfricanLaptopShowcase
        tag="Frequently Asked Questions"
        title="TallyPrime, Cloud Hosting & EOS® — Your Questions Answered"
        description="Find answers to common questions about TallyPrime licensing, KRA compliance, cloud hosting, remote access, and the Entrepreneurial Operating System (EOS®) by Gino Wickman."
        socialDescription="Got questions about TallyPrime in Kenya? Find answers to the most common questions about implementation, pricing, and KRA compliance."
        features={['TallyPrime editions & pricing', 'Cloud hosting & remote access', 'EOS® implementation process', 'KRA compliance & eTIMS setup']}
        theme="faq"
      />
      <FAQ />
    </main>
  );
}
