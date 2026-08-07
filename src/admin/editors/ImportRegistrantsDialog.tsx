import { useMemo, useRef, useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle2, FileSpreadsheet, Download } from 'lucide-react';
import { fbSet } from '../../firebase/config';
import {
  parseCsv, autoMapColumns, phoneKey, emailKey, parseImportDate, downloadCsv,
  type ImportField,
} from '../crm/csvImport';

// ─────────────────────────────────────────────────────────────────────────────
// Bulk import of workshop RSVPs from a CSV — the mirror of the "Export CSV"
// button on the same screen, and the same flow as the leads and subscriber
// importers: read the file, match the columns, show the count, then write.
//
// Registrations belong to one workshop, so everything here is scoped to the
// event selected on screen: the rows land on that workshop, and duplicates are
// judged against that workshop's list only. The same person attending two
// workshops is two registrations, not a duplicate.
// ─────────────────────────────────────────────────────────────────────────────

interface ExistingRegistrant { email: string; phone: string; }

interface Props {
  eventId: string;
  eventTitle: string;
  existing: ExistingRegistrant[];
  onClose: () => void;
  onImported: (count: number) => void;
}

const FIELDS: ImportField[] = [
  { key: 'name',      label: 'Name',          aliases: ['name', 'full name', 'attendee', 'attendee name', 'contact name', 'participant'] },
  { key: 'email',     label: 'Email',         aliases: ['email', 'e-mail', 'email address', 'mail'] },
  { key: 'phone',     label: 'Phone',         aliases: ['phone', 'phone number', 'mobile', 'mobile number', 'tel', 'telephone', 'contact'] },
  { key: 'company',   label: 'Company',       aliases: ['company', 'company name', 'organisation', 'organization', 'business', 'firm'] },
  { key: 'type',      label: 'Type',          aliases: ['type', 'staff', 'role', 'category'] },
  { key: 'createdAt', label: 'Registered At', aliases: ['registered at', 'registered', 'date', 'date registered', 'rsvp date', 'created'] },
  { key: 'attended',  label: 'Attended',      aliases: ['attended', 'attendance', 'checked in', 'present', 'turned up'] },
];

const isYes = (raw: string) => {
  const v = (raw || '').trim().toLowerCase();
  return v === 'yes' || v === 'y' || v === 'true' || v === '1' || v === 'attended' || v === 'present';
};

// Only an explicit staff marker flags someone internal — everyone else is a
// prospect, which is what keeps the headcount and pipeline numbers honest.
const isStaff = (raw: string) => {
  const v = (raw || '').trim().toLowerCase();
  return v === 'staff' || v === 'internal' || v === 'team' || v === 'yes';
};

