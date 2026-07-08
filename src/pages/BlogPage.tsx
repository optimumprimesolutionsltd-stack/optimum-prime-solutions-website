import Blog from '../components/Blog';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <SEO
        title="Blog | TallyPrime, KRA Compliance & Business Tips for Kenya"
        description="Practical guides, case studies, and expert insights on TallyPrime implementation, KRA compliance, eTIMS, cloud hosting, payroll, and EOS® — tailored for Kenyan business owners."
        socialDescription="Stay informed with the latest insights on TallyPrime, KRA eTIMS compliance, and business automation in Kenya."
        canonical="/blog"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Blog', item: 'https://www.optimumprimesolutions.co.ke/blog/' },
        ]}
      />
      <AfricanLaptopShowcase
        tag="Insights & Articles"
        title="TallyPrime, Cloud Hosting & EOS® Insights for Kenyan Businesses"
        description="Practical guides, case studies, and expert insights on TallyPrime implementation, KRA compliance, cloud hosting, and the Entrepreneurial Operating System (EOS®) — all tailored for Kenyan business owners."
        socialDescription="Stay informed with the latest insights on TallyPrime, KRA eTIMS compliance, and business automation in Kenya."
        features={['TallyPrime tips & tutorials', 'EOS® business operating system guides', 'Cloud hosting & remote access advice', 'KRA compliance & eTIMS updates']}
        theme="blog"
      />
      <Blog />
    </main>
  );
}
