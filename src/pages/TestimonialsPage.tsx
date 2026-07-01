import SEO from '../components/SEO';
import Testimonials from '../components/Testimonials';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Client Reviews & Testimonials | Optimum Prime Solutions"
        description="Read what Kenyan business owners say about Optimum Prime Solutions. Real testimonials from TallyPrime, cloud hosting, and EOS® consulting clients across Kenya."
        canonical="/testimonials"
        keywords="TallyPrime reviews Kenya, Optimum Prime Solutions testimonials, TallyPrime client stories, accounting software reviews Kenya"
      />
      <AfricanLaptopShowcase
        tag="Client stories"
        title="A happy business owner sharing their TallyPrime journey"
        description="Every testimonial is grounded in a single-person experience, showing how our local team helps one owner gain control of finances and inventory."
        features={['Real Kenyan success stories', 'Personal support and follow-up', 'Proof of smoother compliance', 'Strong ROI for small teams']}
        theme="testimonials"
      />
      <Testimonials />
    </div>
  );
}
