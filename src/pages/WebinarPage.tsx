import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { fbSet, fbSubscribe } from '../firebase/config';
import {
  DEFAULT_WEBINAR, parseWebinars, pickActiveWebinar, isRegistrationClosed,
  type WebinarEvent,
} from '../data/webinarEvent';

const NOTIFIER_URL = 'https://optimum-prime-lead-notifier.onrender.com/new-lead';

interface FormState {
  name: string;
  company: string;
  phone: string;
  email: string;
}

export default function WebinarPage() {
  const [form, setForm] = useState<FormState>({ name: '', company: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Active webinar details come from Firebase (admin-editable); fall back to the
  // built-in default so the page still renders before any event is configured.
  const [webinar, setWebinar] = useState<WebinarEvent>(DEFAULT_WEBINAR);
  useEffect(() => {
    const unsub = fbSubscribe('webinars', (raw: Record<string, any> | null) => {
      setWebinar(pickActiveWebinar(parseWebinars(raw)));
    });
    return unsub;
  }, []);

  // Registration auto-closes at the end of the event day (Kenya time).
  const registrationClosed = isRegistrationClosed(webinar);

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationClosed) return; // guard: the event day has passed
    if (!validate()) return;
    setSubmitting(true);
    try {
      const id = `webreg_${Date.now()}`;
      const confirmationMessage =
        `Hello ${form.name}! 🎉\n\n` +
        `You're registered for our ${webinar.title}!\n\n` +
        `📅 *Date:* ${webinar.date}\n` +
        `🕒 *Time:* ${webinar.time}\n` +
        `📍 *Join:* ${webinar.venue}\n\n` +
        `We'll send you a reminder before we go live. See you online!\n\n` +
        `📞 *+254 116 246 074*\n` +
        `🌐 *www.optimumprimesolutions.co.ke*\n\n` +
        `_Optimum Prime Solutions — TallyPrime · Cloud · Biz Analyst_`;
      const payload = {
        ...form,
        eventId: webinar.id,
        interest: `Webinar Registration — ${webinar.title}`,
        source: 'Webinar Registration Page',
        message: `Registered for ${webinar.title} on ${webinar.date} at ${webinar.time}`,
        confirmation_message: confirmationMessage,
        createdAt: new Date().toISOString(),
        status: 'registered',
      };
      // Save to Firebase — kept separate from Demo Leads
      await fbSet(`webinar_registrants/${id}`, payload);
      // Trigger WhatsApp notification (to office + registrant confirmation)
      await fetch(NOTIFIER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900">
      <SEO
        title={`${webinar.title} | Free Webinar — Optimum Prime`}
        description="Join our free online TallyPrime webinar. Learn practical features and best practices live from certified experts, with a Q&A."
        socialDescription="Join our free online webinars on TallyPrime best practices, KRA compliance, and business growth in Kenya."
        canonical="/webinar"
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-teal-500/30">
            Free Online Webinar
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            {webinar.title}
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join our certified TallyPrime experts for a live, practical session built to save you time and keep your business running smoothly — all from the comfort of your desk.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-teal-400 text-lg">📅</span>
              <span><strong className="text-white">{webinar.date}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-400 text-lg">🕒</span>
              <span><strong className="text-white">{webinar.time}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-400 text-lg">📍</span>
              <span><strong className="text-white">{webinar.venue}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-400 text-lg">💰</span>
              <span><strong className="text-white">Free</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Topics + Form */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-start">

        {/* What we'll cover */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">What We'll Cover</h2>
          <ul className="space-y-5">
            {[
              { icon: '🖥️', title: 'Live Product Walkthrough', desc: 'See the features in action on a real TallyPrime setup — not just slides.' },
              { icon: '🧾', title: 'Invoicing & Reporting Tips', desc: 'Professional invoice templates, cleaner reports, and time-saving shortcuts.' },
              { icon: '💾', title: 'Data Safety & Backup', desc: 'Scheduled auto-backup and best practices so you never lose critical data.' },
              { icon: '📊', title: 'Reports That Drive Decisions', desc: 'The everyday reports every business owner should be running.' },
              { icon: '🙋', title: 'Live Q&A', desc: 'Ask our certified TallyPrime experts anything — get answers live.' },
            ].map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="text-2xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-slate-400 text-sm mt-0.5">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Registration Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
          {registrationClosed && !success ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-white mb-2">Registration Closed</h3>
              <p className="text-slate-300 text-sm mb-4">
                Registration for <strong className="text-teal-400">{webinar.title}</strong> ({webinar.date}) has now closed.
                Thank you to everyone who joined!
              </p>
              <p className="text-slate-400 text-sm">
                Want to be first to know about our next webinar? Reach us on WhatsApp at{' '}
                <a href="https://wa.me/254116246074" target="_blank" rel="noopener noreferrer"
                  className="text-teal-400 font-semibold hover:underline">+254 116 246 074</a>.
              </p>
            </div>
          ) : success ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">You're All Set!</h3>
              <p className="text-slate-300 text-sm mb-4">
                We've sent your joining details to your WhatsApp. We look forward to seeing you on <strong className="text-teal-400">{webinar.date}</strong>.
              </p>
              {webinar.calendarStart && webinar.calendarEnd && (
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(webinar.title)}&dates=${webinar.calendarStart}/${webinar.calendarEnd}&details=Free+online+webinar+by+Optimum+Prime+Solutions&location=${encodeURIComponent(webinar.venue)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
                >
                  🗓️ Save the Date on Google Calendar
                </a>
              )}
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-white mb-1">Reserve Your Spot</h3>
              <p className="text-slate-400 text-sm mb-6">Takes less than a minute. Your joining link will be sent to your WhatsApp.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Jane Wanjiru"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Nairobi Traders Ltd"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 0712 345 678"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. jane@company.co.ke"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-60 text-white font-bold py-3 rounded-lg text-sm transition-colors"
                >
                  {submitting ? 'Registering…' : '✅ Register for Free Webinar'}
                </button>
                <p className="text-slate-500 text-xs text-center">
                  Your joining link will be sent to your WhatsApp immediately after registration.
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
