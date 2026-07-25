import { useState, useMemo, useEffect } from 'react';
import {
  Search, Trash2, Mail, Phone, Building2, Calendar, ChevronDown,
  Download, Plus, X, CheckCircle2, Loader2, CalendarDays, MapPin,
  User, Send, AlertCircle, FileText,
} from 'lucide-react';
import type { SiteData, Lead } from '../../data/siteData';
import { fbSubscribe, fbSet } from '../../firebase/config';
import {
  buildCrmReportHtml, buildUnifiedCsv, buildUnifiedXls, downloadFile, printHtml,
  type WorkshopRegistrant,
} from '../crm/crmExport';
import { PIPELINE_ORDER, stageColor, stageTint, defaultNextStep } from '../crm/pipeline';

interface P { data: SiteData; onSave: (d: SiteData) => void }

const BACKEND_URL = 'https://optimum-prime-lead-notifier.onrender.com';

const INDUSTRIES = [
  'Manufacturing', 'Distribution & Wholesale', 'Retail', 'Construction',
  'Hardware & Building Materials', 'NGO / Non-Profit', 'School / Education',
  'SACCO / Cooperative', 'Professional Services', 'Other',
];

// ── Kenya Public Holidays (recurring annual dates as MM-DD) ──────────────────
const KE_HOLIDAYS_RECURRING = new Set([
  '01-01', // New Year's Day
  '05-01', // Labour Day
  '06-01', // Madaraka Day
  '10-10', // Huduma Day
  '10-20', // Mashujaa Day
  '12-12', // Jamhuri Day
  '12-25', // Christmas Day
  '12-26', // Boxing Day
]);
// One-off holidays (YYYY-MM-DD) — add upcoming ones as needed
const KE_HOLIDAYS_ONEOFF = new Set([
  '2026-04-03', // Good Friday 2026
  '2026-04-06', // Easter Monday 2026
  '2027-03-26', // Good Friday 2027
  '2027-03-29', // Easter Monday 2027
]);

function isKenyaHoliday(dateStr: string): boolean {
  if (!dateStr) return false;
  const mmdd = dateStr.slice(5); // "MM-DD"
  return KE_HOLIDAYS_RECURRING.has(mmdd) || KE_HOLIDAYS_ONEOFF.has(dateStr);
}

function getDayOfWeek(dateStr: string): number {
  // Returns 0=Sun, 1=Mon ... 6=Sat
  if (!dateStr) return -1;
  return new Date(dateStr + 'T12:00:00').getDay();
}

function isDateBlocked(dateStr: string): boolean {
  if (!dateStr) return false;
  const dow = getDayOfWeek(dateStr);
  if (dow === 0) return true; // Sunday
  if (isKenyaHoliday(dateStr)) return true;
  return false;
}

// ── Working hours per day ────────────────────────────────────────────────────
// Weekday: 8:00–17:00, Saturday: 8:00–12:00
function getAvailableHours(dateStr: string): { start: number; end: number } | null {
  if (!dateStr) return null;
  if (isDateBlocked(dateStr)) return null;
  const dow = getDayOfWeek(dateStr);
  if (dow === 6) return { start: 8, end: 12 }; // Saturday
  return { start: 8, end: 17 }; // Mon–Fri
}

// ── Generate time slots (30-min intervals) ───────────────────────────────────
function generateTimeSlots(dateStr: string): { value: string; label: string; blocked: boolean }[] {
  const hours = getAvailableHours(dateStr);
  if (!hours) return [];
  const slots: { value: string; label: string; blocked: boolean }[] = [];
  for (let h = hours.start; h < hours.end; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const value = `${hh}:${mm}`;
      const ampm = h < 12 ? 'AM' : 'PM';
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const label = `${h12}:${mm} ${ampm}`;
      slots.push({ value, label, blocked: false });
    }
  }
  return slots;
}

// ── Status config ────────────────────────────────────────────────────────────
// Stages come from the shared pipeline module so every surface stays in sync.
const statuses = PIPELINE_ORDER;
const statusBadgeStyle = (status: string) => ({ backgroundColor: stageColor(status), color: '#fff' });

// ── Manual booking form ──────────────────────────────────────────────────────
interface BookingForm {
  clientName: string; clientPhone: string; clientEmail: string;
  clientCompany: string; clientIndustry: string;
  demoType: 'online' | 'physical';
  demoDate: string; demoTime: string; demoLocation: string; demoNotes: string;
  teamMemberName: string; teamMemberPhone: string;
  extraTeam: TeamMember[];
  notifyClient: boolean;
}
const emptyBooking: BookingForm = {
  clientName: '', clientPhone: '', clientEmail: '',
  clientCompany: '', clientIndustry: '',
  demoType: 'online', demoDate: '', demoTime: '', demoLocation: '', demoNotes: '',
  teamMemberName: '', teamMemberPhone: '',
  extraTeam: [],
  notifyClient: true,
};

// ── Team member entry ───────────────────────────────────────────────────────
interface TeamMember { name: string; phone: string; }

// ── Schedule panel state ─────────────────────────────────────────────────────
interface ScheduleForm {
  scheduledDate: string; scheduledTime: string;
  demoType: 'online' | 'physical'; demoLocation: string;
  teamMemberName: string; teamMemberPhone: string;
  extraTeam: TeamMember[];
  demoNotes: string;
}

