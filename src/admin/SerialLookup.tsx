import { useState, useEffect, useMemo, useRef } from 'react';
import { KeyRound, Search, X, Copy, Check, Package } from 'lucide-react';
import type { Client } from '../data/siteData';
import {
  clientProducts, productLabel, productExpires, clientOnboarded, daysUntilDate,
} from '../data/siteData';

// ── Why this exists ─────────────────────────────────────────────────────────
// The serial number is what every support conversation starts with, and it is
// needed at the moment a customer is already on the phone. Making someone leave
// whatever tab they are in, open the Customer Directory, search, and read a
// table is several seconds too many for something asked ten times a day.
//
// So it is a lookup that opens over the top of whatever is on screen, from
// anywhere in the panel, and closes again without changing what tab you were
// on. Nothing here can edit anything — it answers a question and gets out of
// the way.

interface P {
  clients: Client[];
  open: boolean;
  onClose: () => void;
}

const fmt = (d?: string): string =>
  d ? new Date(`${d}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) : '—';

export default function SerialLookup({ clients, open, onClose }: P) {
  const [q, setQ] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on open, and clear the previous search so it never opens showing
  // whoever was looked up last — that is a different customer's data sitting on
  // screen for no reason.
  useEffect(() => {
    if (!open) { setQ(''); setCopied(null); return; }
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Nothing is listed until something is typed. A lookup that opens showing
  // every customer invites scrolling, which is the thing being avoided.
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return clients
      .filter(c => [c.serialNo, c.company, c.contactName, c.phone, c.email]
        .some(v => (v || '').toLowerCase().includes(term)))
      .slice(0, 8);
  }, [clients, q]);

  const copy = async (serial: string) => {
    try {
      await navigator.clipboard.writeText(serial);
      setCopied(serial);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Clipboard access can be refused; the serial is on screen either way,
      // so this is a convenience failing, not the feature failing.
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm px-4 pt-[10vh]"
      onClick={onClose}>
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
            placeholder="Serial number, company, contact, phone or email…"
            className="flex-1 text-sm outline-none placeholder:text-slate-400" />
          <button onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {!q.trim() ? (
            <div className="px-4 py-8 text-center">
              <KeyRound className="h-7 w-7 text-slate-300 mx-auto" />
              <p className="mt-2 text-xs text-slate-500">
                Start typing to find a customer's licence.
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {clients.length} customer{clients.length === 1 ? '' : 's'} on record
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs font-semibold text-slate-600">Nothing matches "{q.trim()}"</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Only customers whose deal closed won are here. A prospect still in the pipeline
                will not have a licence yet.
              </p>
            </div>
          ) : (
            results.map(c => {
              const products = clientProducts(c);
              return (
                <div key={c.id} className="border-b border-slate-50 last:border-0 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{c.company}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {[c.contactName, c.phone].filter(Boolean).join(' · ') || 'No contact on record'}
                      </p>
                    </div>
                    {/* The serial is the answer, so it is the biggest thing here
                        and it is one tap to copy into whatever you are typing. */}
                    <button onClick={() => copy(c.serialNo)}
                      title="Copy serial number"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-sm font-bold tracking-wide text-slate-900 hover:bg-slate-100 transition">
                      {c.serialNo}
                      {copied === c.serialNo
                        ? <Check className="h-3.5 w-3.5 text-green-600" />
                        : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                    </button>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Onboarded {fmt(clientOnboarded(c))}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {products.map(p => {
                      const left = productExpires(p) ? daysUntilDate(p.expiresOn) : null;
                      const tone = !productExpires(p) ? 'bg-slate-100 text-slate-600'
                        : left === null ? 'bg-amber-100 text-amber-700'
                        : left < 0 ? 'bg-red-100 text-red-700'
                        : left <= 30 ? 'bg-orange-100 text-orange-700'
                        : 'bg-emerald-100 text-emerald-700';
                      return (
                        <span key={p.id}
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${tone}`}>
                          <Package className="h-3 w-3 shrink-0" />
                          {productLabel(p)}
                          {productExpires(p) && (
                            <span className="font-normal opacity-80">
                              {p.expiresOn
                                ? left === null ? '' : left < 0 ? `· expired` : `· ${left}d`
                                : '· no date'}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">
            Read-only — open the Customer Directory to change anything
          </span>
          <span className="text-[10px] text-slate-400">
            <kbd className="rounded border border-slate-300 bg-white px-1">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
