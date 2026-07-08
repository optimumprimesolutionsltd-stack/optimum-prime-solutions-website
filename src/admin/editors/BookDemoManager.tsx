import { useState } from 'react';
import { CalendarDays, User, Phone, Mail, Building2, Send, CheckCircle2, Plus, Loader2 } from 'lucide-react';

const INDUSTRIES = [
  'Manufacturing', 'Distribution & Wholesale', 'Retail', 'Construction',
  'Hardware & Building Materials', 'NGO / Non-Profit', 'School / Education',
  'SACCO / Cooperative', 'Professional Services', 'Other',
];

const BACKEND_URL = 'https://optimum-prime-lead-notifier.onrender.com';

interface BookingForm {
  // Client details
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientCompany: string;
  clientIndustry: string;
  // Demo details
  demoType: 'online' | 'physical';
  demoDate: string;
  demoTime: string;
  demoLocation: string;
  demoNotes: string;
  // Team member details
  teamMemberName: string;
  teamMemberPhone: string;
  // Optional second team member
  teamMember2Name: string;
  teamMember2Phone: string;
  // Notification preferences
  notifyClient: boolean;
  notifyClientEmail: boolean;
}

const emptyForm: BookingForm = {
  clientName: '', clientPhone: '', clientEmail: '', clientCompany: '', clientIndustry: '',
  demoType: 'online', demoDate: '', demoTime: '', demoLocation: '', demoNotes: '',
  teamMemberName: '', teamMemberPhone: '',
  teamMember2Name: '', teamMember2Phone: '',
  notifyClient: true, notifyClientEmail: false,
};

