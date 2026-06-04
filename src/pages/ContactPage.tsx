import Contact from '../components/Contact';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
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
