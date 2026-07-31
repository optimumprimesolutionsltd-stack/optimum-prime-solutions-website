import { useState } from 'react';
import { Save, Plus, X, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import type { SiteData, FaqItem } from '../../data/siteData';

const defaultCats = ['General', 'Pricing', 'Services', 'KRA & Tax', 'Support', 'Security'];

interface P { data: SiteData; onSave: (d: SiteData) => void }

export default function FaqEditor({ data, onSave }: P) {
  const [items, setItems] = useState<FaqItem[]>(data.faqs.map(f => ({ ...f })));
  const [exp, setExp] = useState<string | null>(null);

  const add = () => {
    const n: FaqItem = { id: Date.now() + '', q: '', a: '', cat: 'General' };
    setItems([...items, n]);
    setExp(n.id);
  };

  const rm = (id: string) => { if (confirm('Remove?')) setItems(items.filter(f => f.id !== id)); };
  const upd = (id: string, u: Partial<FaqItem>) => setItems(items.map(f => f.id === id ? { ...f, ...u } : f));

  const move = (index: number, dir: -1 | 1) => {
    const ni = index + dir;
    if (ni < 0 || ni >= items.length) return;
    const a = [...items];
    [a[index], a[ni]] = [a[ni], a[index]];
    setItems(a);
  };

  const cats = Array.from(new Set([...defaultCats, ...items.map(f => f.cat)]));

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-slate-900">{items.length} FAQs</p>
        <button onClick={add}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition">
          <Plus className="h-4 w-4" />Add FAQ
        </button>
      </div>

      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 flex items-start gap-3">
        <HelpCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-base font-bold text-slate-900">💡 FAQs Power the Chatbot</p>
          <p className="text-sm text-slate-700 mt-1">The chatbot automatically searches FAQ answers to respond to visitor questions. Well-written, detailed FAQs make the chatbot smarter and more helpful.</p>
        </div>
      </div>

      {items.map((f, i) => (
        <div key={f.id} className={`rounded-2xl border bg-white overflow-hidden transition ${exp === f.id ? 'border-accent/30 shadow-md' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExp(exp === f.id ? null : f.id)}>
            <div className="flex gap-0.5">
              <button onClick={e => { e.stopPropagation(); move(i, -1); }} className="p-1 text-slate-400 hover:text-slate-600"><ChevronUp className="h-3 w-3" /></button>
              <button onClick={e => { e.stopPropagation(); move(i, 1); }} className="p-1 text-slate-400 hover:text-slate-600"><ChevronDown className="h-3 w-3" /></button>
            </div>
            <HelpCircle className={`h-4 w-4 shrink-0 ${exp === f.id ? 'text-accent' : 'text-slate-400'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-slate-900 truncate">{f.q || 'New Question...'}</p>
              <p className="text-sm text-slate-600 font-medium">{f.cat}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); rm(f.id); }}
              className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 shrink-0"><X className="h-4 w-4" /></button>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ${exp === f.id ? 'rotate-180' : ''}`} />
          </div>

          {exp === f.id && (
            <div className="border-t border-slate-100 p-5 space-y-4">
              <div><label className="block text-sm font-bold text-slate-900 mb-2">Question</label>
                <input value={f.q} onChange={e => upd(f.id, { q: e.target.value })} placeholder="e.g. How much does TallyPrime cost?"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base text-slate-900 placeholder-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" /></div>
              <div><label className="block text-sm font-bold text-slate-900 mb-2">Answer</label>
                <textarea value={f.a} onChange={e => upd(f.id, { a: e.target.value })} rows={5} placeholder="Provide a detailed answer..."
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base text-slate-900 placeholder-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" /></div>
              <div><label className="block text-sm font-bold text-slate-900 mb-2">Category</label>
                <select value={f.cat} onChange={e => upd(f.id, { cat: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20">
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select></div>
            </div>
          )}
        </div>
      ))}

      <button onClick={() => onSave({ ...data, faqs: items })}
        className="flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-base font-bold text-white shadow-lg hover:bg-slate-800 transition">
        <Save className="h-4 w-4" />Save FAQs
      </button>
    </div>
  );
}
