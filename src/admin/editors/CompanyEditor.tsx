import { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import type { SiteData } from '../../data/siteData';

interface P { data: SiteData; onSave: (d: SiteData) => void }

export default function CompanyEditor({ data, onSave }: P) {
  const [c, setC] = useState({
    ...data.company,
    about: [...data.company.about],
    stats: data.company.stats.map(s => ({ ...s })),
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Basic Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">1</span>
          Company Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company Name</label>
            <input value={c.name} onChange={e => setC({ ...c, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tagline</label>
            <input value={c.tagline} onChange={e => setC({ ...c, tagline: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mission Statement</label>
            <textarea value={c.mission} onChange={e => setC({ ...c, mission: e.target.value })} rows={3}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Vision Statement</label>
            <textarea value={c.vision} onChange={e => setC({ ...c, vision: e.target.value })} rows={3}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10" />
          </div>
        </div>
      </div>

      {/* About Paragraphs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">2</span>
          About Paragraphs
        </h3>
        <div className="space-y-3">
          {c.about.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea value={p} onChange={e => { const a = [...c.about]; a[i] = e.target.value; setC({ ...c, about: a }); }} rows={3}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10" />
              <button onClick={() => setC({ ...c, about: c.about.filter((_, idx) => idx !== i) })}
                className="self-start rounded-lg p-2 text-red-400 hover:bg-red-50 transition"><X className="h-4 w-4" /></button>
            </div>
          ))}
          <button onClick={() => setC({ ...c, about: [...c.about, ''] })}
            className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark transition">
            <Plus className="h-4 w-4" />Add Paragraph
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">3</span>
          Stats / Highlights
        </h3>
        <div className="space-y-3">
          {c.stats.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <input value={s.value} onChange={e => { const st = [...c.stats]; st[i] = { ...st[i], value: e.target.value }; setC({ ...c, stats: st }); }}
                placeholder="500+" className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold outline-none focus:border-accent" />
              <input value={s.label} onChange={e => { const st = [...c.stats]; st[i] = { ...st[i], label: e.target.value }; setC({ ...c, stats: st }); }}
                placeholder="Clients Served" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent" />
              <button onClick={() => setC({ ...c, stats: c.stats.filter((_, idx) => idx !== i) })}
                className="rounded-lg p-2 text-red-400 hover:bg-red-50"><X className="h-4 w-4" /></button>
            </div>
          ))}
          <button onClick={() => setC({ ...c, stats: [...c.stats, { label: '', value: '' }] })}
            className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark transition">
            <Plus className="h-4 w-4" />Add Stat
          </button>
        </div>
      </div>

      <button onClick={() => onSave({ ...data, company: c })}
        className="flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 transition">
        <Save className="h-4 w-4" />Save Company Info
      </button>
    </div>
  );
}
