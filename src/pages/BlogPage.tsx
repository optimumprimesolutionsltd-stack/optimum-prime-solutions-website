import Blog from '../components/Blog';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AfricanLaptopShowcase
        tag="Insights & Articles"
        title="TallyPrime, Cloud Hosting & EOS® Insights for Kenyan Businesses"
        description="Practical guides, case studies, and expert insights on TallyPrime implementation, KRA compliance, cloud hosting, and the Entrepreneurial Operating System (EOS®) — all tailored for Kenyan business owners."
        features={['TallyPrime tips & tutorials', 'EOS® business operating system guides', 'Cloud hosting & remote access advice', 'KRA compliance & eTIMS updates']}
        theme="blog"
      />
      <Blog />
    </div>
  );
}