interface BookedDemo {
  id: string;
  clientName: string;
  clientCompany: string;
  clientPhone: string;
  clientEmail: string;
  clientIndustry: string;
  demoType: 'online' | 'physical';
  demoDate: string;
  demoTime: string;
  demoLocation: string;
  demoNotes: string;
  teamMemberName: string;
  teamMemberPhone: string;
  teamMember2Name: string;
  teamMember2Phone: string;
  bookedAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function BookDemoManager() {
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [demos, setDemos] = useState<BookedDemo[]>([]);
  const [view, setView] = useState<'book' | 'list'>('book');

  const set = (field: keyof BookingForm, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    if (!form.clientName.trim()) return 'Client name is required';
    if (!form.clientPhone.trim()) return 'Client phone number is required';
    if (!form.clientCompany.trim()) return 'Client company is required';
    if (!form.clientIndustry) return 'Please select an industry';
    if (!form.demoDate) return 'Demo date is required';
    if (!form.demoTime) return 'Demo time is required';
    if (form.demoType === 'physical' && !form.demoLocation.trim()) return 'Location / address is required for physical demos';
    if (!form.teamMemberName.trim()) return 'Your name is required';
    if (!form.teamMemberPhone.trim()) return 'Your phone number is required';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${BACKEND_URL}/book-demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Server error');

      // Save to local list
      const newDemo: BookedDemo = {
        id: Date.now().toString(),
        ...form,
        bookedAt: new Date().toISOString(),
        status: 'scheduled',
      };
      setDemos(prev => [newDemo, ...prev]);
      setSuccess(true);
      setForm(emptyForm);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError('Failed to send notifications. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = (id: string, status: BookedDemo['status']) => {
    setDemos(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const statusColor = (s: BookedDemo['status']) => {
    if (s === 'scheduled') return 'bg-blue-100 text-blue-700';
    if (s === 'completed') return 'bg-green-100 text-green-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Book a Client Demo</h2>
          <p className="text-sm text-navy-500 mt-0.5">Schedule a TallyPrime demo and notify all parties automatically</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('book')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${view === 'book' ? 'bg-accent text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}
          >
            <Plus className="h-4 w-4 inline mr-1.5" />Book Demo
          </button>
          <button
            onClick={() => setView('list')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${view === 'list' ? 'bg-accent text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}
          >
            <CalendarDays className="h-4 w-4 inline mr-1.5" />Scheduled ({demos.filter(d => d.status === 'scheduled').length})
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 px-5 py-4">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Demo booked successfully!</p>
            <p className="text-xs text-green-600 mt-0.5">WhatsApp notifications sent to the office, team member(s), and client.</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-3 text-sm text-red-700">{error}</div>
      )}

      {view === 'book' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Client Details */}
          <div className="rounded-2xl border border-navy-200 bg-white p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-navy-900">Client Details</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-1.5">Client Name *</label>
              <input
                type="text"
                value={form.clientName}
                onChange={e => set('clientName', e.target.value)}
                placeholder="e.g. John Kamau"
                className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  value={form.clientPhone}
                  onChange={e => set('clientPhone', e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1.5">Email (optional)</label>
                <input
                  type="email"
                  value={form.clientEmail}
                  onChange={e => set('clientEmail', e.target.value)}
                  placeholder="john@company.co.ke"
                  className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-1.5">Company Name *</label>
              <input
                type="text"
                value={form.clientCompany}
                onChange={e => set('clientCompany', e.target.value)}
                placeholder="e.g. Ujenzi Distributors Ltd"
                className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-1.5">Industry *</label>
              <select
                value={form.clientIndustry}
                onChange={e => set('clientIndustry', e.target.value)}
                className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white"
              >
                <option value="">Select industry...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          {/* Demo Details */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-navy-200 bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center">
                  <CalendarDays className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-bold text-navy-900">Demo Schedule</h3>
              </div>

              {/* Demo Type Toggle */}
              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1.5">Demo Type *</label>
                <div className="flex rounded-xl overflow-hidden border border-navy-200">
                  <button
                    type="button"
                    onClick={() => set('demoType', 'online')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition ${
                      form.demoType === 'online'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-navy-600 hover:bg-navy-50'
                    }`}
                  >
                    <span>💻</span> Online (Google Meet)
                  </button>
                  <button
                    type="button"
                    onClick={() => set('demoType', 'physical')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition border-l border-navy-200 ${
                      form.demoType === 'physical'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-navy-600 hover:bg-navy-50'
                    }`}
                  >
                    <span>📍</span> Physical / On-site
                  </button>
                </div>
              </div>

              {/* Location field — only for physical demos */}
              {form.demoType === 'physical' && (
                <div>
                  <label className="block text-xs font-semibold text-navy-600 mb-1.5">Location / Address *</label>
                  <input
                    type="text"
                    value={form.demoLocation}
                    onChange={e => set('demoLocation', e.target.value)}
                    placeholder="e.g. Client's office — Moi Avenue, Nairobi"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-600 mb-1.5">Date *</label>
                  <input
                    type="date"
                    value={form.demoDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => set('demoDate', e.target.value)}
                    className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-600 mb-1.5">Time *</label>
                  <input
                    type="time"
                    value={form.demoTime}
                    onChange={e => set('demoTime', e.target.value)}
                    className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1.5">Notes (optional)</label>
                <textarea
                  value={form.demoNotes}
                  onChange={e => set('demoNotes', e.target.value)}
                  placeholder="e.g. Client is interested in manufacturing module. Met at Ruiru expo."
                  rows={3}
                  className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
                />
              </div>
            </div>

            {/* Team Member */}
            <div className="rounded-2xl border border-navy-200 bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-xl bg-green-50 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-bold text-navy-900">Team Member(s)</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-600 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    value={form.teamMemberName}
                    onChange={e => set('teamMemberName', e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-600 mb-1.5">Your Phone *</label>
                  <input
                    type="tel"
                    value={form.teamMemberPhone}
                    onChange={e => set('teamMemberPhone', e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-600 mb-1.5">2nd Member (optional)</label>
                  <input
                    type="text"
                    value={form.teamMember2Name}
                    onChange={e => set('teamMember2Name', e.target.value)}
                    placeholder="Name"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-600 mb-1.5">2nd Member Phone</label>
                  <input
                    type="tel"
                    value={form.teamMember2Phone}
                    onChange={e => set('teamMember2Phone', e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="rounded-2xl border border-navy-200 bg-white p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center">
                <Send className="h-4 w-4 text-orange-600" />
              </div>
              <h3 className="font-bold text-navy-900">Notifications</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-slate-800">Office (always)</span>
                </div>
                <p className="text-xs text-slate-500">WhatsApp notification sent to both office numbers (+254 116 246 074 and +254 758 449 475)</p>
                <span className="mt-2 inline-block text-xs font-semibold text-green-700 bg-green-100 rounded-full px-2 py-0.5">Always on</span>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-800">Client WhatsApp</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Send a confirmation message to the client's WhatsApp number</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.notifyClient}
                    onChange={e => set('notifyClient', e.target.checked)}
                    className="h-4 w-4 rounded accent-accent"
                  />
                  <span className="text-xs font-medium text-slate-700">Send to client</span>
                </label>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-slate-800">Client Email</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Send a confirmation email to the client (if email provided)</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.notifyClientEmail}
                    onChange={e => set('notifyClientEmail', e.target.checked)}
                    className="h-4 w-4 rounded accent-accent"
                  />
                  <span className="text-xs font-medium text-slate-700">Send email</span>
                </label>
              </div>
            </div>

            {/* Sticky submit bar */}
            <div className="sticky bottom-0 left-0 right-0 z-20 bg-white border-t border-navy-200 px-6 py-4 flex items-center justify-between shadow-lg">
              <p className="text-xs text-navy-500">All required fields must be filled before submitting.</p>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-60 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-accent/20 transition"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending notifications...</>
                ) : (
                  <><Send className="h-4 w-4" /> Book Demo &amp; Notify All</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="rounded-2xl border border-navy-200 bg-white overflow-hidden">
          {demos.length === 0 ? (
            <div className="py-16 text-center">
              <CalendarDays className="h-10 w-10 text-navy-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-navy-500">No demos booked yet</p>
              <p className="text-xs text-navy-400 mt-1">Demos you book will appear here</p>
              <button onClick={() => setView('book')} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent text-white px-5 py-2.5 text-sm font-semibold">
                <Plus className="h-4 w-4" /> Book First Demo
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-navy-50 border-b border-navy-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wide">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wide">Company</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wide">Date & Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wide">Team</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {demos.map(demo => (
                  <tr key={demo.id} className="hover:bg-navy-50/50 transition">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-navy-900">{demo.clientName}</p>
                      <p className="text-xs text-navy-400">{demo.clientPhone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-navy-700">{demo.clientCompany}</p>
                      <p className="text-xs text-navy-400">{demo.clientIndustry}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-navy-800">{new Date(demo.demoDate).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                      <p className="text-xs text-navy-400">{demo.demoTime}</p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        demo.demoType === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {demo.demoType === 'online' ? '💻 Online' : '📍 Physical'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-navy-700">{demo.teamMemberName}</p>
                      {demo.teamMember2Name && <p className="text-xs text-navy-400">+ {demo.teamMember2Name}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColor(demo.status)}`}>
                        {demo.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {demo.status === 'scheduled' && (
                          <>
                            <button onClick={() => updateStatus(demo.id, 'completed')} className="text-xs text-green-600 hover:underline font-medium">Complete</button>
                            <button onClick={() => updateStatus(demo.id, 'cancelled')} className="text-xs text-red-500 hover:underline font-medium">Cancel</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
