import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';

export default function ConsultingPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Business Consulting Services"
        description="Optimum Prime Solutions offers TallyPrime implementation and business solutions for Kenyan businesses."
        canonical="/tallyprime/consulting"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6 [&_a]:text-slate-400 [&_a:hover]:text-red-400 [&_span]:text-slate-300" />
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Business Solutions
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              We are Kenya's certified TallyPrime partner, focused on helping businesses streamline their operations through TallyPrime implementation, cloud hosting, and comprehensive business automation solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact#demo-form"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Book a Free Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/tallyprime"
                className="inline-flex items-center gap-2 rounded-full bg-slate-700 hover:bg-slate-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition"
              >
                Explore TallyPrime Solutions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Core Services</h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✓</span>
                  <span><strong>TallyPrime Implementation</strong> - Installation, configuration, and training for Silver, Gold, and Enterprise editions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✓</span>
                  <span><strong>Cloud Hosting</strong> - Secure remote access and automated backups from KES 3,000/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✓</span>
                  <span><strong>KRA Compliance</strong> - Full eTIMS integration and VAT compliance setup</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✓</span>
                  <span><strong>Payroll Processing</strong> - Automated payroll with PAYE, NHIF, NSSF, and Housing Levy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✓</span>
                  <span><strong>Support & Training</strong> - Business-hours remote support with under 1-hour response time</span>
                </li>
              </ul>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ready to Get Started?</h3>
              <p className="text-slate-600 mb-6">
                Contact our team today to discuss which TallyPrime solution is right for your business.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact#demo-form" className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-sm font-semibold">
                  Book Free Demo <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/tallyprime" className="inline-flex items-center gap-2 rounded-full border border-slate-300 hover:border-red-400 text-slate-700 hover:text-red-600 px-6 py-3 text-sm font-semibold">
                  Explore All Services <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
