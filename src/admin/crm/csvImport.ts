// ─────────────────────────────────────────────────────────────────────────────
// Shared plumbing for the admin CSV importers (leads, subscribers).
// Reading a spreadsheet is the same job everywhere — parse it, work out which
// column is which, and recognise a contact you already hold — so it lives here
// once rather than drifting between the dialogs that use it.
// ─────────────────────────────────────────────────────────────────────────────

// A column an importer can map onto one of its own fields. `aliases` are the
// header names auto-detected on load — the matching export's own labels first,
// then the wording other systems and hand-made spreadsheets tend to use.
export interface ImportField {
  key: string;
  label: string;
  aliases: string[];
}

// ── CSV parsing ─────────────────────────────────────────────────────────────
// Hand-rolled rather than a dependency: it has to survive quoted fields
// containing commas and line breaks, doubled quotes ("" → "), CRLF line endings
// and the BOM Excel writes at the front of the file.
export function parseCsv(text: string): string[][] {
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

// Match each field to a column: an exact label match wins, then an exact alias,
// then a header that merely contains one. Unmatched fields come back as -1.
export function autoMapColumns(headers: string[], fields: ImportField[]): Record<string, number> {
  const lower = headers.map(h => h.toLowerCase().trim());
  const mapping: Record<string, number> = {};
  fields.forEach(f => {
    let idx = lower.findIndex(h => h === f.label.toLowerCase());
    if (idx === -1) idx = lower.findIndex(h => f.aliases.includes(h));
    if (idx === -1) idx = lower.findIndex(h => h && f.aliases.some(a => h.includes(a)));
    mapping[f.key] = idx;
  });
  return mapping;
}

// ── Matching people you already hold ────────────────────────────────────────
// Phones compare on digits only, last 9 of them: +254 712 345 678, 0712345678
// and 254712345678 are the same person.
export const phoneKey = (p: string): string => {
  const digits = (p || '').replace(/\D/g, '');
  return digits.length >= 9 ? digits.slice(-9) : digits;
};

export const emailKey = (e: string): string => (e || '').trim().toLowerCase();

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Dates ───────────────────────────────────────────────────────────────────
// Accepts ISO, yyyy-mm-dd, and the dd/mm/yyyy the exports write (en-GB).
// Anything unreadable falls back to "now" rather than poisoning the record.
export function parseImportDate(raw: string): string {
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

// Trigger a browser download of a CSV built in memory — used by the importers'
// "blank template" links.
export function downloadCsv(filename: string, csv: string): void {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
