import { useState, type FormEvent } from 'react';
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
  const [form, setForm] = useState<FormData>({
    name: '',
    company: '',
    phone: '',
    email: '',
    businessType: '',
    demoDate: '',
    currentSoftware: '',
    message: '',
  });

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

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
        currentSoftware: form.currentSoftware,
        message: form.message,
        createdAt: lead.createdAt,
        status: 'New',
      });

      update({ ...data, leads: [...data.leads, lead] });
      await sendEmailNotification(form);
      setOk(true);
      setForm({
        name: '',
        company: '',
        phone: '',
        email: '',
        businessType: '',
        demoDate: '',
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

  const sendEmailNotification = async (formData: FormData) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.email,
          subject: 'Demo Request Received - Optimum Prime Solutions',
          html: `
            <h2>Thank you for your demo request!</h2>
            <p>Hi ${formData.name},</p>
            <p>We've received your request for a Tally Prime demo. Our team will contact you within 24 hours.</p>
            <ul>
              <li>Company: ${formData.company || 'Not provided'}</li>
              <li>Phone: ${formData.phone}</li>
              <li>Preferred Date: ${formData.demoDate || 'Not specified'}</li>
            </ul>
            <p>Best regards,<br/>Optimum Prime Solutions Team</p>
          `,
        }),
      });

      if (!response.ok) {
        console.warn('Email notification failed - form was saved to database');
      }
    } catch (error) {
      console.warn('Could not send email notification:', error);
    }
  };

  const info = [
    { icon: MapPin, title: 'Visit Us', lines: [c.location] },
    { icon: Phone, title: 'Call Us', lines: c.phones },
    { icon: Mail, title: 'Email Us', lines: c.emails },
    { icon: Clock, title: 'Hours', lines: c.workingHours },
  ];

  return (
    <section id="contact" className="relative overflow-hidden bg-slate-50 py-24">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-200/40 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2 space-y-6 overflow-hidden rounded-[2rem] bg-white border border-slate-200 p-8 shadow-xl text-slate-950">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
                Contact
              </span>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Request a demo with the team that helps businesses grow faster.
                </h2>
                <p className="mt-4 text-base text-slate-600">
                  Complete the form and a specialist will contact you with a custom TallyPrime plan for your organization.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {info.map(({ icon: Icon, title, lines }) => (
                <div key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-slate-950">
                    <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-sky-100 text-sky-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{title}</p>
                      {lines.map((line) => (
                        <p key={line} className="mt-1 text-sm text-slate-600">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={`https://wa.me/${c.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-[#25D366]/30 transition hover:bg-[#1DA851]"
            >
              <WhatsAppIcon className="h-4 w-4 text-white" /> Chat on WhatsApp
            </a>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl text-slate-950">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Demo request</p>
                  <h3 className="mt-3 text-2xl font-bold text-slate-950">Let's build your next TallyPrime solution.</h3>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                  {isOnline ? 'Online' : 'Offline'}
                </div>
              </div>

              {serverError && (
                <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              {ok ? (
                <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-10 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-sky-500" />
                  <h4 className="mt-4 text-xl font-semibold text-slate-950">Request submitted</h4>
                  <p className="mt-2 text-sm text-slate-600">Our team will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-8 grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { k: 'name', l: 'Full name *', t: 'text', p: 'John Doe' },
                      { k: 'company', l: 'Company name', t: 'text', p: 'Your company' },
                      { k: 'phone', l: 'Phone *', t: 'tel', p: '+254 700 000000' },
                      { k: 'email', l: 'Email *', t: 'email', p: 'john@company.ke' },
                      { k: 'businessType', l: 'Business type', t: 'text', p: 'Retail / Manufacturing' },
                      { k: 'demoDate', l: 'Preferred date', t: 'date', p: '' },
                      { k: 'currentSoftware', l: 'Current software', t: 'text', p: 'QuickBooks, Excel' },
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
                            required={field.l.includes('*')}
                            className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition ${
                              error ? 'border-red-500/70 bg-slate-50 text-slate-950 placeholder:text-red-400' : 'border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-500'
                            }`}
                          />
                          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
                        </label>
                      );
                    })}
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
                        getFieldError(errors, 'message') ? 'border-red-500/70 bg-slate-50 text-slate-950 placeholder:text-red-400' : 'border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-500'
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
