import Blog from '../components/Blog';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';
import SEO from '../components/SEO';

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <SEO
        title="Blog | TallyPrime & KRA Compliance Tips | Optimum Prime"
        description="Practical guides and expert insights on TallyPrime, KRA compliance, eTIMS, cloud hosting, inventory and payroll for Kenyan business owners."
        socialDescription="Stay informed with the latest insights on TallyPrime, KRA eTIMS compliance, and business automation in Kenya."
        canonical="/blog"
breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Blog', item: 'https://www.optimumprimesolutions.co.ke/blog/' },
        ]}
      />
      <AfricanLaptopShowcase
        tag="Insights & Articles"
        title="TallyPrime, eTIMS & Cloud Hosting Insights for Kenyan Businesses"
        description="Practical guides, case studies and expert insights on TallyPrime implementation, KRA compliance, inventory, cloud hosting and business reporting for Kenyan owners."
        socialDescription="Stay informed with the latest insights on TallyPrime, KRA eTIMS compliance, and business automation in Kenya."
        features={['TallyPrime tips & tutorials', 'Inventory & reporting guidance', 'Cloud hosting & remote access advice', 'KRA compliance & eTIMS updates']}
        theme="blog"
      />
      <Blog />
    </main>
  );
}
