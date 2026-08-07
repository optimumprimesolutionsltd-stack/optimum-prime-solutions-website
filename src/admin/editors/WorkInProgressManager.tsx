import { useState, useMemo, useEffect } from 'react';
import {
  Briefcase, Plus, X, Search, Trash2, Download, CheckCircle2, Clock,
  PauseCircle, Circle, User, Building2, Phone, Mail, Calendar, AlertCircle,
  GraduationCap, Wrench,
} from 'lucide-react';
import type { SiteData, WipJob, WipJobType, WipStatus, WipTask } from '../../data/siteData';
import { OPTIMUM_STAFF, DEMO_TEAM, DEFAULT_STAFF, staffByName } from '../../data/staff';
import { toWhatsAppNumber } from '../../utils/phone';

// ─────────────────────────────────────────────────────────────────────────────
// Work in Progress — what we owe clients after the sale.
//
// The pipeline ends at "Closed Won", but the work starts there: training,
// implementation, migration, support. This is the register of that work — who
// is doing it, for whom, by when, and how far along it is.
// ─────────────────────────────────────────────────────────────────────────────

interface P {
  data: SiteData;
  onSave: (d: SiteData) => void;
  // A job id handed over from Demo Leads when a won deal starts delivery.
  openJobId?: string | null;
  onOpenConsumed?: () => void;
}

const JOB_TYPES: { value: WipJobType; label: string; icon: string }[] = [
  { value: 'Training',       label: 'Training',       icon: '🎓' },
  { value: 'Implementation', label: 'Implementation', icon: '🛠️' },
  { value: 'Migration',      label: 'Data migration', icon: '📦' },
  { value: 'Customization',  label: 'Customization',  icon: '🧩' },
  { value: 'Support',        label: 'Support',        icon: '🛟' },
  { value: 'Other',          label: 'Other',          icon: '📁' },
];

const STATUSES: { value: WipStatus; color: string; icon: typeof Circle }[] = [
  { value: 'Not Started', color: '#94a3b8', icon: Circle },
  { value: 'In Progress', color: '#f59e0b', icon: Clock },
  { value: 'On Hold',     color: '#ef4444', icon: PauseCircle },
  { value: 'Completed',   color: '#16a34a', icon: CheckCircle2 },
];

const statusMeta = (s: WipStatus) => STATUSES.find(x => x.value === s) || STATUSES[0];
const typeIcon = (t: WipJobType) => JOB_TYPES.find(x => x.value === t)?.icon || '📁';

const todayISO = () => new Date().toISOString().split('T')[0];

// A job is late when its agreed completion date has passed and it isn't done.
const isOverdue = (j: WipJob): boolean =>
  !!j.targetDate && j.status !== 'Completed' && j.targetDate < todayISO();

const emptyJob = (): WipJob => ({
  id: '',
  client: '', company: '', phone: '', email: '',
  jobType: 'Implementation',
  title: '',
  assignedStaff: [DEFAULT_STAFF.name],
  startDate: todayISO(),
  targetDate: '',
  status: 'Not Started',
  progress: 0,
  value: '',
  notes: '',
  tasks: [],
  createdAt: '',
});

