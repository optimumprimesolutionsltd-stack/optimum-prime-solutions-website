import { useState } from 'react';
import { Save, Plus, X, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import type { SiteData } from '../../data/siteData';

interface P { data: SiteData; onSave: (d: SiteData) => void }

export default function ContactEditor({ data, onSave }: P) {
  const [c, setC] = useState({
    ...data.contact,
    phones: [...data.contact.phones],
    emails: [...data.contact.emails],
    workingHours: [...data.contact.workingHours],
  });

  const updList = (key: 'phones' | 'emails' | 'workingHours', index: number, value: string) => {
    const list = [...c[key]]; list[index] = value; setC({ ...c, [key]: list });
  };
  const addToList = (key: 'phones' | 'emails' | 'workingHours') => setC({ ...c, [key]: [...c[key], ''] });
  const rmFromList = (key: 'phones' | 'emails' | 'workingHours', index: number) => setC({ ...c, [key]: c[key].filter((_: string, i: number) => i !== index) });

  const sections: { key: 'phones' | 'emails' | 'workingHours'; label: string; icon: typeof Phone; placeholder: string }[] = [
    { key: 'phones', label: 'Phone Numbers', icon: Phone, placeholder: '+254 700 000 000' },
    { key: 'emails', label: 'Email Addresses', icon: Mail, placeholder: 'info@example.com' },
    { key: 'workingHours', label: 'Working Hours', icon: Clock, placeholder: 'Mon – Fri: 8:00 AM – 5:00 PM' },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Location & WhatsApp */}
      <div className="rounded-2xl border border-navy-200 bg-white p-6">
        <h3 className="text-base font-bold text-navy-900 mb-5 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-accent" />
          Location & WhatsApp
        </h3>
        <div className="space-y-4">
          <div><label className="block text-xs font-semibold text-navy-600 mb-1.5">Address / Location</label>
            <input value={c.location} onChange={e => setC({ ...c, location: e.target.value })} placeholder="Ruiru, Kenya"
              className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-navy-600 mb-1.5 flex items-center gap-1"><MessageCircle className="h-3 w-3" />WhatsApp Number</label>
              <input value={c.whatsapp} onChange={e => setC({ ...c, whatsapp: e.target.value })} placeholder="254700000000"
                className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent" />
              <p className="text-[10px] text-navy-400 mt-1">Numbers only, no + or spaces</p></div>
            <div><label className="block text-xs font-semibold text-navy-600 mb-1.5">Google Maps Embed URL</label>
              <input value={c.mapUrl} onChange={e => setC({ ...c, mapUrl: e.target.value })} placeholder="https://www.google.com/maps/embed..."
                className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent" /></div>
          </div>
        </div>
      </div>

      {/* Phone / Email / Hours */}
      {sections.map(({ key, label, icon: Icon, placeholder }) => (
        <div key={key} className="rounded-2xl border border-navy-200 bg-white p-6">
          <h3 className="text-base font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Icon className="h-5 w-5 text-accent" />{label}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-navy-600">Edit {label}</label>
              {c[key].map((val: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <input value={val} onChange={e => updList(key, i, e.target.value)} placeholder={placeholder}
                    className="flex-1 rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent" />
                  <button onClick={() => rmFromList(key, i)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-50 transition"><X className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => addToList(key)}
                className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark transition">
                <Plus className="h-4 w-4" />Add {label.replace(/s$/, '').replace(/es$/, '')}
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-2">Live Preview</label>
              <div className="rounded-lg border border-navy-200 bg-navy-50 p-4 space-y-2">
                {c[key].filter((v: string) => v).length > 0 ? (
                  c[key].filter((v: string) => v).map((val: string, i: number) => (
                    <div key={i} className="text-sm text-navy-800 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>{val}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-navy-400">Preview will appear here...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button onClick={() => onSave({ ...data, contact: c })}
        className="flex items-center gap-2 rounded-xl bg-navy-900 px-7 py-3 text-sm font-semibold text-white shadow-lg hover:bg-navy-800 transition">
        <Save className="h-4 w-4" />Save Contact Info
      </button>
    </div>
  );
}
