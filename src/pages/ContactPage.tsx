import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Contact from '../components/Contact';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';

export default function ContactPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const scroll = () => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      };
      // Try immediately, then retry after animations settle
      setTimeout(scroll, 200);
      setTimeout(scroll, 600);
    }
  }, [hash]);

  return (
    <main className="min-h-screen bg-slate-900">
      <SEO
        title="Contact Us | Optimum Prime Solutions — TallyPrime Kenya"
        description="Get in touch with Optimum Prime Solutions. Book a TallyPrime demo or ask about implementation, cloud hosting, KRA eTIMS compliance and training in Nairobi, Ruiru and across Kenya."
        socialDescription="Ready to modernize your business? Contact Optimum Prime Solutions — Kenya's certified TallyPrime partner in Ruiru."
        canonical="/contact"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Contact', item: 'https://www.optimumprimesolutions.co.ke/contact/' },
        ]}
      />
      <AfricanLaptopShowcase
        tag="Get in touch"
        title="Contact one expert who guides your TallyPrime setup"
        description="Reach out with a direct question and get a one-on-one answer that helps you move forward with confidence."
        socialDescription="Ready to modernize your business? Contact Optimum Prime Solutions — Kenya's certified TallyPrime partner in Ruiru."
        features={['Fast demo scheduling', 'Personal support invite', 'TallyPrime implementation help', 'WhatsApp-friendly contact']}
        theme="contact"
      />
      <Contact />
    </main>
  );
}
