import { useMemo, useRef, useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle2, FileSpreadsheet, Download } from 'lucide-react';
import type { Lead } from '../../data/siteData';
import { PIPELINE_ORDER } from '../crm/pipeline';
import { OPTIMUM_STAFF, DEFAULT_STAFF, staffByName, staffEmail } from '../../data/staff';

// ─────────────────────────────────────────────────────────────────────────────
// Bulk import of clients/leads from a CSV file — the mirror image of the
// "Leads CSV" export. A file exported from here (or from Excel, Tally, an old
// spreadsheet of clients) can be read straight back in.
//
// Nothing is written until the preview is confirmed: the file is parsed, the
// columns are matched to lead fields, duplicates are flagged against what is
// already in the database, and only then does the Import button do anything.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  existingLeads: Lead[];
  onImport: (leads: Lead[]) => void;
  onClose: () => void;
}

// The lead fields a CSV column can be mapped onto. `aliases` are the header
// names we auto-detect — the export's own labels first, then the wording other
// systems and hand-made spreadsheets tend to use.
const FIELDS: { key: string; label: string; aliases: string[] }[] = [
  { key: 'name',            label: 'Name',             aliases: ['name', 'full name', 'client name', 'contact name', 'contact person', 'customer', 'customer name'] },
  { key: 'company',         label: 'Company',          aliases: ['company', 'company name', 'organisation', 'organization', 'business', 'business name', 'firm'] },
  { key: 'phone',           label: 'Phone',            aliases: ['phone', 'phone number', 'mobile', 'mobile number', 'tel', 'telephone', 'contact', 'cell', 'msisdn'] },
  { key: 'email',           label: 'Email',            aliases: ['email', 'e-mail', 'email address', 'mail'] },
  { key: 'industry',        label: 'Industry',         aliases: ['industry', 'business type', 'sector', 'nature of business'] },
  { key: 'currentSoftware', label: 'Current Software', aliases: ['current software', 'software', 'existing system', 'system'] },
  { key: 'message',         label: 'Notes / Message',  aliases: ['message', 'notes', 'note', 'remarks', 'comment', 'comments', 'details'] },
  { key: 'status',          label: 'Status',           aliases: ['status', 'stage', 'pipeline stage'] },
  { key: 'createdAt',       label: 'Date Added',       aliases: ['date submitted', 'created', 'created at', 'createdat', 'date', 'date added', 'last interaction'] },
];

const SOURCES: { value: NonNullable<Lead['source']>; label: string }[] = [
  { value: 'field',    label: '📣 Field / Marketing' },
  { value: 'referral', label: 'Referral' },
  { value: 'email',    label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone',    label: 'Phone' },
  { value: 'direct',   label: 'Direct Contact' },
  { value: 'website',  label: 'Website' },
];

// ── CSV parsing ─────────────────────────────────────────────────────────────
// A hand-rolled parser rather than a dependency: it has to survive quoted
// fields containing commas and line breaks, doubled quotes ("" → "), CRLF line
// endings and the BOM Excel writes at the front of the file.
function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];

    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') { cell += '"'; i++; }  // escaped quote
        else inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') { inQuotes = true; }
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\r') { /* handled by the \n that follows */ }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  // Whatever is left when the file ends is the final cell / row.
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }

  // Drop rows that are entirely empty — trailing blank lines are the norm.
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

// Phones are compared on digits only, last 9 of them: +254 712 345 678,
// 0712345678 and 254712345678 are the same person.
const phoneKey = (p: string) => {
  const digits = (p || '').replace(/\D/g, '');
  return digits.length >= 9 ? digits.slice(-9) : digits;
};
const emailKey = (e: string) => (e || '').trim().toLowerCase();

