import { useMemo, useRef, useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle2, FileSpreadsheet, Download } from 'lucide-react';
import { fbSet } from '../../firebase/config';
import {
  parseCsv, autoMapColumns, emailKey, parseImportDate, downloadCsv, EMAIL_PATTERN,
  type ImportField,
} from '../crm/csvImport';

// ─────────────────────────────────────────────────────────────────────────────
// Bulk import of newsletter subscribers from a CSV — the mirror of the
// "Export CSV" button on the same screen, and the same flow as the leads
// importer: read the file, match the columns, show the count, then write.
//
// A subscriber is a much smaller record than a lead — an email address is the
// whole of it — so the only hard requirement is a valid address.
// ─────────────────────────────────────────────────────────────────────────────

interface ExistingSubscriber { email: string; }

interface Props {
  existing: ExistingSubscriber[];
  onClose: () => void;
  onImported: (count: number) => void;
}

const FIELDS: ImportField[] = [
  { key: 'email',        label: 'Email',         aliases: ['email', 'e-mail', 'email address', 'mail', 'address'] },
  { key: 'name',         label: 'Name',          aliases: ['name', 'full name', 'contact name', 'subscriber', 'first name'] },
  { key: 'status',       label: 'Status',        aliases: ['status', 'state', 'subscription status'] },
  { key: 'subscribedAt', label: 'Subscribed At', aliases: ['subscribed at', 'subscribedat', 'date', 'date subscribed', 'signed up', 'created'] },
];

// Only an explicit unsubscribe marker turns someone off — anything else (blank,
// "Active", a stray value) is treated as an active subscriber.
const isUnsubscribed = (raw: string) => {
  const v = (raw || '').trim().toLowerCase();
  return v === 'unsubscribed' || v === 'unsubscribe' || v === 'inactive' || v === 'no' || v === 'false';
};

