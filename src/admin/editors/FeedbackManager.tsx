import { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Star, CheckCircle2, Circle } from 'lucide-react';
import { fbSubscribe, fbSet } from '../../firebase/config';

interface ProductFeedback {
  id: string;
  product: 'jamvi' | 'mavuno';
  message: string;
  rating: number | null;
  submittedBy: string | null;
  appVersion: string | null;
  context: string | null;
  status: 'new' | 'reviewed';
  createdAt: string;
}

const PRODUCT_LABEL: Record<string, string> = { jamvi: 'Jamvi', mavuno: 'Mavuno HR' };
const PRODUCT_PILL: Record<string, string> = {
  jamvi: 'bg-indigo-100 text-indigo-700',
  mavuno: 'bg-emerald-100 text-emerald-700',
};

export default function FeedbackManager() {
  const [items, setItems] = useState<ProductFeedback[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [product, setProduct] = useState<'all' | 'jamvi' | 'mavuno'>('all');
  const [status, setStatus] = useState<'all' | 'new' | 'reviewed'>('all');

  useEffect(() => {
    const unsub = fbSubscribe('productFeedback', (raw: Record<string, any> | null) => {
      const list: ProductFeedback[] = raw
        ? Object.entries(raw).map(([id, v]: [string, any]) => ({
            id,
            product: v.product === 'mavuno' ? 'mavuno' : 'jamvi',
            message: v.message ?? '',
            rating: typeof v.rating === 'number' ? v.rating : null,
            submittedBy: v.submittedBy ?? null,
            appVersion: v.appVersion ?? null,
            context: v.context ?? null,
            status: v.status === 'reviewed' ? 'reviewed' : 'new',
            createdAt: v.createdAt ?? '',
          }))
        : [];
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setItems(list);
      setLoaded(true);
    });
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (product !== 'all') list = list.filter((f) => f.product === product);
    if (status !== 'all') list = list.filter((f) => f.status === status);
    return list;
  }, [items, product, status]);

  const newCount = items.filter((f) => f.status === 'new').length;

  const toggleStatus = (item: ProductFeedback) => {
    void fbSet(`productFeedback/${item.id}/status`, item.status === 'new' ? 'reviewed' : 'new');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Product Feedback</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Submitted directly from each product's app
          {newCount > 0 && <> · <span className="font-semibold text-amber-600">{newCount} new</span></>}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          {(['all', 'jamvi', 'mavuno'] as const).map((f) => (
            <button key={f} onClick={() => setProduct(f)}
              className={`px-3 py-2 text-xs font-semibold capitalize transition ${
                product === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}>
              {f === 'all' ? 'All products' : PRODUCT_LABEL[f]}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          {(['all', 'new', 'reviewed'] as const).map((f) => (
            <button key={f} onClick={() => setStatus(f)}
              className={`px-3 py-2 text-xs font-semibold capitalize transition ${
                status === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {!loaded ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm font-medium text-slate-500">
          Loading feedback…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            {items.length === 0 ? 'No feedback submitted yet' : 'Nothing matches your filter'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div key={item.id} className={`rounded-2xl border bg-white p-4 ${item.status === 'new' ? 'border-amber-200' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ${PRODUCT_PILL[item.product]}`}>
                    {PRODUCT_LABEL[item.product]}
                  </span>
                  {item.rating != null && (
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < item.rating! ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </span>
                  )}
                  {item.context && <span className="text-xs text-slate-400">{item.context}</span>}
                </div>
                <button onClick={() => toggleStatus(item)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    item.status === 'new' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}>
                  {item.status === 'new' ? <Circle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  {item.status === 'new' ? 'Mark reviewed' : 'Reviewed'}
                </button>
              </div>
              <p className="mt-2.5 text-sm text-slate-800 whitespace-pre-wrap">{item.message}</p>
              <p className="mt-2 text-xs text-slate-400">
                {item.submittedBy ?? 'Anonymous'}
                {item.appVersion && <> · v{item.appVersion}</>}
                {item.createdAt && <> · {new Date(item.createdAt).toLocaleString()}</>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
