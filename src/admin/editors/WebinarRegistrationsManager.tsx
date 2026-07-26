import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, Trash2, Mail, Phone, Building2, Calendar, Download, Users as UsersIcon,
  CheckCircle2, Circle, UserPlus, Undo2, Plus, Pencil, X, Star,
} from 'lucide-react';
import { fbSubscribe, fbSet } from '../../firebase/config';
import type { SiteData, Lead } from '../../data/siteData';
import { PIPELINE_STAGES } from '../crm/pipeline';
import {
  DEFAULT_WEBINAR, LEGACY_WEBINAR_ID, parseWebinars, pickActiveWebinar,
  regEventId, isTrainingWebinar, type WebinarEvent, type WebinarAudience,
} from '../../data/webinarEvent';

interface Registrant {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  message?: string;
  createdAt: string;
  status?: string;
  attended?: boolean;
  attendedAt?: string;
  webinarLeadId?: string; // set once this attendee is pushed into the follow-up pipeline
  eventId?: string;        // which webinar they registered for (legacy rows have none)
  staff?: boolean;         // an internal team member, not a prospect
}

interface EventForm {
  id: string; title: string; date: string; time: string; venue: string;
  audience: WebinarAudience;
  active: boolean; calendarStart: string; calendarEnd: string;
}

interface Props { data: SiteData; onSave: (d: SiteData) => void }

