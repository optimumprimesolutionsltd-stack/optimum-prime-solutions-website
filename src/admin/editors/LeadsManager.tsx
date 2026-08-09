import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search, Trash2, Mail, Phone, Building2, Calendar, ChevronDown, ChevronUp,
  Download, Upload, Plus, X, CheckCircle2, Loader2, CalendarDays, MapPin,
  User, Send, AlertCircle, FileText, Video, LayoutGrid, List,
  RotateCcw, CalendarPlus, Briefcase,
} from 'lucide-react';
import type { SiteData, Lead, WipJob } from '../../data/siteData';
import { fbSubscribe, fbSet } from '../../firebase/config';
import KanbanBoard from './KanbanBoard';
import ImportLeadsDialog from './ImportLeadsDialog';
import {
  buildCrmReportHtml, buildUnifiedCsv, buildUnifiedXls, downloadFile, printHtml,
  type WorkshopRegistrant,
} from '../crm/crmExport';
import { PIPELINE_ORDER, stageColor, stageTint, defaultNextStep, isValidTransition, getValidNextStages } from '../crm/pipeline';
import {
  LEGACY_WORKSHOP_ID, parseWorkshops, regEventId, type WorkshopEvent,
} from '../../data/workshopEvent';
import {
  LEGACY_WEBINAR_ID, parseWebinars, type WebinarEvent,
} from '../../data/webinarEvent';
import { getDayOfWeek, isDateBlocked, generateTimeSlots } from '../../data/demoTimings';
import {
  OPTIMUM_STAFF, DEMO_TEAM, DEFAULT_STAFF, COMPANY_EMAIL, staffByName, staffEmail,
} from '../../data/staff';
import {
  googleCalendarUrl, buildIcs, downloadIcs, demoGuestList, type CalendarEvent,
} from '../crm/calendar';
import { toWhatsAppNumber } from '../../utils/phone';

interface P {
  data: SiteData;
  onSave: (d: SiteData) => void;
  // When another tab (e.g. Webinar RSVPs) asks to book a demo for a lead, this
  // is that lead's id; LeadsManager auto-opens its Book-a-Demo pop-up.
  openScheduleLeadId?: string | null;
  onScheduleConsumed?: () => void;
  // Won deals hand off to the Work in Progress tab once a delivery job exists.
  onStartWork?: (jobId: string) => void;
}

const BACKEND_URL = 'https://optimum-prime-lead-notifier.onrender.com';

const INDUSTRIES = [
  'Manufacturing', 'Distribution & Wholesale', 'Retail', 'Construction',
  'Hardware & Building Materials', 'NGO / Non-Profit', 'School / Education',
  'SACCO / Cooperative', 'Professional Services', 'Other',
];

// Staff come from the shared directory (src/data/staff.ts) so a name, phone and
// email can never drift apart between the booking pop-up, the edit panel and
// the calendar invite.

// Booking-day / time-slot rules live in one shared module so the admin pop-up
// and the public request form always offer the same days and hours.

// ── Status config ────────────────────────────────────────────────────────────
// Stages come from the shared pipeline module so every surface stays in sync.
const statuses = PIPELINE_ORDER;
const statusBadgeStyle = (status: string) => ({ backgroundColor: stageColor(status), color: '#fff' });

// ── Manual booking form ──────────────────────────────────────────────────────
interface BookingForm {
  clientName: string; clientPhone: string; clientEmail: string;
  clientCompany: string; clientIndustry: string;
  sourceOfEnquiry: 'email' | 'whatsapp' | 'referral' | 'phone' | 'direct' | 'website';
  demoType: 'online' | 'physical';
  demoDate: string; demoTime: string; demoLocation: string; demoNotes: string;
  teamMemberName: string; teamMemberPhone: string;
  extraTeam: TeamMember[];
  notifyClient: boolean;
}
const emptyBooking: BookingForm = {
  clientName: '', clientPhone: '', clientEmail: '',
  clientCompany: '', clientIndustry: '',
  sourceOfEnquiry: 'website',
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
  tallyStaff1: string; tallyStaff2: string;
  extraTeam: TeamMember[];
  demoNotes: string;
}

// ── When a lead came in ─────────────────────────────────────────────────────
// Leads that land from the website carry a full timestamp, so we can show the
// clock time — useful for knowing how fresh an enquiry is and how fast we
// responded. Leads typed in by hand only carry a date (no 'T' in the value);
// for those we show the date alone rather than a made-up midnight.
const leadReceived = (createdAt: string): { date: string; time: string | null } => {
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return { date: createdAt, time: null };
  const hasClock = createdAt.includes('T');
  return {
    date: (hasClock ? d : new Date(createdAt + 'T12:00:00')).toLocaleDateString(),
    time: hasClock ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : null,
  };
};

// ── Staff picker ────────────────────────────────────────────────────────────
// Kenneth and John Mark do the demos, consultations and client work, so they
// are one-tap buttons; everyone else is a click deeper in the dropdown. Picking
// a name fills in that person's phone, and their email flows into the calendar
// invite.
function StaffPicker({ value, onPick, accent = 'accent' }: {
  value: string;
  onPick: (name: string, phone: string) => void;
  accent?: 'accent' | 'blue';
}) {
  const others = OPTIMUM_STAFF.filter(s => !s.demoTeam);
  const isOther = !!value && !DEMO_TEAM.some(s => s.name === value);
  const activeStyle = accent === 'blue'
    ? { backgroundColor: '#2563eb', color: '#fff', borderColor: '#2563eb' }
    : { backgroundColor: '#e53e3e', color: '#fff', borderColor: '#e53e3e' };
  const idleStyle = { backgroundColor: '#fff', color: '#475569', borderColor: '#e2e8f0' };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {DEMO_TEAM.map(s => (
          <button key={s.email} type="button"
            onClick={() => onPick(s.name, s.phone)}
            title={`${s.name} · ${s.phone} · ${s.email}`}
            className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition"
            style={value === s.name ? activeStyle : idleStyle}>
            {value === s.name ? <CheckCircle2 className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
            {s.name.replace(/^(Mr\.|Ms\.)\s*/, '')}
          </button>
        ))}
        <select
          value={isOther ? value : ''}
          onChange={e => {
            const s = staffByName(e.target.value);
            if (s) onPick(s.name, s.phone);
          }}
          title="Assign someone else on the team"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-accent cursor-pointer">
          <option value="">Someone else…</option>
          {others.map(s => <option key={s.email} value={s.name}>{s.name}</option>)}
        </select>
      </div>
      {value && (
        <p className="text-[11px] text-slate-500">
          {value} · {staffByName(value)?.phone || ''}
          {staffEmail(value) && <> · <span className="text-slate-400">{staffEmail(value)}</span></>}
        </p>
      )}
    </div>
  );
}