export default function ImportSubscribersDialog({ existing, onClose, onImported }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(0);

  const [mapping, setMapping] = useState<Record<string, number>>({});
  const [skipDuplicates, setSkipDuplicates] = useState(true);

  const readFile = (file: File) => {
    setError('');
    if (!/\.csv$/i.test(file.name)) {
      setError('Please choose a .csv file. In Excel: File → Save As → CSV.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCsv(String(reader.result || ''));
      if (parsed.length < 2) {
        setError('That file has no data rows — it needs a header row plus at least one subscriber.');
        return;
      }
      const head = parsed[0].map(h => h.trim());
      setFileName(file.name);
      setHeaders(head);
      setRows(parsed.slice(1));
      setMapping(autoMapColumns(head, FIELDS));
    };
    reader.onerror = () => setError('Could not read that file. Try re-saving it as CSV.');
    reader.readAsText(file);
  };

  const cell = (row: string[], key: string) => {
    const i = mapping[key];
    return i === undefined || i < 0 ? '' : (row[i] || '').trim();
  };

  // ── What the file will actually do to the list ──────────────────────────
  const analysis = useMemo(() => {
    const known = new Set(existing.map(s => emailKey(s.email)).filter(Boolean));
    const seen = new Set<string>();          // duplicates inside the file itself

    const ready: string[][] = [];
    const duplicates: string[][] = [];
    const invalid: string[][] = [];

    rows.forEach(r => {
      const email = emailKey(cell(r, 'email'));
      // No address, or not an address — nothing to subscribe.
      if (!email || !EMAIL_PATTERN.test(email)) { invalid.push(r); return; }

      if (known.has(email) || seen.has(email)) {
        duplicates.push(r);
        if (skipDuplicates) return;
      }
      seen.add(email);
      ready.push(r);
    });

    return { ready, duplicates, invalid };
  }, [rows, mapping, skipDuplicates, existing]);

  const toRecord = (r: string[]) => {
    const name = cell(r, 'name');
    return {
      email: emailKey(cell(r, 'email')),
      ...(name ? { name } : {}),
      status: isUnsubscribed(cell(r, 'status')) ? 'unsubscribed' as const : 'active' as const,
      subscribedAt: parseImportDate(cell(r, 'subscribedAt')),
    };
  };

  const runImport = async () => {
    if (!analysis.ready.length || saving) return;
    setSaving(true);
    setError('');

    // Written one record at a time, the same way the manual "Add" button does —
    // writing the whole node in one go would clobber anyone who subscribed
    // while this dialog was open.
    const stamp = Date.now();
    const results = await Promise.all(
      analysis.ready.map((r, i) => fbSet(`newsletter_subscribers/${stamp}-${i}`, toRecord(r)))
    );

    // fbSet reports a failed write by returning false rather than throwing, so
    // the count has to come from the results — never from how many we sent.
    const saved = results.filter(Boolean).length;
    const failed = results.length - saved;

    if (saved === 0) {
      setError('Could not save to the database. Check your connection and try again.');
      setSaving(false);
      return;
    }

    setDone(saved);
    onImported(saved);
    if (failed > 0) {
      // A partial write is not a success — say so and leave the dialog open so
      // the file can be re-run for the ones that did not land.
      setError(`${failed} of ${results.length} could not be saved. Re-run the file to retry them — the ones already added will show as duplicates.`);
      setSaving(false);
      return;
    }
    setTimeout(onClose, 1600);
  };

  const downloadTemplate = () => downloadCsv('subscribers-import-template.csv', [
    FIELDS.map(f => f.label).join(','),
    '"jane@mwangihardware.co.ke","Jane Mwangi","Active","06/08/2026"',
  ].join('\n'));

  const reset = () => {
    setFileName(''); setHeaders([]); setRows([]); setMapping({}); setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Import Subscribers from CSV</h3>
            <p className="text-xs text-slate-500 mt-0.5">Add a mailing list in bulk — nothing is saved until you press Import.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-4 space-y-4 min-h-0 flex-1 overflow-y-auto">
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {done > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <span className="text-sm text-green-700">
                {done} subscriber{done === 1 ? '' : 's'} added to your list.
              </span>
            </div>
          )}

          {!rows.length ? (
            <>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault(); setDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) readFile(f);
                }}
                onClick={() => fileRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                  dragOver ? 'border-accent bg-accent/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}>
                <FileSpreadsheet className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-3 text-sm font-semibold text-slate-700">Drop a CSV file here, or click to choose one</p>
                <p className="mt-1 text-xs text-slate-500">
                  Needs a header row. An email address per row is enough — a name is optional.
                </p>
              </div>
              <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f); }} />
              <button onClick={downloadTemplate}
                className="flex items-center gap-2 text-xs font-semibold text-accent hover:underline">
                <Download className="h-3.5 w-3.5" /> Download a blank template
              </button>
              <p className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
                Import only people who agreed to hear from you. Everyone added here goes into the
                next "Notify Subscribers" broadcast.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileSpreadsheet className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 truncate">{fileName}</span>
                  <span className="text-xs text-slate-500 shrink-0">· {rows.length} row{rows.length === 1 ? '' : 's'}</span>
                </div>
                <button onClick={reset} className="text-xs font-semibold text-slate-500 hover:text-slate-700 underline shrink-0">
                  choose another file
                </button>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Match your columns</p>
                <p className="text-xs text-slate-500 mb-3">
                  Matched automatically from your headers — change any that landed on the wrong column.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {FIELDS.map(f => (
                    <label key={f.key} className="flex items-center gap-2">
                      <span className="w-28 shrink-0 text-xs font-medium text-slate-600">{f.label}</span>
                      <select
                        value={mapping[f.key] ?? -1}
                        onChange={e => setMapping(m => ({ ...m, [f.key]: Number(e.target.value) }))}
                        className="flex-1 min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-accent">
                        <option value={-1}>— not in file —</option>
                        {headers.map((h, i) => <option key={i} value={i}>{h || `Column ${i + 1}`}</option>)}
                      </select>
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                <input type="checkbox" checked={skipDuplicates} onChange={e => setSkipDuplicates(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-accent focus:ring-accent" />
                <span className="text-xs text-slate-600">Skip addresses already on the list</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-green-50 p-3 text-center">
                  <p className="text-xl font-bold text-green-700">{analysis.ready.length}</p>
                  <p className="text-[10px] font-medium text-green-700">Will be added</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-center" title="Already subscribed, or listed twice in this file">
                  <p className="text-xl font-bold text-amber-700">{analysis.duplicates.length}</p>
                  <p className="text-[10px] font-medium text-amber-700">{skipDuplicates ? 'Duplicates skipped' : 'Duplicates (kept)'}</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-3 text-center" title="Missing or malformed email address">
                  <p className="text-xl font-bold text-slate-600">{analysis.invalid.length}</p>
                  <p className="text-[10px] font-medium text-slate-600">Invalid emails</p>
                </div>
              </div>

              {analysis.ready.length > 0 && (
                <div className="rounded-lg border border-slate-200 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        {['Email', 'Name', 'Status'].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.ready.slice(0, 5).map(toRecord).map((s, i) => (
                        <tr key={i} className="border-b border-slate-100 last:border-0">
                          <td className="px-3 py-2 text-xs font-medium text-slate-900">{s.email}</td>
                          <td className="px-3 py-2 text-xs text-slate-600">{s.name || '—'}</td>
                          <td className="px-3 py-2 text-xs text-slate-600">{s.status === 'unsubscribed' ? 'Unsubscribed' : 'Active'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {analysis.ready.length > 5 && (
                    <p className="px-3 py-2 text-[11px] text-slate-500">…and {analysis.ready.length - 5} more.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 flex-shrink-0">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={runImport} disabled={!analysis.ready.length || saving || done > 0}
            title={analysis.ready.length ? '' : 'Nothing to import yet'}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition disabled:opacity-40">
            <Upload className="h-4 w-4" />
            {saving ? 'Importing…' : `Import ${analysis.ready.length || ''} subscriber${analysis.ready.length === 1 ? '' : 's'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
