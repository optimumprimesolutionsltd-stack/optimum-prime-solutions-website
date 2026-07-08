import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { useSite } from '../context/SiteContext';
import { useOnlineStatus } from './OfflineBanner';
import { validateForm, getFieldError, type FormData, type ValidationError } from '../utils/validation';
import { fbSet } from '../firebase/config';
import type { Lead } from '../data/siteData';

export default function Contact() {
  const { data, update } = useSite();
  const c = data.contact;
  const isOnline = useOnlineStatus();
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [searchParams] = useSearchParams();
  const [requestType, setRequestType] = useState<'demo' | 'consultation'>(
    searchParams.get('type') === 'consultation' ? 'consultation' : 'demo'
  );

  useEffect(() => {
    if (searchParams.get('type') === 'consultation') {
      setRequestType('consultation');
    }
  }, [searchParams]);
  const [form, setForm] = useState<FormData>({
    name: '',
    company: '',
    phone: '',
    email: '',
    businessType: '',
    demoDate: '',
    demoTime: '',
    currentSoftware: '',
    message: '',
  });

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  // Kenya public holidays (YYYY-MM-DD)
  const KENYA_HOLIDAYS = new Set([
    // 2026
    '2026-01-01', // New Year's Day
    '2026-04-03', // Good Friday
    '2026-04-06', // Easter Monday
    '2026-05-01', // Labour Day
    '2026-06-01', // Madaraka Day
    '2026-10-10', // Huduma Day
    '2026-10-20', // Mashujaa Day
    '2026-12-12', // Jamhuri Day
    '2026-12-25', // Christmas Day
    '2026-12-26', // Boxing Day
    // 2027
    '2027-01-01',
    '2027-03-26', // Good Friday
    '2027-03-29', // Easter Monday
    '2027-05-01',
    '2027-06-01',
    '2027-10-10',
    '2027-10-20',
    '2027-12-12',
    '2027-12-25',
    '2027-12-26',
  ]);

  const isBlockedDate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.getDay(); // 0=Sun, 6=Sat
    if (day === 0) return true; // Block all Sundays
    if (KENYA_HOLIDAYS.has(dateStr)) return true; // Block holidays
    return false;
  };

  const isSaturday = (dateStr: string): boolean => {
    if (!dateStr) return false;
    return new Date(dateStr + 'T00:00:00').getDay() === 6;
  };

  // Time slots — full week vs Saturday (2PM onwards only)
  const ALL_TIME_SLOTS = [
    '8:00 AM – 9:00 AM',
    '9:00 AM – 10:00 AM',
    '10:00 AM – 11:00 AM',
    '11:00 AM – 12:00 PM',
    '12:00 PM – 1:00 PM',
    '2:00 PM – 3:00 PM',
    '3:00 PM – 4:00 PM',
    '4:00 PM – 5:00 PM',
  ];
  const SATURDAY_TIME_SLOTS = [
    '2:00 PM – 3:00 PM',
    '3:00 PM – 4:00 PM',
    '4:00 PM – 5:00 PM',
  ];
  const availableTimeSlots = isSaturday(form.demoDate) ? SATURDAY_TIME_SLOTS : ALL_TIME_SLOTS;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setServerError(null);

    const validation = validateForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (!isOnline) {
      setServerError('You are offline. Please check your internet connection before submitting.');
      return;
    }

    setLoading(true);

    try {
      const lead: Lead = {
        ...form,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'New',
      };

      await fbSet(`leads/${lead.id}`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        businessType: form.businessType,
        demoDate: form.demoDate,
        demoTime: form.demoTime,
        currentSoftware: form.currentSoftware,
        message: form.message,
        createdAt: lead.createdAt,
        status: 'New',
        requestType,
      });

      update({ ...data, leads: [...data.leads, lead] });
      await sendEmailNotification(form, requestType);
      setOk(true);
      setRequestType('demo');
      setForm({
        name: '',
        company: '',
        phone: '',
        email: '',
        businessType: '',
        demoDate: '',
        demoTime: '',
        currentSoftware: '',
        message: '',
      });
      setTimeout(() => setOk(false), 5000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit form. Please try again.';
      setServerError(message);
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmailNotification = async (formData: FormData, reqType: 'demo' | 'consultation' = 'demo') => {
    try {
      const response = await fetch('https://optimum-prime-lead-notifier.onrender.com/new-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          phone: formData.phone,
          email: formData.email,
          businessType: formData.businessType,
          currentSoftware: formData.currentSoftware,
          demoDate: formData.demoDate,
          demoTime: formData.demoTime,
          message: formData.message,
          interest: reqType === 'consultation' ? 'EOS® Business Consultation' : 'TallyPrime Demo',
          requestType: reqType,
          source: 'Website — Contact Form',
        }),
      });

      if (!response.ok) {
        console.warn('WhatsApp notification failed — lead was saved to database');
      }
    } catch (error) {
      console.warn('Could not send WhatsApp notification:', error);
    }
  };

  const info = [
    { icon: MapPin, title: 'Visit Us', lines: [c.location] },
    { icon: Phone, title: 'Call Us', lines: c.phones },
    { icon: Mail, title: 'Email Us', lines: c.emails },
    { icon: Clock, title: 'Hours', lines: c.workingHours },
  ];

  const facebookLink = "https://www.facebook.com/profile.php?id=100041376170510";

  return (
    <section id="contact" className="relative overflow-hidden bg-slate-900 py-24">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-500/5 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2 space-y-6 overflow-hidden rounded-[2rem] bg-slate-800 border border-white/10 p-8 shadow-xl text-white">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                Contact
              </span>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Request a demo with the team that helps businesses grow faster.
                </h2>
                <p className="mt-4 text-base text-slate-400">
                  Complete the form and a specialist will contact you with a custom TallyPrime plan for your organization.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {info.map(({ icon: Icon, title, lines }) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-sky-100 text-sky-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      {lines.map((line) => (
                        <p key={line} className="mt-1 text-sm text-slate-400">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4">
              <a
                href={`https://wa.me/${c.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-[#25D366]/30 transition hover:bg-[#1DA851]"
              >
                <WhatsAppIcon className="h-4 w-4 text-white" /> Chat on WhatsApp
              </a>
              <a
                href={facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#1877F2] px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-[#1877F2]/30 transition hover:bg-[#166fe5]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Follow us on Facebook
              </a>
            </div>
          </div>

          <div id="demo-form" className="lg:col-span-3">
            <div className="rounded-[2rem] border border-white/10 bg-slate-800 p-8 shadow-xl text-white">
              {/* Request type toggle */}
              <div className="mb-6 flex rounded-2xl border border-white/10 bg-slate-900 p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setRequestType('demo')}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold transition"
                  style={requestType === 'demo' ? { backgroundColor: '#e53e3e', color: '#fff' } : { backgroundColor: 'transparent', color: '#94a3b8' }}
                >
                  📊 Book a Demo
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('consultation')}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold transition"
                  style={requestType === 'consultation' ? { backgroundColor: '#8b5cf6', color: '#fff' } : { backgroundColor: 'transparent', color: '#94a3b8' }}
                >
                  🤝 Book a Consultation
                </button>
              </div>

              <div className="mb-6 rounded-2xl bg-sky-600/20 border border-sky-500/30 px-6 py-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-3 w-3 rounded-full bg-sky-400 animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Step 1 — Fill in your details below</p>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {requestType === 'consultation' ? 'Book a free EOS® Business Consultation' : 'Book your free TallyPrime demo'}
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  {requestType === 'consultation'
                    ? 'Complete the form and our EOS® consultant will confirm your session within 24 hours.'
                    : 'Complete the form and our team will confirm your demo within 24 hours.'}
                </p>
              </div>

              {serverError && (
                <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              {ok ? (
                <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-slate-900 p-10 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-sky-500" />
                  <h4 className="mt-4 text-xl font-semibold text-white">Request submitted</h4>
                  <p className="mt-2 text-sm text-slate-400">Our team will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-8 grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Full name */}
                    {[{ k: 'name', l: 'Full name *', t: 'text', p: 'John Doe' },
                      { k: 'company', l: 'Company name *', t: 'text', p: 'Your company' },
                      { k: 'phone', l: 'Phone *', t: 'tel', p: '+254 700 000000' },
                      { k: 'email', l: 'Email *', t: 'email', p: 'john@company.ke' },
                    ].map((field) => {
                      const error = getFieldError(errors, field.k);
                      return (
                        <label key={field.k} className="block text-sm text-slate-200">
                          <span className="block mb-2 font-semibold text-slate-100">{field.l}</span>
                          <input
                            type={field.t}
                            value={(form as Record<string, string>)[field.k]}
                            onChange={(e) => set(field.k, e.target.value)}
                            placeholder={field.p}
                            required
                            className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition ${
                              error ? 'border-red-500/70 bg-slate-900 text-white placeholder:text-red-400' : 'border-white/10 bg-slate-900 text-white placeholder:text-slate-400'
                            }`}
                          />
                          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
                        </label>
                      );
                    })}

                    {/* Business type dropdown */}
                    <label className="block text-sm text-slate-200">
                      <span className="block mb-2 font-semibold text-slate-100">Business type *</span>
                      <select
                        value={form.businessType}
                        onChange={(e) => set('businessType', e.target.value)}
                        required
                        className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition appearance-none ${
                          getFieldError(errors, 'businessType') ? 'border-red-500/70 bg-slate-900 text-white' : 'border-white/10 bg-slate-900 text-white'
                        } ${!form.businessType ? 'text-slate-400' : 'text-white'}`}
                      >
                        <option value="" disabled>Select business type</option>
                        <option value="Retail">Retail</option>
                        <option value="Wholesale / Distribution">Wholesale / Distribution</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Construction">Construction</option>
                        <option value="Hardware">Hardware</option>
                        <option value="School / Education">School / Education</option>
                        <option value="NGO / Non-profit">NGO / Non-profit</option>
                        <option value="SACCO / Microfinance">SACCO / Microfinance</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Other">Other</option>
                      </select>
                      {getFieldError(errors, 'businessType') && <p className="mt-2 text-xs text-red-400">{getFieldError(errors, 'businessType')}</p>}
                    </label>

                    {/* Current software dropdown */}
                    <label className="block text-sm text-slate-200">
                      <span className="block mb-2 font-semibold text-slate-100">Current software *</span>
                      <select
                        value={form.currentSoftware}
                        onChange={(e) => set('currentSoftware', e.target.value)}
                        required
                        className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition appearance-none ${
                          getFieldError(errors, 'currentSoftware') ? 'border-red-500/70 bg-slate-900 text-white' : 'border-white/10 bg-slate-900 text-white'
                        } ${!form.currentSoftware ? 'text-slate-400' : 'text-white'}`}
                      >
                        <option value="" disabled>Select current software</option>
                        <option value="QuickBooks">QuickBooks</option>
                        <option value="Sage">Sage</option>
                        <option value="Pastel">Pastel</option>
                        <option value="Excel / Manual">Excel / Manual</option>
                        <option value="TallyPrime (older version)">TallyPrime (older version)</option>
                        <option value="Tally ERP 9">Tally ERP 9</option>
                        <option value="Odoo">Odoo</option>
                        <option value="SAP">SAP</option>
                        <option value="None">None — starting fresh</option>
                        <option value="Other">Other</option>
                      </select>
                      {getFieldError(errors, 'currentSoftware') && <p className="mt-2 text-xs text-red-400">{getFieldError(errors, 'currentSoftware')}</p>}
                    </label>

                    {/* Preferred date */}
                    <label className="block text-sm text-slate-200">
                      <span className="block mb-2 font-semibold text-slate-100">Preferred date *</span>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-accent">
                          📅
                        </span>
                        <input
                          type="date"
                          value={form.demoDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (isBlockedDate(val)) {
                              setErrors((prev) => [
                                ...prev.filter((err) => err.field !== 'demoDate'),
                                { field: 'demoDate', message: 'We are closed on Sundays and public holidays. Please choose another date.' },
                              ]);
                              set('demoDate', val);
                            } else {
                              setErrors((prev) => prev.filter((err) => err.field !== 'demoDate'));
                              if (isSaturday(val) && form.demoTime && !SATURDAY_TIME_SLOTS.includes(form.demoTime)) {
                                setForm((prev) => ({ ...prev, demoDate: val, demoTime: '' }));
                              } else {
                                set('demoDate', val);
                              }
                            }
                          }}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full rounded-3xl border pl-10 pr-4 py-3 text-sm outline-none transition ${
                            getFieldError(errors, 'demoDate') ? 'border-red-500/70 bg-slate-900 text-white' : 'border-white/10 bg-slate-900 text-white'
                          }`}
                        />
                      </div>
                      {getFieldError(errors, 'demoDate') && <p className="mt-2 text-xs text-red-400">{getFieldError(errors, 'demoDate')}</p>}
                      {form.demoDate && isSaturday(form.demoDate) && !isBlockedDate(form.demoDate) && (
                        <p className="mt-1 text-xs text-amber-400">Saturday — demo slots available from 2:00 PM only.</p>
                      )}
                    </label>

                    {/* Preferred time */}
                    <label className="block text-sm text-slate-200">
                      <span className="block mb-2 font-semibold text-slate-100">Preferred time *</span>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-accent">
                          ⏰
                        </span>
                        <select
                          value={form.demoTime}
                          onChange={(e) => set('demoTime', e.target.value)}
                          required
                          className={`w-full rounded-3xl border pl-10 pr-4 py-3 text-sm outline-none transition appearance-none ${
                            getFieldError(errors, 'demoTime') ? 'border-red-500/70 bg-slate-900 text-white' : 'border-white/10 bg-slate-900 text-white'
                          } ${!form.demoTime ? 'text-slate-400' : 'text-white'}`}
                        >
                          <option value="" disabled>
                            {form.demoDate ? 'Select preferred time' : 'Select a date first'}
                          </option>
                          {availableTimeSlots.map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                      {getFieldError(errors, 'demoTime') && <p className="mt-2 text-xs text-red-400">{getFieldError(errors, 'demoTime')}</p>}
                    </label>
                  </div>

                  <label className="block text-sm text-slate-200">
                    <span className="block mb-2 font-semibold text-slate-100">Message</span>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      rows={4}
                      placeholder="Tell us about your needs... (optional)"
                      className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition ${
                        getFieldError(errors, 'message') ? 'border-red-500/70 bg-slate-900 text-white placeholder:text-red-400' : 'border-white/10 bg-slate-900 text-white placeholder:text-slate-400'
                      }`}
                    />
                    {getFieldError(errors, 'message') && <p className="mt-2 text-xs text-red-400">{getFieldError(errors, 'message')}</p>}
                  </label>

                  <button
                    type="submit"
                    disabled={loading || !isOnline}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Request
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
