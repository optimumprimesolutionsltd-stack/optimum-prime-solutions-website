import Products from '../components/Products';
import AfricanLaptopShowcase from '../components/AfricanLaptopShowcase';

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <AfricanLaptopShowcase
        tag="Product packages"
        title="Choose the right Tally Prime edition for your business"
        description="One business owner with a laptop can see everything clearly with the right product plan—Silver, Gold, Plus and Enterprise packages built for real operations."
        features={['Clear pricing for one-user workflows', 'Add-on support and remote access', 'Ideal for single-person accounting', 'Scales when you grow']}
        theme="products"
      />
      <Products />
    </div>
  );
}