const fmtDate = (d?: string) =>
  d ? new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export default function WorkInProgressManager({ data, onSave, openJobId, onOpenConsumed }: P) {
  const jobs = useMemo(() => data.wipJobs || [], [data.wipJobs]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | WipStatus>('All');
  const [filterType, setFilterType] = useState<'All' | WipJobType>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Add / edit form
  const [editing, setEditing] = useState<WipJob | null>(null);
  const [formError, setFormError] = useState('');
  const [newTask, setNewTask] = useState('');

  // A won deal handed over from Demo Leads — open it straight into the editor
  // so the details can be finished while they're fresh.
  useEffect(() => {
    if (!openJobId) return;
    const job = jobs.find(j => j.id === openJobId);
    if (!job) return;
    setFilterStatus('All');
    setFilterType('All');
    setSearch('');
    setEditing({ ...job });
    setExpandedId(job.id);
    onOpenConsumed?.();
  }, [openJobId, jobs]);

  const setF = <K extends keyof WipJob>(field: K, value: WipJob[K]) =>
    setEditing(prev => prev ? { ...prev, [field]: value } : prev);

  const openNew = () => { setEditing({ ...emptyJob() }); setFormError(''); setNewTask(''); };
  const openEdit = (j: WipJob) => { setEditing({ ...j, tasks: j.tasks ? [...j.tasks] : [] }); setFormError(''); setNewTask(''); };

  const toggleStaff = (name: string) => {
    setEditing(prev => {
      if (!prev) return prev;
      const has = prev.assignedStaff.includes(name);
      return {
        ...prev,
        assignedStaff: has
          ? prev.assignedStaff.filter(n => n !== name)
          : [...prev.assignedStaff, name],
      };
    });
  };

  const addTask = () => {
    const label = newTask.trim();
    if (!label || !editing) return;
    setEditing({
      ...editing,
      tasks: [...(editing.tasks || []), { id: `t_${Date.now()}`, label, done: false }],
    });
    setNewTask('');
  };

  const toggleTask = (jobId: string, taskId: string) => {
    onSave({
      ...data,
      wipJobs: jobs.map(j => {
        if (j.id !== jobId) return j;
        const tasks = (j.tasks || []).map(t => t.id === taskId ? { ...t, done: !t.done } : t);
        // Progress follows the checklist when there is one — one number, kept
        // honest, instead of a percentage someone has to remember to update.
        const done = tasks.filter(t => t.done).length;
        const progress = tasks.length ? Math.round((done / tasks.length) * 100) : j.progress;
        const status: WipStatus = progress === 100 ? 'Completed'
          : progress > 0 && j.status === 'Not Started' ? 'In Progress'
          : j.status;
        return {
          ...j, tasks, progress, status,
          ...(status === 'Completed' && !j.completedAt ? { completedAt: new Date().toISOString() } : {}),
          updatedAt: new Date().toISOString(),
        };
      }),
    });
  };

  const saveJob = () => {
    if (!editing) return;
    if (!editing.client.trim() && !editing.company.trim()) {
      setFormError('Add the client or the company name'); return;
    }
    if (!editing.title.trim()) { setFormError('Give the job a title — what is being delivered?'); return; }
    if (editing.assignedStaff.length === 0) { setFormError('Assign at least one person to the work'); return; }
    if (editing.targetDate && editing.startDate && editing.targetDate < editing.startDate) {
      setFormError('The target date is before the start date'); return;
    }
    setFormError('');

    const now = new Date().toISOString();
    const isNew = !editing.id;
    const job: WipJob = {
      ...editing,
      id: editing.id || `wip_${Date.now()}`,
      createdAt: editing.createdAt || now,
      updatedAt: now,
      progress: Math.max(0, Math.min(100, Number(editing.progress) || 0)),
      ...(editing.status === 'Completed' && !editing.completedAt ? { completedAt: now } : {}),
    };
    onSave({
      ...data,
      wipJobs: isNew ? [job, ...jobs] : jobs.map(j => j.id === job.id ? job : j),
    });
    setEditing(null);
    setExpandedId(job.id);
  };

  const setStatus = (id: string, status: WipStatus) => {
    onSave({
      ...data,
      wipJobs: jobs.map(j => {
        if (j.id !== id) return j;
        // Drop the key rather than setting it to undefined — Firebase rejects
        // an undefined value and the whole save would be lost.
        const { completedAt, ...rest } = j;
        return {
          ...rest,
          status,
          progress: status === 'Completed' ? 100 : j.progress,
          ...(status === 'Completed' ? { completedAt: completedAt || new Date().toISOString() } : {}),
          updatedAt: new Date().toISOString(),
        };
      }),
    });
  };

  const setProgress = (id: string, progress: number) => {
    onSave({
      ...data,
      wipJobs: jobs.map(j => j.id === id ? {
        ...j,
        progress,
        status: progress === 100 ? 'Completed' : progress > 0 && j.status === 'Not Started' ? 'In Progress' : j.status,
        ...(progress === 100 ? { completedAt: j.completedAt || new Date().toISOString() } : {}),
        updatedAt: new Date().toISOString(),
      } : j),
    });
  };

  const removeJob = (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!confirm(`Delete "${job?.title || 'this job'}"? This cannot be undone.`)) return;
    onSave({
      ...data,
      wipJobs: jobs.filter(j => j.id !== id),
      // Unlink the lead so "Start work" offers to open a fresh job again.
      // The key is removed, not set to undefined — Firebase would reject that.
      leads: data.leads.map(l => {
        if (l.wipJobId !== id) return l;
        const { wipJobId, ...rest } = l;
        return rest;
      }),
    });
  };

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = jobs
    .filter(j => filterStatus === 'All' || j.status === filterStatus)
    .filter(j => filterType === 'All' || j.jobType === filterType)
    .filter(j => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return j.client.toLowerCase().includes(q)
        || j.company.toLowerCase().includes(q)
        || j.title.toLowerCase().includes(q)
        || j.assignedStaff.join(' ').toLowerCase().includes(q);
    })
    // Live work first, then by the date it is due.
    .sort((a, b) => {
      const rank = (j: WipJob) => j.status === 'Completed' ? 2 : j.status === 'On Hold' ? 1 : 0;
      if (rank(a) !== rank(b)) return rank(a) - rank(b);
      return (a.targetDate || '9999').localeCompare(b.targetDate || '9999');
    });

  const counts = {
    all: jobs.length,
    active: jobs.filter(j => j.status === 'In Progress').length,
    notStarted: jobs.filter(j => j.status === 'Not Started').length,
    onHold: jobs.filter(j => j.status === 'On Hold').length,
    done: jobs.filter(j => j.status === 'Completed').length,
    overdue: jobs.filter(isOverdue).length,
  };

  const exportCsv = () => {
    const headers = ['Client', 'Company', 'Phone', 'Email', 'Job Type', 'Title', 'Assigned', 'Start', 'Target', 'Status', 'Progress %', 'Value', 'Notes'];
    const rows = filtered.map(j => [
      j.client, j.company, j.phone || '', j.email || '', j.jobType, j.title,
      j.assignedStaff.join(' | '), j.startDate || '', j.targetDate || '',
      j.status, String(j.progress), j.value || '', (j.notes || '').replace(/\n/g, ' '),
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `work-in-progress-${todayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Work in Progress</h2>
          <p className="text-sm text-slate-500 mt-0.5">Client work being delivered — training, implementation, migration and support</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={exportCsv} disabled={filtered.length === 0}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-40">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button onClick={openNew}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
            style={{ backgroundColor: '#e53e3e' }}>
            <Plus className="h-4 w-4" /> New Job
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {[
          { label: 'All jobs',    value: counts.all,        color: 'bg-slate-50 text-slate-700' },
          { label: 'Not started', value: counts.notStarted, color: 'bg-slate-100 text-slate-600' },
          { label: 'In progress', value: counts.active,     color: 'bg-amber-50 text-amber-700' },
          { label: 'On hold',     value: counts.onHold,     color: 'bg-red-50 text-red-600' },
          { label: 'Completed',   value: counts.done,       color: 'bg-green-50 text-green-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-[10px] font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {counts.overdue > 0 && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 px-5 py-4">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-sm font-semibold text-red-800">
            {counts.overdue} job{counts.overdue > 1 ? 's are' : ' is'} past the agreed completion date
          </p>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by client, company, job or staff..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {(['All', ...STATUSES.map(s => s.value)] as ('All' | WipStatus)[]).map(s => {
            const isActive = filterStatus === s;
            const color = s === 'All' ? '#1e3a5f' : statusMeta(s as WipStatus).color;
            const count = s === 'All' ? jobs.length : jobs.filter(j => j.status === s).length;
            return (
              <button key={s} onClick={() => setFilterStatus(s)}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5"
                style={isActive
                  ? { backgroundColor: color, color: '#fff', borderColor: color }
                  : { backgroundColor: `${color}1a`, color, borderColor: 'transparent' }}>
                {s}
                <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                  style={isActive
                    ? { backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }
                    : { backgroundColor: '#e2e8f0', color: '#475569' }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">Type:</span>
          {(['All', ...JOB_TYPES.map(t => t.value)] as ('All' | WipJobType)[]).map(t => {
            const isActive = filterType === t;
            const count = t === 'All' ? jobs.length : jobs.filter(j => j.jobType === t).length;
            return (
              <button key={t} onClick={() => setFilterType(t)}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap"
                style={isActive
                  ? { backgroundColor: '#1e3a5f', color: '#fff', borderColor: '#1e3a5f' }
                  : { backgroundColor: '#fff', color: '#475569', borderColor: '#e2e8f0' }}>
                {t === 'All' ? 'All types' : `${typeIcon(t as WipJobType)} ${t}`} <span style={{ opacity: 0.7 }}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Add / edit form ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto pt-16">
          <div className="w-full max-w-2xl h-fit rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-accent" />
                <h3 className="font-bold text-slate-900">{editing.id ? 'Edit job' : 'New job'}</h3>
              </div>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1.5 hover:bg-slate-200 transition">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {formError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />{formError}
                </div>
              )}

              {/* Client */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client</p>
                <div className="grid grid-cols-2 gap-3">
                  <input value={editing.company} onChange={e => setF('company', e.target.value)}
                    placeholder="Company *"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  <input value={editing.client} onChange={e => setF('client', e.target.value)}
                    placeholder="Contact person"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  <input value={editing.phone || ''} onChange={e => setF('phone', e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  <input value={editing.email || ''} onChange={e => setF('email', e.target.value)}
                    placeholder="Email"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                </div>
              </div>

              {/* The work */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">The work</p>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => setF('jobType', t.value)}
                      className="rounded-xl border px-3 py-2 text-xs font-semibold transition"
                      style={editing.jobType === t.value
                        ? { backgroundColor: '#1e3a5f', color: '#fff', borderColor: '#1e3a5f' }
                        : { backgroundColor: '#fff', color: '#475569', borderColor: '#e2e8f0' }}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
                <input value={editing.title} onChange={e => setF('title', e.target.value)}
                  placeholder="What is being delivered? e.g. TallyPrime rollout — 3 branches, 8 users *"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
              </div>

              {/* Who's doing it */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <User className="h-3 w-3 inline mr-1" />Who is doing the work? *
                </p>
                <div className="flex flex-wrap gap-2">
                  {[...DEMO_TEAM, ...OPTIMUM_STAFF.filter(s => !s.demoTeam)].map(s => {
                    const on = editing.assignedStaff.includes(s.name);
                    return (
                      <button key={s.email} type="button" onClick={() => toggleStaff(s.name)}
                        title={`${s.name} · ${s.phone}`}
                        className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition"
                        style={on
                          ? { backgroundColor: '#e53e3e', color: '#fff', borderColor: '#e53e3e' }
                          : { backgroundColor: '#fff', color: '#475569', borderColor: '#e2e8f0' }}>
                        {on ? <CheckCircle2 className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                        {s.name.replace(/^(Mr\.|Ms\.)\s*/, '')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dates, status, value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Start date</label>
                  <input type="date" value={editing.startDate || ''} onChange={e => setF('startDate', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Target completion</label>
                  <input type="date" value={editing.targetDate || ''} onChange={e => setF('targetDate', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
                  <select value={editing.status} onChange={e => setF('status', e.target.value as WipStatus)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contract value (optional)</label>
                  <input value={editing.value || ''} onChange={e => setF('value', e.target.value)}
                    placeholder="e.g. KES 120,000"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery checklist (optional)</p>
                <p className="text-[11px] text-slate-500">Tick items off as you go and the progress bar keeps itself up to date.</p>
                {(editing.tasks || []).map((t, i) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <input value={t.label}
                      onChange={e => setF('tasks', (editing.tasks || []).map((x, xi) => xi === i ? { ...x, label: e.target.value } : x))}
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                    <button type="button"
                      onClick={() => setF('tasks', (editing.tasks || []).filter((_, xi) => xi !== i))}
                      className="rounded-lg p-2 text-red-400 hover:bg-red-50 transition shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <input value={newTask} onChange={e => setNewTask(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTask(); } }}
                    placeholder="e.g. Chart of accounts set up · Stock masters imported · Day-2 training"
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  <button type="button" onClick={addTask}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition shrink-0">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              </div>

              <textarea value={editing.notes || ''} onChange={e => setF('notes', e.target.value)}
                placeholder="Notes — scope, who to call on site, licence details, anything the next person needs"
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />

              <div className="flex gap-3">
                <button onClick={saveJob}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition"
                  style={{ backgroundColor: '#e53e3e' }}>
                  <CheckCircle2 className="h-4 w-4" /> {editing.id ? 'Save changes' : 'Add job'}
                </button>
                <button onClick={() => setEditing(null)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Job list ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
          <Wrench className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            {jobs.length === 0 ? 'No client work logged yet' : 'No jobs match your filters'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {jobs.length === 0
              ? 'Add a job here, or press “Start work” on a Closed Won lead in Demo Leads.'
              : 'Try a different search, status or type.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(j => {
            const meta = statusMeta(j.status);
            const StatusIcon = meta.icon;
            const overdue = isOverdue(j);
            const tasks: WipTask[] = j.tasks || [];
            return (
              <div key={j.id} className={`rounded-2xl border overflow-hidden transition ${
                overdue ? 'border-red-300 bg-red-50/30'
                : expandedId === j.id ? 'border-accent/30 bg-white shadow-md'
                : 'border-slate-200 bg-white'}`}>

                {/* Row */}
                <div className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === j.id ? null : j.id)}>
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                    {typeIcon(j.jobType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900 truncate">{j.company || j.client}</p>
                      <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold text-white"
                        style={{ backgroundColor: meta.color }}>{j.status}</span>
                      {overdue && (
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-semibold text-white">
                          OVERDUE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{j.title}</p>
                    {/* Progress */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden max-w-[220px]">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${j.progress}%`, backgroundColor: meta.color }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{j.progress}%</span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right shrink-0">
                    <p className="text-[10px] text-slate-400">Due</p>
                    <p className={`text-xs font-semibold ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                      {fmtDate(j.targetDate)}
                    </p>
                  </div>
                  <StatusIcon className="h-4 w-4 shrink-0" style={{ color: meta.color }} />
                </div>

                {/* Expanded */}
                {expandedId === j.id && (
                  <div className="border-t border-slate-100 p-5 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="flex items-start gap-2 min-w-0">
                        <Building2 className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-500 font-medium">Company</p>
                          <p className="text-sm text-slate-900 truncate">{j.company || '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 min-w-0">
                        <User className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-500 font-medium">Contact</p>
                          <p className="text-sm text-slate-900 truncate">{j.client || '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 min-w-0">
                        <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-500 font-medium">Phone</p>
                          <p className="text-sm text-slate-900 truncate">{j.phone || '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 min-w-0">
                        <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-500 font-medium">Email</p>
                          <p className="text-sm text-slate-900 break-all">{j.email || '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 min-w-0">
                        <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-500 font-medium">Started</p>
                          <p className="text-sm text-slate-900">{fmtDate(j.startDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 min-w-0">
                        <GraduationCap className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-500 font-medium">Doing the work</p>
                          <p className="text-sm text-slate-900 truncate">
                            {j.assignedStaff.map(n => n.replace(/^(Mr\.|Ms\.)\s*/, '')).join(', ') || '—'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {j.value && (
                      <p className="text-sm text-slate-700"><span className="text-slate-500">Value:</span> <strong>{j.value}</strong></p>
                    )}

                    {/* Checklist */}
                    {tasks.length > 0 && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Checklist — {tasks.filter(t => t.done).length}/{tasks.length} done
                        </p>
                        {tasks.map(t => (
                          <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={t.done} onChange={() => toggleTask(j.id, t.id)}
                              className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent" />
                            <span className={`text-sm ${t.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{t.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {j.notes && (
                      <div>
                        <p className="text-[10px] text-slate-500 font-medium mb-1">Notes</p>
                        <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 leading-relaxed whitespace-pre-wrap">{j.notes}</p>
                      </div>
                    )}

                    {/* Controls */}
                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <label className="text-xs font-semibold text-slate-600">Status:</label>
                        <select value={j.status} onChange={e => setStatus(j.id, e.target.value as WipStatus)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium outline-none focus:border-accent">
                          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
                        </select>
                        <label className="text-xs font-semibold text-slate-600 ml-2">Progress:</label>
                        <input type="range" min={0} max={100} step={5} value={j.progress}
                          onChange={e => setProgress(j.id, Number(e.target.value))}
                          className="w-40 accent-red-600" />
                        <span className="text-xs font-bold text-slate-600 w-10">{j.progress}%</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => openEdit(j)}
                          className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900 transition">
                          Edit job
                        </button>
                        {toWhatsAppNumber(j.phone || '') && (
                          <a href={`https://wa.me/${toWhatsAppNumber(j.phone || '')}`} target="_blank" rel="noopener noreferrer"
                            className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition">
                            WhatsApp
                          </a>
                        )}
                        {j.email && (
                          <a href={`mailto:${j.email}`}
                            className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition">
                            Send Email
                          </a>
                        )}
                        {j.assignedStaff.map(n => {
                          const s = staffByName(n);
                          return s ? (
                            <span key={n} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-medium text-slate-600">
                              {s.name.replace(/^(Mr\.|Ms\.)\s*/, '')} · {s.phone}
                            </span>
                          ) : null;
                        })}
                        <button onClick={() => removeJob(j.id)}
                          className="ml-auto rounded-lg p-1.5 text-red-400 hover:bg-red-50 transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400">
                      Added {new Date(j.createdAt).toLocaleString()}
                      {j.completedAt && ` · Completed ${new Date(j.completedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