export default function ImportRegistrantsDialog({ eventId, eventTitle, existing, onClose, onImported }: Props) {
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
  const [markAttended, setMarkAttended] = useState(false);

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
        setError('That file has no data rows — it needs a header row plus at least one attendee.');
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

  // ── What the file will actually do to this workshop's list ──────────────
  const analysis = useMemo(() => {
    const knownEmails = new Set(existing.map(r => emailKey(r.email)).filter(Boolean));
    const knownPhones = new Set(existing.map(r => phoneKey(r.phone)).filter(Boolean));
    const seenEmails = new Set<string>();
    const seenPhones = new Set<string>();

    const ready: string[][] = [];
    const duplicates: string[][] = [];
    const skipped: string[][] = [];

    rows.forEach(r => {
      const name = cell(r, 'name');
      const phone = cell(r, 'phone');
      const email = cell(r, 'email');

      // A sign-up sheet needs a person and a way to reach them.
      if (!name || !(phone || email)) { skipped.push(r); return; }

      const ek = emailKey(email);
      const pk = phoneKey(phone);
      const isDup =
        (!!ek && (knownEmails.has(ek) || seenEmails.has(ek))) ||
        (!!pk && (knownPhones.has(pk) || seenPhones.has(pk)));

      if (isDup) { duplicates.push(r); if (skipDuplicates) return; }
      if (ek) seenEmails.add(ek);
      if (pk) seenPhones.add(pk);
      ready.push(r);
    });

    return { ready, duplicates, skipped };
  }, [rows, mapping, skipDuplicates, existing]);

  const toRecord = (r: string[]) => {
    const company = cell(r, 'company');
    // The checkbox is for the common case: a paper sign-in sheet typed up after
    // the event, where everyone on it was in the room.
    const attended = markAttended || isYes(cell(r, 'attended'));
    const createdAt = parseImportDate(cell(r, 'createdAt'));
    return {
      name: cell(r, 'name'),
      email: cell(r, 'email'),
      phone: cell(r, 'phone'),
      ...(company ? { company } : {}),
      createdAt,
      attended,
      // Firebase rejects undefined, so optional fields are spread in or absent.
      ...(attended ? { attendedAt: createdAt } : {}),
      ...(isStaff(cell(r, 'type')) ? { staff: true } : {}),
      eventId,
    };
  };

  const runImport = async () => {
    if (!analysis.ready.length || saving) return;
    setSaving(true);
    setError('');

    const stamp = Date.now();
    const results = await Promise.all(
      analysis.ready.map((r, i) => fbSet(`workshop_registrants/${stamp}-${i}`, toRecord(r)))
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
      setError(`${failed} of ${results.length} could not be saved. Re-run the file to retry them — the ones already added will show as duplicates.`);
      setSaving(false);
      return;
    }
    setTimeout(onClose, 1600);
  };

  const downloadTemplate = () => downloadCsv('workshop-rsvps-import-template.csv', [
    FIELDS.map(f => f.label).join(','),
    '"Jane Mwangi","jane@mwangihardware.co.ke","+254 712 345 678","Mwangi Hardware Ltd","Prospect","06/08/2026","Yes"',
  ].join('\n'));

  const reset = () => {
    setFileName(''); setHeaders([]); setRows([]); setMapping({}); setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-900">Import RSVPs from CSV</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Everyone in this file joins <span className="font-semibold">{eventTitle}</span>.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 shrink-0"><X className="h-5 w-5" /></button>
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
                {done} attendee{done === 1 ? '' : 's'} added to this workshop.
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
                  Needs a header row. A name plus a phone or email is enough — good for typing up a paper sign-in sheet.
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

              <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={skipDuplicates} onChange={e => setSkipDuplicates(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-accent focus:ring-accent" />
                  <span className="text-xs text-slate-600">
                    Skip people already registered for this workshop (matched on email or phone)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={markAttended} onChange={e => setMarkAttended(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-accent focus:ring-accent" />
                  <span className="text-xs text-slate-600">
                    Mark everyone in this file as attended — for typing up a sign-in sheet after the event
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-green-50 p-3 text-center">
                  <p className="text-xl font-bold text-green-700">{analysis.ready.length}</p>
                  <p className="text-[10px] font-medium text-green-700">Will be added</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-center" title="Already on this workshop's list, or listed twice in this file">
                  <p className="text-xl font-bold text-amber-700">{analysis.duplicates.length}</p>
                  <p className="text-[10px] font-medium text-amber-700">{skipDuplicates ? 'Duplicates skipped' : 'Duplicates (kept)'}</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-3 text-center" title="No name, or no phone and no email">
                  <p className="text-xl font-bold text-slate-600">{analysis.skipped.length}</p>
                  <p className="text-[10px] font-medium text-slate-600">Incomplete rows</p>
                </div>
              </div>

              {analysis.ready.length > 0 && (
                <div className="rounded-lg border border-slate-200 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        {['Name', 'Company', 'Phone', 'Type', 'Attended'].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.ready.slice(0, 5).map(toRecord).map((r, i) => (
                        <tr key={i} className="border-b border-slate-100 last:border-0">
                          <td className="px-3 py-2 text-xs font-medium text-slate-900">{r.name}</td>
                          <td className="px-3 py-2 text-xs text-slate-600">{r.company || '—'}</td>
                          <td className="px-3 py-2 text-xs text-slate-600">{r.phone || '—'}</td>
                          <td className="px-3 py-2 text-xs text-slate-600">{'staff' in r ? 'Staff' : 'Prospect'}</td>
                          <td className="px-3 py-2 text-xs text-slate-600">{r.attended ? 'Yes' : 'No'}</td>
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
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition disabled:opacity-40">
            <Upload className="h-4 w-4" />
            {saving ? 'Importing…' : `Import ${analysis.ready.length || ''} attendee${analysis.ready.length === 1 ? '' : 's'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
