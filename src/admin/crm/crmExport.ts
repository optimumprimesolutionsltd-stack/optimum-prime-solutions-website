// ─────────────────────────────────────────────────────────────────────────────
// CRM export helpers — builds a shareable HTML status report and a unified CSV
// combining Demo Leads (siteData) with Workshop Breakfast attendees (Firebase).
// Both outputs are pure functions returning strings, so they are easy to test
// and are triggered from the admin panel as file downloads.
// ─────────────────────────────────────────────────────────────────────────────
import type { Lead, Client } from '../../data/siteData';
import { PIPELINE_ORDER, defaultNextStep, stageColor, stageReportLabel } from './pipeline';
import { sourceLabel, sourceDetail } from './leadSource';
import { sourcePerformance, formatKes, formatWinRate } from './sourcePerformance';

export interface WorkshopRegistrant {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  message?: string;
  createdAt: string;
  attended?: boolean;
  attendedAt?: string;
  workshopLeadId?: string; // set once converted into the follow-up pipeline
  staff?: boolean;         // internal team member — excluded from prospect exports
  eventId?: string;        // which workshop event they registered for
}

const esc = (s: unknown) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const csvCell = (s: unknown) => `"${String(s ?? '').replace(/"/g, '""')}"`;

const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const fmtDateTime = (iso?: string, time?: string) => {
  if (!iso) return '';
  const date = fmtDate(iso);
  if (!time) return date;
  return `${date} · ${time} EAT`;
};

// Shared tabular data — leads plus any workshop attendees not yet in the pipeline.
// Used by both the CSV and Excel exports so the two stay identical.
function unifiedRows(leads: Lead[], registrants: WorkshopRegistrant[]): { headers: string[]; rows: string[][] } {
  const headers = [
    'Name', 'Company', 'Phone', 'Email', 'Industry',
    'Source', 'Event', 'Attended', 'Stage', 'Next Step',
    'Demo Contact Person', 'Demo Contact Phone', 'Scheduled Demo (EAT)', 'Date Added (EAT)',
    // Licensing — populated on won deals.
    'Serial No.', 'Deal Type', 'Value (KES)', 'Date Won (EAT)',
  ];

  const leadRows = leads.map(l => {
    const eventName = l.source === 'workshop' ? (l.workshopTitle || '')
      : l.source === 'webinar' ? (l.webinarTitle || '')
      // The detail that goes with the channel — which storming drive it came
      // off, or who sent the referral over.
      : sourceDetail(l);
    return [
      l.name, l.company, l.phone, l.email, l.industry || l.businessType || '',
      // Source is just the channel, not the event name. Read off the canonical
      // list rather than falling back to 'Website': that fallback exported
      // every referral, phone call and unattributed lead as a website enquiry.
      sourceLabel(l.source),
      // Event name goes in its own column
      eventName,
      // Attended indicates if they actually showed up
      (l.attendedWorkshop || l.attendedWebinar) ? 'Yes'
        : (l.source === 'workshop' || l.source === 'webinar') ? 'No' : '',
      stageReportLabel(l.status), l.nextStep || defaultNextStep(l.status),
      // Demo contact person (assigned team member)
      l.teamMemberName || '', l.teamMemberPhone || '',
      fmtDateTime(l.scheduledDate, l.scheduledTime), fmtDateTime(l.createdAt),
      // Serial is written as text so Excel doesn't strip a leading zero or turn a
      // 9-digit number into scientific notation.
      l.serialNo || '', l.dealType || '',
      l.amount != null ? String(l.amount) : '',
      l.wonAt ? fmtDateTime(l.wonAt.split('T')[0]) : '',
    ];
  });

  // Workshop registrants who were NOT converted into a lead — so Tally Solutions
  // sees the full room, not just the ones already being worked.
  const convertedRegIds = new Set(leads.map(l => l.workshopRegId).filter(Boolean));
  const registrantRows = registrants
    .filter(r => !convertedRegIds.has(r.id) && !r.staff)
    .map(r => [
      r.name, r.company || '', r.phone, r.email, '',
      'Workshop',
      '', // Event name (not tracked at registrant level)
      r.attended ? 'Yes' : 'No',
      'Not in pipeline', 'Add to follow-up if qualified',
      '', '', // Demo contact person columns (not yet assigned)
      '', fmtDateTime(r.createdAt),
      '', '', '', '', // Licensing columns — nothing sold yet
    ]);

  return { headers, rows: [...leadRows, ...registrantRows] };
}