export default function LeadsManager({ data, onSave }: P) {
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedId, setExpandedId]   = useState<string | null>(null);

  // Workshop attendees — pulled in for the unified CRM report / export
  const [registrants, setRegistrants] = useState<WorkshopRegistrant[]>([]);
  useEffect(() => {
    const unsub = fbSubscribe('workshop_registrants', (raw: Record<string, any> | null) => {
      setRegistrants(raw ? Object.entries(raw).map(([id, v]) => ({ id, ...(v as object) }) as WorkshopRegistrant) : []);
    });
    return unsub;
  }, []);

  const companyName = data.company?.name || 'Optimum Prime Solutions';

  // ── Export controls: date range + whether to include closed deals ──────────
  const [exportFrom, setExportFrom]   = useState('');
  const [exportTo, setExportTo]       = useState('');
  const [includeClosed, setIncludeClosed] = useState(false);

  const inDateRange = (iso: string) => {
    const t = new Date(iso).getTime();
    if (exportFrom && t < new Date(exportFrom + 'T00:00:00').getTime()) return false;
    if (exportTo && t > new Date(exportTo + 'T23:59:59').getTime()) return false;
    return true;
  };

  // The date range scopes the whole Demo Leads view — stats, tab counts and the
  // list — so the numbers always match the chosen period.
  const dateScopedLeads = useMemo(
    () => data.leads.filter(l => inDateRange(l.createdAt)),
    [data.leads, exportFrom, exportTo],
  );

  // Leads to export: the date-scoped set, open pipeline by default (New → Demo
  // Done) unless the user opts to include Closed Won/Lost.
  const exportLeads = useMemo(
    () => dateScopedLeads.filter(l => includeClosed || (l.status !== 'Closed Won' && l.status !== 'Closed Lost')),
    [dateScopedLeads, includeClosed],
  );

  const exportRegistrants = useMemo(
    () => registrants.filter(r => inDateRange(r.createdAt)),
    [registrants, exportFrom, exportTo],
  );

  const reportHtml = () => buildCrmReportHtml(exportLeads, exportRegistrants, { companyName, preparedFor: 'Tally Solutions' });
  const downloadReport = (format: string) => {
    if (format === 'pdf') printHtml(reportHtml());
    else if (format === 'excel') downloadFile('crm-report.xls', buildUnifiedXls(exportLeads, exportRegistrants), 'application/vnd.ms-excel');
    else if (format === 'csv') downloadFile('crm-report.csv', buildUnifiedCsv(exportLeads, exportRegistrants), 'text/csv');
    else if (format === 'html') downloadFile('crm-status-report.html', reportHtml(), 'text/html');
  };

  // Re-date already-converted workshop leads to their workshop registration date
  // (older ones carry the conversion date). Runs only on user click, so it acts
  // on fully-loaded data — never a silent rewrite.
  const regCreatedById = useMemo(() => {
    const m = new Map<string, string>();
    registrants.forEach(r => { if (r.createdAt) m.set(r.id, r.createdAt); });
    return m;
  }, [registrants]);
  const workshopDateFixCount = useMemo(() => data.leads.filter(l =>
    l.source === 'workshop' && l.workshopRegId
    && regCreatedById.has(l.workshopRegId)
    && regCreatedById.get(l.workshopRegId) !== l.createdAt
  ).length, [data.leads, regCreatedById]);
  const fixWorkshopDates = () => {
    if (workshopDateFixCount === 0) return;
    if (!confirm(`Set the date of ${workshopDateFixCount} workshop lead(s) to their workshop registration date, so date filters line up with the workshop?`)) return;
    onSave({ ...data, leads: data.leads.map(l => {
      if (l.source === 'workshop' && l.workshopRegId) {
        const c = regCreatedById.get(l.workshopRegId);
        if (c && c !== l.createdAt) return { ...l, createdAt: c };
      }
      return l;
    }) });
  };

  // Permanently remove all Closed Lost leads to declutter the pipeline.
  const closedLostCount = useMemo(() => data.leads.filter(l => l.status === 'Closed Lost').length, [data.leads]);
  const deleteClosedLost = () => {
    if (closedLostCount === 0) return;
    if (confirm(`Permanently delete all ${closedLostCount} "Closed Lost" lead(s)? This cannot be undone.`)) {
      // Also clear them from the /leads node, otherwise the live sync
      // re-merges them back in and the delete appears not to work.
      data.leads.filter(l => l.status === 'Closed Lost').forEach(l => fbSet(`leads/${l.id}`, null));
      onSave({ ...data, leads: data.leads.filter(l => l.status !== 'Closed Lost') });
      setSelectedIds(new Set());
    }
  };

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus]   = useState('Contacted');

  // Booking panel
  const [showBooking, setShowBooking] = useState(false);
  const [booking, setBooking]         = useState<BookingForm>(emptyBooking);
  const [bookingError, setBookingError] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Schedule panel (per-lead)
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [schedForm, setSchedForm]       = useState<ScheduleForm>({
    scheduledDate: '', scheduledTime: '', demoType: 'online',
    demoLocation: '', teamMemberName: '', teamMemberPhone: '',
    extraTeam: [], demoNotes: '',
  });
  const [schedSubmitting, setSchedSubmitting] = useState(false);
  const [schedError, setSchedError]           = useState('');

  // Edit mode for already-scheduled leads
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError]   = useState('');
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  const setB = (f: keyof BookingForm, v: string | boolean) =>
    setBooking(prev => ({ ...prev, [f]: v }));
  const setS = (f: keyof ScheduleForm, v: string) =>
    setSchedForm(prev => ({ ...prev, [f]: v }));

  // ── Extra team members helpers (schedule/edit panel) ────────────────────
  const addExtraTeam = () =>
    setSchedForm(prev => ({ ...prev, extraTeam: [...prev.extraTeam, { name: '', phone: '' }] }));
  const removeExtraTeam = (i: number) =>
    setSchedForm(prev => ({ ...prev, extraTeam: prev.extraTeam.filter((_, idx) => idx !== i) }));
  const setExtraTeam = (i: number, field: keyof TeamMember, val: string) =>
    setSchedForm(prev => ({
      ...prev,
      extraTeam: prev.extraTeam.map((m, idx) => idx === i ? { ...m, [field]: val } : m),
    }));

  // ── Extra team members helpers (booking panel) ───────────────────────────
  const addBookingExtraTeam = () =>
    setBooking(prev => ({ ...prev, extraTeam: [...prev.extraTeam, { name: '', phone: '' }] }));
  const removeBookingExtraTeam = (i: number) =>
    setBooking(prev => ({ ...prev, extraTeam: prev.extraTeam.filter((_, idx) => idx !== i) }));
  const setBookingExtraTeam = (i: number, field: keyof TeamMember, val: string) =>
    setBooking(prev => ({
      ...prev,
      extraTeam: prev.extraTeam.map((m, idx) => idx === i ? { ...m, [field]: val } : m),
    }));

  // ── Booked slots (for conflict detection) ───────────────────────────────
  // Excludes the lead currently being edited so its own slot isn't shown as blocked
  const bookedSlots = useMemo(() =>
    new Set(
      data.leads
        .filter(l => l.status === 'Demo Scheduled' && l.scheduledDate && l.scheduledTime && l.id !== editingId)
        .map(l => `${l.scheduledDate}|${l.scheduledTime}`)
    ), [data.leads, editingId]);

  // ── Filtered leads ───────────────────────────────────────────────────────
  const filtered = dateScopedLeads
    .filter(l => filterStatus === 'All' || l.status === filterStatus)
    .filter(l => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return l.name.toLowerCase().includes(q)
        || l.email.toLowerCase().includes(q)
        || (l.company || '').toLowerCase().includes(q)
        || l.phone.includes(q);
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // ── Status update ────────────────────────────────────────────────────────
  // Reclassify a mistakenly-added lead as internal staff: flag the linked
  // workshop registrant as Staff (so it's sorted over in Workshop RSVPs) and
  // remove the lead from the pipeline. For a non-workshop lead it just removes.
  const markAsStaff = (lead: Lead) => {
    const w = lead.workshopRegId ? ' and mark them Staff in Workshop RSVPs' : '';
    if (!confirm(`Mark ${lead.name} as internal staff? This removes them from Demo Leads${w}.`)) return;
    if (lead.workshopRegId) fbSet(`workshop_registrants/${lead.workshopRegId}/staff`, true);
    fbSet(`leads/${lead.id}`, null);
    onSave({ ...data, leads: data.leads.filter(l => l.id !== lead.id) });
  };

  const updateStatus = (id: string, status: string) => {
    onSave({ ...data, leads: data.leads.map(l => l.id === id ? { ...l, status } : l) });
    if (status === 'Demo Scheduled') {
      setSchedulingId(id);
      const lead = data.leads.find(l => l.id === id);
      setSchedForm({
        // Pre-fill with already-saved schedule details first,
        // then fall back to the client's requested preferences
        scheduledDate: lead?.scheduledDate || lead?.demoDate || '',
        scheduledTime: lead?.scheduledTime || lead?.demoTime || '',
        demoType: lead?.demoType || 'online',
        demoLocation: lead?.demoLocation || '',
        teamMemberName: lead?.teamMemberName || '',
        teamMemberPhone: lead?.teamMemberPhone || '',
        extraTeam: (lead as any)?.extraTeam || [],
        demoNotes: lead?.demoNotes || lead?.message || '',
      });
      setSchedError('');
    } else {
      if (schedulingId === id) setSchedulingId(null);
    }
  };

  const removeLead = (id: string) => {
    if (confirm('Delete this lead permanently?')) {
      fbSet(`leads/${id}`, null); // remove from the /leads node too, or the sync re-adds it
      onSave({ ...data, leads: data.leads.filter(l => l.id !== id) });
    }
  };

  // ── Bulk selection helpers ───────────────────────────────────────────────
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allFilteredSelected = filtered.length > 0 && filtered.every(l => selectedIds.has(l.id));

  const toggleSelectAll = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allFilteredSelected) filtered.forEach(l => next.delete(l.id));
      else filtered.forEach(l => next.add(l.id));
      return next;
    });
  };

  const applyBulkStatus = () => {
    if (selectedIds.size === 0) return;
    onSave({
      ...data,
      leads: data.leads.map(l => selectedIds.has(l.id) ? { ...l, status: bulkStatus } : l),
    });
    setSelectedIds(new Set());
  };

  const bulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Delete ${selectedIds.size} lead(s) permanently?`)) {
      selectedIds.forEach(id => fbSet(`leads/${id}`, null)); // also clear from the /leads node
      onSave({ ...data, leads: data.leads.filter(l => !selectedIds.has(l.id)) });
      setSelectedIds(new Set());
    }
  };

  // ── Export CSV ───────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Industry', 'Business Type',
      'Demo Date (Requested)', 'Scheduled Date', 'Scheduled Time', 'Demo Type',
      'Location', 'Team Member', 'Current Software', 'Message', 'Status', 'Next Step',
      'Source', 'Attended Breakfast', 'Date Submitted'];
    const rows = exportLeads.map(l => [
      l.name, l.email, l.phone, l.company, l.industry || l.businessType, l.businessType,
      l.demoDate, l.scheduledDate || '', l.scheduledTime || '', l.demoType || '',
      l.demoLocation || '', l.teamMemberName || '', l.currentSoftware, l.message,
      l.status, defaultNextStep(l.status), l.source || 'website',
      l.attendedWorkshop ? 'Yes' : (l.source === 'workshop' ? 'No' : ''), l.createdAt,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'demo-leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Manual booking submit ────────────────────────────────────────────────
  const validateBooking = () => {
    if (!booking.clientName.trim()) return 'Client name is required';
    if (!booking.clientPhone.trim()) return 'Client phone is required';
    if (!booking.clientCompany.trim()) return 'Company name is required';
    if (!booking.clientIndustry) return 'Please select an industry';
    if (!booking.demoDate) return 'Demo date is required';
    if (!booking.demoTime) return 'Demo time is required';
    if (isDateBlocked(booking.demoDate)) return 'This date is a Sunday or public holiday — please choose another day';
    if (booking.demoType === 'physical' && !booking.demoLocation.trim()) return 'Location is required for physical demos';
    if (!booking.teamMemberName.trim()) return 'Your name is required';
    if (!booking.teamMemberPhone.trim()) return 'Your phone number is required';
    return null;
  };

  const handleBookingSubmit = async () => {
    const err = validateBooking();
    if (err) { setBookingError(err); return; }
    setBookingError('');
    setBookingSubmitting(true);

    try {
      // 1. Save lead to siteData (appears in Demo Leads list)
      const newLead: Lead = {
        id: Date.now().toString(),
        name: booking.clientName,
        phone: booking.clientPhone,
        email: booking.clientEmail,
        company: booking.clientCompany,
        industry: booking.clientIndustry,
        businessType: booking.clientIndustry,
        demoDate: booking.demoDate,
        currentSoftware: '',
        message: booking.demoNotes,
        createdAt: new Date().toISOString(),
        status: 'Demo Scheduled',
        source: 'manual',
        scheduledDate: booking.demoDate,
        scheduledTime: booking.demoTime,
        demoType: booking.demoType,
        demoLocation: booking.demoLocation,
        demoNotes: booking.demoNotes,
        teamMemberName: booking.teamMemberName,
        teamMemberPhone: booking.teamMemberPhone,
        meetSent: false,
      };
      onSave({ ...data, leads: [newLead, ...data.leads] });

      // 2. Send notifications via backend (Meet link generated server-side)
      const allBookingTeam = [
        { name: booking.teamMemberName, phone: booking.teamMemberPhone },
        ...booking.extraTeam.filter(m => m.name.trim()),
      ];
      await fetch(`${BACKEND_URL}/book-demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: booking.clientName,
          clientPhone: booking.clientPhone,
          clientEmail: booking.clientEmail,
          clientCompany: booking.clientCompany,
          clientIndustry: booking.clientIndustry,
          demoDate: booking.demoDate,
          demoTime: booking.demoTime,
          demoType: booking.demoType,
          demoLocation: booking.demoLocation,
          demoNotes: booking.demoNotes,
          teamMemberName: allBookingTeam[0]?.name || '',
          teamMemberPhone: allBookingTeam[0]?.phone || '',
          teamMember2Name: allBookingTeam[1]?.name || '',
          teamMember2Phone: allBookingTeam[1]?.phone || '',
          teamMember3Name: allBookingTeam[2]?.name || '',
          teamMember3Phone: allBookingTeam[2]?.phone || '',
          notifyClient: booking.notifyClient,
          source: 'manual',
        }),
      });

      setBookingSuccess(true);
      setBooking(emptyBooking);
      setShowBooking(false);
      setTimeout(() => setBookingSuccess(false), 5000);
    } catch {
      setBookingError('Failed to send notifications. Please check your connection.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  // ── Schedule a lead (status → Demo Scheduled) ────────────────────────────
  const validateSched = () => {
    if (!schedForm.scheduledDate) return 'Please select a date';
    if (!schedForm.scheduledTime) return 'Please select a time';
    if (isDateBlocked(schedForm.scheduledDate)) return 'This date is a Sunday or public holiday';
    if (schedForm.demoType === 'physical' && !schedForm.demoLocation.trim()) return 'Location is required for physical demos';
    if (!schedForm.teamMemberName.trim()) return 'Assign a team member';
    if (!schedForm.teamMemberPhone.trim()) return 'Team member phone is required';
    return null;
  };

  const handleScheduleSubmit = async (lead: Lead) => {
    const err = validateSched();
    if (err) { setSchedError(err); return; }
    setSchedError('');
    setSchedSubmitting(true);

    try {
      // Update lead record with schedule details
      const updated: Lead = {
        ...lead,
        status: 'Demo Scheduled',
        scheduledDate: schedForm.scheduledDate,
        scheduledTime: schedForm.scheduledTime,
        demoType: schedForm.demoType,
        demoLocation: schedForm.demoLocation,
        teamMemberName: schedForm.teamMemberName,
        teamMemberPhone: schedForm.teamMemberPhone,
        demoNotes: schedForm.demoNotes,
        meetSent: true,
        ...(schedForm.extraTeam.length > 0 ? { extraTeam: schedForm.extraTeam } : {}),
      } as Lead;
      onSave({ ...data, leads: data.leads.map(l => l.id === lead.id ? updated : l) });

      // Build extra team list for backend
      const allTeam = [
        { name: schedForm.teamMemberName, phone: schedForm.teamMemberPhone },
        ...schedForm.extraTeam.filter(m => m.name.trim()),
      ];

      // Send Meet link + confirmation via backend
      await fetch(`${BACKEND_URL}/book-demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: lead.name,
          clientPhone: lead.phone,
          clientEmail: lead.email,
          clientCompany: lead.company,
          clientIndustry: lead.industry || lead.businessType,
          demoDate: schedForm.scheduledDate,
          demoTime: schedForm.scheduledTime,
          demoType: schedForm.demoType,
          demoLocation: schedForm.demoLocation,
          demoNotes: schedForm.demoNotes,
          teamMemberName: allTeam[0]?.name || '',
          teamMemberPhone: allTeam[0]?.phone || '',
          teamMember2Name: allTeam[1]?.name || '',
          teamMember2Phone: allTeam[1]?.phone || '',
          teamMember3Name: allTeam[2]?.name || '',
          teamMember3Phone: allTeam[2]?.phone || '',
          notifyClient: true,
          source: 'scheduled',
        }),
      });

      setSchedulingId(null);
    } catch {
      setSchedError('Failed to send notifications. Please try again.');
    } finally {
      setSchedSubmitting(false);
    }
  };


  // ── Edit an already-scheduled demo ────────────────────────────────────────
  const openEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setEditError('');
    setEditSuccess(null);
    setSchedForm({
      scheduledDate: lead.scheduledDate || '',
      scheduledTime: lead.scheduledTime || '',
      demoType: lead.demoType || 'online',
      demoLocation: lead.demoLocation || '',
      teamMemberName: lead.teamMemberName || '',
      teamMemberPhone: lead.teamMemberPhone || '',
      extraTeam: (lead as any).extraTeam || [],
      demoNotes: lead.demoNotes || '',
    });
  };

  const handleEditSubmit = async (lead: Lead, resendToClient: boolean) => {
    if (!schedForm.scheduledDate) { setEditError('Please select a date'); return; }
    if (!schedForm.scheduledTime) { setEditError('Please select a time'); return; }
    if (isDateBlocked(schedForm.scheduledDate)) { setEditError('This date is a Sunday or public holiday'); return; }
    if (schedForm.demoType === 'physical' && !schedForm.demoLocation.trim()) { setEditError('Location is required for physical demos'); return; }
    if (!schedForm.teamMemberName.trim()) { setEditError('Assign at least one team member'); return; }
    setEditError('');
    setEditSubmitting(true);
    try {
      const allTeam = [
        { name: schedForm.teamMemberName, phone: schedForm.teamMemberPhone },
        ...schedForm.extraTeam.filter(m => m.name.trim()),
      ];
      const updated: Lead = {
        ...lead,
        scheduledDate: schedForm.scheduledDate,
        scheduledTime: schedForm.scheduledTime,
        demoType: schedForm.demoType,
        demoLocation: schedForm.demoLocation,
        teamMemberName: schedForm.teamMemberName,
        teamMemberPhone: schedForm.teamMemberPhone,
        demoNotes: schedForm.demoNotes,
        meetSent: true,
        ...(schedForm.extraTeam.length > 0 ? { extraTeam: schedForm.extraTeam } : { extraTeam: [] }),
      } as Lead;
      onSave({ ...data, leads: data.leads.map(l => l.id === lead.id ? updated : l) });

      if (resendToClient) {
        await fetch(`${BACKEND_URL}/book-demo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: lead.name,
            clientPhone: lead.phone,
            clientEmail: lead.email,
            clientCompany: lead.company,
            clientIndustry: lead.industry || lead.businessType,
            demoDate: schedForm.scheduledDate,
            demoTime: schedForm.scheduledTime,
            demoType: schedForm.demoType,
            demoLocation: schedForm.demoLocation,
            demoNotes: schedForm.demoNotes,
            teamMemberName: allTeam[0]?.name || '',
            teamMemberPhone: allTeam[0]?.phone || '',
            teamMember2Name: allTeam[1]?.name || '',
            teamMember2Phone: allTeam[1]?.phone || '',
            teamMember3Name: allTeam[2]?.name || '',
            teamMember3Phone: allTeam[2]?.phone || '',
            notifyClient: true,
            source: 'reschedule',
          }),
        });
        setEditSuccess('Demo updated and new confirmation sent to client.');
      } else {
        setEditSuccess('Demo details updated. No message sent to client.');
      }
      setEditingId(null);
      setTimeout(() => setEditSuccess(null), 5000);
    } catch {
      setEditError('Failed to save changes. Please try again.');
    } finally {
      setEditSubmitting(false);
    }
  };

  // ── Booking form time slots ──────────────────────────────────────────────
  const bookingSlots = useMemo(() => {
    const slots = generateTimeSlots(booking.demoDate);
    return slots.map(s => ({
      ...s,
      blocked: bookedSlots.has(`${booking.demoDate}|${s.value}`),
    }));
  }, [booking.demoDate, bookedSlots]);

  // ── Schedule form time slots ─────────────────────────────────────────────
  const schedSlots = useMemo(() => {
    const slots = generateTimeSlots(schedForm.scheduledDate);
    return slots.map(s => ({
      ...s,
      blocked: bookedSlots.has(`${schedForm.scheduledDate}|${s.value}`),
    }));
  }, [schedForm.scheduledDate, bookedSlots]);

  // Edit form uses the same schedForm state — slots computed from schedForm.scheduledDate
  // (editSlots reuse schedSlots since they share the same form state)

  return (
    <div className="mx-auto max-w-4xl space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Demo Leads</h2>
          <p className="text-sm text-navy-500 mt-0.5">All demo requests — website and manually booked</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3 py-2.5">
            <FileText className="h-4 w-4 text-navy-500" />
            <select
              defaultValue=""
              onChange={e => { const v = e.target.value; e.target.value = ''; if (v) downloadReport(v); }}
              title="Download the CRM status report for Tally Solutions"
              className="bg-transparent text-sm font-semibold text-navy-700 outline-none cursor-pointer">
              <option value="" disabled>CRM Report…</option>
              <option value="pdf">Download as PDF</option>
              <option value="excel">Download as Excel</option>
              <option value="csv">Download as CSV</option>
              <option value="html">Download as Web page</option>
            </select>
          </div>
          <button
            onClick={() => { setShowBooking(true); setBookingError(''); setBooking(emptyBooking); }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
            style={{ backgroundColor: '#e53e3e' }}
          >
            <Plus className="h-4 w-4" /> Book New Demo
          </button>
        </div>
      </div>

      {/* ── Success banner ── */}
      {bookingSuccess && (
        <div className="flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 px-5 py-4">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Demo booked and lead added!</p>
            <p className="text-xs text-green-600 mt-0.5">WhatsApp notifications sent to the office, team member, and client.</p>
          </div>
        </div>
      )}

      {/* ── Edit success banner ── */}
      {editSuccess && (
        <div className="flex items-center gap-3 rounded-2xl bg-blue-50 border border-blue-200 px-5 py-4">
          <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
          <p className="text-sm font-semibold text-blue-800">{editSuccess}</p>
        </div>
      )}

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: 'Total',     value: dateScopedLeads.length,                                          color: 'bg-navy-50 text-navy-700' },
          { label: 'New',       value: dateScopedLeads.filter(l => l.status === 'New').length,          color: 'bg-accent/10 text-accent' },
          { label: 'Contacted', value: dateScopedLeads.filter(l => l.status === 'Contacted').length,    color: 'bg-blue-50 text-blue-600' },
          { label: 'Qualified', value: dateScopedLeads.filter(l => l.status === 'Qualified').length,    color: 'bg-purple-50 text-purple-600' },
          { label: 'Demo Set',  value: dateScopedLeads.filter(l => l.status === 'Demo Scheduled').length, color: 'bg-amber-50 text-amber-600' },
          { label: 'Won',       value: dateScopedLeads.filter(l => l.status === 'Closed Won').length,   color: 'bg-green-50 text-green-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-[10px] font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="space-y-3">
        {/* Search + Export row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, company..."
              className="w-full rounded-lg border border-navy-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          <button onClick={exportCSV} disabled={data.leads.length === 0}
            title="Detailed leads-only spreadsheet (all lead columns)"
            className="flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 transition disabled:opacity-40">
            <Download className="h-4 w-4" /> Leads CSV
          </button>
        </div>
        {/* Date filter (scopes the whole view + exports), closed-deal scope, cleanup */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-navy-100 bg-navy-50/50 px-3 py-2.5 text-xs">
          <span className="font-semibold text-navy-500">Filter by date:</span>
          <label className="flex items-center gap-1.5 text-navy-600">
            From
            <input type="date" value={exportFrom} onChange={e => setExportFrom(e.target.value)}
              className="rounded-lg border border-navy-200 bg-white px-2 py-1 text-xs outline-none focus:border-accent" />
          </label>
          <label className="flex items-center gap-1.5 text-navy-600">
            To
            <input type="date" value={exportTo} onChange={e => setExportTo(e.target.value)}
              className="rounded-lg border border-navy-200 bg-white px-2 py-1 text-xs outline-none focus:border-accent" />
          </label>
          {(exportFrom || exportTo) && (
            <button onClick={() => { setExportFrom(''); setExportTo(''); }}
              className="text-navy-400 hover:text-navy-600 underline">clear dates</button>
          )}
          <span className="text-navy-400">
            {(exportFrom || exportTo)
              ? `Showing ${dateScopedLeads.length} lead${dateScopedLeads.length === 1 ? '' : 's'} in range`
              : `${dateScopedLeads.length} leads (all dates)`}
          </span>
          <label className="flex items-center gap-1.5 text-navy-600 cursor-pointer" title="Only affects what the exports contain">
            <input type="checkbox" checked={includeClosed} onChange={e => setIncludeClosed(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-navy-300 text-accent focus:ring-accent" />
            Include Closed in exports
          </label>
          {workshopDateFixCount > 0 && (
            <button onClick={fixWorkshopDates}
              title="Older workshop leads carry the date you converted them. Click to re-date them to their workshop registration date."
              className="ml-auto flex items-center gap-1 rounded-lg border border-accent/30 bg-white px-2.5 py-1 font-semibold text-accent hover:bg-accent/10 transition">
              <Calendar className="h-3.5 w-3.5" /> Fix workshop dates ({workshopDateFixCount})
            </button>
          )}
          {closedLostCount > 0 && (
            <button onClick={deleteClosedLost}
              className="ml-auto flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1 font-semibold text-red-500 hover:bg-red-50 transition">
              <Trash2 className="h-3.5 w-3.5" /> Delete Closed Lost ({closedLostCount})
            </button>
          )}
        </div>
        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2">
          {(['All', ...statuses] as string[]).map(s => {
            // Colours are derived from the shared pipeline module (inline styles
            // bypass Tailwind's purge for these dynamic values).
            const isActive = filterStatus === s;
            const color = s === 'All' ? '#1e3a5f' : stageColor(s);
            const tint = s === 'All' ? '#f1f5f9' : stageTint(s);
            const count = s === 'All' ? dateScopedLeads.length : dateScopedLeads.filter(l => l.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5"
                style={isActive
                  ? { backgroundColor: color, color: '#fff', borderColor: color }
                  : { backgroundColor: tint, color, borderColor: 'transparent' }
                }
              >
                {s}
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                  style={isActive
                    ? { backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }
                    : { backgroundColor: '#e2e8f0', color: '#475569' }
                  }
                >{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Manual Booking Panel (slide-in) ── */}
      {showBooking && (
        <div className="rounded-2xl border border-accent/30 bg-white shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100 bg-navy-50">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-accent" />
              <h3 className="font-bold text-navy-900">Book a New Demo</h3>
            </div>
            <button onClick={() => setShowBooking(false)} className="rounded-lg p-1.5 hover:bg-navy-200 transition">
              <X className="h-4 w-4 text-navy-500" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {bookingError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />{bookingError}
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-2">
              {/* Client Details */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-navy-500 uppercase tracking-wider">Client Details</p>
                <input value={booking.clientName} onChange={e => setB('clientName', e.target.value)}
                  placeholder="Client name *" className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={booking.clientPhone} onChange={e => setB('clientPhone', e.target.value)}
                    placeholder="+254 7XX XXX XXX *" className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  <input value={booking.clientEmail} onChange={e => setB('clientEmail', e.target.value)}
                    placeholder="Email (optional)" className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                </div>
                <input value={booking.clientCompany} onChange={e => setB('clientCompany', e.target.value)}
                  placeholder="Company name *" className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                <select value={booking.clientIndustry} onChange={e => setB('clientIndustry', e.target.value)}
                  className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white">
                  <option value="">Select industry *</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              {/* Demo Schedule */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-navy-500 uppercase tracking-wider">Demo Schedule</p>

                {/* Demo Type */}
                <div className="flex rounded-xl overflow-hidden border border-navy-200">
                  <button type="button" onClick={() => setB('demoType', 'online')}
                    className={`flex-1 py-2.5 text-sm font-semibold transition ${booking.demoType === 'online' ? 'bg-blue-600 text-white' : 'bg-white text-navy-600 hover:bg-navy-50'}`}>
                    💻 Online
                  </button>
                  <button type="button" onClick={() => setB('demoType', 'physical')}
                    className={`flex-1 py-2.5 text-sm font-semibold transition border-l border-navy-200 ${booking.demoType === 'physical' ? 'bg-green-600 text-white' : 'bg-white text-navy-600 hover:bg-navy-50'}`}>
                    📍 Physical
                  </button>
                </div>

                {/* Date */}
                <div>
                  <input type="date" value={booking.demoDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => { setB('demoDate', e.target.value); setB('demoTime', ''); }}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent ${booking.demoDate && isDateBlocked(booking.demoDate) ? 'border-red-400 bg-red-50' : 'border-navy-200'}`} />
                  {booking.demoDate && isDateBlocked(booking.demoDate) && (
                    <p className="mt-1 text-xs text-red-600">⛔ {getDayOfWeek(booking.demoDate) === 0 ? 'Sundays are not available' : 'This is a public holiday'} — please choose another date.</p>
                  )}
                  {booking.demoDate && getDayOfWeek(booking.demoDate) === 6 && !isDateBlocked(booking.demoDate) && (
                    <p className="mt-1 text-xs text-amber-600">⚠️ Saturday — available slots: 8:00 AM – 12:00 PM only.</p>
                  )}
                </div>

                {/* Time slots */}
                {booking.demoDate && !isDateBlocked(booking.demoDate) && bookingSlots.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-navy-500 mb-1.5">Select time *</p>
                    <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {bookingSlots.map(s => (
                        <button key={s.value} type="button"
                          disabled={s.blocked}
                          onClick={() => setB('demoTime', s.value)}
                          title={s.blocked ? 'Already booked' : ''}
                          className={`rounded-lg py-1.5 text-xs font-medium transition border ${
                            s.blocked
                              ? 'border-navy-100 bg-navy-100 text-navy-300 cursor-not-allowed line-through'
                              : booking.demoTime === s.value
                                ? 'border-accent bg-accent text-white'
                                : 'border-navy-200 bg-white text-navy-700 hover:border-accent hover:bg-accent/5'
                          }`}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location for physical */}
                {booking.demoType === 'physical' && (
                  <input value={booking.demoLocation} onChange={e => setB('demoLocation', e.target.value)}
                    placeholder="Location / address *" className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                )}

                <textarea value={booking.demoNotes} onChange={e => setB('demoNotes', e.target.value)}
                  placeholder="Notes (optional)" rows={2}
                  className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-navy-500 uppercase tracking-wider">Assigned Team Members</p>
                {booking.extraTeam.length < 2 && (
                  <button type="button" onClick={addBookingExtraTeam}
                    className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add member
                  </button>
                )}
              </div>
              {/* Primary */}
              <div className="grid grid-cols-2 gap-3">
                <input value={booking.teamMemberName} onChange={e => setB('teamMemberName', e.target.value)}
                  placeholder="Your name *" className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                <input value={booking.teamMemberPhone} onChange={e => setB('teamMemberPhone', e.target.value)}
                  placeholder="Your phone *" className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
              </div>
              {/* Extra members */}
              {booking.extraTeam.map((m, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 items-center">
                  <input value={m.name} onChange={e => setBookingExtraTeam(i, 'name', e.target.value)}
                    placeholder={`Member ${i + 2} name`}
                    className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  <div className="flex gap-1">
                    <input value={m.phone} onChange={e => setBookingExtraTeam(i, 'phone', e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="flex-1 rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                    <button type="button" onClick={() => removeBookingExtraTeam(i)}
                      className="rounded-lg p-2 text-red-400 hover:bg-red-50 transition shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Notify client toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={booking.notifyClient} onChange={e => setB('notifyClient', e.target.checked)}
                className="h-4 w-4 rounded border-navy-300 text-accent focus:ring-accent" />
              <span className="text-sm text-navy-700">Send WhatsApp confirmation to client</span>
            </label>

            {/* Submit */}
            <button onClick={handleBookingSubmit} disabled={bookingSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white disabled:opacity-60 transition"
              style={{ backgroundColor: '#e53e3e' }}>
              {bookingSubmitting
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking & Notifying...</>
                : <><Send className="h-4 w-4" /> Book Demo & Notify All</>}
            </button>
          </div>
        </div>
      )}

      {/* ── Selection / Bulk Actions Bar ── */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-xs font-medium text-navy-600 cursor-pointer select-none">
            <input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-navy-300 text-accent focus:ring-accent" />
            Select all ({filtered.length})
          </label>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-3 py-2 flex-wrap">
              <span className="text-xs font-semibold text-navy-700">{selectedIds.size} selected</span>
              <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}
                className="rounded-lg border border-navy-200 px-2 py-1.5 text-xs font-medium outline-none focus:border-accent bg-white">
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
              <button onClick={applyBulkStatus}
                className="rounded-lg px-3 py-1.5 text-xs font-bold text-white transition" style={{ backgroundColor: '#e53e3e' }}>
                Move to {bulkStatus}
              </button>
              <button onClick={bulkDelete}
                className="rounded-lg px-2 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition">
                Delete
              </button>
              <button onClick={() => setSelectedIds(new Set())}
                className="rounded-lg px-2 py-1.5 text-xs font-medium text-navy-500 hover:bg-navy-100 transition">
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Leads List ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-navy-200 bg-white py-16 text-center">
          <UsersIcon className="mx-auto h-10 w-10 text-navy-300" />
          <p className="mt-3 text-sm font-medium text-navy-500">
            {data.leads.length === 0 ? 'No leads yet' : 'No leads match your filters'}
          </p>
          <p className="mt-1 text-xs text-navy-400">
            {data.leads.length === 0
              ? 'Demo requests from the website and manual bookings will appear here.'
              : 'Try a different search or status filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(l => (
            <div key={l.id} className={`rounded-2xl border overflow-hidden transition ${
                l.status === 'New'
                  ? 'border-accent bg-red-50/30 shadow-sm shadow-accent/10'
                  : expandedId === l.id
                  ? 'border-accent/30 bg-white shadow-md'
                  : 'border-navy-200 bg-white'
              }`}>
              {/* Lead row */}
              <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpandedId(expandedId === l.id ? null : l.id)}>
                <input type="checkbox" checked={selectedIds.has(l.id)}
                  onClick={e => e.stopPropagation()}
                  onChange={() => toggleSelect(l.id)}
                  className="h-4 w-4 rounded border-navy-300 text-accent focus:ring-accent shrink-0" />
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {l.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-navy-900 truncate">{l.name}</p>
                    {l.status === 'New' && <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />}
                    {l.source === 'manual' && (
                      <span className="rounded-full bg-navy-100 px-2 py-0.5 text-[9px] font-semibold text-navy-500">MANUAL</span>
                    )}
                    {l.source === 'workshop' && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-700"
                        title={l.attendedWorkshop ? 'Attended the breakfast workshop' : 'Registered for workshop — did not attend'}>
                        🥐 WORKSHOP{l.attendedWorkshop ? ' ✓' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-navy-500 truncate">{l.phone} · {l.company || 'No company'}</p>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap"
                  style={statusBadgeStyle(l.status)}
                >
                  {l.status}
                </span>
                {l.requestType && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-semibold whitespace-nowrap hidden sm:inline"
                    style={
                      l.requestType === 'consultation'
                        ? { backgroundColor: '#8b5cf6', color: '#fff' }
                        : l.requestType === 'bizanalyst'
                        ? { backgroundColor: '#0ea5e9', color: '#fff' }
                        : { backgroundColor: '#3b82f6', color: '#fff' }
                    }
                  >
                    {l.requestType === 'consultation' ? '🤝 Consultation' : l.requestType === 'bizanalyst' ? '📱 Biz Analyst' : '📊 Demo'}
                  </span>
                )}
                {l.scheduledDate && (
                  <span className="text-[10px] text-navy-400 hidden sm:block whitespace-nowrap">
                    📅 {new Date(l.scheduledDate + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    {l.scheduledTime && ` · ${l.scheduledTime}`}
                  </span>
                )}
                <span className="text-[10px] text-navy-400 hidden sm:block whitespace-nowrap">
                  {new Date(l.createdAt).toLocaleDateString()}
                </span>
                <ChevronDown className={`h-4 w-4 text-navy-400 transition-transform shrink-0 ${expandedId === l.id ? 'rotate-180' : ''}`} />
              </div>

              {/* Expanded detail */}
              {expandedId === l.id && (
                <div className="border-t border-navy-100 p-5 space-y-4">
                  {/* Info grid — always 1 col on mobile, 2 cols on sm, 3 cols on lg */}
                  <div style={{ display: 'grid', gap: '12px 24px', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' }}
                    className="sm:grid-cols-2-override lg:grid-cols-3-override"
                    ref={el => {
                      if (!el) return;
                      const w = window.innerWidth;
                      el.style.gridTemplateColumns = w >= 1024 ? 'repeat(3,minmax(0,1fr))' : w >= 640 ? 'repeat(2,minmax(0,1fr))' : 'repeat(1,minmax(0,1fr))';
                    }}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <Mail className="h-4 w-4 text-navy-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-navy-500 font-medium">Email</p>
                        <p className="text-sm text-navy-900 break-all">{l.email || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 min-w-0">
                      <Phone className="h-4 w-4 text-navy-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-navy-500 font-medium">Phone</p>
                        <p className="text-sm text-navy-900">{l.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 min-w-0">
                      <Building2 className="h-4 w-4 text-navy-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-navy-500 font-medium">Company</p>
                        <p className="text-sm text-navy-900 truncate">{l.company || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 min-w-0">
                      <Calendar className="h-4 w-4 text-navy-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-navy-500 font-medium">Requested Slot</p>
                        <p className="text-sm text-navy-900">
                          {l.demoDate
                            ? `${new Date(l.demoDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}${l.demoTime ? ` · ${l.demoTime}` : ''}`
                            : 'Flexible'}
                        </p>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-navy-500 font-medium mb-0.5">Industry</p>
                      <p className="text-sm text-navy-900 truncate">{l.industry || l.businessType || '—'}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-navy-500 font-medium mb-0.5">Current Software</p>
                      <p className="text-sm text-navy-900 truncate">{l.currentSoftware || '—'}</p>
                    </div>
                  </div>

                  {l.message && (
                    <div>
                      <p className="text-[10px] text-navy-500 font-medium mb-1">Message</p>
                      <p className="text-sm text-navy-700 bg-navy-50 rounded-xl p-3 leading-relaxed">{l.message}</p>
                    </div>
                  )}

                  {/* Scheduled demo info (if already scheduled) */}
                  {l.status === 'Demo Scheduled' && l.scheduledDate && l.meetSent && editingId !== l.id && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-amber-700">📅 Demo Scheduled</p>
                        <button
                          onClick={() => openEdit(l)}
                          className="flex items-center gap-1 rounded-lg bg-amber-100 hover:bg-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-800 transition">
                          ✏️ Edit Demo
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-amber-800">
                        <div><span className="font-semibold">Date:</span> {new Date(l.scheduledDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div><span className="font-semibold">Time:</span> {l.scheduledTime} EAT</div>
                        <div><span className="font-semibold">Type:</span> {l.demoType === 'online' ? '💻 Online' : '📍 Physical'}</div>
                        {l.teamMemberName && <div><span className="font-semibold">Team:</span> {l.teamMemberName}{(l as any).extraTeam?.length > 0 ? ` +${(l as any).extraTeam.length}` : ''}</div>}
                      </div>
                      {l.demoType === 'physical' && l.demoLocation && (
                        <div className="text-xs text-amber-800 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{l.demoLocation}
                        </div>
                      )}
                      {l.meetLink && (
                        <a href={l.meetLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                          📹 {l.meetLink}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Auto next step — derived from the stage, shown in the CRM report */}
                  <div className="flex items-center gap-2 text-xs text-navy-500">
                    <span className="font-semibold">Next step:</span>
                    <span className="rounded-lg bg-navy-50 px-2.5 py-1 font-medium text-navy-700">{defaultNextStep(l.status)}</span>
                    <span className="text-navy-400">— set automatically from the stage</span>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center justify-between border-t border-navy-100 pt-4 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-navy-600">Status:</label>
                      <select value={l.status} onChange={e => e.target.value === '__staff__' ? markAsStaff(l) : updateStatus(l.id, e.target.value)}
                        className="rounded-lg border border-navy-200 px-3 py-1.5 text-sm font-medium outline-none focus:border-accent">
                        {statuses.map(s => <option key={s}>{s}</option>)}
                        <option value="__staff__">— Not a lead: mark as Staff —</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      {l.email && (
                        <a href={`mailto:${l.email}`}
                          className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition">
                          Send Email
                        </a>
                      )}
                      <a href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition">
                        WhatsApp
                      </a>
                      <button onClick={() => removeLead(l.id)}
                        className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* ── Edit Panel (shown when editing an already-scheduled demo) ── */}
                  {editingId === l.id && (
                    <div className="rounded-2xl border border-blue-300 bg-blue-50 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-blue-600" />
                          <p className="font-bold text-blue-800">Edit Demo Details</p>
                        </div>
                        <button onClick={() => setEditingId(null)}
                          className="rounded-lg p-1.5 hover:bg-blue-200 transition">
                          <X className="h-4 w-4 text-blue-600" />
                        </button>
                      </div>
                      <p className="text-xs text-blue-700">Update the demo details. You can choose whether to re-send the updated confirmation to the client.</p>

                      {editError && (
                        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                          <AlertCircle className="h-4 w-4 shrink-0" />{editError}
                        </div>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Demo type */}
                        <div className="sm:col-span-2">
                          <div className="flex rounded-xl overflow-hidden border border-blue-300">
                            <button type="button" onClick={() => setS('demoType', 'online')}
                              className={`flex-1 py-2.5 text-sm font-semibold transition ${schedForm.demoType === 'online' ? 'bg-blue-600 text-white' : 'bg-white text-navy-600 hover:bg-navy-50'}`}>
                              💻 Online (Google Meet)
                            </button>
                            <button type="button" onClick={() => setS('demoType', 'physical')}
                              className={`flex-1 py-2.5 text-sm font-semibold transition border-l border-blue-300 ${schedForm.demoType === 'physical' ? 'bg-green-600 text-white' : 'bg-white text-navy-600 hover:bg-navy-50'}`}>
                              📍 Physical / On-site
                            </button>
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <label className="block text-xs font-semibold text-navy-600 mb-1.5">Date *</label>
                          <input type="date" value={schedForm.scheduledDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => { setS('scheduledDate', e.target.value); setS('scheduledTime', ''); }}
                            className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 ${schedForm.scheduledDate && isDateBlocked(schedForm.scheduledDate) ? 'border-red-400 bg-red-50' : 'border-navy-200'}`} />
                          {schedForm.scheduledDate && isDateBlocked(schedForm.scheduledDate) && (
                            <p className="mt-1 text-xs text-red-600">⛔ {getDayOfWeek(schedForm.scheduledDate) === 0 ? 'Sundays not available' : 'Public holiday'} — choose another date.</p>
                          )}
                          {schedForm.scheduledDate && getDayOfWeek(schedForm.scheduledDate) === 6 && !isDateBlocked(schedForm.scheduledDate) && (
                            <p className="mt-1 text-xs text-amber-600">⚠️ Saturday — 8:00 AM–12:00 PM only.</p>
                          )}
                        </div>

                        {/* Time slots */}
                        <div>
                          <label className="block text-xs font-semibold text-navy-600 mb-1.5">Time *</label>
                          {schedForm.scheduledDate && !isDateBlocked(schedForm.scheduledDate) && schedSlots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
                              {schedSlots.map(s => (
                                <button key={s.value} type="button"
                                  disabled={s.blocked}
                                  onClick={() => setS('scheduledTime', s.value)}
                                  title={s.blocked ? 'Already booked' : ''}
                                  className={`rounded-lg py-1.5 text-xs font-medium transition border ${
                                    s.blocked
                                      ? 'border-navy-100 bg-navy-100 text-navy-300 cursor-not-allowed line-through'
                                      : schedForm.scheduledTime === s.value
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : 'border-navy-200 bg-white text-navy-700 hover:border-blue-400 hover:bg-blue-50'
                                  }`}>
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-navy-400 italic">Select a date first</p>
                          )}
                        </div>

                        {/* Location (physical only) */}
                        {schedForm.demoType === 'physical' && (
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-navy-600 mb-1.5">Location / Address *</label>
                            <input value={schedForm.demoLocation} onChange={e => setS('demoLocation', e.target.value)}
                              placeholder="e.g. Client's office — Moi Avenue, Nairobi"
                              className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400" />
                          </div>
                        )}

                        {/* Team members */}
                        <div className="sm:col-span-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">
                              <User className="h-3 w-3 inline mr-1" />Team Members *
                            </label>
                            {schedForm.extraTeam.length < 2 && (
                              <button type="button" onClick={addExtraTeam}
                                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                                <Plus className="h-3 w-3" /> Add member
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input value={schedForm.teamMemberName} onChange={e => setS('teamMemberName', e.target.value)}
                              placeholder="Name *"
                              className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400" />
                            <input value={schedForm.teamMemberPhone} onChange={e => setS('teamMemberPhone', e.target.value)}
                              placeholder="+254 7XX XXX XXX"
                              className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400" />
                          </div>
                          {schedForm.extraTeam.map((m, i) => (
                            <div key={i} className="grid grid-cols-2 gap-2 items-center">
                              <input value={m.name} onChange={e => setExtraTeam(i, 'name', e.target.value)}
                                placeholder={`Member ${i + 2} name`}
                                className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400" />
                              <div className="flex gap-1">
                                <input value={m.phone} onChange={e => setExtraTeam(i, 'phone', e.target.value)}
                                  placeholder="+254 7XX XXX XXX"
                                  className="flex-1 rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400" />
                                <button type="button" onClick={() => removeExtraTeam(i)}
                                  className="rounded-lg p-2 text-red-400 hover:bg-red-50 transition shrink-0">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Notes */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-navy-600 mb-1.5">Notes (optional)</label>
                          <textarea value={schedForm.demoNotes} onChange={e => setS('demoNotes', e.target.value)}
                            placeholder="e.g. Focus on manufacturing module, client uses QuickBooks currently"
                            rows={2} className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 resize-none" />
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <button onClick={() => handleEditSubmit(l, true)} disabled={editSubmitting}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white disabled:opacity-60 transition"
                          style={{ backgroundColor: '#2563eb' }}>
                          {editSubmitting
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                            : <><Send className="h-4 w-4" /> Save & Re-send to Client</>}
                        </button>
                        <button onClick={() => handleEditSubmit(l, false)} disabled={editSubmitting}
                          className="flex items-center justify-center gap-2 rounded-xl border border-navy-300 px-4 py-3 text-sm font-semibold text-navy-700 hover:bg-navy-50 disabled:opacity-60 transition">
                          Save Only (no message)
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="rounded-xl border border-navy-200 px-4 py-3 text-sm font-medium text-navy-500 hover:bg-navy-50 transition">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Schedule Panel (shown when status = Demo Scheduled and not yet sent) ── */}
                  {schedulingId === l.id && !l.meetSent && (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-amber-600" />
                        <p className="font-bold text-amber-800">Schedule the Demo & Send Confirmation</p>
                      </div>
                      <p className="text-xs text-amber-700">
                        Fill in the details below. The client will receive a WhatsApp confirmation
                        {schedForm.demoType === 'online' ? ' with a Google Meet link.' : ' with the location.'}
                      </p>

                      {schedError && (
                        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                          <AlertCircle className="h-4 w-4 shrink-0" />{schedError}
                        </div>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Demo type */}
                        <div className="sm:col-span-2">
                          <div className="flex rounded-xl overflow-hidden border border-amber-300">
                            <button type="button" onClick={() => setS('demoType', 'online')}
                              className={`flex-1 py-2.5 text-sm font-semibold transition ${schedForm.demoType === 'online' ? 'bg-blue-600 text-white' : 'bg-white text-navy-600 hover:bg-navy-50'}`}>
                              💻 Online (Google Meet)
                            </button>
                            <button type="button" onClick={() => setS('demoType', 'physical')}
                              className={`flex-1 py-2.5 text-sm font-semibold transition border-l border-amber-300 ${schedForm.demoType === 'physical' ? 'bg-green-600 text-white' : 'bg-white text-navy-600 hover:bg-navy-50'}`}>
                              📍 Physical / On-site
                            </button>
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <label className="block text-xs font-semibold text-navy-600 mb-1.5">Date *</label>
                          <input type="date" value={schedForm.scheduledDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => { setS('scheduledDate', e.target.value); setS('scheduledTime', ''); }}
                            className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent ${schedForm.scheduledDate && isDateBlocked(schedForm.scheduledDate) ? 'border-red-400 bg-red-50' : 'border-navy-200'}`} />
                          {schedForm.scheduledDate && isDateBlocked(schedForm.scheduledDate) && (
                            <p className="mt-1 text-xs text-red-600">⛔ {getDayOfWeek(schedForm.scheduledDate) === 0 ? 'Sundays not available' : 'Public holiday'} — choose another date.</p>
                          )}
                          {schedForm.scheduledDate && getDayOfWeek(schedForm.scheduledDate) === 6 && !isDateBlocked(schedForm.scheduledDate) && (
                            <p className="mt-1 text-xs text-amber-600">⚠️ Saturday — 8:00 AM–12:00 PM only.</p>
                          )}
                        </div>

                        {/* Time slots */}
                        <div>
                          <label className="block text-xs font-semibold text-navy-600 mb-1.5">Time *</label>
                          {schedForm.scheduledDate && !isDateBlocked(schedForm.scheduledDate) && schedSlots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
                              {schedSlots.map(s => (
                                <button key={s.value} type="button"
                                  disabled={s.blocked}
                                  onClick={() => setS('scheduledTime', s.value)}
                                  title={s.blocked ? 'Already booked' : ''}
                                  className={`rounded-lg py-1.5 text-xs font-medium transition border ${
                                    s.blocked
                                      ? 'border-navy-100 bg-navy-100 text-navy-300 cursor-not-allowed line-through'
                                      : schedForm.scheduledTime === s.value
                                        ? 'border-accent bg-accent text-white'
                                        : 'border-navy-200 bg-white text-navy-700 hover:border-accent hover:bg-accent/5'
                                  }`}>
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-navy-400 italic">Select a date first</p>
                          )}
                        </div>

                        {/* Location (physical only) */}
                        {schedForm.demoType === 'physical' && (
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-navy-600 mb-1.5">Location / Address *</label>
                            <input value={schedForm.demoLocation} onChange={e => setS('demoLocation', e.target.value)}
                              placeholder="e.g. Client's office — Moi Avenue, Nairobi"
                              className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                          </div>
                        )}

                        {/* Team members */}
                        <div className="sm:col-span-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">
                              <User className="h-3 w-3 inline mr-1" />Team Members *
                            </label>
                            {schedForm.extraTeam.length < 2 && (
                              <button type="button" onClick={addExtraTeam}
                                className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
                                <Plus className="h-3 w-3" /> Add member
                              </button>
                            )}
                          </div>
                          {/* Primary team member */}
                          <div className="grid grid-cols-2 gap-2">
                            <input value={schedForm.teamMemberName} onChange={e => setS('teamMemberName', e.target.value)}
                              placeholder="Name *"
                              className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                            <input value={schedForm.teamMemberPhone} onChange={e => setS('teamMemberPhone', e.target.value)}
                              placeholder="+254 7XX XXX XXX"
                              className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                          </div>
                          {/* Extra team members */}
                          {schedForm.extraTeam.map((m, i) => (
                            <div key={i} className="grid grid-cols-2 gap-2 items-center">
                              <input value={m.name} onChange={e => setExtraTeam(i, 'name', e.target.value)}
                                placeholder={`Member ${i + 2} name`}
                                className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                              <div className="flex gap-1">
                                <input value={m.phone} onChange={e => setExtraTeam(i, 'phone', e.target.value)}
                                  placeholder="+254 7XX XXX XXX"
                                  className="flex-1 rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                                <button type="button" onClick={() => removeExtraTeam(i)}
                                  className="rounded-lg p-2 text-red-400 hover:bg-red-50 transition shrink-0">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Notes */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-navy-600 mb-1.5">Notes (optional)</label>
                          <textarea value={schedForm.demoNotes} onChange={e => setS('demoNotes', e.target.value)}
                            placeholder="e.g. Focus on manufacturing module, client uses QuickBooks currently"
                            rows={2} className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => handleScheduleSubmit(l)} disabled={schedSubmitting}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white disabled:opacity-60 transition"
                          style={{ backgroundColor: '#e53e3e' }}>
                          {schedSubmitting
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                            : <><Send className="h-4 w-4" /> Confirm & Send {schedForm.demoType === 'online' ? 'Meet Link' : 'Location'}</>}
                        </button>
                        <button onClick={() => setSchedulingId(null)}
                          className="rounded-xl border border-navy-200 px-4 py-3 text-sm font-medium text-navy-600 hover:bg-navy-50 transition">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-navy-400">Submitted: {new Date(l.createdAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
