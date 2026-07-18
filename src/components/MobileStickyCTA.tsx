import { Link, useLocation } from 'react-router-dom';

export default function MobileStickyCTA() {
  const { pathname } = useLocation();
  // Hidden on pages that already have their own dedicated registration/demo
  // form — showing "Book a Free Demo" alongside a different on-screen CTA
  // (workshop RSVP, webinar signup) is confusing, and on /contact the fixed
  // bar would otherwise sit on top of the form's Submit button once scrolled
  // into view, blocking taps on it.
  if (pathname.startsWith('/contact') || pathname.startsWith('/workshop-rsvp') || pathname.startsWith('/webinar')) return null;

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-sm shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.25)]">
      <div className="flex items-stretch gap-2 px-3 py-2.5">
        <Link
          to="/contact#demo-form"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex-1 inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-red-600/30"
        >
          Book a Free Demo
        </Link>
      </div>
    </div>
  );
}
