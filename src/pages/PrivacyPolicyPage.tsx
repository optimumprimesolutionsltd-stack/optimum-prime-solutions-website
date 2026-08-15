import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { useSite } from '../context/SiteContext';

export default function PrivacyPolicyPage() {
  const { data } = useSite();
  const email = data.contact.emails[0] || 'info@optimumprimesolutions.co.ke';
  const phone = data.contact.phones[0] || '+254 116 246 074';

  return (
    <main className="min-h-screen bg-white">
      <SEO
        title="Privacy Policy | Optimum Prime Solutions"
        description="How Optimum Prime Solutions collects, uses, and protects your personal data across our website, WhatsApp communications, and services."
        canonical="/privacy-policy"
        breadcrumbs={[
          { name: 'Home', item: 'https://www.optimumprimesolutions.co.ke/' },
          { name: 'Privacy Policy', item: 'https://www.optimumprimesolutions.co.ke/privacy-policy/' },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumb className="mb-8" />

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: 14 July 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <p>
              Optimum Prime Solutions Ltd ("we", "us", "our") is Kenya's Certified TallyPrime Partner,
              also providing cloud hosting, and business analytics services. This
              policy explains what personal information we collect, how we use it, and the choices you
              have.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">Information We Collect</h2>
            <p>When you use our website or contact us, we may collect:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Name, company name, and business type</li>
              <li>Phone number and WhatsApp number</li>
              <li>Email address</li>
              <li>Details of your enquiry, demo preferences, or messages you send us</li>
              <li>Website reviews or testimonials you choose to submit</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>To respond to demo requests, consultations, and general enquiries</li>
              <li>To send booking confirmations and reminders via WhatsApp, email, or phone</li>
              <li>To notify our team internally so we can follow up with you promptly</li>
              <li>To send newsletter updates, if you subscribe (you can unsubscribe anytime)</li>
              <li>To improve our website, products, and customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">WhatsApp Communications</h2>
            <p>
              We use the WhatsApp Business Platform (provided by Meta) to send you demo confirmations,
              reminders, and replies to enquiries you submit. Messages sent through WhatsApp are subject
              to WhatsApp's own privacy policy in addition to this one. You can stop receiving messages
              from us at any time by telling us directly on WhatsApp or by contacting us using the
              details below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">How We Store Your Data</h2>
            <p>
              Your information is stored securely using Firebase (Google Cloud infrastructure). We use
              third-party services to help deliver our services, including Google Meet and Google
              Calendar (for scheduling demos), and Resend (for transactional email). These providers
              only receive the information necessary to perform their function.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">Data Sharing</h2>
            <p>
              We do not sell your personal information. We only share it with the service providers
              listed above, as needed to operate our business, or where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">Your Rights</h2>
            <p>
              You can ask us to access, correct, or delete the personal information we hold about you at
              any time by contacting us using the details below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or how we handle your data, contact
              us at{' '}
              <a href={`mailto:${email}`} className="text-red-600 hover:underline">{email}</a>{' '}
              or {phone}.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
