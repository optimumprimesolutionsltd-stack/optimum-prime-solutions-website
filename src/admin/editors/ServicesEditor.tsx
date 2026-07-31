import { useState } from 'react';
import { Save, Plus, X, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import type { SiteData, ServiceItem } from '../../data/siteData';

const iconOptions = ['Package', 'BookOpen', 'Wallet', 'Factory', 'FileCheck', 'Code', 'Headphones', 'BarChart3', 'Download', 'Settings', 'Shield', 'Zap'];

interface P { data: SiteData; onSave: (d: SiteData) => void }

export default function ServicesEditor({ data, onSave }: P) {
  const [items, setItems] = useState<ServiceItem[]>(data.services.map(s => ({ ...s, features: [...s.features] })));
  const [exp, setExp] = useState<string | null>(null);

  const add = () => {
    const n: ServiceItem = { id: Date.now() + '', title: 'New Service', desc: 'Service description...', icon: 'Package', features: ['Feature 1'] };
    setItems([...items, n]);
    setExp(n.id);
  };

  const rm = (id: string) => { if (confirm('Remove this service?')) setItems(items.filter(s => s.id !== id)); };
  const upd = (id: string, u: Partial<ServiceItem>) => setItems(items.map(s => s.id === id ? { ...s, ...u } : s));

  const move = (index: number, dir: -1 | 1) => {
    const ni = index + dir;
    if (ni < 0 || ni >= items.length) return;
    const a = [...items];
    [a[index], a[ni]] = [a[ni], a[index]];
    setItems(a);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{items.length} services · drag to reorder</p>
        <button onClick={add}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition">
          <Plus className="h-4 w-4" />Add Service
        </button>
      </div>

      {items.map((s, i) => (
        <div key={s.id} className={`rounded-2xl border bg-white overflow-hidden transition ${exp === s.id ? 'border-accent/30 shadow-md' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExp(exp === s.id ? null : s.id)}>
            <GripVertical className="h-4 w-4 text-slate-300 shrink-0" />
            <div className="flex gap-0.5">
              <button onClick={e => { e.stopPropagation(); move(i, -1); }} className="p-1 text-slate-400 hover:text-slate-600"><ChevronUp className="h-3 w-3" /></button>
              <button onClick={e => { e.stopPropagation(); move(i, 1); }} className="p-1 text-slate-400 hover:text-slate-600"><ChevronDown className="h-3 w-3" /></button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{s.title}</p>
              <p className="text-xs text-slate-400">{s.features.length} features · Icon: {s.icon}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); rm(s.id); }}
              className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 shrink-0"><X className="h-4 w-4" /></button>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ${exp === s.id ? 'rotate-180' : ''}`} />
          </div>

          {exp === s.id && (
            <div className="border-t border-slate-100 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Title</label>
                  <input value={s.title} onChange={e => upd(s.id, { title: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-accent" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Icon</label>
                  <select value={s.icon} onChange={e => upd(s.id, { icon: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-accent">
                    {iconOptions.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select></div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Description (Readable Preview)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Edit Description</label>
                    <textarea value={s.desc} onChange={e => upd(s.id, { desc: e.target.value })} rows={8} placeholder="Service description..."
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-accent font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Live Preview</label>
                    <div className="h-52 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm text-slate-800 leading-relaxed">
                        {s.desc || <span className="text-slate-400">Description preview will appear here...</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-2">Features</label>
                <div className="space-y-2">
                  {s.features.map((f, fi) => (
                    <div key={fi} className="flex gap-2">
                      <input value={f} onChange={e => { const fs = [...s.features]; fs[fi] = e.target.value; upd(s.id, { features: fs }); }}
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent" />
                      <button onClick={() => upd(s.id, { features: s.features.filter((_, idx) => idx !== fi) })}
                        className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                  <button onClick={() => upd(s.id, { features: [...s.features, ''] })}
                    className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-dark"><Plus className="h-3 w-3" />Add Feature</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={() => onSave({ ...data, services: items })}
        className="flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 transition">
        <Save className="h-4 w-4" />Save Services
      </button>
    </div>
  );
}
