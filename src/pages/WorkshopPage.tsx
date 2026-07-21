import { useState } from 'react';
import SEO from '../components/SEO';
import { fbSet } from '../firebase/config';

const WORKSHOP_DATE = 'Friday, 24th July 2026';
const WORKSHOP_TIME = '7:00 AM (EAT)';
const WORKSHOP_VENUE = 'Ndanga Hotel, Ruiru';
const NOTIFIER_URL = 'https://optimum-prime-lead-notifier.onrender.com/new-lead';

interface FormState {
  name: string;
  company: string;
  phone: string;
  email: string;
}

export default function WorkshopPage() {
  const [form, setForm] = useState<FormState>({ name: '', company: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (form.email.trim() && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
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
        `You're registered for our Inventory Management Breakfast Workshop!\n\n` +
        `📅 *Date:* ${WORKSHOP_DATE}\n` +
        `🕒 *Time:* ${WORKSHOP_TIME}\n` +
        `📍 *Venue:* ${WORKSHOP_VENUE}\n\n` +
        `We look forward to seeing you there. Breakfast will be served — please arrive by 6:45 AM.\n\n` +
        `📞 *+254 116 246 074*\n` +
        `🌐 *www.optimumprimesolutions.co.ke*\n\n` +
        `_Optimum Prime Solutions — TallyPrime · Cloud · EOS® · Biz Analyst_`;
      const payload = {
        ...form,
        interest: 'Workshop Registration — Inventory Management Breakfast Workshop',
        source: 'Workshop Registration Page',
        message: `Registered for workshop on ${WORKSHOP_DATE} at ${WORKSHOP_TIME}, ${WORKSHOP_VENUE}`,
        confirmation_message: confirmationMessage,
        createdAt: new Date().toISOString(),
        status: 'registered',
      };
      // Save to Firebase — kept separate from Demo Leads
      await fbSet(`workshop_registrants/${id}`, payload);
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
        title="Inventory Management Breakfast Workshop | Optimum Prime"
        description="Join our free Inventory Management Breakfast Workshop on Fri 24th July 2026 at Ndanga Hotel, 7:00 AM."
        socialDescription="Free breakfast workshop on inventory management — Optimum Prime Solutions, Ndanga Hotel."
        canonical="/workshop-rsvp"
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-teal-500/30">
            Free Breakfast Workshop
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Mastering <span className="text-teal-400">Inventory Management</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join us for a hands-on breakfast workshop on practical inventory management for growing Kenyan businesses. Network, learn, and enjoy breakfast on us.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-teal-400 text-lg">📅</span>
              <span><strong className="text-white">{WORKSHOP_DATE}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-400 text-lg">🕒</span>
              <span><strong className="text-white">{WORKSHOP_TIME}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-400 text-lg">📍</span>
              <span><strong className="text-white">{WORKSHOP_VENUE}</strong></span>
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
              { icon: '🤝', title: 'Networking Breakfast', desc: 'Connect with fellow business owners and our team over breakfast before the session starts.' },
              { icon: '📦', title: 'Stock Control Fundamentals', desc: 'Practical methods to track stock levels, reduce waste, and avoid stockouts.' },
              { icon: '📊', title: 'Reorder Point Planning', desc: 'Set smart reorder points so you never run out — or over-order — again.' },
              { icon: '🧮', title: 'TallyPrime for Inventory', desc: 'See how TallyPrime automates stock valuation, batch tracking, and reporting.' },
              { icon: '🔍', title: 'Audit & Reconciliation Tips', desc: 'Simple habits that keep your books and your shelves in sync.' },
              { icon: '🙋', title: 'Live Q&A', desc: 'Bring your inventory challenges — get answers from our certified experts.' },
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
                We've sent your confirmation to your WhatsApp. We look forward to seeing you on <strong className="text-teal-400">{WORKSHOP_DATE}</strong> at <strong className="text-teal-400">{WORKSHOP_VENUE}</strong>.
              </p>
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Inventory+Management+Breakfast+Workshop&dates=20260724T040000Z/20260724T070000Z&details=Free+breakfast+workshop+by+Optimum+Prime+Solutions&location=${encodeURIComponent(WORKSHOP_VENUE)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
              >
                🗓️ Save the Date on Google Calendar
              </a>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-white mb-1">Reserve Your Seat</h3>
              <p className="text-slate-400 text-sm mb-6">Takes less than a minute. Your confirmation will be sent to your WhatsApp.</p>
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
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email Address (optional)</label>
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
                  {submitting ? 'Registering…' : '✅ Register for Free Workshop'}
                </button>
                <p className="text-slate-500 text-xs text-center">
                  Your confirmation will be sent to your WhatsApp immediately after registration.
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
