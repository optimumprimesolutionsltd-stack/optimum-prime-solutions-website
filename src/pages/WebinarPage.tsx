import { useState } from 'react';
import SEO from '../components/SEO';
import { fbSet } from '../firebase/config';

const WEBINAR_DATE = 'Wednesday, 15th July 2026';
const WEBINAR_TIME = '3:00 PM – 4:00 PM (EAT)';
const WEBINAR_MEET_LINK = 'https://meet.google.com/ded-fdcf-aac';
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
    if (!validate()) return;
    setSubmitting(true);
    try {
      const id = `reg_${Date.now()}`;
      const confirmationMessage =
        `Hello ${form.name}! 🎉\n\n` +
        `You're registered for our free TallyPrime 7.1 webinar!\n\n` +
        `📅 *Date:* ${WEBINAR_DATE}\n` +
        `🕒 *Time:* ${WEBINAR_TIME}\n` +
        `📍 *Venue:* Online via Google Meet\n\n` +
        `*What We'll Cover:*\n` +
        `✅ Auto Wrap Text\n` +
        `✅ Professional Invoice Print Templates\n` +
        `✅ Scheduled Auto Backup\n` +
        `✅ Reuse Deleted Voucher Numbers\n` +
        `✅ Live Q&A\n\n` +
        `📹 *Google Meet Join Link:*\n` +
        `${WEBINAR_MEET_LINK}\n` +
        `_(Click to join at 3:00 PM EAT on 15th July)_\n\n` +
        `📞 *+254 116 246 074*\n` +
        `🌐 *www.optimumprimesolutions.co.ke*\n\n` +
        `_Optimum Prime Solutions — TallyPrime · Cloud · EOS® · Biz Analyst_`;
      const payload = {
        ...form,
        interest: 'Webinar Registration — TallyPrime 7.1',
        source: 'Webinar Registration Page',
        message: `Registered for webinar on ${WEBINAR_DATE} at ${WEBINAR_TIME}`,
        confirmation_message: confirmationMessage,
        createdAt: new Date().toISOString(),
        status: 'registered',
      };
      // Save to Firebase
      await fbSet(`webinar_registrants/${id}`, payload);
      // Trigger WhatsApp notification
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
        title="Free Webinar — What's New in TallyPrime 7.1 | Optimum Prime Solutions"
        description="Join our free webinar on Wednesday 15th July 2026 and discover the powerful new features in TallyPrime 7.1 — Auto Wrap Text, Invoice Templates, Scheduled Backup & more."
        socialDescription="Join our free webinars on TallyPrime best practices, KRA compliance, and business growth in Kenya."
        canonical="/webinar"
/>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-teal-500/30">
            Free Webinar
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            What's New in <span className="text-teal-400">TallyPrime 7.1</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join our certified TallyPrime experts for a live walkthrough of the most powerful features in TallyPrime 7.1 — built to save you time and keep your business running smoothly.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-teal-400 text-lg">📅</span>
              <span><strong className="text-white">{WEBINAR_DATE}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-400 text-lg">🕒</span>
              <span><strong className="text-white">{WEBINAR_TIME}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-400 text-lg">📍</span>
              <span><strong className="text-white">Online via Google Meet</strong></span>
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
              { icon: '📝', title: 'Auto Wrap Text', desc: 'Long descriptions, narrations & names now display fully — no more truncation in reports and vouchers.' },
              { icon: '🖨️', title: 'Professional Invoice Print Templates', desc: '8 ready-to-use, fully customisable invoice templates with your logo and branding.' },
              { icon: '💾', title: 'Scheduled Auto Backup', desc: 'Set it once and your company data backs up automatically — never lose critical information again.' },
              { icon: '🔢', title: 'Reuse Deleted Voucher Numbers', desc: 'Keep your numbering sequence clean and continuous by reusing deleted voucher numbers.' },
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
          {success ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">You're All Set!</h3>
              <p className="text-slate-300 text-sm mb-4">
                We've sent the Google Meet join link to your WhatsApp. We look forward to seeing you on <strong className="text-teal-400">{WEBINAR_DATE}</strong>.
              </p>
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=TallyPrime+7.1+Webinar&dates=20260715T120000Z/20260715T130000Z&details=Free+webinar+by+Optimum+Prime+Solutions&location=Google+Meet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
              >
                🗓️ Save the Date on Google Calendar
              </a>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-white mb-1">Reserve Your Spot</h3>
              <p className="text-slate-400 text-sm mb-6">Takes less than a minute. Your Google Meet link will be sent to your WhatsApp.</p>
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
                  Your Google Meet link will be sent to your WhatsApp immediately after registration.
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