// Accepts ISO, yyyy-mm-dd, and the dd/mm/yyyy the exports write (en-GB).
// Anything unreadable falls back to "now" rather than poisoning the record.
function parseDate(raw: string): string {
  const v = (raw || '').trim();
  if (!v) return new Date().toISOString();

  const dmy = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T12:00:00`).toISOString();
  }
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? new Date().toISOString() : new Date(t).toISOString();
}

// Status is only honoured when it names a real pipeline stage (case-insensitive);
// anything else starts at New so an imported row can't sit outside the pipeline.
function normaliseStatus(raw: string): string {
  const v = (raw || '').trim().toLowerCase();
  return PIPELINE_ORDER.find(s => s.toLowerCase() === v) || 'New';
}

export default function ImportLeadsDialog({ existingLeads, onImport, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [done, setDone] = useState(0);

  // field key → CSV column index (-1 = not mapped)
  const [mapping, setMapping] = useState<Record<string, number>>({});
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [source, setSource] = useState<NonNullable<Lead['source']>>('field');
  const [capturedBy, setCapturedBy] = useState(DEFAULT_STAFF.name);

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
        setError('That file has no data rows — it needs a header row plus at least one contact.');
        return;
      }
      const head = parsed[0].map(h => h.trim());
      // Auto-match each lead field to the first column whose header matches one
      // of its aliases; an exact-label match always wins over a loose one.
      const auto: Record<string, number> = {};
      const lower = head.map(h => h.toLowerCase().trim());
      FIELDS.forEach(f => {
        let idx = lower.findIndex(h => h === f.label.toLowerCase());
        if (idx === -1) idx = lower.findIndex(h => f.aliases.includes(h));
        if (idx === -1) idx = lower.findIndex(h => h && f.aliases.some(a => h.includes(a)));
        auto[f.key] = idx;
      });
      setFileName(file.name);
      setHeaders(head);
      setRows(parsed.slice(1));
      setMapping(auto);
    };
    reader.onerror = () => setError('Could not read that file. Try re-saving it as CSV.');
    reader.readAsText(file);
  };

  const cell = (row: string[], key: string) => {
    const i = mapping[key];
    return i === undefined || i < 0 ? '' : (row[i] || '').trim();
  };

  // ── What the file will actually do to the database ──────────────────────
  const analysis = useMemo(() => {
    const existingEmails = new Set(existingLeads.map(l => emailKey(l.email)).filter(Boolean));
    const existingPhones = new Set(existingLeads.map(l => phoneKey(l.phone)).filter(Boolean));
    // Duplicates inside the file itself count too, or one CSV listing the same
    // client twice would create it twice.
    const seenEmails = new Set<string>();
    const seenPhones = new Set<string>();

    const ready: string[][] = [];
    const duplicates: string[][] = [];
    const skipped: string[][] = [];

    rows.forEach(r => {
      const name = cell(r, 'name');
      const phone = cell(r, 'phone');
      const email = cell(r, 'email');
      const company = cell(r, 'company');

      // A row is worth importing if we can name it and reach it.
      if (!(name || company) || !(phone || email)) { skipped.push(r); return; }

      const ek = emailKey(email);
      const pk = phoneKey(phone);
      const isDup =
        (!!ek && (existingEmails.has(ek) || seenEmails.has(ek))) ||
        (!!pk && (existingPhones.has(pk) || seenPhones.has(pk)));

      if (isDup) { duplicates.push(r); if (skipDuplicates) return; }
      if (ek) seenEmails.add(ek);
      if (pk) seenPhones.add(pk);
      ready.push(r);
    });

    return { ready, duplicates, skipped };
  }, [rows, mapping, skipDuplicates, existingLeads]);

  const toLead = (r: string[], i: number): Lead => {
    const name = cell(r, 'name');
    const company = cell(r, 'company');
    const industry = cell(r, 'industry');
    return {
      id: `lead-${Date.now()}-${i}`,
      name: name || company,          // a company row with no contact person still gets a name
      email: cell(r, 'email'),
      phone: cell(r, 'phone'),
      company,
      businessType: industry,
      currentSoftware: cell(r, 'currentSoftware'),
      message: cell(r, 'message'),
      demoDate: '',
      createdAt: parseDate(cell(r, 'createdAt')),
      status: normaliseStatus(cell(r, 'status')),
      source,
      requestType: 'demo',
      industry,
      // Whoever runs the import owns the follow-up until it is reassigned —
      // same rule as a lead added by hand.
      teamMemberName: capturedBy,
      teamMemberPhone: staffByName(capturedBy)?.phone || '',
      teamMemberEmail: staffEmail(capturedBy),
    };
  };

  const runImport = () => {
    const leads = analysis.ready.map(toLead);
    if (!leads.length) return;
    onImport(leads);
    setDone(leads.length);
    setTimeout(onClose, 1600);
  };

  // A blank file in the exact shape the importer expects, so there is never any
  // guessing about column names.
  const downloadTemplate = () => {
    const csv = [
      FIELDS.map(f => f.label).join(','),
      '"Jane Mwangi","Mwangi Hardware Ltd","+254 712 345 678","jane@mwangihardware.co.ke","Hardware & Building Materials","Manual books","Met at the Nakuru road show","New","06/08/2026"',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFileName(''); setHeaders([]); setRows([]); setMapping({}); setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Import Clients from CSV</h3>
            <p className="text-xs text-slate-500 mt-0.5">Add many clients at once — nothing is saved until you press Import.</p>
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
                {done} client{done === 1 ? '' : 's'} imported into your leads database.
              </span>
            </div>
          )}

          {/* ── Step 1: the file ── */}
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
                  Needs a header row. Name (or Company) plus a Phone or Email is enough — everything else is optional.
                </p>
              </div>
              <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f); }} />
              <button onClick={downloadTemplate}
                className="flex items-center gap-2 text-xs font-semibold text-accent hover:underline">
                <Download className="h-3.5 w-3.5" /> Download a blank template
              </button>
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

              {/* ── Step 2: column matching ── */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Match your columns</p>
                <p className="text-xs text-slate-500 mb-3">
                  Matched automatically from your headers — change any that landed on the wrong column.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {FIELDS.map(f => (
                    <label key={f.key} className="flex items-center gap-2">
                      <span className="w-32 shrink-0 text-xs font-medium text-slate-600">{f.label}</span>
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

              {/* ── Step 3: what to stamp on every imported row ── */}
              <div className="grid sm:grid-cols-2 gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                <label className="flex items-center gap-2">
                  <span className="w-32 shrink-0 text-xs font-medium text-slate-600">Lead source</span>
                  <select value={source} onChange={e => setSource(e.target.value as NonNullable<Lead['source']>)}
                    className="flex-1 min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-accent">
                    {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </label>
                <label className="flex items-center gap-2">
                  <span className="w-32 shrink-0 text-xs font-medium text-slate-600">Assign to</span>
                  <select value={capturedBy} onChange={e => setCapturedBy(e.target.value)}
                    className="flex-1 min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-accent">
                    {OPTIMUM_STAFF.map(s => <option key={s.email} value={s.name}>{s.name}</option>)}
                  </select>
                </label>
                <label className="sm:col-span-2 flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={skipDuplicates} onChange={e => setSkipDuplicates(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-accent focus:ring-accent" />
                  <span className="text-xs text-slate-600">
                    Skip contacts already in the database (matched on email or phone number)
                  </span>
                </label>
              </div>

              {/* ── Step 4: the count, before anything is written ── */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-green-50 p-3 text-center">
                  <p className="text-xl font-bold text-green-700">{analysis.ready.length}</p>
                  <p className="text-[10px] font-medium text-green-700">Will be added</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-center" title="Already in your database, or listed twice in this file">
                  <p className="text-xl font-bold text-amber-700">{analysis.duplicates.length}</p>
                  <p className="text-[10px] font-medium text-amber-700">{skipDuplicates ? 'Duplicates skipped' : 'Duplicates (kept)'}</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-3 text-center" title="No name/company, or no phone and no email">
                  <p className="text-xl font-bold text-slate-600">{analysis.skipped.length}</p>
                  <p className="text-[10px] font-medium text-slate-600">Incomplete rows</p>
                </div>
              </div>

              {/* Preview — the first few rows exactly as they will be saved. */}
              {analysis.ready.length > 0 && (
                <div className="rounded-lg border border-slate-200 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        {['Name', 'Company', 'Phone', 'Email', 'Status'].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.ready.slice(0, 5).map(toLead).map(l => (
                        <tr key={l.id} className="border-b border-slate-100 last:border-0">
                          <td className="px-3 py-2 text-xs font-medium text-slate-900">{l.name}</td>
                          <td className="px-3 py-2 text-xs text-slate-600">{l.company || '—'}</td>
                          <td className="px-3 py-2 text-xs text-slate-600">{l.phone || '—'}</td>
                          <td className="px-3 py-2 text-xs text-slate-600">{l.email || '—'}</td>
                          <td className="px-3 py-2 text-xs text-slate-600">{l.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {analysis.ready.length > 5 && (
                    <p className="px-3 py-2 text-[11px] text-slate-500">
                      …and {analysis.ready.length - 5} more.
                    </p>
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
          <button onClick={runImport} disabled={!analysis.ready.length || done > 0}
            title={analysis.ready.length ? '' : 'Nothing to import yet'}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-40">
            <Upload className="h-4 w-4" />
            Import {analysis.ready.length || ''} client{analysis.ready.length === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    </div>
  );
}
