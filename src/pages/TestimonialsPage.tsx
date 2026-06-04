import Testimonials from '../components/Testimonials';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen">
      <AfricanLaptopShowcase
        tag="Client stories"
        title="A happy business owner sharing their Tally Prime journey"
        description="Every testimonial is grounded in a single-person experience, showing how our local team helps one owner gain control of finances and inventory."
        features={['Real Kenyan success stories', 'Personal support and follow-up', 'Proof of smoother compliance', 'Strong ROI for small teams']}
        theme="testimonials"
      />
      <Testimonials />
    </div>
  );
}
