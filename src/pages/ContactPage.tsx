import Contact from '../components/Contact';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Contact Us | Optimum Prime Solutions — TallyPrime Kenya"
        description="Get in touch with Optimum Prime Solutions. Book a TallyPrime demo, request a quote, or ask about cloud hosting, KRA compliance, or EOS® consulting. Based in Ruiru, Kenya. Call +254 116 246 074."
        canonical="/contact"
        keywords="contact TallyPrime Kenya, book TallyPrime demo Kenya, TallyPrime quote Kenya, Optimum Prime Solutions contact, TallyPrime Ruiru Kenya, accounting software support Kenya"
      />
      <AfricanLaptopShowcase
        tag="Get in touch"
        title="Contact one expert who guides your Tally Prime setup"
        description="Reach out with a direct question and get a one-on-one answer that helps you move forward with confidence."
        features={['Fast demo scheduling', 'Personal support invite', 'Tally Prime implementation help', 'WhatsApp-friendly contact']}
        theme="contact"
      />
      <Contact />
    </div>
  );
}
