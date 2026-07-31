import { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import type { SiteData, IndustryItem } from '../../data/siteData';

const iconOptions = ['ShoppingBag', 'Truck', 'Factory', 'Landmark', 'Wrench', 'Heart', 'ShoppingCart', 'GraduationCap', 'Building2', 'Briefcase', 'Coffee', 'Leaf'];

interface P { data: SiteData; onSave: (d: SiteData) => void }

export default function IndustriesEditor({ data, onSave }: P) {
  const [items, setItems] = useState<IndustryItem[]>(data.industries.map(i => ({ ...i })));

  const add = () => setItems([...items, { id: Date.now() + '', name: '', icon: 'ShoppingBag', desc: '' }]);
  const rm = (id: string) => { if (confirm('Remove?')) setItems(items.filter(i => i.id !== id)); };
  const upd = (id: string, u: Partial<IndustryItem>) => setItems(items.map(i => i.id === id ? { ...i, ...u } : i));

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{items.length} industries</p>
        <button onClick={add} className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition">
          <Plus className="h-4 w-4" />Add Industry
        </button>
      </div>

      {items.map(ind => (
        <div key={ind.id} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-bold text-slate-900">{ind.name || 'New Industry'}</p>
            <button onClick={() => rm(ind.id)} className="rounded-lg p-1 text-red-400 hover:bg-red-50"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Industry Name</label>
              <input value={ind.name} onChange={e => upd(ind.id, { name: e.target.value })} placeholder="e.g. Retail & Shops"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Icon</label>
              <select value={ind.icon} onChange={e => upd(ind.id, { icon: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent">
                {iconOptions.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select></div>
          </div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Description (Readable Preview)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Edit Description</label>
                <textarea value={ind.desc} onChange={e => upd(ind.id, { desc: e.target.value })} placeholder="Brief description..." rows={6}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent font-mono text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Live Preview</label>
                <div className="h-40 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-sm text-slate-800 leading-relaxed">
                    {ind.desc || <span className="text-slate-400">Preview will appear here...</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button onClick={() => onSave({ ...data, industries: items })}
        className="flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 transition">
        <Save className="h-4 w-4" />Save Industries
      </button>
    </div>
  );
}
