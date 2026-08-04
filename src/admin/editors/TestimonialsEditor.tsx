import { useState, useEffect } from 'react';
import { Save, Plus, X, Star, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import type { SiteData, TestimonialItem } from '../../data/siteData';
import { fbGet, fbSet } from '../../firebase/config';

interface PendingReview {
  id: string;
  name: string;
  company: string;
  role: string;
  rating: number;
  text: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface P { data: SiteData; onSave: (d: SiteData) => void }

export default function TestimonialsEditor({ data, onSave }: P) {
  const [items, setItems] = useState<TestimonialItem[]>(data.testimonials.map(t => ({ ...t })));
  const [pending, setPending] = useState<PendingReview[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [activeTab, setActiveTab] = useState<'published' | 'pending'>('published');

  const loadPending = async () => {
    setLoadingPending(true);
    try {
      const raw = await fbGet('pending_reviews');
      if (raw) {
        const list: PendingReview[] = Object.values(raw) as PendingReview[];
        // Show only pending ones
        setPending(list.filter(r => r.status === 'pending').sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        ));
      } else {
        setPending([]);
      }
    } catch (err) {
      console.error('Failed to load pending reviews:', err);
    }
    setLoadingPending(false);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const add = () => setItems([...items, { id: Date.now() + '', name: '', role: '', company: '', text: '', rating: 5 }]);
  const rm = (id: string) => { if (confirm('Remove this testimonial?')) setItems(items.filter(t => t.id !== id)); };
  const upd = (id: string, u: Partial<TestimonialItem>) => setItems(items.map(t => t.id === id ? { ...t, ...u } : t));

  const approveReview = async (review: PendingReview) => {
    // Add to published testimonials
    const newItem: TestimonialItem = {
      id: review.id,
      name: review.name,
      role: review.role || 'Client',
      company: review.company || 'Kenya',
      text: review.text,
      rating: review.rating,
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onSave({ ...data, testimonials: updatedItems });

    // Mark as approved in Firebase
    await fbSet(`pending_reviews/${review.id}/status`, 'approved');
    setPending(prev => prev.filter(r => r.id !== review.id));
  };

  const rejectReview = async (review: PendingReview) => {
    if (!confirm(`Reject review from ${review.name}? This cannot be undone.`)) return;
    await fbSet(`pending_reviews/${review.id}/status`, 'rejected');
    setPending(prev => prev.filter(r => r.id !== review.id));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('published')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'published'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          Published ({items.length})
        </button>
        <button
          onClick={() => { setActiveTab('pending'); loadPending(); }}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'pending'
              ? 'bg-red-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="h-4 w-4" />
          Pending Approval
          {pending.length > 0 && (
            <span className="ml-1 h-5 min-w-[20px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
              {pending.length}
            </span>
          )}
        </button>
      </div>

      {/* Published testimonials tab */}
      {activeTab === 'published' && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{items.length} published testimonials</p>
            <button onClick={add}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition">
              <Plus className="h-4 w-4" />Add Testimonial
            </button>
          </div>

          {items.map(t => (
            <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-xs font-bold text-white">
                    {t.name ? t.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name || 'New Testimonial'}</p>
                    <p className="text-xs text-slate-400">{t.role ? `${t.role}, ${t.company}` : 'Set details below'}</p>
                  </div>
                </div>
                <button onClick={() => rm(t.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Name</label>
                  <input value={t.name} onChange={e => upd(t.id, { name: e.target.value })} placeholder="John Doe"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Role</label>
                  <input value={t.role} onChange={e => upd(t.id, { role: e.target.value })} placeholder="CEO"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Company</label>
                  <input value={t.company} onChange={e => upd(t.id, { company: e.target.value })} placeholder="Company Ltd"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent" /></div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Testimonial Text (Readable Preview)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Edit Text</label>
                    <textarea value={t.text} onChange={e => upd(t.id, { text: e.target.value })} rows={8} placeholder="What the client said..."
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-accent font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Live Preview</label>
                    <div className="h-52 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm text-slate-800 leading-relaxed italic">
                        {t.text ? `"${t.text}"` : <span className="text-slate-400">Preview will appear here...</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-2">Rating</label>
                <div className="flex gap-1">{[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => upd(t.id, { rating: s })}>
                    <Star className={`h-5 w-5 transition ${s <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}</div></div>
            </div>
          ))}

          <button onClick={() => onSave({ ...data, testimonials: items })}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 transition">
            <Save className="h-4 w-4" />Save Testimonials
          </button>
        </>
      )}

      {/* Pending reviews tab */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {loadingPending ? 'Loading...' : `${pending.length} review${pending.length !== 1 ? 's' : ''} awaiting approval`}
            </p>
            <button
              onClick={loadPending}
              disabled={loadingPending}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loadingPending ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {!loadingPending && pending.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
              <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">No pending reviews</p>
              <p className="text-xs text-slate-400 mt-1">New reviews submitted via the website will appear here.</p>
            </div>
          )}

          {pending.map(review => (
            <div key={review.id} className="rounded-2xl border border-red-200 bg-white p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {review.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{review.name}</p>
                    <p className="text-xs text-slate-400">
                      {[review.role, review.company].filter(Boolean).join(', ') || 'No role/company provided'}
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Submitted {new Date(review.submittedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`h-4 w-4 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                <p className="text-sm text-slate-800 italic leading-relaxed">"{review.text}"</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => approveReview(review)}
                  className="flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 transition shadow-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve & Publish
                </button>
                <button
                  onClick={() => rejectReview(review)}
                  className="flex items-center gap-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold px-5 py-2.5 transition"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