export default function WebinarRegistrationsManager({ data, onSave }: Props) {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'attended' | 'pending' | 'staff'>('all');

  // ── Webinar events ────────────────────────────────────────────────────────
  const [events, setEvents] = useState<WebinarEvent[]>([DEFAULT_WEBINAR]);
  const [selectedEventId, setSelectedEventId] = useState<string>(LEGACY_WEBINAR_ID);
  const [editing, setEditing] = useState<EventForm | null>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    const unsub = fbSubscribe('webinars', (raw: Record<string, any> | null) => {
      const list = parseWebinars(raw);
      if (list.length === 0) {
        // First run — seed the July webinar so existing RSVPs have a home.
        setEvents([DEFAULT_WEBINAR]);
        if (!seededRef.current) {
          seededRef.current = true;
          const { id, ...rest } = DEFAULT_WEBINAR;
          fbSet(`webinars/${id}`, rest);
        }
      } else {
        setEvents(list);
      }
    });
    return unsub;
  }, []);

  // Keep the selected event valid; default to the active one.
  useEffect(() => {
    if (!events.some(e => e.id === selectedEventId)) {
      setSelectedEventId(pickActiveWebinar(events).id);
    }
  }, [events, selectedEventId]);

  useEffect(() => {
    const unsubscribe = fbSubscribe('webinar_registrants', (raw: Record<string, any> | null) => {
      const list = raw
        ? Object.entries(raw).map(([id, v]) => ({ id, ...(v as object) }) as Registrant)
        : [];
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRegistrants(list);
      setLoaded(true);
    });
    return unsubscribe;
  }, []);

  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  // The webinar's actual calendar day (parsed from the event's calendarStart
  // ISO). Used so every attendee reflects on the webinar day regardless of
  // when they signed up. null if the event has no calendar date set yet.
  const eventDayISO = useMemo(() => {
    const m = selectedEvent?.calendarStart?.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
    return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z` : null;
  }, [selectedEvent]);

  // Registrants belonging to the selected webinar only.
  const eventRegistrants = useMemo(
    () => registrants.filter(r => regEventId(r) === selectedEventId),
    [registrants, selectedEventId],
  );

  // Headcount view: totals include everyone (staff shown greyed); staff are
  // still kept out of lead/pipeline metrics and exports elsewhere.
  const staffList = useMemo(() => eventRegistrants.filter(r => r.staff), [eventRegistrants]);
  const attendedCount = useMemo(() => eventRegistrants.filter(r => r.attended).length, [eventRegistrants]);
  // Attendance split so internal staff are never mixed into the prospect
  // numbers. Head count = everyone actually in the room (attended prospects
  // + staff present) = attendedCount.
  const prospectsAttended = useMemo(() => eventRegistrants.filter(r => r.attended && !r.staff).length, [eventRegistrants]);
  const prospectsNoShow   = useMemo(() => eventRegistrants.filter(r => !r.attended && !r.staff).length, [eventRegistrants]);
  const staffPresent      = useMemo(() => eventRegistrants.filter(r => r.attended && r.staff).length, [eventRegistrants]);

  const filtered = useMemo(() => {
    let list = filter === 'staff' ? staffList : eventRegistrants;
    if (filter === 'attended') list = list.filter(r => r.attended);
    if (filter === 'pending') list = list.filter(r => !r.attended);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(r =>
      r.name.toLowerCase().includes(q)
      || r.email.toLowerCase().includes(q)
      || (r.company || '').toLowerCase().includes(q)
      || r.phone.includes(q)
    );
  }, [eventRegistrants, staffList, search, filter]);

  // Staff are internal team members, never leads. If anyone is flagged staff
  // but still has a lead in the pipeline — e.g. they were flagged before this
  // rule existed, or pushed to follow-up first — withdraw that lead so staff
  // never appear in Demo Leads. Runs whenever registrants/leads change and is a
  // no-op once clean, so it also covers any future edge cases automatically.
  useEffect(() => {
    if (!loaded) return;
    const staffIds = new Set(registrants.filter(r => r.staff).map(r => r.id));
    const strays = data.leads.filter(l => l.webinarRegId && staffIds.has(l.webinarRegId));
    if (strays.length === 0) return;
    const strayIds = new Set(strays.map(l => l.id));
    onSave({ ...data, leads: data.leads.filter(l => !strayIds.has(l.id)) });
    strays.forEach(l => l.webinarRegId && fbSet(`webinar_registrants/${l.webinarRegId}/webinarLeadId`, null));
  }, [loaded, registrants, data, onSave]);

  const setStaff = (r: Registrant, staff: boolean) => {
    fbSet(`webinar_registrants/${r.id}/staff`, staff);
    // Staff are internal team members, not prospects. If this person was
    // already pushed into the follow-up pipeline, withdraw their lead so
    // Demo Leads and Webinar RSVPs stay consistent.
    if (staff) {
      const linked = data.leads.find(l => l.webinarRegId === r.id);
      if (linked) {
        onSave({ ...data, leads: data.leads.filter(l => l.webinarRegId !== r.id) });
        fbSet(`webinar_registrants/${r.id}/webinarLeadId`, null);
      }
    }
  };

  const toggleAttendance = (r: Registrant) => {
    const attended = !r.attended;
    fbSet(`webinar_registrants/${r.id}/attended`, attended);
    fbSet(`webinar_registrants/${r.id}/attendedAt`, attended ? new Date().toISOString() : null);
    // Keep the linked lead's attendance flag live instead of the stale
    // snapshot captured when they were first added to the pipeline.
    const linked = data.leads.find(l => l.webinarRegId === r.id);
    if (linked && linked.attendedWebinar !== attended) {
      onSave({
        ...data,
        leads: data.leads.map(l => l.webinarRegId === r.id ? { ...l, attendedWebinar: attended } : l),
      });
    }
  };

  const removeRegistrant = (id: string) => {
    if (confirm('Remove this registration permanently?')) {
      fbSet(`webinar_registrants/${id}`, null);
    }
  };

  // ── Event editor ───────────────────────────────────────────────────────────
  const openNewEvent = () => setEditing({
    id: `web_${Date.now()}`, title: 'TallyPrime Online Webinar',
    date: '', time: '10:00 AM (EAT)', venue: 'Online — Google Meet link sent on registration',
    audience: 'prospects', active: true, calendarStart: '', calendarEnd: '',
  });
  const openEditEvent = () => {
    if (!selectedEvent) return;
    setEditing({
      id: selectedEvent.id, title: selectedEvent.title, date: selectedEvent.date,
      time: selectedEvent.time, venue: selectedEvent.venue,
      audience: selectedEvent.audience || 'prospects', active: !!selectedEvent.active,
      calendarStart: selectedEvent.calendarStart || '', calendarEnd: selectedEvent.calendarEnd || '',
    });
  };
  const setE = (f: keyof EventForm, v: string | boolean) =>
    setEditing(prev => prev ? { ...prev, [f]: v } : prev);

  const saveEvent = () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.date.trim() || !editing.venue.trim()) {
      alert('Please fill in the title, date and join details.');
      return;
    }
    const { id, active, calendarStart, calendarEnd, ...rest } = editing;
    const existing = events.find(e => e.id === id);
    const record: Omit<WebinarEvent, 'id'> = {
      ...rest,
      active,
      createdAt: existing?.createdAt || new Date().toISOString(),
      ...(calendarStart.trim() ? { calendarStart: calendarStart.trim() } : {}),
      ...(calendarEnd.trim() ? { calendarEnd: calendarEnd.trim() } : {}),
    };
    // Only one webinar can be active at a time.
    if (active) {
      events.filter(e => e.id !== id && e.active).forEach(e => fbSet(`webinars/${e.id}/active`, false));
    }
    fbSet(`webinars/${id}`, record);
    setSelectedEventId(id);
    setEditing(null);
  };

  const deleteEvent = () => {
    if (!selectedEvent) return;
    if (eventRegistrants.length > 0) {
      alert(`This webinar has ${eventRegistrants.length} registration(s). Remove or reassign them before deleting the webinar.`);
      return;
    }
    if (events.length <= 1) { alert('You need at least one webinar.'); return; }
    if (!confirm(`Delete the webinar "${selectedEvent.title} — ${selectedEvent.date}"? It has no registrations.`)) return;
    fbSet(`webinars/${selectedEvent.id}`, null);
    setSelectedEventId(pickActiveWebinar(events.filter(e => e.id !== selectedEvent.id)).id);
  };

  const makeActive = () => {
    if (!selectedEvent || selectedEvent.active) return;
    events.filter(e => e.active).forEach(e => fbSet(`webinars/${e.id}/active`, false));
    fbSet(`webinars/${selectedEvent.id}/active`, true);
  };

  // ── Pipeline linking ───────────────────────────────────────────────────────
  const pipelineRegIds = useMemo(
    () => new Set(data.leads.map(l => l.webinarRegId).filter(Boolean) as string[]),
    [data.leads],
  );
  const isInPipeline = (r: Registrant) => pipelineRegIds.has(r.id);

  const addToPipeline = (r: Registrant, stage: string) => {
    if (isInPipeline(r) || !stage) return;
    const eventTitle = selectedEvent?.title || 'the webinar';
    // Training webinars are for existing clients, so attendees are NOT cold
    // prospects — we never bulk-convert them. But an existing client who raises
    // a need during or after training IS a real opportunity, so we still let the
    // rep log it, capturing exactly what they asked for.
    const training = isTrainingWebinar(selectedEvent);
    let need = '';
    if (training) {
      need = (window.prompt(
        `${r.name} is an existing client (training webinar).\n\n`
        + 'What did they request? e.g. buying an add-on, paying for implementation, '
        + 'a new module, or more training. Leave blank to just log a follow-up.',
      ) || '').trim();
    }
    const leadId = `weblead_${r.id}`;
    const newLead: Lead = {
      id: leadId,
      name: r.name,
      company: r.company || '',
      phone: r.phone,
      email: r.email || '',
      businessType: '',
      demoDate: '',
      currentSoftware: '',
      message: training
        ? `Existing client — follow-up from training "${eventTitle}"${need ? `: ${need}` : ''}.`
        : (r.message || `Attended ${eventTitle}.`),
      ...(training && need ? { demoNotes: need } : {}),
      // Date the lead to the webinar DAY, so every attendee reflects on the
      // webinar day in Demo Leads regardless of when they registered. Falls
      // back to their registration date, then now.
      createdAt: eventDayISO || r.createdAt || new Date().toISOString(),
      status: stage,
      source: 'webinar',
      attendedWebinar: !!r.attended,
      webinarRegId: r.id,
      // Record which webinar this lead came from so Demo Leads and the CRM
      // report can tell one webinar apart from the next.
      webinarEventId: regEventId(r),
      webinarTitle: selectedEvent?.title || '',
    };
    onSave({ ...data, leads: [newLead, ...data.leads] });
    fbSet(`webinar_registrants/${r.id}/webinarLeadId`, leadId);
  };

  const removeFromPipeline = (r: Registrant) => {
    const linked = data.leads.find(l => l.webinarRegId === r.id);
    const stageNote = linked ? ` (currently at "${linked.status}")` : '';
    if (!confirm(`Remove ${r.name} from the follow-up pipeline${stageNote}? This deletes their lead from Demo Leads. You can add them again later.`)) return;
    onSave({ ...data, leads: data.leads.filter(l => l.webinarRegId !== r.id) });
    fbSet(`webinar_registrants/${r.id}/webinarLeadId`, null);
  };

  // Re-date every existing lead for this webinar to the webinar DAY, so early
  // sign-ups reflect on the webinar day in Demo Leads alongside everyone else.
  const reflectOnWebinarDay = () => {
    if (!eventDayISO) {
      alert('Set this webinar’s calendar date first (Edit details → Calendar start), then try again.');
      return;
    }
    const regIds = new Set(eventRegistrants.map(r => r.id));
    const affected = data.leads.filter(l => l.webinarRegId && regIds.has(l.webinarRegId) && l.createdAt !== eventDayISO);
    if (affected.length === 0) { alert('All leads for this webinar already reflect the webinar day.'); return; }
    if (!confirm(`Set ${affected.length} lead(s) to the webinar day (${selectedEvent?.date})? They’ll all show together on that date in Demo Leads.`)) return;
    const ids = new Set(affected.map(l => l.id));
    onSave({ ...data, leads: data.leads.map(l => ids.has(l.id) ? { ...l, createdAt: eventDayISO } : l) });
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Type', 'Registered At', 'Attended', 'Checked In At'];
    const rows = eventRegistrants.map(r => [r.name, r.email, r.phone, r.company || '', r.staff ? 'Staff' : 'Prospect', r.createdAt, r.attended ? 'Yes' : 'No', r.attendedAt || '']);
    const csv = [headers, ...rows].map(row => row.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const safe = (selectedEvent?.date || 'webinar').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    const a = document.createElement('a'); a.href = url; a.download = `webinar-${safe}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const cardDate = selectedEvent ? `${selectedEvent.date}${selectedEvent.time ? ` · ${selectedEvent.time}` : ''}` : '';

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Webinar RSVPs</h2>
          <p className="text-sm text-navy-500 mt-0.5">Registrations per webinar — pick a webinar below</p>
        </div>
        <button onClick={exportCSV} disabled={eventRegistrants.length === 0}
          className="flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 transition disabled:opacity-40">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* ── Webinar selector ── */}
      <div className="rounded-2xl border border-navy-200 bg-white p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs font-bold text-navy-500 uppercase tracking-wider">Webinar</label>
          <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)}
            className="flex-1 min-w-[220px] rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-medium text-navy-800 outline-none focus:border-accent">
            {events.map(e => (
              <option key={e.id} value={e.id}>
                {e.title} — {e.date}{e.active ? '  (active)' : ''}
              </option>
            ))}
          </select>
          <button onClick={openEditEvent}
            className="flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition">
            <Pencil className="h-3.5 w-3.5" /> Edit details
          </button>
          <button onClick={openNewEvent}
            className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-accent/25 hover:bg-accent/90 hover:shadow-lg transition">
            <Plus className="h-4 w-4" /> New Webinar
          </button>
        </div>
        {selectedEvent && (
          <div className="flex items-center gap-3 flex-wrap text-xs text-navy-500">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{cardDate}</span>
            <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{selectedEvent.venue}</span>
            {/* Audience is settable right here on the main view — no need to
                open "Edit details". Writes straight to Firebase. */}
            <label className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${isTrainingWebinar(selectedEvent) ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
              <span className="opacity-70">For:</span>
              <select
                value={selectedEvent.audience || 'prospects'}
                onChange={e => fbSet(`webinars/${selectedEvent.id}/audience`, e.target.value)}
                title="Who is this webinar for?"
                className="bg-transparent font-semibold outline-none cursor-pointer">
                <option value="prospects">🎯 New prospects</option>
                <option value="clients">🎓 Existing clients — training</option>
              </select>
            </label>
            {selectedEvent.active ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 font-semibold text-green-700">
                <Star className="h-3 w-3" /> Live — open for RSVPs
              </span>
            ) : (
              <button onClick={makeActive}
                className="inline-flex items-center gap-1 rounded-full bg-navy-100 px-2 py-0.5 font-semibold text-navy-600 hover:bg-navy-200 transition">
                <Star className="h-3 w-3" /> Make this the live webinar
              </button>
            )}
            {/* Only prospect webinars produce leads, so the "reflect on the day"
                tool is meaningless for training webinars. */}
            {!isTrainingWebinar(selectedEvent) && (
              <button onClick={reflectOnWebinarDay}
                title="Set every lead from this webinar to the webinar day, so early sign-ups group with everyone else on that date in Demo Leads"
                className="inline-flex items-center gap-1 rounded-full border border-navy-200 bg-white px-2.5 py-0.5 font-semibold text-navy-600 hover:bg-navy-50 transition">
                <Calendar className="h-3 w-3" /> Reflect all on webinar day
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Event editor ── */}
      {editing && (
        <div className="rounded-2xl border border-accent/30 bg-white shadow-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900">
              {events.some(e => e.id === editing.id) ? 'Edit webinar details' : 'New webinar'}
            </h3>
            <button onClick={() => setEditing(null)} className="rounded-lg p-1.5 hover:bg-navy-100 transition">
              <X className="h-4 w-4 text-navy-500" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-navy-600 mb-1">Title *</label>
              <input value={editing.title} onChange={e => setE('title', e.target.value)}
                className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-1">Date * (as shown to visitors)</label>
              <input value={editing.date} onChange={e => setE('date', e.target.value)}
                placeholder="e.g. Friday, 30th October 2026"
                className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-1">Time</label>
              <input value={editing.time} onChange={e => setE('time', e.target.value)}
                placeholder="e.g. 7:00 AM (EAT)"
                className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-navy-600 mb-1">Join details / link *</label>
              <input value={editing.venue} onChange={e => setE('venue', e.target.value)}
                placeholder="e.g. Online via Google Meet — https://meet.google.com/xxx-xxxx-xxx"
                className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-navy-600 mb-1">Who is this webinar for?</label>
              <div className="flex rounded-xl overflow-hidden border border-navy-200">
                <button type="button" onClick={() => setE('audience', 'prospects')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition ${editing.audience === 'prospects' ? 'bg-accent text-white' : 'bg-white text-navy-600 hover:bg-navy-50'}`}>
                  🎯 New prospects
                </button>
                <button type="button" onClick={() => setE('audience', 'clients')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition border-l border-navy-200 ${editing.audience === 'clients' ? 'bg-navy-700 text-white' : 'bg-white text-navy-600 hover:bg-navy-50'}`}>
                  🎓 Existing clients — training
                </button>
              </div>
              <p className="mt-1 text-[11px] text-navy-400">
                {editing.audience === 'clients'
                  ? 'Training for existing clients — attendees aren’t treated as new leads. If a client requests something afterwards (add-on, implementation, training…), you can still log that follow-up per person.'
                  : 'Lead-generation webinar — attendees can be converted into Demo Leads, just like a workshop.'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-1">Calendar start (optional)</label>
              <input value={editing.calendarStart} onChange={e => setE('calendarStart', e.target.value)}
                placeholder="20261030T040000Z"
                className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-1">Calendar end (optional)</label>
              <input value={editing.calendarEnd} onChange={e => setE('calendarEnd', e.target.value)}
                placeholder="20261030T070000Z"
                className="w-full rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-navy-700 cursor-pointer">
            <input type="checkbox" checked={editing.active} onChange={e => setE('active', e.target.checked)}
              className="h-4 w-4 rounded border-navy-300 text-accent focus:ring-accent" />
            Make this the live webinar shown on the public RSVP page
          </label>
          <div className="flex items-center gap-2">
            <button onClick={saveEvent}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-accent/90 transition">
              Save webinar
            </button>
            <button onClick={() => setEditing(null)}
              className="rounded-xl border border-navy-200 px-4 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50 transition">
              Cancel
            </button>
            {events.some(e => e.id === editing.id) && (
              <button onClick={deleteEvent}
                className="ml-auto rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition">
                Delete webinar
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-green-50 p-3 text-center">
          <p className="text-xl font-bold text-green-700">{prospectsAttended}</p>
          <p className="text-[10px] font-medium text-green-700">Attended (Prospects)</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 text-center">
          <p className="text-xl font-bold text-amber-700">{prospectsNoShow}</p>
          <p className="text-[10px] font-medium text-amber-700">Not Attended</p>
        </div>
        <div className="rounded-xl bg-slate-100 p-3 text-center">
          <p className="text-xl font-bold text-slate-600">{staffPresent}</p>
          <p className="text-[10px] font-medium text-slate-600">Staff Present</p>
        </div>
        <div className="rounded-xl bg-navy-50 p-3 text-center">
          <p className="text-xl font-bold text-navy-700">{attendedCount}</p>
          <p className="text-[10px] font-medium text-navy-700">Total Head Count</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {([['all', 'All'], ['attended', 'Attended'], ['pending', 'Not Arrived'], ['staff', 'Staff']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === key ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, company..."
          className="w-full rounded-lg border border-navy-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent" />
      </div>

      {!loaded ? (
        <div className="rounded-2xl border border-navy-200 bg-white py-16 text-center">
          <p className="text-sm font-medium text-navy-500">Loading registrations…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-navy-200 bg-white py-16 text-center">
          <UsersIcon className="mx-auto h-10 w-10 text-navy-300" />
          <p className="mt-3 text-sm font-medium text-navy-500">
            {eventRegistrants.length === 0 ? 'No registrations for this webinar yet' : 'No registrations match your search'}
          </p>
          <p className="mt-1 text-xs text-navy-400">
            {eventRegistrants.length === 0
              ? 'Make this webinar live and share the invite link — signups will appear here.'
              : 'Try a different search term.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className={`rounded-2xl border p-4 space-y-2 ${r.staff ? 'border-slate-300 bg-slate-100' : r.attended ? 'border-green-300 bg-green-50/40' : 'border-navy-200 bg-white'}`}>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-600 to-navy-900 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {r.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-navy-900 truncate">
                    {r.name}
                    {r.staff && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600 align-middle">
                        Staff
                      </span>
                    )}
                    {r.attended && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 align-middle">
                        <CheckCircle2 className="h-3 w-3" /> Checked in
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-navy-500 truncate">{r.phone} · {r.company || 'No company'}</p>
                </div>
                <span className="text-[10px] text-navy-400 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
                <select
                  value={r.staff ? 'staff' : 'prospect'}
                  onChange={e => setStaff(r, e.target.value === 'staff')}
                  title="Is this attendee a prospect or your own staff? Staff are excluded from lead stats and exports."
                  className={`rounded-lg border px-2 py-1.5 text-xs font-semibold outline-none cursor-pointer shrink-0 ${
                    r.staff ? 'border-slate-400 bg-slate-200 text-slate-700' : 'border-navy-200 bg-white text-navy-700 focus:border-accent'
                  }`}>
                  <option value="prospect">Prospect</option>
                  <option value="staff">Staff</option>
                </select>
                <button onClick={() => removeRegistrant(r.id)}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 transition shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {/* Staff rows stay fully interactive — you still mark their
                  attendance for the head count. Only the pipeline action
                  below is hidden for staff (they are not prospects). */}
              <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-14 text-xs text-navy-600">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Mail className="h-3.5 w-3.5 text-navy-400 shrink-0" /><span className="truncate">{r.email || '—'}</span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Building2 className="h-3.5 w-3.5 text-navy-400 shrink-0" /><span className="truncate">{r.company || '—'}</span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Calendar className="h-3.5 w-3.5 text-navy-400 shrink-0" /><span className="truncate">{cardDate}</span>
                </div>
              </div>
              <div className="pl-14 flex items-center gap-2 pt-1 flex-wrap">
                <button onClick={() => toggleAttendance(r)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    r.attended
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
                  }`}>
                  {r.attended ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                  {r.attended ? 'Attended' : 'Mark Attended'}
                </button>
                {r.email && (
                  <a href={`mailto:${r.email}`}
                    className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition">
                    Send Email
                  </a>
                )}
                <a href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition">
                  <Phone className="h-3 w-3 inline mr-1" />WhatsApp
                </a>
                {r.staff ? (
                  <span className="text-xs text-slate-400 italic">Internal — not a lead</span>
                ) : isInPipeline(r) ? (
                  <span className="rounded-lg bg-navy-100 pl-3 pr-1.5 py-1 text-xs font-semibold text-navy-500 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    In pipeline: {data.leads.find(l => l.webinarRegId === r.id)?.status || '—'}
                    <button onClick={() => removeFromPipeline(r)} title="Remove from pipeline (added by mistake)"
                      className="rounded p-1 text-red-400 hover:bg-red-100 hover:text-red-600 transition">
                      <Undo2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ) : isTrainingWebinar(selectedEvent) ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 pl-2.5 pr-1 py-1 text-xs font-semibold text-purple-700">
                    <UserPlus className="h-3.5 w-3.5" />
                    <select
                      defaultValue=""
                      onChange={e => { if (e.target.value) addToPipeline(r, e.target.value); }}
                      title="Existing client — if they requested something (add-on, implementation, training…), log it as a follow-up opportunity"
                      className="bg-transparent text-purple-700 font-semibold text-xs outline-none cursor-pointer pr-1 py-0.5">
                      <option value="" disabled>Requested something? Log follow-up →</option>
                      {PIPELINE_STAGES.map(s => (
                        <option key={s.id} value={s.id} className="text-navy-900">{s.id} — {s.hint}</option>
                      ))}
                    </select>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-accent/10 pl-2.5 pr-1 py-1 text-xs font-semibold text-accent">
                    <UserPlus className="h-3.5 w-3.5" />
                    <select
                      defaultValue=""
                      onChange={e => { if (e.target.value) addToPipeline(r, e.target.value); }}
                      title="Add to the follow-up pipeline at the stage this lead is really at"
                      className="bg-transparent text-accent font-semibold text-xs outline-none cursor-pointer pr-1 py-0.5">
                      <option value="" disabled>Add to follow-up as…</option>
                      {PIPELINE_STAGES.map(s => (
                        <option key={s.id} value={s.id} className="text-navy-900">{s.id} — {s.hint}</option>
                      ))}
                    </select>
                  </span>
                )}
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
