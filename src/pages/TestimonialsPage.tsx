import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import Testimonials from '../components/Testimonials';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import ReviewForm from '../components/ReviewForm';

const NAVBAR_HEIGHT = 88; // px — accounts for sticky navbar + a little breathing room

export default function TestimonialsPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === '#review-form') {
      // Wait for page to fully render before scrolling
      const timer = setTimeout(() => {
        const el = document.getElementById('review-form');
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  return (
    <main className="min-h-screen">
      <SEO
        title="Client Reviews & Testimonials | Optimum Prime Solutions"
        description="Read what Kenyan business owners say about Optimum Prime Solutions. Real testimonials from TallyPrime, cloud hosting, and EOS consulting clients across Kenya."
        socialDescription="See what Kenyan businesses say about working with Optimum Prime Solutions — your trusted TallyPrime partner."
        canonical="/testimonials"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Testimonials', item: 'https://www.optimumprimesolutions.co.ke/testimonials/' },
        ]}
      />
      <AfricanLaptopShowcase
        tag="Client stories"
        title="A happy business owner sharing their TallyPrime journey"
        description="Every testimonial is grounded in a single-person experience, showing how our local team helps one owner gain control of finances and inventory."
        socialDescription="See what Kenyan businesses say about working with Optimum Prime Solutions — your trusted TallyPrime partner."
        features={['Real Kenyan success stories', 'Personal support and follow-up', 'Proof of smoother compliance', 'Strong ROI for small teams']}
        theme="testimonials"
      />
      <Testimonials />
      <ReviewForm />
    </main>
  );
}