// ── Unified CSV ─────────────────────────────────────────────────────────────
export function buildUnifiedCsv(leads: Lead[], registrants: WorkshopRegistrant[]): string {
  const { headers, rows } = unifiedRows(leads, registrants);
  return [headers, ...rows].map(row => row.map(csvCell).join(',')).join('\n');
}

// ── Unified Excel (.xls via an HTML table Excel opens natively) ─────────────
export function buildUnifiedXls(leads: Lead[], registrants: WorkshopRegistrant[]): string {
  const { headers, rows } = unifiedRows(leads, registrants);
  const thead = `<tr>${headers.map(h => `<th style="background:#1e3a5f;color:#fff;text-align:left">${esc(h)}</th>`).join('')}</tr>`;
  const tbody = rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('');
  return `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8">
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
<x:Name>CRM</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
</head><body><table border="1">${thead}${tbody}</table></body></html>`;
}

// ── Shareable HTML report — a standalone, self-contained page ────────────────
export function buildCrmReportHtml(
  leads: Lead[],
  registrants: WorkshopRegistrant[],
  opts?: {
    companyName?: string;
    preparedFor?: string;
    // When the report covers a single event, its details title the report.
    workshop?: { title: string; date?: string; venue?: string };
    webinar?: { title: string; date?: string };
    online?: { title: string };
    manual?: { title: string };
    // Closed deals held back by the "Include Closed" toggle. Printed on the
    // report so a thin or empty section reads as a deliberate scope, not as
    // missing data.
    closedExcluded?: number;
    // Client register, so won deals can report the licence they sold.
    clients?: Client[];
  },
): string {
  const companyName = opts?.companyName || 'Optimum Prime Solutions';
  const preparedFor = opts?.preparedFor || 'Tally Solutions';
  const workshop = opts?.workshop;
  const webinar = opts?.webinar;
  const online = opts?.online;
  const manual = opts?.manual;
  const closedExcluded = opts?.closedExcluded || 0;
  const event = workshop || webinar || online || manual;
  const reportTitle = event ? event.title : 'CRM Status Report';
  const generated = new Date().toLocaleString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const convertedRegIds = new Set(leads.map(l => l.workshopRegId).filter(Boolean));
  // Attendance broken out so internal staff are never mixed into the prospect
  // numbers. "Attended" and "Not Attended" count prospects only; staff are
  // reported on their own line; head count is everyone actually in the room.
  const prospectsAttended = registrants.filter(r => r.attended && !r.staff).length;
  const prospectsNoShow   = registrants.filter(r => !r.attended && !r.staff).length;
  const staffPresent      = registrants.filter(r => r.attended && r.staff).length;
  const headCount         = registrants.filter(r => r.attended).length; // prospects + staff in the room
  const workshopLeads = leads.filter(l => l.source === 'workshop').length;
  const webinarLeads = leads.filter(l => l.source === 'webinar').length;
  const onlineLeads = leads.filter(l => l.source === 'website').length;
  const manualLeads = leads.filter(l => l.source === 'manual').length;
  // Leads picked up on the road — field storming, road shows, market visits.
  const fieldLeads = leads.filter(l => l.source === 'field').length;
  const wonLeads = leads.filter(l => l.status === 'Closed Won');
  const won = wonLeads.length;
  // Revenue actually closed, and how much of it is backed by a licence serial —
  // an unsourced win can't be renewed, so the gap is worth showing.
  const wonValue = wonLeads.reduce((sum, l) => sum + (l.amount || 0), 0);
  const wonWithSerial = wonLeads.filter(l => l.serialNo).length;
  // Closed Lost only appears here when the export includes closed deals.
  const lost = leads.filter(l => l.status === 'Closed Lost').length;

  // Source performance for the report. Binned through sourceCategory, so every
  // source the panel can set has a bucket and anything unrecognised falls into
  // "other" — otherwise those leads vanish from the chart AND drop out of the
  // denominator, silently inflating every other source's share.
  //
  // Bars are the VALUE won per source, not the number of leads. A lead count
  // ranks channels by how busy they are; this ranks them by what they brought
  // in, which is the question the report is read to answer. Until deal values
  // have been recorded there is nothing to rank, so it falls back to volume and
  // says so.
  const perf = sourcePerformance(leads);
  const perfByValue = perf.hasValues;
  const maxPerfBar = Math.max(...perf.rows.map(r => (perfByValue ? r.wonValue : r.leads)), 1);
  const sourceChartBars = perf.rows
    .map(r => {
      const pct = ((perfByValue ? r.wonValue : r.leads) / maxPerfBar) * 100;
      const label = r.key === 'online' ? 'Website'
        // The residual bucket, named for what it is. Calling it "Other" made an
        // attribution gap look like a channel we actually sell through.
        : r.key === 'other' ? 'No source recorded'
        : sourceLabel(r.key);
      const color: string = ({
        online: '#3b82f6', workshop: '#f59e0b', webinar: '#8b5cf6',
        field: '#eab308',
        email: '#10b981', whatsapp: '#059669', referral: '#ec4899',
        phone: '#f97316', direct: '#6366f1',
      } as Record<string, string>)[r.key] || '#64748b';
      const detail = [
        `${r.leads} lead${r.leads === 1 ? '' : 's'}`,
        `${r.won} won`,
        r.winRate !== null ? `${formatWinRate(r.winRate)} win rate` : '',
        r.wonValue > 0 ? formatKes(r.wonValue) : '',
      ].filter(Boolean).join(' · ');
      return `<div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; gap: 12px; margin-bottom: 4px;">
          <span style="font-size: 12px; font-weight: 600; color: #1e3a5f;">${esc(label)}</span>
          <span style="font-size: 11px; color: #475569;">${esc(detail)}</span>
        </div>
        <div style="height: 24px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; width: ${pct}%; background: ${color};"></div>
        </div>
      </div>`;
    }).join('');

  // What the totals cannot see, stated rather than silently absorbed.
  const perfNote = !perf.hasValues
    ? 'Bars show lead count — no deal values recorded yet. Enter the value when a deal is marked Closed Won and this ranks by revenue instead.'
    : perf.totalWonWithoutValue > 0
      ? `Bars show value won. ${formatKes(perf.totalWonValue)} across ${perf.totalWon - perf.totalWonWithoutValue} of ${perf.totalWon} won deals — ${perf.totalWonWithoutValue} ${perf.totalWonWithoutValue === 1 ? 'has' : 'have'} no value recorded, so the real figure is higher.`
      : 'Bars show value won. Win rate counts decided deals only.';

  // Group leads by pipeline stage in canonical order.
  const grouped = PIPELINE_ORDER
    .map(stage => ({ stage, items: leads.filter(l => l.status === stage) }))
    .filter(g => g.items.length > 0);

  // Won deals answer different questions from open ones — what was sold, for how
  // much, against which licence, and when — so that section gets its own columns
  // rather than being forced through the demo-scheduling ones.
  const clientBySerial = new Map((opts?.clients || []).map(c => [c.serialNo, c]));
  const wonSection = (items: Lead[]) => `
      <table>
        <thead><tr><th>Contact</th><th>Company</th><th>Serial No.</th><th>Licence</th><th>Sold</th><th>Value (KES)</th><th>Date Won</th></tr></thead>
        <tbody>
          ${items.map(l => {
            const c = l.serialNo ? clientBySerial.get(l.serialNo) : undefined;
            return `
            <tr>
              <td><strong>${esc(l.name)}</strong></td>
              <td>${esc(l.company || '—')}</td>
              <td>${l.serialNo
                ? `<code>${esc(l.serialNo)}</code>`
                : '<span style="color:#b45309">⚠ missing</span>'}</td>
              <td>${c ? esc(`${c.edition} ${c.term}`) : '—'}</td>
              <td>${esc(l.dealType || '—')}</td>
              <td>${l.amount != null ? esc(l.amount.toLocaleString()) : '—'}</td>
              <td><small>${esc(l.wonAt ? fmtDateTime(l.wonAt.split('T')[0]) : '—')}</small></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`;

  const openSection = (items: Lead[]) => `
      <table>
        <thead><tr><th>Contact</th><th>Company</th><th>Phone</th><th>Breakfast</th><th>Demo Contact</th><th>Scheduled Demo (EAT)</th><th>Next Step</th></tr></thead>
        <tbody>
          ${items.map(l => `
            <tr>
              <td><strong>${esc(l.name)}</strong>${l.source === 'workshop' ? ' <span class="tag">🥐 workshop</span>' : ''}</td>
              <td>${esc(l.company || '—')}</td>
              <td>${esc(l.phone || '—')}</td>
              <td>${l.attendedWorkshop ? '✅' : (l.source === 'workshop' ? '—' : '')}</td>
              <td><small>${esc(l.teamMemberName || '—')}<br>${esc(l.teamMemberPhone || '')}</small></td>
              <td><small>${esc(fmtDateTime(l.scheduledDate, l.scheduledTime) || '—')}</small></td>
              <td>${esc(l.nextStep || defaultNextStep(l.status))}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;

  const stageSections = grouped.map(g => `
    <section class="stage">
      <h3><span class="dot" style="background:${stageColor(g.stage)}"></span>${esc(stageReportLabel(g.stage))} <span class="count">${g.items.length}</span></h3>
      ${g.stage === 'Closed Won' ? wonSection(g.items) : openSection(g.items)}
    </section>`).join('');

  // Workshop attendees still awaiting a follow-up decision (staff excluded).
  const pendingReg = registrants.filter(r => !convertedRegIds.has(r.id) && !r.staff);
  const pendingSection = pendingReg.length === 0 ? '' : `
    <section class="stage">
      <h3><span class="dot" style="background:#94a3b8"></span>Workshop attendees — not yet in pipeline <span class="count">${pendingReg.length}</span></h3>
      <table>
        <thead><tr><th>Contact</th><th>Company</th><th>Phone</th><th>Breakfast</th><th>Registered (EAT)</th></tr></thead>
        <tbody>
          ${pendingReg.map(r => `
            <tr>
              <td><strong>${esc(r.name)}</strong></td>
              <td>${esc(r.company || '—')}</td>
              <td>${esc(r.phone || '—')}</td>
              <td>${r.attended ? '✅' : '—'}</td>
              <td><small>${esc(fmtDateTime(r.createdAt))}</small></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </section>`;

  // Staff / internal team roster — who was there to run the event. Shown near
  // the top so the reader can separate the team from the prospects at a glance.
  const staffRows = registrants.filter(r => r.staff);
  const staffSection = staffRows.length === 0 ? '' : `
    <section class="stage">
      <h3><span class="dot" style="background:#64748b"></span>Staff / internal team <span class="count">${staffRows.length}</span></h3>
      <table>
        <thead><tr><th>Name</th><th>Company</th><th>Phone</th><th>Present</th></tr></thead>
        <tbody>
          ${staffRows.map(r => `
            <tr>
              <td><strong>${esc(r.name)}</strong></td>
              <td>${esc(r.company || '—')}</td>
              <td>${esc(r.phone || '—')}</td>
              <td>${r.attended ? '✅' : '—'}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </section>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(reportTitle)} — ${esc(companyName)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; background: #f8fafc; }
  .wrap { max-width: 900px; margin: 0 auto; padding: 32px 20px 60px; }
  header.rpt { border-bottom: 3px solid #1e3a5f; padding-bottom: 16px; margin-bottom: 24px; }
  header.rpt h1 { margin: 0 0 4px; font-size: 22px; color: #1e3a5f; }
  header.rpt p { margin: 2px 0; font-size: 13px; color: #64748b; }
  .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 28px; }
  .kpi { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; text-align: center; }
  .kpi b { display: block; font-size: 24px; color: #1e3a5f; }
  .kpi span { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: .04em; }
  .stage { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 18px; margin-bottom: 18px; }
  .stage h3 { margin: 0 0 12px; font-size: 15px; display: flex; align-items: center; gap: 8px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .count { background: #f1f5f9; color: #475569; border-radius: 999px; padding: 1px 9px; font-size: 12px; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; color: #94a3b8; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: .03em; padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }
  td { padding: 8px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
  .tag { font-size: 10px; background: #fef3c7; color: #92400e; border-radius: 6px; padding: 1px 6px; font-weight: 600; }
  footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; }
  @media print { body { background: #fff; } .stage, .kpi { break-inside: avoid; } }
</style></head>
<body><div class="wrap">
  <header class="rpt">
    <h1>${esc(reportTitle)}</h1>
    <p><strong>${esc(companyName)}</strong> — ${
      workshop ? 'workshop follow-up &amp; sales pipeline'
      : webinar ? 'webinar follow-up &amp; sales pipeline'
      : online ? 'online demo pipeline'
      : manual ? 'manual lead pipeline'
      : 'sales pipeline'
    }</p>
    ${workshop && (workshop.date || workshop.venue)
      ? `<p>${esc([workshop.date, workshop.venue].filter(Boolean).join(' · '))}</p>`
      : webinar && webinar.date
      ? `<p>${esc(webinar.date)}</p>`
      : ''}
    <p>Prepared for: ${esc(preparedFor)}</p>
    <p>Generated: ${esc(generated)}</p>
    ${closedExcluded > 0
      ? `<p style="color:#b45309;font-weight:600">Scope: open pipeline only — ${closedExcluded} closed deal${closedExcluded === 1 ? '' : 's'} excluded</p>`
      : ''}
  </header>

  <div class="kpis">
    <div class="kpi"><b>${leads.length}</b><span>Total Leads</span></div>
    ${registrants.length > 0 ? `
      <div class="kpi"><b>${registrants.length}</b><span>Workshop Registered</span></div>
      <div class="kpi"><b>${prospectsAttended}</b><span>Attended (Prospects)</span></div>
      <div class="kpi"><b>${prospectsNoShow}</b><span>Not Attended</span></div>
      <div class="kpi"><b>${staffPresent}</b><span>Staff Present</span></div>
      <div class="kpi"><b>${headCount}</b><span>Total Head Count</span></div>
    ` : ''}
    ${workshopLeads > 0 ? `<div class="kpi"><b>${workshopLeads}</b><span>Workshop → Pipeline</span></div>` : ''}
    ${webinarLeads > 0 ? `<div class="kpi"><b>${webinarLeads}</b><span>Webinar → Pipeline</span></div>` : ''}
    ${onlineLeads > 0 ? `<div class="kpi"><b>${onlineLeads}</b><span>Online → Pipeline</span></div>` : ''}
    ${fieldLeads > 0 ? `<div class="kpi"><b>${fieldLeads}</b><span>Field / Marketing → Pipeline</span></div>` : ''}
    ${manualLeads > 0 ? `<div class="kpi"><b>${manualLeads}</b><span>Manual → Pipeline</span></div>` : ''}
    ${closedExcluded > 0 ? '' : `<div class="kpi"><b>${won}</b><span>Closed Won</span></div>`}
    ${closedExcluded === 0 && wonValue > 0 ? `<div class="kpi"><b>${wonValue.toLocaleString()}</b><span>Won Value (KES)</span></div>` : ''}
    ${closedExcluded === 0 && won > 0 && wonWithSerial < won ? `<div class="kpi"><b>${won - wonWithSerial}</b><span>Won — Serial Missing</span></div>` : ''}
    ${lost > 0 ? `<div class="kpi"><b>${lost}</b><span>Closed Lost</span></div>` : ''}
  </div>

  ${sourceChartBars ? `<section class="stage" style="margin-bottom: 28px;">
    <h3 style="margin-bottom: 6px;">📊 Source performance</h3>
    <p style="margin: 0 0 16px; font-size: 11px; color: #64748b;">${esc(perfNote)}</p>
    <div style="padding: 0 8px;">
      ${sourceChartBars}
    </div>
  </section>` : ''}

  ${staffSection}
  ${stageSections || (closedExcluded > 0
    ? `<p style="color:#64748b">No open leads — all ${closedExcluded} lead${closedExcluded === 1 ? '' : 's'} here ${closedExcluded === 1 ? 'is' : 'are'} closed and excluded from this report.</p>`
    : '<p style="color:#64748b">No leads in the pipeline yet.</p>')}
  ${pendingSection}

  <footer>Confidential — generated by ${esc(companyName)} admin panel. Figures reflect data at time of export.</footer>
</div></body></html>`;
}

// ── Trigger a browser download for a string payload ─────────────────────────
export function downloadFile(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  // The anchor must be in the DOM for the download to fire in some browsers
  // (Firefox), and the object URL has to outlive the click — revoking it
  // immediately (as before) aborted the save. Append, click, then revoke late.
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

// ── Render an HTML report to PDF via the browser's print dialog ──────────────
// Produces a real PDF (user picks "Save as PDF" as the destination) without
// bundling a heavy PDF library, and keeps the report's exact styling.
//
// The report opens in its OWN browser tab and prints from there. This is
// deliberate: printing a hidden iframe could blank the admin page when the
// print dialog was cancelled, and a plain pop-up got blocked. Because this runs
// from a click (a user gesture), the new tab is allowed; and since the print
// dialog belongs to the report tab, cancelling it never disturbs the admin app.
export function printHtml(html: string) {
  // A fixed "Save as PDF" bar so the user doesn't have to know the Ctrl+P /
  // "change destination to Save as PDF" trick. It sits above the report, is
  // hidden when the page actually prints (so it never appears in the saved
  // PDF), and is injected only here — the "Download as Web page" export stays
  // clean. The hint reminds them to pick "Save as PDF" as the destination,
  // which is the one step the button itself can't do for them.
  const printBar = `
<style>
  .op-print-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
    display: flex; align-items: center; justify-content: center; gap: 14px;
    background: #1e3a5f; padding: 10px 16px; box-shadow: 0 2px 10px rgba(0,0,0,.25);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .op-print-bar button { border: 0; border-radius: 8px; padding: 10px 20px;
    font-size: 14px; font-weight: 700; cursor: pointer; }
  .op-save { background: #e53e3e; color: #fff; }
  .op-close { background: rgba(255,255,255,.15); color: #fff; }
  .op-hint { color: #cbd5e1; font-size: 12px; }
  body { padding-top: 60px; }
  @media print { .op-print-bar { display: none !important; } body { padding-top: 0 !important; } }
</style>
<div class="op-print-bar">
  <button class="op-save" onclick="window.print()">⬇ Save as PDF</button>
  <span class="op-hint">In the dialog, set <b>Destination</b> to <b>“Save as PDF”</b>, then Save.</span>
  <button class="op-close" onclick="window.close()">Close</button>
</div>`;
  const withBar = html.replace('<body>', `<body>${printBar}`);
  const blob = new Blob([withBar], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, '_blank');
  if (!w) {
    URL.revokeObjectURL(url);
    alert('Please allow pop-ups for this site, then choose "Download as PDF" again. '
      + 'The report opens in a new tab where you can Save as PDF.');
    return;
  }
  // Give the new tab time to load the blob before releasing the URL.
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