export default function LeadsManager({ data, onSave, openScheduleLeadId, onScheduleConsumed, onStartWork }: P) {
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSource, setFilterSource] = useState<'All' | 'workshop' | 'webinar' | 'online' | 'field' | 'email' | 'whatsapp' | 'referral' | 'phone' | 'direct'>('All');
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);
  // Scroll anchor for the modal's error banner — the form is taller than the
  // pop-up, so an error at the top is invisible from the submit button.
  const addLeadTopRef = useRef<HTMLDivElement>(null);
  const [addLeadForm, setAddLeadForm] = useState({
    name: '', email: '', phone: '', company: '', businessType: '', currentSoftware: '', message: '', industry: '',
    source: 'field' as 'email' | 'whatsapp' | 'referral' | 'phone' | 'direct' | 'field',
    fieldCampaign: '',
    capturedBy: DEFAULT_STAFF.name,
    createdAt: new Date().toISOString().split('T')[0],
    requestType: 'demo' as 'demo' | 'consultation' | 'bizanalyst' | 'customization' | 'other',
  });
  const [addLeadError, setAddLeadError] = useState('');
  const [addLeadSuccess, setAddLeadSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

  // Workshop attendees — pulled in for the unified CRM report / export
  const [registrants, setRegistrants] = useState<WorkshopRegistrant[]>([]);
  useEffect(() => {
    const unsub = fbSubscribe('workshop_registrants', (raw: Record<string, any> | null) => {
      setRegistrants(raw ? Object.entries(raw).map(([id, v]) => ({ id, ...(v as object) }) as WorkshopRegistrant) : []);
    });
    return unsub;
  }, []);

  // Workshop EVENTS — so we can tell one workshop apart from the next when
  // filtering leads (a workshop is a group event, unlike a one-off online demo).
  const [events, setEvents] = useState<WorkshopEvent[]>([]);
  const [filterWorkshop, setFilterWorkshop] = useState<string>('all');
  useEffect(() => {
    const unsub = fbSubscribe('workshops', (raw: Record<string, any> | null) => {
      setEvents(parseWorkshops(raw));
    });
    return unsub;
  }, []);

  // One-time migration: the "Demo Scheduled" stage was renamed to "Schedule a
  // Demo". Move any lead still on the old status onto the new one so it never
  // drops out of the pipeline (a rename alone would orphan it). Self-terminating
  // — once migrated nothing matches, so it won't loop.
  useEffect(() => {
    const OLD = 'Demo Scheduled';
    if (!data.leads.some(l => l.status === OLD)) return;
    onSave({
      ...data,
      leads: data.leads.map(l => l.status === OLD ? { ...l, status: 'Schedule a Demo' } : l),
    });
  }, [data, onSave]);

  // Auto-fix workshop lead dates: re-date workshop leads to their registration
  // date so date filters align with the actual workshop, not conversion date.
  // Self-terminating — once all are fixed, nothing matches.
  useEffect(() => {
    if (registrants.length === 0) return;
    const regCreatedById = new Map(registrants.map(r => [r.id, r.createdAt]));
    const needsFix = data.leads.filter(l =>
      l.source === 'workshop' && l.workshopRegId
      && regCreatedById.has(l.workshopRegId)
      && regCreatedById.get(l.workshopRegId) !== l.createdAt
    );
    if (needsFix.length === 0) return;
    onSave({
      ...data,
      leads: data.leads.map(l => {
        if (l.source === 'workshop' && l.workshopRegId) {
          const regDate = regCreatedById.get(l.workshopRegId);
          if (regDate && regDate !== l.createdAt) return { ...l, createdAt: regDate };
        }
        return l;
      }),
    });
  }, [data.leads, registrants, onSave]);

  // Auto-remove Closed Lost leads older than 60 days to keep the pipeline clean.
  // Self-terminating — once all old closed leads are removed, nothing matches.
  useEffect(() => {
    const SIX_DAYS_MS = 60 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const toRemove = data.leads.filter(l => {
      if (l.status !== 'Closed Lost') return false;
      const createdTime = new Date(l.createdAt).getTime();
      return (now - createdTime) > SIX_DAYS_MS;
    });
    if (toRemove.length === 0) return;
    const toRemoveIds = new Set(toRemove.map(l => l.id));
    onSave({ ...data, leads: data.leads.filter(l => !toRemoveIds.has(l.id)) });
    // Also clear them from Firebase so they don't re-sync back
    toRemove.forEach(l => fbSet(`leads/${l.id}`, null));
  }, [data.leads, onSave]);

  // Which workshop a lead belongs to. Newer leads carry workshopEventId directly;
  // older ones are resolved through their registrant (legacy July RSVPs have no
  // eventId and fall back to the legacy workshop id).
  const regEventById = useMemo(() => {
    const m = new Map<string, string>();
    registrants.forEach(r => m.set(r.id, regEventId(r as { eventId?: string })));
    return m;
  }, [registrants]);
  const leadWorkshopId = (l: Lead): string =>
    l.workshopEventId
    || (l.workshopRegId ? regEventById.get(l.workshopRegId) : undefined)
    || LEGACY_WORKSHOP_ID;
  const workshopTitleById = (id: string) =>
    events.find(e => e.id === id)?.title || (id === LEGACY_WORKSHOP_ID ? 'Earlier workshop' : 'Workshop');

  // Webinar EVENTS — the online mirror of the workshop grouping, so webinar
  // leads can be told apart by which webinar they came from.
  const [webinarEvents, setWebinarEvents] = useState<WebinarEvent[]>([]);
  const [filterWebinar, setFilterWebinar] = useState<string>('all');
  useEffect(() => {
    const unsub = fbSubscribe('webinars', (raw: Record<string, any> | null) => {
      setWebinarEvents(parseWebinars(raw));
    });
    return unsub;
  }, []);
  // Webinar leads carry webinarEventId directly at conversion; fall back to the
  // legacy bucket for any that don't.
  const leadWebinarId = (l: Lead): string => l.webinarEventId || LEGACY_WEBINAR_ID;
  const webinarTitleById = (id: string) =>
    webinarEvents.find(e => e.id === id)?.title || (id === LEGACY_WEBINAR_ID ? 'Earlier webinar' : 'Webinar');

  const companyName = data.company?.name || 'Optimum Prime Solutions';

  // ── Export controls: date range + whether to include closed deals ──────────
  const [exportFrom, setExportFrom]   = useState('');
  const [exportTo, setExportTo]       = useState('');
  const [includeClosed, setIncludeClosed] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set([
    'name', 'email', 'phone', 'company', 'industry', 'status', 'demoDate', 'scheduledDate', 'createdAt'
  ]));

  const inDateRange = (iso: string) => {
    const t = new Date(iso).getTime();
    if (exportFrom && t < new Date(exportFrom + 'T00:00:00').getTime()) return false;
    if (exportTo && t > new Date(exportTo + 'T23:59:59').getTime()) return false;
    return true;
  };

  const sourceCategory = (l: Lead): 'workshop' | 'webinar' | 'online' | 'field' | 'email' | 'whatsapp' | 'referral' | 'phone' | 'direct' =>
    l.source === 'workshop' ? 'workshop'
    : l.source === 'webinar' ? 'webinar'
    : l.source === 'website' ? 'online'
    : l.source === 'field' ? 'field'
    : (l.source as 'email' | 'whatsapp' | 'referral' | 'phone' | 'direct' | undefined) || 'email';

  // The date range scopes the whole Demo Leads view — stats, tab counts and the
  // list — so the numbers always match the chosen period.
  const dateScopedLeads = useMemo(
    () => data.leads.filter(l => inDateRange(l.createdAt)),
    [data.leads, exportFrom, exportTo],
  );

  // Leads to export: the date-scoped set, open pipeline by default (New → Demo
  // Done) unless the user opts to include Closed Won/Lost.
  const exportLeads = useMemo(
    () => {
      // When a specific source/workshop is filtered, ignore date range and show all leads from that source
      const baseLeads = filterSource !== 'All' ? data.leads : dateScopedLeads;
      let leads = baseLeads.filter(l => includeClosed || (l.status !== 'Closed Won' && l.status !== 'Closed Lost'));
      if (filterSource !== 'All') leads = leads.filter(l => sourceCategory(l) === filterSource);
      if (filterSource === 'workshop' && filterWorkshop !== 'all') leads = leads.filter(l => leadWorkshopId(l) === filterWorkshop);
      if (filterSource === 'webinar' && filterWebinar !== 'all') leads = leads.filter(l => leadWebinarId(l) === filterWebinar);
      return leads;
    },
    [data.leads, dateScopedLeads, includeClosed, filterSource, filterWorkshop, filterWebinar],
  );

  const exportRegistrants = useMemo(
    () => {
      // When a specific workshop is filtered, show all registrants from that workshop, ignoring date range
      let regs = filterSource === 'workshop' ? registrants : registrants.filter(r => inDateRange(r.createdAt));
      // Registrants are only for workshops, not webinars or online leads
      if (filterSource !== 'All' && filterSource !== 'workshop') {
        return [];
      }
      if (filterSource === 'workshop' && filterWorkshop !== 'all') {
        regs = regs.filter(r => regEventId(r as { eventId?: string }) === filterWorkshop);
      }
      return regs;
    },
    [registrants, exportFrom, exportTo, filterSource, filterWorkshop],
  );

  // When the report covers exactly one event (workshop/webinar/online/manual),
  // feature that event in the title and file names.
  const reportEvent = useMemo(() => {
    if (filterSource === 'workshop' && filterWorkshop !== 'all') {
      const e = events.find(ev => ev.id === filterWorkshop);
      return e ? { type: 'workshop' as const, title: e.title, date: e.date, venue: e.venue } : undefined;
    }
    if (filterSource === 'webinar' && filterWebinar !== 'all') {
      const e = webinarEvents.find(ev => ev.id === filterWebinar);
      return e ? { type: 'webinar' as const, title: e.title, date: e.date } : undefined;
    }
    if (filterSource === 'online') {
      return { type: 'online' as const, title: 'Online Demos' };
    }
    // The remaining sources are direct contacts rather than events. This used to
    // test for a 'manual' source that no longer exists, so it never fired and
    // every one of these exports came out titled just "CRM Status Report".
    const directTitles: Record<string, string> = {
      email: 'Email Enquiries',
      whatsapp: 'WhatsApp Leads',
      referral: 'Referrals',
      phone: 'Phone Enquiries',
      direct: 'Direct Contacts',
    };
    if (directTitles[filterSource]) {
      return { type: 'manual' as const, title: directTitles[filterSource] };
    }
    return undefined;
  }, [filterSource, filterWorkshop, filterWebinar, events, webinarEvents]);

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'report';
  const fileBase = reportEvent ? `crm-report-${slugify(reportEvent.title)}` : 'crm-report';

  const reportHtml = () => {
    const opts = { companyName, preparedFor: 'Tally Solutions' };
    if (reportEvent?.type === 'workshop') {
      return buildCrmReportHtml(exportLeads, exportRegistrants,
        { ...opts, workshop: { title: reportEvent.title, date: reportEvent.date, venue: reportEvent.venue } });
    }
    if (reportEvent?.type === 'webinar') {
      return buildCrmReportHtml(exportLeads, exportRegistrants,
        { ...opts, webinar: { title: reportEvent.title, date: reportEvent.date } });
    }
    if (reportEvent?.type === 'online') {
      return buildCrmReportHtml(exportLeads, exportRegistrants,
        { ...opts, online: { title: reportEvent.title } });
    }
    if (reportEvent?.type === 'manual') {
      return buildCrmReportHtml(exportLeads, exportRegistrants,
        { ...opts, manual: { title: reportEvent.title } });
    }
    return buildCrmReportHtml(exportLeads, exportRegistrants, opts);
  };
  const downloadReport = (format: string) => {
    if (format === 'pdf') printHtml(reportHtml());
    else if (format === 'excel') downloadFile(`${fileBase}.xls`, buildUnifiedXls(exportLeads, exportRegistrants), 'application/vnd.ms-excel');
    else if (format === 'csv') downloadFile(`${fileBase}.csv`, buildUnifiedCsv(exportLeads, exportRegistrants), 'text/csv');
    else if (format === 'html') downloadFile(`${fileBase}.html`, reportHtml(), 'text/html');
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
    tallyStaff1: '', tallyStaff2: '',
    extraTeam: [], demoNotes: '',
  });
  const [schedSubmitting, setSchedSubmitting] = useState(false);
  const [schedError, setSchedError]           = useState('');
  const [escalationError, setEscalationError] = useState<string | null>(null);

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
        .filter(l => l.status === 'Schedule a Demo' && l.scheduledDate && l.scheduledTime && l.id !== editingId)
        .map(l => `${l.scheduledDate}|${l.scheduledTime}`)
    ), [data.leads, editingId]);

  // ── Filtered leads ───────────────────────────────────────────────────────
  // The working list always shows every lead (subject to status / source /
  // search). The date range only scopes the report + CSV exports — it must
  // never silently hide leads from the person working the pipeline.
  //
  // Filtering happens in three named steps so every count on screen is measured
  // against the same set the view below it renders:
  //   searchScoped — the search box only. What the Source chips count, so
  //     "Online / Website (6)" is a promise: pick it and you get those six.
  //   sourceScoped — one source (and one workshop/webinar), every pipeline
  //     stage. What the stats strip and the status tabs count, so the tabs
  //     always add up to the number on the Source chip.
  //   filtered — sourceScoped narrowed to a single stage by the status tabs.
  //     Both List and Board render exactly this, so the two views can never
  //     disagree about which leads you are looking at.
  const matchesSearch = (l: Lead) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return l.name.toLowerCase().includes(q)
      || l.email.toLowerCase().includes(q)
      || (l.company || '').toLowerCase().includes(q)
      || l.phone.includes(q);
  };

  const searchScoped = data.leads.filter(matchesSearch);

  const sourceScoped = searchScoped
    .filter(l => filterSource === 'All' || sourceCategory(l) === filterSource)
    // When viewing Workshop leads, optionally narrow to one specific workshop.
    .filter(l => filterSource !== 'workshop' || filterWorkshop === 'all' || leadWorkshopId(l) === filterWorkshop)
    // When viewing Webinar leads, optionally narrow to one specific webinar.
    .filter(l => filterSource !== 'webinar' || filterWebinar === 'all' || leadWebinarId(l) === filterWebinar)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filtered = sourceScoped.filter(l => filterStatus === 'All' || l.status === filterStatus);

  // ── Opening the booking pop-up ───────────────────────────────────────────
  // Opening the form is NOT the same as booking. This only fills the pop-up and
  // shows it — nothing is written to the lead until the booking is confirmed.
  // A mis-clicked 📅 Book is therefore harmless: close the pop-up and the lead
  // is exactly where it was. (The forward-only guard still applies, so a lead
  // that can't move to "Schedule a Demo" can't open the pop-up either.)
  const openScheduling = (lead: Lead): boolean => {
    if (!isValidTransition(lead.status, 'Schedule a Demo')) {
      setEscalationError(`Cannot move "${lead.name}" from "${lead.status}" back to "Schedule a Demo". Leads can only escalate forward or to Closed Lost.`);
      setTimeout(() => setEscalationError(null), 5000);
      return false;
    }
    setEscalationError(null);
    setSchedulingId(lead.id);
    setSchedForm({
      // Pre-fill with already-saved schedule details first,
      // then fall back to the client's requested preferences
      scheduledDate: lead.scheduledDate || lead.demoDate || '',
      scheduledTime: lead.scheduledTime || lead.demoTime || '',
      demoType: lead.demoType || 'online',
      demoLocation: lead.demoLocation || '',
      // Pre-fill the demo team so the form opens ready to send; one tap
      // switches between Kenneth and John Mark.
      teamMemberName: lead.teamMemberName || DEFAULT_STAFF.name,
      teamMemberPhone: lead.teamMemberPhone || DEFAULT_STAFF.phone,
      tallyStaff1: '', tallyStaff2: '',
      extraTeam: (lead as any)?.extraTeam || [],
      demoNotes: lead.demoNotes || lead.message || '',
    });
    setSchedError('');
    return true;
  };

  // ── Repairing mis-clicked bookings ───────────────────────────────────────
  // The 📅 Book button used to move a lead to "Schedule a Demo" the instant it
  // was pressed, before any date was entered — so a stray tap parked leads in
  // the booking stage with nothing booked, and the forward-only rule meant they
  // couldn't be put back by hand. The button no longer does that, but leads
  // stranded by the old behaviour need rescuing.
  //
  // A stranded lead is one sitting in "Schedule a Demo" with no booking at all:
  // no date, and no confirmation ever sent. If a date was entered the booking is
  // real work in progress, so it is left alone.
  const strandedLeads = data.leads.filter(l =>
    l.status === 'Schedule a Demo' && !l.meetSent && !l.scheduledDate && !l.demoDate
  );
  const [showRepair, setShowRepair] = useState(false);
  // Which stage each stranded lead should go back to. Unknowable from the record
  // — nothing stores the previous stage — so "New" is the default and the admin
  // corrects any that were further along.
  const [repairStages, setRepairStages] = useState<Record<string, string>>({});
  const [repairDone, setRepairDone] = useState(0);

  const openRepair = () => {
    setRepairStages(Object.fromEntries(strandedLeads.map(l => [l.id, 'New'])));
    setShowRepair(true);
  };

  // Deliberately bypasses the forward-only guard in updateStatus — walking these
  // leads back is the whole point, and it's the same exemption confirmRestart
  // uses for reopening a lost deal.
  const confirmRepair = () => {
    const picks = strandedLeads
      .map(l => ({ lead: l, stage: repairStages[l.id] }))
      .filter(p => p.stage && p.stage !== 'Schedule a Demo');
    if (picks.length === 0) { setShowRepair(false); return; }
    const byIdPick = new Map(picks.map(p => [p.lead.id, p.stage]));
    onSave({
      ...data,
      leads: data.leads.map(l => {
        const stage = byIdPick.get(l.id);
        return stage ? { ...l, status: stage, nextStep: defaultNextStep(stage) } : l;
      }),
    });
    setShowRepair(false);
    setEscalationError(null);
    setRepairDone(picks.length);
    setTimeout(() => setRepairDone(0), 6000);
  };

  // ── Status update ────────────────────────────────────────────────────────
  const updateStatus = (id: string, status: string) => {
    const lead = data.leads.find(l => l.id === id);
    if (!lead) return;

    // Validate escalation: prevent moving backward in the pipeline
    if (!isValidTransition(lead.status, status)) {
      setEscalationError(`Cannot move "${lead.name}" from "${lead.status}" back to "${status}". Leads can only escalate forward or to Closed Lost.`);
      setTimeout(() => setEscalationError(null), 5000);
      return;
    }

    onSave({ ...data, leads: data.leads.map(l => l.id === id
      // Stamp when a deal was lost, so a restart later can show how long it sat.
      ? { ...l, status, ...(status === 'Closed Lost' ? { lostAt: new Date().toISOString() } : {}) }
      : l) });
    setEscalationError(null);

    if (status === 'Schedule a Demo') {
      openScheduling(lead);
    } else {
      if (schedulingId === id) setSchedulingId(null);
    }
  };

  // Handoff from another tab (Workshop / Webinar RSVPs): when asked to book a
  // demo for a lead, clear filters so it's visible and expand it. If the demo is
  // already booked, open the EDIT flow (so an existing booking is edited, never
  // duplicated); otherwise open the scheduling pop-up. Same flows as here. The
  // ref guards against re-processing the same id when data.leads updates.
  const handledScheduleRef = useRef<string | null>(null);
  useEffect(() => {
    if (!openScheduleLeadId) { handledScheduleRef.current = null; return; }
    if (handledScheduleRef.current === openScheduleLeadId) return;
    const lead = data.leads.find(l => l.id === openScheduleLeadId);
    if (!lead) return; // wait for the lead to arrive
    handledScheduleRef.current = openScheduleLeadId;
    setFilterStatus('All');
    setFilterSource('All');
    setSearch('');
    setExpandedId(openScheduleLeadId);
    if (lead.meetSent) openEdit(lead);
    else openScheduling(lead);
    onScheduleConsumed?.();
  }, [openScheduleLeadId, data.leads]);

  // ── Restarting a Closed Lost lead ────────────────────────────────────────
  // A lost deal is rarely dead forever — budgets free up, the person who said
  // no moves on. Restarting drops the lead back into the working pipeline with
  // a clean slate and asks which period it should be domiciled in: today's, so
  // it shows up in this month's numbers and reports, or the original date, so
  // the history of when it first came in is preserved.
  //
  // This deliberately bypasses the forward-only escalation guard in
  // updateStatus — reopening a lost deal is the one legitimate way back.
  const [restartLead, setRestartLead] = useState<Lead | null>(null);
  const [restartPeriod, setRestartPeriod] = useState<'today' | 'original'>('today');
  const [restartStage, setRestartStage] = useState('New');
  const [restartNote, setRestartNote] = useState('');

  const openRestart = (lead: Lead) => {
    setRestartLead(lead);
    setRestartPeriod('today');
    setRestartStage('New');
    setRestartNote('');
  };

  const confirmRestart = () => {
    const lead = restartLead;
    if (!lead) return;
    const now = new Date().toISOString();
    // Keep the very first date the lead was domiciled in, even after re-dating,
    // so "when did we first meet them" is never lost.
    const original = lead.originalCreatedAt || lead.createdAt;
    const restarted: Lead = {
      ...lead,
      status: restartStage,
      createdAt: restartPeriod === 'today' ? now : original,
      originalCreatedAt: original,
      reopenedAt: now,
      reopenCount: (lead.reopenCount || 0) + 1,
      // Clear the old booking so the lead goes through scheduling afresh
      // instead of showing a demo that already came and went.
      scheduledDate: '', scheduledTime: '', meetSent: false, meetLink: '',
      demoNotes: restartNote.trim()
        ? `${restartNote.trim()}${lead.demoNotes ? `\n— previously: ${lead.demoNotes}` : ''}`
        : lead.demoNotes,
      nextStep: defaultNextStep(restartStage),
    };
    onSave({ ...data, leads: data.leads.map(l => l.id === lead.id ? restarted : l) });
    setRestartLead(null);
    setEscalationError(null);
    setExpandedId(lead.id);
  };

  // ── Won deal → delivery job ──────────────────────────────────────────────
  // A won deal still has to be delivered. This opens the work (training,
  // implementation…) in the Work in Progress tab, pre-filled from the lead.
  const startWork = (lead: Lead) => {
    const existing = (data.wipJobs || []).find(j => j.leadId === lead.id);
    if (existing) { onStartWork?.(existing.id); return; }
    const jobId = `wip_${Date.now()}`;
    const job: WipJob = {
      id: jobId,
      client: lead.name,
      company: lead.company || '',
      phone: lead.phone || '',
      email: lead.email || '',
      jobType: lead.requestType === 'customization' ? 'Customization' : 'Implementation',
      title: `${lead.company || lead.name} — TallyPrime implementation`,
      assignedStaff: lead.teamMemberName ? [lead.teamMemberName] : [DEFAULT_STAFF.name],
      startDate: new Date().toISOString().split('T')[0],
      status: 'Not Started',
      progress: 0,
      notes: lead.demoNotes || lead.message || '',
      leadId: lead.id,
      createdAt: new Date().toISOString(),
    };
    onSave({
      ...data,
      wipJobs: [job, ...(data.wipJobs || [])],
      leads: data.leads.map(l => l.id === lead.id ? { ...l, wipJobId: jobId } : l),
    });
    onStartWork?.(jobId);
  };

  // ── Calendar invites ─────────────────────────────────────────────────────
  // Everything a booked slot needs to become a real calendar entry: both demo
  // staff, the shared company mailbox, whoever is assigned, and the client.
  const leadCalendar = (l: Lead): { event: CalendarEvent; guests: string[] } => {
    const guests = demoGuestList({
      assignedStaffName: l.teamMemberName,
      extraStaffNames: (l.extraTeam || []).map(m => m.name),
      clientEmail: l.email,
    });
    const kind = l.requestType === 'consultation' ? 'Consultation'
      : l.requestType === 'bizanalyst' ? 'Biz Analyst session'
      : l.requestType === 'customization' ? 'Customization / TDL session'
      : 'TallyPrime demo';
    const who = [l.company, l.name].filter(Boolean).join(' · ');
    const detailLines = [
      `${kind} with ${l.name}${l.company ? ` (${l.company})` : ''}`,
      l.phone ? `Client phone: ${l.phone}` : '',
      l.email ? `Client email: ${l.email}` : '',
      l.teamMemberName ? `Optimum lead: ${l.teamMemberName}${l.teamMemberPhone ? ` (${l.teamMemberPhone})` : ''}` : '',
      (l.extraTeam || []).length ? `Also attending: ${(l.extraTeam || []).map(m => m.name).join(', ')}` : '',
      l.demoNotes ? `Purpose: ${l.demoNotes}` : '',
      l.meetLink ? `Google Meet: ${l.meetLink}` : '',
      '',
      `Booked from the Optimum Prime admin panel. Office: ${COMPANY_EMAIL}`,
    ].filter(Boolean);
    return {
      guests,
      event: {
        title: `${kind} — ${who || l.name}`,
        description: detailLines.join('\n'),
        location: l.demoType === 'online'
          ? (l.meetLink || 'Google Meet — link to follow')
          : (l.demoLocation || 'On-site'),
        date: l.scheduledDate || l.demoDate,
        time: l.scheduledTime || l.demoTime || '09:00',
        durationMinutes: 60,
        guests,
        organizerEmail: staffEmail(l.teamMemberName) || COMPANY_EMAIL,
      },
    };
  };

  const addToGoogleCalendar = (l: Lead) => {
    window.open(googleCalendarUrl(leadCalendar(l).event), '_blank', 'noopener,noreferrer');
  };
  const downloadInvite = (l: Lead) => {
    const safe = (l.company || l.name || 'demo').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32);
    downloadIcs(`demo-${safe}-${l.scheduledDate || 'unscheduled'}`, buildIcs(leadCalendar(l).event));
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
    let skipped = 0;
    const updated = data.leads.map(l => {
      if (!selectedIds.has(l.id)) return l;
      // Validate escalation for each lead
      if (!isValidTransition(l.status, bulkStatus)) {
        skipped++;
        return l; // Skip this lead
      }
      return { ...l, status: bulkStatus };
    });
    onSave({ ...data, leads: updated });
    if (skipped > 0) {
      setEscalationError(`${skipped} lead(s) couldn't be moved (already at or past this stage).`);
      setTimeout(() => setEscalationError(null), 5000);
    }
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

  // ── Available export fields ──────────────────────────────────────────────
  const allFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    { key: 'industry', label: 'Industry' },
    { key: 'demoDate', label: 'Demo Date (Requested)' },
    { key: 'scheduledDate', label: 'Scheduled Date' },
    { key: 'scheduledTime', label: 'Scheduled Time' },
    { key: 'demoType', label: 'Demo Type' },
    { key: 'demoLocation', label: 'Location' },
    { key: 'teamMemberName', label: 'Team Member' },
    { key: 'status', label: 'Status' },
    { key: 'source', label: 'Source' },
    { key: 'message', label: 'Message' },
    { key: 'currentSoftware', label: 'Current Software' },
    { key: 'createdAt', label: 'Date Submitted' },
  ];

  const toggleField = (key: string) => {
    const newSet = new Set(selectedFields);
    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);
    setSelectedFields(newSet);
  };

  // ── Export with selected format and fields ──────────────────────────────
  const performExport = () => {
    const visibleFields = allFields.filter(f => selectedFields.has(f.key));
    const headers = visibleFields.map(f => f.label);

    const rows = exportLeads.map(l => visibleFields.map(f => {
      switch(f.key) {
        case 'name': return l.name;
        case 'email': return l.email;
        case 'phone': return l.phone;
        case 'company': return l.company;
        case 'industry': return l.industry || l.businessType || '';
        case 'demoDate': return l.demoDate;
        case 'scheduledDate': return l.scheduledDate || '';
        case 'scheduledTime': return l.scheduledTime || '';
        case 'demoType': return l.demoType || '';
        case 'demoLocation': return l.demoLocation || '';
        case 'teamMemberName': return l.teamMemberName || '';
        case 'status': return l.status;
        case 'source': return l.source || 'website';
        case 'message': return l.message;
        case 'currentSoftware': return l.currentSoftware;
        case 'createdAt': return l.createdAt;
        default: return '';
      }
    }));

    const date = new Date().toISOString().split('T')[0];

    if (exportFormat === 'csv') {
      const csv = [headers, ...rows].map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `demo-leads-${date}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === 'excel') {
      // Use the unified Excel export
      downloadFile(`demo-leads-${date}.xls`, buildUnifiedXls(exportLeads, exportRegistrants), 'application/vnd.ms-excel');
    } else if (exportFormat === 'pdf') {
      // Generate HTML table and print to PDF
      const htmlTable = `
        <html>
          <head>
            <title>Demo Leads Export</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th { background: #1e3a5f; color: white; padding: 10px; text-align: left; font-weight: bold; }
              td { padding: 8px; border-bottom: 1px solid #ddd; }
              tr:nth-child(even) { background: #f5f5f5; }
            </style>
          </head>
          <body>
            <h2>Demo Leads Report - ${date}</h2>
            <p>Total leads: ${exportLeads.length}</p>
            <table>
              <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
              <tbody>
                ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      printHtml(htmlTable);
    }

    setShowExportDialog(false);
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
        status: 'Schedule a Demo',
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

  // ── Schedule a lead (status → Schedule a Demo) ───────────────────────────
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
      // Update lead record with schedule details. This confirmed booking is the
      // point where the lead actually moves to "Schedule a Demo" — never on the
      // click that merely opened this form. A lead already further down the
      // pipeline keeps its stage, since the forward-only rule still holds.
      const updated: Lead = {
        ...lead,
        status: isValidTransition(lead.status, 'Schedule a Demo') ? 'Schedule a Demo' : lead.status,
        scheduledDate: schedForm.scheduledDate,
        scheduledTime: schedForm.scheduledTime,
        demoType: schedForm.demoType,
        demoLocation: schedForm.demoLocation,
        teamMemberName: schedForm.teamMemberName,
        teamMemberPhone: schedForm.teamMemberPhone,
        teamMemberEmail: staffEmail(schedForm.teamMemberName),
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
      teamMemberName: lead.teamMemberName || DEFAULT_STAFF.name,
      teamMemberPhone: lead.teamMemberPhone || DEFAULT_STAFF.phone,
      tallyStaff1: '', tallyStaff2: '',
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
        teamMemberEmail: staffEmail(schedForm.teamMemberName),
        demoNotes: schedForm.demoNotes,
        meetSent: true,
        ...(schedForm.extraTeam.length > 0 ? { extraTeam: schedForm.extraTeam } : { extraTeam: [] }),
      } as Lead;
      onSave({ ...data, leads: data.leads.map(l => l.id === lead.id ? updated : l) });

      if (resendToClient) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        try {
          const res = await fetch(`${BACKEND_URL}/book-demo`, {
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
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (res.ok) {
            try {
              const data = await res.json();
              if (data.success || data.message || res.status === 200) {
                setEditSuccess('✓ Demo updated and confirmation sent to WhatsApp & email.');
              } else {
                setEditSuccess('✓ Demo updated. Message delivery status unclear — client may not have received it.');
              }
            } catch {
              setEditSuccess('✓ Demo updated. Confirmation likely sent (delivery status unclear).');
            }
          } else {
            setEditError(`Failed to send confirmation (${res.status}). Demo was saved locally. Please try resending manually.`);
          }
        } catch (err) {
          clearTimeout(timeoutId);
          if ((err as Error).name === 'AbortError') {
            setEditSuccess('✓ Demo updated, but confirmation is still sending (backend is slow). Check shortly.');
          } else {
            setEditError('Failed to send confirmation. Demo was saved locally. Please try resending manually.');
          }
        }
      } else {
        setEditSuccess('✓ Demo details updated. No message sent to client.');
      }
      setEditingId(null);
      setTimeout(() => setEditSuccess(null), 6000);
    } catch (err) {
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

  // ── Add new lead ─────────────────────────────────────────────────────────
  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddLeadError('');

    // Email is NOT required. A lead met in the field or picked up on a call
    // usually comes with a name and a number and nothing else — refusing to
    // save that is why the button looked broken.
    if (!addLeadForm.name.trim() || !addLeadForm.phone.trim()) {
      setAddLeadError('Name and phone are required');
      // The form scrolls, so the message at the top can sit off-screen above
      // the button that was just clicked. Bring it into view.
      addLeadTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: addLeadForm.name.trim(),
      email: addLeadForm.email.trim(),
      phone: addLeadForm.phone.trim(),
      company: addLeadForm.company.trim(),
      businessType: addLeadForm.businessType.trim(),
      currentSoftware: addLeadForm.currentSoftware.trim(),
      message: addLeadForm.message.trim(),
      demoDate: '',
      // The day it was captured, not the day it was typed in — a field team
      // entering Friday's round on Monday should still land in Friday.
      createdAt: addLeadForm.createdAt
        ? new Date(`${addLeadForm.createdAt}T12:00:00`).toISOString()
        : new Date().toISOString(),
      status: 'New',
      source: addLeadForm.source,
      ...(addLeadForm.source === 'field' && addLeadForm.fieldCampaign.trim()
        ? { fieldCampaign: addLeadForm.fieldCampaign.trim() } : {}),
      requestType: addLeadForm.requestType,
      industry: addLeadForm.industry.trim(),
      // Whoever captured it owns the follow-up until it is reassigned.
      teamMemberName: addLeadForm.capturedBy,
      teamMemberPhone: staffByName(addLeadForm.capturedBy)?.phone || '',
      teamMemberEmail: staffEmail(addLeadForm.capturedBy),
    };

    // Newest first, so the lead you just added is at the top of the list
    // rather than buried at the bottom.
    onSave({ ...data, leads: [newLead, ...data.leads] });
    setAddLeadSuccess(true);
    setAddLeadForm({
      name: '', email: '', phone: '', company: '', businessType: '', currentSoftware: '', message: '', industry: '',
      source: 'field', fieldCampaign: '', capturedBy: DEFAULT_STAFF.name,
      createdAt: new Date().toISOString().split('T')[0],
      requestType: 'demo',
    });
    // A filter left on another stage or source is the classic "I added it and
    // nothing happened" — clear them so the new lead is definitely on screen.
    setFilterStatus('All');
    setFilterSource('All');
    setSearch('');
    setTimeout(() => {
      setAddLeadSuccess(false);
      setShowAddLead(false);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">

      {/* ── Source Distribution Graph ── */}
      {(() => {
        const sourceData = {
          website: data.leads.filter(l => l.source === 'website').length,
          workshop: data.leads.filter(l => l.source === 'workshop').length,
          webinar: data.leads.filter(l => l.source === 'webinar').length,
          field: data.leads.filter(l => l.source === 'field').length,
          email: data.leads.filter(l => l.source === 'email').length,
          whatsapp: data.leads.filter(l => l.source === 'whatsapp').length,
          referral: data.leads.filter(l => l.source === 'referral').length,
          phone: data.leads.filter(l => l.source === 'phone').length,
          direct: data.leads.filter(l => l.source === 'direct').length,
        };
        const totalBySource = Object.values(sourceData).reduce((a, b) => a + b, 0);
        const sources = Object.entries(sourceData).filter(([_, count]) => count > 0);

        return sources.length > 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">📊 Leads by Source</h3>
            <div className="space-y-3">
              {sources.map(([source, count]) => {
                const pct = totalBySource > 0 ? Math.round((count / totalBySource) * 100) : 0;
                const label = source === 'whatsapp' ? 'WhatsApp'
                  : source === 'field' ? 'Field / Marketing'
                  : source.charAt(0).toUpperCase() + source.slice(1);
                const colors: Record<string, string> = {
                  website: 'bg-blue-500', workshop: 'bg-amber-500', webinar: 'bg-purple-500',
                  field: 'bg-yellow-500',
                  email: 'bg-green-500', whatsapp: 'bg-emerald-600', referral: 'bg-pink-500',
                  phone: 'bg-orange-500', direct: 'bg-indigo-500',
                };
                return (
                  <div key={source}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-600">{label}</span>
                      <span className="text-xs font-bold text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[source] || 'bg-slate-400'} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;
      })()}

      {/* ── Header ── */}
      <div className="sticky top-0 z-20 bg-white py-4 -mx-5 px-5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Demo Leads</h2>
          <p className="text-sm text-slate-500 mt-0.5">All demo requests — website and manually booked</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <FileText className="h-4 w-4 text-slate-500" />
            <select
              defaultValue=""
              onChange={e => { const v = e.target.value; e.target.value = ''; if (v) downloadReport(v); }}
              title="Download the CRM status report for Tally Solutions"
              className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer">
              <option value="" disabled>CRM Report…</option>
              <option value="pdf">Download as PDF</option>
              <option value="excel">Download as Excel</option>
              <option value="csv">Download as CSV</option>
              <option value="html">Download as Web page</option>
            </select>
          </div>

          <button
            onClick={() => { setShowAddLead(true); setAddLeadError(''); }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
            style={{ backgroundColor: '#2563eb' }}
          >
            <Plus className="h-4 w-4" /> Add New Lead
          </button>
          <button
            onClick={() => { setShowBooking(true); setBookingError(''); setBooking(emptyBooking); }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
            style={{ backgroundColor: '#e53e3e' }}
          >
            <Plus className="h-4 w-4" /> Book New Demo
          </button>

          {/* View toggle */}
          <div className="flex items-center gap-1.5 rounded-xl border-2 border-slate-300 bg-slate-50 p-1.5">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List className="h-4 w-4" /> List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="h-4 w-4" /> Board
            </button>
          </div>
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
      {/* Measured on sourceScoped, not filtered: this is the breakdown of where
          the chosen source's leads sit, so picking a status tab must not make
          the other five tiles collapse to zero. */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: 'Total',     value: sourceScoped.length,                                          color: 'bg-slate-50 text-slate-700' },
          { label: 'New',       value: sourceScoped.filter(l => l.status === 'New').length,          color: 'bg-accent/10 text-accent' },
          { label: 'Contacted', value: sourceScoped.filter(l => l.status === 'Contacted').length,    color: 'bg-blue-50 text-blue-600' },
          { label: 'Qualified', value: sourceScoped.filter(l => l.status === 'Qualified').length,    color: 'bg-purple-50 text-purple-600' },
          { label: 'Demo Set',  value: sourceScoped.filter(l => l.status === 'Schedule a Demo').length, color: 'bg-red-50 text-red-600' },
          { label: 'Won',       value: sourceScoped.filter(l => l.status === 'Closed Won').length,   color: 'bg-green-50 text-green-700' },
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, company..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          <button onClick={() => setShowExportDialog(true)} disabled={exportLeads.length === 0}
            title={exportLeads.length === 0 ? "No leads to export" : "Export leads with custom fields"}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-40">
            <Download className="h-4 w-4" /> Leads CSV
          </button>
          <button onClick={() => setShowImportDialog(true)}
            title="Add clients in bulk from a CSV file"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
            <Upload className="h-4 w-4" /> Import CSV
          </button>
        </div>
        {/* Report/export date range only — this NEVER hides leads from the list
            above; it just scopes what the CRM Report and CSV downloads contain. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 text-xs"
          title="This range only scopes the CRM Report and CSV downloads — your lead list above always shows everyone.">
          <span className="font-semibold text-slate-500">Report date range:</span>
          <label className="flex items-center gap-1.5 text-slate-600">
            From
            <input type="date" value={exportFrom} onChange={e => setExportFrom(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-accent" />
          </label>
          <label className="flex items-center gap-1.5 text-slate-600">
            To
            <input type="date" value={exportTo} onChange={e => setExportTo(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-accent" />
          </label>
          {(exportFrom || exportTo) && (
            <button onClick={() => { setExportFrom(''); setExportTo(''); }}
              className="text-slate-400 hover:text-slate-600 underline">clear dates</button>
          )}
          <span className="text-slate-400">
            {(exportFrom || exportTo)
              ? `Report covers ${exportLeads.length} lead${exportLeads.length === 1 ? '' : 's'} in this range`
              : `Report covers all ${exportLeads.length} leads`}
          </span>
          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer" title="Only affects what the exports contain">
            <input type="checkbox" checked={includeClosed} onChange={e => setIncludeClosed(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-accent focus:ring-accent" />
            Include Closed in exports
          </label>
        </div>
        {/* Source filter — separate online / workshop / manual so bulk actions
            and Select-all only touch the source you're looking at. */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">Source:</span>
          {([['All', 'All sources'], ['online', 'Online / Website'], ['field', '📣 Field / Marketing'], ['workshop', 'Workshop'], ['webinar', 'Webinar'], ['email', 'Email'], ['whatsapp', 'WhatsApp'], ['referral', 'Referral'], ['phone', 'Phone'], ['direct', 'Direct']] as [typeof filterSource, string][]).map(([val, label]) => {
            const isActive = filterSource === val;
            // Counted across every pipeline stage — "Online / Website (6)" means
            // six leads came in that way, wherever they've since got to. Picking
            // a source therefore also clears the status tab, so the list and the
            // board show all six rather than just the ones in one stage.
            const count = val === 'All'
              ? searchScoped.length
              : searchScoped.filter(l => sourceCategory(l) === val).length;
            return (
              <button key={val}
                onClick={() => { setFilterSource(val); setFilterStatus('All'); if (val !== 'workshop') setFilterWorkshop('all'); if (val !== 'webinar') setFilterWebinar('all'); }}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap"
                style={isActive
                  ? { backgroundColor: '#1e3a5f', color: '#fff', borderColor: '#1e3a5f' }
                  : { backgroundColor: '#fff', color: '#475569', borderColor: '#e2e8f0' }}>
                {label} <span style={{ opacity: 0.7 }}>({count})</span>
              </button>
            );
          })}
          {/* Which workshop? A workshop is a group event, so once you're looking
              at Workshop leads you can narrow to one specific event. */}
          {filterSource === 'workshop' && (
            <label className="flex items-center gap-1.5 text-xs text-slate-600 ml-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={filterWorkshop}
                onChange={e => setFilterWorkshop(e.target.value)}
                title="Show leads from a specific workshop"
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-accent cursor-pointer">
                <option value="all">
                  All workshops ({searchScoped.filter(l => sourceCategory(l) === 'workshop').length})
                </option>
                {(() => {
                  // List every workshop that actually has leads, most recent first,
                  // plus a catch-all for legacy leads with no resolvable event.
                  const wsLeads = searchScoped.filter(l => sourceCategory(l) === 'workshop');
                  const counts = new Map<string, number>();
                  wsLeads.forEach(l => {
                    const id = leadWorkshopId(l);
                    counts.set(id, (counts.get(id) || 0) + 1);
                  });
                  const ordered = [...events].reverse().filter(e => counts.has(e.id));
                  const listedIds = new Set(ordered.map(e => e.id));
                  const orphanIds = [...counts.keys()].filter(id => !listedIds.has(id));
                  return [
                    ...ordered.map(e => (
                      <option key={e.id} value={e.id}>{e.title} ({counts.get(e.id)})</option>
                    )),
                    ...orphanIds.map(id => (
                      <option key={id} value={id}>{workshopTitleById(id)} ({counts.get(id)})</option>
                    )),
                  ];
                })()}
              </select>
            </label>
          )}
          {/* Which webinar? Same idea as workshops — narrow to one online event. */}
          {filterSource === 'webinar' && (
            <label className="flex items-center gap-1.5 text-xs text-slate-600 ml-1">
              <Video className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={filterWebinar}
                onChange={e => setFilterWebinar(e.target.value)}
                title="Show leads from a specific webinar"
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-accent cursor-pointer">
                <option value="all">
                  All webinars ({searchScoped.filter(l => sourceCategory(l) === 'webinar').length})
                </option>
                {(() => {
                  const wbLeads = searchScoped.filter(l => sourceCategory(l) === 'webinar');
                  const counts = new Map<string, number>();
                  wbLeads.forEach(l => {
                    const id = leadWebinarId(l);
                    counts.set(id, (counts.get(id) || 0) + 1);
                  });
                  const ordered = [...webinarEvents].reverse().filter(e => counts.has(e.id));
                  const listedIds = new Set(ordered.map(e => e.id));
                  const orphanIds = [...counts.keys()].filter(id => !listedIds.has(id));
                  return [
                    ...ordered.map(e => (
                      <option key={e.id} value={e.id}>{e.title} ({counts.get(e.id)})</option>
                    )),
                    ...orphanIds.map(id => (
                      <option key={id} value={id}>{webinarTitleById(id)} ({counts.get(id)})</option>
                    )),
                  ];
                })()}
              </select>
            </label>
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
            // Scoped to the chosen source, so the tabs add up to the number on
            // the active Source chip instead of quietly counting all 66 leads.
            const count = s === 'All' ? sourceScoped.length : sourceScoped.filter(l => l.status === s).length;
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
        <div className="fixed inset-0 z-50 flex justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto pt-20">
          <div className="rounded-2xl border border-accent/30 bg-white shadow-lg overflow-hidden w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-accent" />
                <h3 className="font-bold text-slate-900">Book a New Demo</h3>
              </div>
              <button onClick={() => setShowBooking(false)} className="rounded-lg p-1.5 hover:bg-slate-200 transition">
                <X className="h-4 w-4 text-slate-500" />
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
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Details</p>
                <input value={booking.clientName} onChange={e => setB('clientName', e.target.value)}
                  placeholder="Client name *" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={booking.clientPhone} onChange={e => setB('clientPhone', e.target.value)}
                    placeholder="+254 7XX XXX XXX *" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  <input value={booking.clientEmail} onChange={e => setB('clientEmail', e.target.value)}
                    placeholder="Email (optional)" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                </div>
                <input value={booking.clientCompany} onChange={e => setB('clientCompany', e.target.value)}
                  placeholder="Company name *" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                <select value={booking.clientIndustry} onChange={e => setB('clientIndustry', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white">
                  <option value="">Select industry *</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
                <select value={booking.sourceOfEnquiry} onChange={e => setB('sourceOfEnquiry', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white">
                  <option value="">Source of Enquiry *</option>
                  <option value="website">Website</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="referral">Referral</option>
                  <option value="phone">Phone Call</option>
                  <option value="direct">Direct Contact</option>
                </select>
              </div>

              {/* Demo Schedule */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Demo Schedule</p>

                {/* Demo Type */}
                <div className="flex rounded-xl overflow-hidden border border-slate-200">
                  <button type="button" onClick={() => setB('demoType', 'online')}
                    className={`flex-1 py-2.5 text-sm font-semibold transition ${booking.demoType === 'online' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                    💻 Online
                  </button>
                  <button type="button" onClick={() => setB('demoType', 'physical')}
                    className={`flex-1 py-2.5 text-sm font-semibold transition border-l border-slate-200 ${booking.demoType === 'physical' ? 'bg-green-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                    📍 Physical
                  </button>
                </div>

                {/* Date */}
                <div>
                  <input type="date" value={booking.demoDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => { setB('demoDate', e.target.value); setB('demoTime', ''); }}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent ${booking.demoDate && isDateBlocked(booking.demoDate) ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                  {booking.demoDate && isDateBlocked(booking.demoDate) && (
                    <p className="mt-1 text-xs text-red-600">⛔ {getDayOfWeek(booking.demoDate) === 0 ? 'Sundays are not available' : 'This is a public holiday'} — please choose another date.</p>
                  )}
                  {booking.demoDate && getDayOfWeek(booking.demoDate) === 6 && !isDateBlocked(booking.demoDate) && (
                    <p className="mt-1 text-xs text-red-600">⚠️ Saturday — available slots: 8:00 AM – 1:00 PM only.</p>
                  )}
                </div>

                {/* Time slots */}
                {booking.demoDate && !isDateBlocked(booking.demoDate) && bookingSlots.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1.5">Select time *</p>
                    <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {bookingSlots.map(s => (
                        <button key={s.value} type="button"
                          disabled={s.blocked}
                          onClick={() => setB('demoTime', s.value)}
                          title={s.blocked ? 'Already booked' : ''}
                          className={`rounded-lg py-1.5 text-xs font-medium transition border ${
                            s.blocked
                              ? 'border-slate-100 bg-slate-100 text-slate-300 cursor-not-allowed line-through'
                              : booking.demoTime === s.value
                                ? 'border-accent bg-accent text-white'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-accent hover:bg-accent/5'
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
                    placeholder="Location / address *" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">What's this about? <span className="font-normal text-slate-400">(purpose — optional)</span></label>
                  <textarea value={booking.demoNotes} onChange={e => setB('demoNotes', e.target.value)}
                    placeholder="e.g. Product demo · buying an add-on · paying for implementation · training / support"
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Team Members</p>
                {booking.extraTeam.length < 2 && (
                  <button type="button" onClick={addBookingExtraTeam}
                    className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add member
                  </button>
                )}
              </div>
              {/* Primary — pre-filled with the demo team; one tap to switch */}
              <StaffPicker value={booking.teamMemberName}
                onPick={(name, phone) => { setB('teamMemberName', name); setB('teamMemberPhone', phone); }} />
              {/* Extra members */}
              {booking.extraTeam.map((m, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 items-center">
                  <input value={m.name} onChange={e => setBookingExtraTeam(i, 'name', e.target.value)}
                    placeholder={`Member ${i + 2} name`}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  <div className="flex gap-1">
                    <input value={m.phone} onChange={e => setBookingExtraTeam(i, 'phone', e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
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
                className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent" />
              <span className="text-sm text-slate-700">Send WhatsApp confirmation to client</span>
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
        </div>
      )}

      {/* ── Selection / Bulk Actions Bar ── */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
            <input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent" />
            Select all ({filtered.length})
          </label>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-3 py-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-700">{selectedIds.size} selected</span>
              <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium outline-none focus:border-accent bg-white">
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
                className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 transition">
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* Escalation Error Alert */}
      {escalationError && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-orange-900">{escalationError}</p>
            <p className="text-xs text-orange-700 mt-1">Leads can only move forward through the pipeline stages.</p>
          </div>
          <button onClick={() => setEscalationError(null)} className="text-orange-400 hover:text-orange-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Stranded bookings: clean up after the old 📅 Book behaviour ── */}
      {repairDone > 0 && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <p className="text-sm font-semibold text-green-900">
            Moved {repairDone} lead{repairDone === 1 ? '' : 's'} back out of “Schedule a Demo”.
          </p>
        </div>
      )}
      {strandedLeads.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3 flex-wrap">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-[220px]">
            <p className="text-sm font-semibold text-amber-900">
              {strandedLeads.length} lead{strandedLeads.length === 1 ? ' is' : 's are'} sitting in “Schedule a Demo” with nothing actually booked
            </p>
            <p className="text-xs text-amber-700 mt-1">
              The 📅 Book button used to move a lead the moment it was pressed, so a mis-tap could park it here.
              No demo was ever sent for {strandedLeads.length === 1 ? 'this one' : 'these'} — put {strandedLeads.length === 1 ? 'it' : 'them'} back where {strandedLeads.length === 1 ? 'it belongs' : 'they belong'}.
            </p>
          </div>
          <button onClick={openRepair}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-md transition shrink-0">
            <RotateCcw className="h-3.5 w-3.5" /> Review &amp; fix
          </button>
        </div>
      )}

      {showRepair && (
        <div className="fixed inset-0 z-50 flex justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto pt-20">
          <div className="rounded-2xl border border-amber-300 bg-white shadow-lg overflow-hidden w-full max-w-2xl h-fit">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-slate-900">Put mis-booked leads back</h3>
              </div>
              <button onClick={() => setShowRepair(false)} title="Close"
                className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                Nothing records which stage these leads were on before, so each one starts at
                <strong className="text-slate-700"> New</strong>. Change any that were further along, or set one back to
                “Schedule a Demo” to leave it exactly as it is.
              </p>
              <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                {strandedLeads.map(l => (
                  <div key={l.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{l.name}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {l.company || 'No company'} · came in {leadReceived(l.createdAt).date}
                      </p>
                    </div>
                    <select
                      value={repairStages[l.id] || 'New'}
                      onChange={e => setRepairStages(prev => ({ ...prev, [l.id]: e.target.value }))}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-accent cursor-pointer shrink-0">
                      {PIPELINE_ORDER.map(s => (
                        <option key={s} value={s}>{s === 'Schedule a Demo' ? 'Leave as is' : `Move back to ${s}`}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 flex-wrap">
                <button
                  onClick={() => setRepairStages(Object.fromEntries(strandedLeads.map(l => [l.id, 'New'])))}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 underline">
                  Set all back to New
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowRepair(false)}
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition">
                    Cancel
                  </button>
                  <button onClick={confirmRepair}
                    className="rounded-lg bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-md transition">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Leads View (List or Kanban) ── */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          data={data}
          leads={filtered}
          onSave={onSave}
          onEditLead={(leadId) => {
            const lead = data.leads.find(l => l.id === leadId);
            if (lead) {
              setExpandedId(leadId);
              openEdit(lead);
            }
          }}
        />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
          <UsersIcon className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            {data.leads.length === 0 ? 'No leads yet' : 'No leads match your filters'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
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
                  : 'border-slate-200 bg-white'
              }`}>
              {/* Lead row */}
              <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpandedId(expandedId === l.id ? null : l.id)}>
                <input type="checkbox" checked={selectedIds.has(l.id)}
                  onClick={e => e.stopPropagation()}
                  onChange={() => toggleSelect(l.id)}
                  className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent shrink-0" />
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {l.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 truncate">{l.name}</p>
                    {l.status === 'New' && <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />}
                    {l.source === 'manual' && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500">MANUAL</span>
                    )}
                    {l.source === 'workshop' && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-semibold text-red-700"
                        title={l.attendedWorkshop ? 'Attended the breakfast workshop' : 'Registered for workshop — did not attend'}>
                        🥐 WORKSHOP{l.attendedWorkshop ? ' ✓' : ''}
                      </span>
                    )}
                    {l.source === 'field' && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-700"
                        title={l.fieldCampaign ? `Field storming / marketing — ${l.fieldCampaign}` : 'Captured in the field'}>
                        📣 FIELD
                      </span>
                    )}
                    {(l.reopenCount || 0) > 0 && (
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-white"
                        title={`Restarted after being closed lost${l.reopenedAt ? ` on ${new Date(l.reopenedAt).toLocaleDateString()}` : ''}`}>
                        ↻ RESTARTED{(l.reopenCount || 0) > 1 ? ` ×${l.reopenCount}` : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{l.phone} · {l.company || 'No company'}</p>
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
                  <span className="text-[10px] text-slate-400 hidden sm:block whitespace-nowrap">
                    📅 {new Date(l.scheduledDate + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    {l.scheduledTime && ` · ${l.scheduledTime}`}
                  </span>
                )}
                {/* When the enquiry landed — date over time, so you can see at a
                    glance how fresh a new lead is. */}
                {(() => {
                  const received = leadReceived(l.createdAt);
                  return (
                    <span className="text-[10px] text-slate-400 hidden sm:block whitespace-nowrap text-right leading-tight"
                      title={received.time ? `Received ${received.date} at ${received.time}` : `Received ${received.date}`}>
                      {received.date}
                      {received.time && (
                        <>
                          <br />
                          <span className={l.status === 'New' ? 'font-semibold text-accent' : ''}>{received.time}</span>
                        </>
                      )}
                    </span>
                  );
                })()}
                {/* One-click demo action. If a demo is already booked, this
                    edits the existing one (never creates a duplicate); otherwise
                    it opens the scheduling pop-up. Opening the pop-up changes
                    nothing on the lead — the stage only moves to "Schedule a
                    Demo" once the booking is actually confirmed — so a
                    mis-click here costs nothing. */}
                {l.meetSent ? (
                  <button
                    onClick={e => { e.stopPropagation(); setExpandedId(l.id); openEdit(l); }}
                    title="Edit this booked demo (date, time, team)"
                    className="inline-flex items-center gap-1 rounded-lg bg-red-500 hover:bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition whitespace-nowrap shrink-0">
                    ✏️ Edit
                  </button>
                ) : (
                  <button
                    onClick={e => { e.stopPropagation(); if (openScheduling(l)) setExpandedId(l.id); }}
                    title="Book / schedule a demo for this lead"
                    className="inline-flex items-center gap-2 rounded-lg bg-accent hover:bg-accent/90 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition whitespace-nowrap shrink-0">
                    📅 Book
                  </button>
                )}
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ${expandedId === l.id ? 'rotate-180' : ''}`} />
              </div>

              {/* Expanded detail */}
              {expandedId === l.id && (
                <div className="border-t border-slate-100 p-5 space-y-4">
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
                      <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-500 font-medium">Email</p>
                        <p className="text-sm text-slate-900 break-all">{l.email || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 min-w-0">
                      <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-500 font-medium">Phone</p>
                        <p className="text-sm text-slate-900">{l.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 min-w-0">
                      <Building2 className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-500 font-medium">Company</p>
                        <p className="text-sm text-slate-900 truncate">{l.company || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 min-w-0">
                      <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-500 font-medium">Requested Slot</p>
                        <p className="text-sm text-slate-900">
                          {l.demoDate
                            ? `${new Date(l.demoDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}${l.demoTime ? ` · ${l.demoTime}` : ''}`
                            : 'Flexible'}
                        </p>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500 font-medium mb-0.5">Industry</p>
                      <p className="text-sm text-slate-900 truncate">{l.industry || l.businessType || '—'}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500 font-medium mb-0.5">Current Software</p>
                      <p className="text-sm text-slate-900 truncate">{l.currentSoftware || '—'}</p>
                    </div>
                  </div>

                  {l.message && (
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium mb-1">Message</p>
                      <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 leading-relaxed">{l.message}</p>
                    </div>
                  )}

                  {/* Scheduled demo info (if already scheduled) */}
                  {l.status === 'Schedule a Demo' && l.scheduledDate && l.meetSent && editingId !== l.id && (
                    <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-50 border-2 border-red-300 p-5 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-red-200 flex items-center justify-center text-lg">📅</div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-red-700">Demo Booked & Confirmed</p>
                            <p className="text-[11px] text-red-600">Ready for presentation</p>
                          </div>
                        </div>
                        <button
                          onClick={() => openEdit(l)}
                          className="flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition">
                          ✏️ Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="bg-white rounded-lg p-3 border border-red-200">
                          <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wide mb-1">Date</p>
                          <p className="text-base font-bold text-red-900">{new Date(l.scheduledDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-red-200">
                          <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wide mb-1">Time</p>
                          <p className="text-base font-bold text-red-900">{l.scheduledTime} EAT</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-red-200">
                          <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wide mb-1">Type</p>
                          <p className="text-base font-bold text-red-900">{l.demoType === 'online' ? '💻 Online' : '📍 Physical'}</p>
                        </div>
                        {l.teamMemberName && <div className="bg-white rounded-lg p-3 border border-red-200">
                          <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wide mb-1">Staff</p>
                          <p className="text-base font-bold text-red-900 truncate">{l.teamMemberName}{(l as any).extraTeam?.length > 0 ? ` +${(l as any).extraTeam.length}` : ''}</p>
                        </div>}
                      </div>
                      {l.demoType === 'physical' && l.demoLocation && (
                        <div className="bg-white rounded-lg p-3 border border-red-200 flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wide mb-1">Location</p>
                            <p className="text-sm font-semibold text-red-900 break-words">{l.demoLocation}</p>
                          </div>
                        </div>
                      )}
                      {l.meetLink && (
                        <a href={l.meetLink} target="_blank" rel="noopener noreferrer"
                          className="block bg-white rounded-lg p-3 border border-blue-300 hover:bg-blue-50 transition">
                          <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">Google Meet Link</p>
                          <p className="text-sm font-semibold text-blue-700 break-all hover:underline">📹 {l.meetLink}</p>
                        </a>
                      )}

                      {/* Put the booking on everyone's calendar. Google for
                          anyone on a Google account, .ics for Outlook and the
                          shared company mailbox — same event, same guests. */}
                      {l.demoType === 'online' && l.scheduledDate && (
                        <div className="bg-white rounded-lg p-3 border border-blue-300 space-y-2">
                          <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
                            <CalendarPlus className="h-3.5 w-3.5 inline mr-1" />Add to calendar
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => addToGoogleCalendar(l)}
                              title="Open a pre-filled Google Calendar event with all guests attached"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition">
                              <CalendarPlus className="h-3.5 w-3.5" /> Google Calendar
                            </button>
                            <button onClick={() => downloadInvite(l)}
                              title="Download an .ics invite for Outlook, Apple Calendar or the office mailbox"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition">
                              <Download className="h-3.5 w-3.5" /> Download invite (.ics)
                            </button>
                            {l.meetLink && (
                              <button onClick={() => { navigator.clipboard?.writeText(l.meetLink || ''); }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                                Copy Meet link
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 break-all">
                            Invites: {leadCalendar(l).guests.join(' · ')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Closed Lost: restart the pipeline ── */}
                  {l.status === 'Closed Lost' && (
                    <div className="rounded-xl border border-slate-300 bg-slate-50 p-4 flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-sm font-bold text-slate-700">Deal closed lost</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {l.lostAt ? `Marked lost ${new Date(l.lostAt).toLocaleDateString()}. ` : ''}
                          Circumstances change — restart the pipeline when they're worth another run.
                        </p>
                      </div>
                      <button onClick={() => openRestart(l)}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900 transition shrink-0">
                        <RotateCcw className="h-3.5 w-3.5" /> Restart pipeline
                      </button>
                    </div>
                  )}

                  {/* ── Closed Won: hand over to delivery ── */}
                  {l.status === 'Closed Won' && (
                    <div className="rounded-xl border border-green-300 bg-green-50 p-4 flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-sm font-bold text-green-800">🎉 Deal won — what happens next?</p>
                        <p className="text-xs text-green-700 mt-0.5">
                          {l.wipJobId
                            ? 'Delivery is already open in Work in Progress.'
                            : 'Open the training / implementation job so the delivery is tracked to completion.'}
                        </p>
                      </div>
                      <button onClick={() => startWork(l)}
                        className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-xs font-bold text-white hover:bg-green-800 transition shrink-0">
                        <Briefcase className="h-3.5 w-3.5" /> {l.wipJobId ? 'Open the job' : 'Start work'}
                      </button>
                    </div>
                  )}

                  {/* Show edit button even for non-scheduled demos in Schedule a Demo status */}
                  {l.status === 'Schedule a Demo' && (!l.scheduledDate || !l.meetSent) && editingId !== l.id && (
                    <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
                      <button
                        onClick={() => {
                          openEdit(l);
                          setSchedulingId(null);
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition">
                        📅 Open Booking Form
                      </button>
                    </div>
                  )}

                  {/* Auto next step — derived from the stage, shown in the CRM report */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold">Next step:</span>
                    <span className="rounded-lg bg-slate-50 px-2.5 py-1 font-medium text-slate-700">{defaultNextStep(l.status)}</span>
                    <span className="text-slate-400">— set automatically from the stage</span>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-slate-600">Status:</label>
                      <select value={l.status} onChange={e => updateStatus(l.id, e.target.value)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium outline-none focus:border-accent">
                        {getValidNextStages(l.status).map(s => <option key={s.id}>{s.id}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {l.status === 'Schedule a Demo' && (l.scheduledDate || !l.meetSent) && (
                        <button onClick={() => openEdit(l)}
                          className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition">
                          📝 Edit Demo
                        </button>
                      )}
                      {l.email && (
                        <a href={`mailto:${l.email}`}
                          className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition">
                          Send Email
                        </a>
                      )}
                      {toWhatsAppNumber(l.phone) && (
                        <a href={`https://wa.me/${toWhatsAppNumber(l.phone)}`} target="_blank" rel="noopener noreferrer"
                          className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition">
                          WhatsApp
                        </a>
                      )}
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
                              className={`flex-1 py-2.5 text-sm font-semibold transition ${schedForm.demoType === 'online' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                              💻 Online (Google Meet)
                            </button>
                            <button type="button" onClick={() => setS('demoType', 'physical')}
                              className={`flex-1 py-2.5 text-sm font-semibold transition border-l border-blue-300 ${schedForm.demoType === 'physical' ? 'bg-green-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                              📍 Physical / On-site
                            </button>
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date *</label>
                          <input type="date" value={schedForm.scheduledDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => { setS('scheduledDate', e.target.value); setS('scheduledTime', ''); }}
                            className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 ${schedForm.scheduledDate && isDateBlocked(schedForm.scheduledDate) ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                          {schedForm.scheduledDate && isDateBlocked(schedForm.scheduledDate) && (
                            <p className="mt-1 text-xs text-red-600">⛔ {getDayOfWeek(schedForm.scheduledDate) === 0 ? 'Sundays not available' : 'Public holiday'} — choose another date.</p>
                          )}
                          {schedForm.scheduledDate && getDayOfWeek(schedForm.scheduledDate) === 6 && !isDateBlocked(schedForm.scheduledDate) && (
                            <p className="mt-1 text-xs text-red-600">⚠️ Saturday — 8:00 AM–1:00 PM only.</p>
                          )}
                        </div>

                        {/* Time slots */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Time *</label>
                          {schedForm.scheduledDate && !isDateBlocked(schedForm.scheduledDate) && schedSlots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
                              {schedSlots.map(s => (
                                <button key={s.value} type="button"
                                  disabled={s.blocked}
                                  onClick={() => setS('scheduledTime', s.value)}
                                  title={s.blocked ? 'Already booked' : ''}
                                  className={`rounded-lg py-1.5 text-xs font-medium transition border ${
                                    s.blocked
                                      ? 'border-slate-100 bg-slate-100 text-slate-300 cursor-not-allowed line-through'
                                      : schedForm.scheduledTime === s.value
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50'
                                  }`}>
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Select a date first</p>
                          )}
                        </div>

                        {/* Location (physical only) */}
                        {schedForm.demoType === 'physical' && (
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Location / Address *</label>
                            <input value={schedForm.demoLocation} onChange={e => setS('demoLocation', e.target.value)}
                              placeholder="e.g. Client's office — Moi Avenue, Nairobi"
                              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400" />
                          </div>
                        )}

                        {/* Team members */}
                        <div className="sm:col-span-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                              <User className="h-3 w-3 inline mr-1" />Team Members *
                            </label>
                            {schedForm.extraTeam.length < 2 && (
                              <button type="button" onClick={addExtraTeam}
                                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                                <Plus className="h-3 w-3" /> Add member
                              </button>
                            )}
                          </div>
                          <StaffPicker value={schedForm.teamMemberName} accent="blue"
                            onPick={(name, phone) => { setS('teamMemberName', name); setS('teamMemberPhone', phone); }} />
                          {schedForm.extraTeam.map((m, i) => (
                            <div key={i} className="grid grid-cols-2 gap-2 items-center">
                              <input value={m.name} onChange={e => setExtraTeam(i, 'name', e.target.value)}
                                placeholder={`Member ${i + 2} name`}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400" />
                              <div className="flex gap-1">
                                <input value={m.phone} onChange={e => setExtraTeam(i, 'phone', e.target.value)}
                                  placeholder="+254 7XX XXX XXX"
                                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400" />
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
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">What's this about? <span className="font-normal text-slate-400">(purpose)</span></label>
                          <textarea value={schedForm.demoNotes} onChange={e => setS('demoNotes', e.target.value)}
                            placeholder="e.g. Product demo · buying an add-on · paying for implementation · training / support"
                            rows={2} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 resize-none" />
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
                          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition">
                          Save Only (no message)
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Schedule Demo pop-up (opens when status = Schedule a Demo, not yet sent) ── */}
                  {/* The backdrop deliberately has NO click-to-close: a stray
                      click outside must never discard a half-filled booking.
                      Close only via the X or Cancel button (or on submit). */}
                  {schedulingId === l.id && !l.meetSent && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6">
                    <div
                      className="my-6 w-full max-w-2xl rounded-2xl border border-red-300 bg-red-50 p-5 space-y-4 shadow-2xl">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-red-600" />
                          <p className="font-bold text-amber-800">Book a Demo — {l.name}</p>
                        </div>
                        <button onClick={() => setSchedulingId(null)} title="Close"
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-100 transition">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-xs text-red-700">
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
                          <div className="flex rounded-xl overflow-hidden border border-red-300">
                            <button type="button" onClick={() => setS('demoType', 'online')}
                              className={`flex-1 py-2.5 text-sm font-semibold transition ${schedForm.demoType === 'online' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                              💻 Online (Google Meet)
                            </button>
                            <button type="button" onClick={() => setS('demoType', 'physical')}
                              className={`flex-1 py-2.5 text-sm font-semibold transition border-l border-red-300 ${schedForm.demoType === 'physical' ? 'bg-green-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                              📍 Physical / On-site
                            </button>
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date *</label>
                          <input type="date" value={schedForm.scheduledDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => { setS('scheduledDate', e.target.value); setS('scheduledTime', ''); }}
                            className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent ${schedForm.scheduledDate && isDateBlocked(schedForm.scheduledDate) ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                          {schedForm.scheduledDate && isDateBlocked(schedForm.scheduledDate) && (
                            <p className="mt-1 text-xs text-red-600">⛔ {getDayOfWeek(schedForm.scheduledDate) === 0 ? 'Sundays not available' : 'Public holiday'} — choose another date.</p>
                          )}
                          {schedForm.scheduledDate && getDayOfWeek(schedForm.scheduledDate) === 6 && !isDateBlocked(schedForm.scheduledDate) && (
                            <p className="mt-1 text-xs text-red-600">⚠️ Saturday — 8:00 AM–1:00 PM only.</p>
                          )}
                        </div>

                        {/* Time slots */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Time *</label>
                          {schedForm.scheduledDate && !isDateBlocked(schedForm.scheduledDate) && schedSlots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
                              {schedSlots.map(s => (
                                <button key={s.value} type="button"
                                  disabled={s.blocked}
                                  onClick={() => setS('scheduledTime', s.value)}
                                  title={s.blocked ? 'Already booked' : ''}
                                  className={`rounded-lg py-1.5 text-xs font-medium transition border ${
                                    s.blocked
                                      ? 'border-slate-100 bg-slate-100 text-slate-300 cursor-not-allowed line-through'
                                      : schedForm.scheduledTime === s.value
                                        ? 'border-accent bg-accent text-white'
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-accent hover:bg-accent/5'
                                  }`}>
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Select a date first</p>
                          )}
                        </div>

                        {/* Location (physical only) */}
                        {schedForm.demoType === 'physical' && (
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Location / Address *</label>
                            <input value={schedForm.demoLocation} onChange={e => setS('demoLocation', e.target.value)}
                              placeholder="e.g. Client's office — Moi Avenue, Nairobi"
                              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                          </div>
                        )}

                        {/* Who's running it — pre-filled with the demo team */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5"><User className="h-3 w-3 inline mr-1" />Who is doing this demo / consultation? *</label>
                          <StaffPicker value={schedForm.teamMemberName}
                            onPick={(name, phone) => { setS('teamMemberName', name); setS('teamMemberPhone', phone); }} />
                        </div>

                        {/* Online demos land on everyone's calendar */}
                        {schedForm.demoType === 'online' && schedForm.scheduledDate && schedForm.scheduledTime && (
                          <div className="sm:col-span-2 rounded-xl border border-blue-200 bg-blue-50 p-3">
                            <p className="text-xs font-semibold text-blue-800 mb-1.5">
                              <CalendarPlus className="h-3.5 w-3.5 inline mr-1" />Calendar invite
                            </p>
                            <p className="text-[11px] text-blue-700">
                              Once you confirm, use <strong>Add to calendar</strong> on the lead to send this to
                              {' '}{DEMO_TEAM.map(s => s.name.replace(/^(Mr\.|Ms\.)\s*/, '')).join(' & ')}, {COMPANY_EMAIL}
                              {' '}and the client — as a Google Calendar event or an .ics file for Outlook.
                            </p>
                          </div>
                        )}

                        {/* Optional Tally Solutions staff */}
                        <div className="sm:col-span-2 space-y-2">
                          <label className="block text-xs font-semibold text-slate-600">Tally Solutions Staff (optional, max 2)</label>
                          <input value={schedForm.tallyStaff1} onChange={e => setS('tallyStaff1', e.target.value)}
                            placeholder="Name or contact (optional)"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                          <input value={schedForm.tallyStaff2} onChange={e => setS('tallyStaff2', e.target.value)}
                            placeholder="Name or contact (optional)"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                        </div>

                        {/* Notes */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">What's this about? <span className="font-normal text-slate-400">(purpose)</span></label>
                          <textarea value={schedForm.demoNotes} onChange={e => setS('demoNotes', e.target.value)}
                            placeholder="e.g. Product demo · buying an add-on · paying for implementation · training / support"
                            rows={2} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
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
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                          Cancel
                        </button>
                      </div>
                    </div>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400">
                    Submitted: {leadReceived(l.createdAt).date}
                    {leadReceived(l.createdAt).time && ` at ${leadReceived(l.createdAt).time}`}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Restart a Closed Lost lead ── */}
      {restartLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-slate-700" />
                <h3 className="font-bold text-slate-900">Restart — {restartLead.name}</h3>
              </div>
              <button onClick={() => setRestartLead(null)} className="rounded-lg p-1.5 hover:bg-slate-200 transition">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-slate-500">
                This puts the lead back into the working pipeline and clears the old booking,
                so it goes through scheduling afresh. Nothing is deleted — the history stays on the record.
              </p>

              {/* Which period the restarted lead is domiciled in */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Which period should it sit in?
                </label>
                <div className="space-y-2">
                  <button type="button" onClick={() => setRestartPeriod('today')}
                    className={`w-full rounded-xl border-2 px-4 py-3 text-left transition ${
                      restartPeriod === 'today' ? 'border-accent bg-accent/5' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                    <p className="text-sm font-bold text-slate-900">
                      Today — {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Counts as a fresh lead in this period. It shows in this month's reports and date-range exports.
                    </p>
                  </button>
                  <button type="button" onClick={() => setRestartPeriod('original')}
                    className={`w-full rounded-xl border-2 px-4 py-3 text-left transition ${
                      restartPeriod === 'original' ? 'border-accent bg-accent/5' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                    <p className="text-sm font-bold text-slate-900">
                      Keep its original period — {new Date(restartLead.originalCreatedAt || restartLead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Stays where it was first captured — the workshop, campaign or month it actually came from.
                    </p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Restart at stage</label>
                  <select value={restartStage} onChange={e => setRestartStage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent">
                    {statuses.filter(s => s !== 'Closed Lost').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Restarted before</label>
                  <p className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                    {restartLead.reopenCount || 0} time{(restartLead.reopenCount || 0) === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Why restart? (optional)</label>
                <textarea value={restartNote} onChange={e => setRestartNote(e.target.value)}
                  placeholder="e.g. Budget approved for the new financial year · New finance manager · Asked us to call back in August"
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent resize-none" />
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button onClick={confirmRestart}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition"
                style={{ backgroundColor: '#e53e3e' }}>
                <RotateCcw className="h-4 w-4" /> Restart as “{restartStage}”
              </button>
              <button onClick={() => setRestartLead(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Dialog — bulk-add clients from a CSV, the reverse of the export */}
      {showImportDialog && (
        <ImportLeadsDialog
          existingLeads={data.leads}
          onClose={() => setShowImportDialog(false)}
          onImport={imported => {
            // Newest first, same as a lead added by hand, so the batch you just
            // brought in sits at the top of the list.
            onSave({ ...data, leads: [...imported, ...data.leads] });
            // Filters left on another stage or source are the classic "I
            // imported and nothing happened" — clear them so the batch shows.
            setFilterStatus('All');
            setFilterSource('All');
            setSearch('');
          }}
        />
      )}

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-900">Export Leads</h3>
              <button onClick={() => setShowExportDialog(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div id="export-content" className="px-6 py-4 space-y-5 min-h-0 flex-1 overflow-y-auto pb-20">
              {/* Summary */}
              <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">{exportLeads.length} leads</span> will be exported
                  {(exportFrom || exportTo) && ` (${exportFrom ? 'from ' + exportFrom : ''} ${exportTo ? 'to ' + exportTo : ''})`.trim()}
                </p>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Format</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={exportFormat === 'csv'} onChange={() => setExportFormat('csv')}
                      className="h-4 w-4 text-accent border-slate-300" />
                    <span className="text-sm text-slate-700">CSV (for CRM import)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={exportFormat === 'excel'} onChange={() => setExportFormat('excel')}
                      className="h-4 w-4 text-accent border-slate-300" />
                    <span className="text-sm text-slate-700">Excel (.xlsx for spreadsheets)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={exportFormat === 'pdf'} onChange={() => setExportFormat('pdf')}
                      className="h-4 w-4 text-accent border-slate-300" />
                    <span className="text-sm text-slate-700">PDF (for printing & sharing)</span>
                  </label>
                </div>
              </div>

              {/* Field Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-900">Select Fields</label>
                  <div className="flex gap-2 text-xs">
                    <button onClick={() => setSelectedFields(new Set(allFields.map(f => f.key)))}
                      className="text-accent hover:underline">Select all</button>
                    <button onClick={() => setSelectedFields(new Set())}
                      className="text-slate-400 hover:text-slate-600">Clear</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {allFields.map(field => (
                    <label key={field.key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={selectedFields.has(field.key)}
                        onChange={() => toggleField(field.key)}
                        className="h-4 w-4 text-accent rounded border-slate-300" />
                      <span className="text-sm text-slate-700">{field.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Data Quality */}
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                <p className="text-xs font-semibold text-amber-900 mb-1">Data Quality</p>
                <ul className="text-xs text-amber-800 space-y-1">
                  <li>✓ {exportLeads.length} valid records</li>
                  <li>✓ {exportLeads.filter(l => !l.email).length} missing email</li>
                  <li>✓ {exportLeads.filter(l => !l.scheduledDate).length} unscheduled demos</li>
                </ul>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 px-4 sm:px-6 py-4 flex flex-col-reverse gap-2 bg-white z-20 rounded-b-lg">
              <div className="flex gap-2">
                <button onClick={() => setShowExportDialog(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const content = document.getElementById('export-content');
                    if (content) content.scrollBy({ top: -100, behavior: 'smooth' });
                  }}
                  className="px-3 py-3 rounded-lg bg-blue-500 border-2 border-blue-600 hover:bg-blue-600 active:bg-blue-700 transition flex items-center justify-center">
                  <ChevronUp className="h-6 w-6 text-white font-bold" />
                </button>
                <button
                  onClick={() => {
                    const content = document.getElementById('export-content');
                    if (content) content.scrollBy({ top: 100, behavior: 'smooth' });
                  }}
                  className="px-3 py-3 rounded-lg bg-blue-500 border-2 border-blue-600 hover:bg-blue-600 active:bg-blue-700 transition flex items-center justify-center">
                  <ChevronDown className="h-6 w-6 text-white font-bold" />
                </button>
              </div>
              <button onClick={performExport} disabled={selectedFields.size === 0}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-base font-bold text-white hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <Download className="h-5 w-5 text-white" />
                <span className="text-white font-bold">EXPORT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Lead Modal ── */}
      {showAddLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-900">Add New Lead</h3>
              <button onClick={() => setShowAddLead(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4 min-h-0 flex-1 overflow-y-auto pb-20">
              <div ref={addLeadTopRef} />
              {addLeadError && (
                <div className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-4">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700">{addLeadError}</span>
                </div>
              )}

              {addLeadSuccess && (
                <div className="flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-green-700">Lead added successfully!</span>
                </div>
              )}

              <form onSubmit={handleAddLeadSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={addLeadForm.name}
                      onChange={e => setAddLeadForm({...addLeadForm, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Email <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <input
                      type="email"
                      value={addLeadForm.email}
                      onChange={e => setAddLeadForm({...addLeadForm, email: e.target.value})}
                      placeholder="john@company.com"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={addLeadForm.phone}
                      onChange={e => setAddLeadForm({...addLeadForm, phone: e.target.value})}
                      placeholder="+254 700 000 000"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={addLeadForm.company}
                      onChange={e => setAddLeadForm({...addLeadForm, company: e.target.value})}
                      placeholder="Company Ltd"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Lead Source</label>
                    <select
                      value={addLeadForm.source}
                      onChange={e => setAddLeadForm({...addLeadForm, source: e.target.value as any})}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <option value="field">📣 Field storming / Marketing</option>
                      <option value="email">Email Inquiry</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="referral">Referral</option>
                      <option value="phone">Phone Call</option>
                      <option value="direct">Direct Contact</option>
                    </select>
                    {/* Which drive the lead came off, so a storming round can
                        be reported on as a unit. */}
                    {addLeadForm.source === 'field' && (
                      <input
                        type="text"
                        value={addLeadForm.fieldCampaign}
                        onChange={e => setAddLeadForm({...addLeadForm, fieldCampaign: e.target.value})}
                        placeholder="Which drive / area? e.g. Industrial Area storming"
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Request Type</label>
                    <select
                      value={addLeadForm.requestType}
                      onChange={e => setAddLeadForm({...addLeadForm, requestType: e.target.value as any})}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <option value="demo">Demo</option>
                      <option value="consultation">Consultation</option>
                      <option value="bizanalyst">BizAnalyst</option>
                      <option value="customization">Customization / Add-On / TDL</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Industry</label>
                    <select
                      value={addLeadForm.industry}
                      onChange={e => setAddLeadForm({...addLeadForm, industry: e.target.value})}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <option value="">Select industry...</option>
                      {INDUSTRIES.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Current Software</label>
                    <input
                      type="text"
                      value={addLeadForm.currentSoftware}
                      onChange={e => setAddLeadForm({...addLeadForm, currentSoftware: e.target.value})}
                      placeholder="e.g., QuickBooks, Manual"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Who owns the follow-up, and which period the lead belongs to */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Following up</label>
                    <StaffPicker value={addLeadForm.capturedBy} accent="blue"
                      onPick={name => setAddLeadForm({...addLeadForm, capturedBy: name})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Date captured</label>
                    <input
                      type="date"
                      value={addLeadForm.createdAt}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={e => setAddLeadForm({...addLeadForm, createdAt: e.target.value})}
                      title="The period this lead is domiciled in — defaults to today"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Message / Notes</label>
                  <textarea
                    value={addLeadForm.message}
                    onChange={e => setAddLeadForm({...addLeadForm, message: e.target.value})}
                    placeholder="Add any notes or details about this lead..."
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition">
                  <Plus className="h-4 w-4" />
                  Add Lead
                </button>
                <p className="text-center text-xs text-slate-400">Only a name and phone number are required.</p>
              </form>
            </div>
          </div>
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
