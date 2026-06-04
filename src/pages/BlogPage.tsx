import Blog from '../components/Blog';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AfricanLaptopShowcase
        tag="Insights & articles"
        title="One laptop, one story: practical insights for business owners"
        description="Our blog brings fresh, single-user perspectives on finance, operations, and Tally Prime best practices for Kenyan enterprises."
        features={['Actionable business advice', 'Accounting tips and case studies', 'Tech guidance for laptop users', 'Local market insights']}
        theme="blog"
      />
      <Blog />
    </div>
  );
}
