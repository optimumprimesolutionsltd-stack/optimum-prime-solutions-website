// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for the sales pipeline.
// Every surface — Demo Leads status dropdown, filter tabs, the workshop
// "Add to Follow-up" picker, and the CRM report — reads its stages from here,
// so the whole pipeline stays interlinked and consistent.
// ─────────────────────────────────────────────────────────────────────────────
export interface PipelineStage {
  id: string;        // the value stored on lead.status
  color: string;     // hex used for badges, tabs and the report
  nextStep: string;  // auto-derived "next action" shown in the CRM report
  hint: string;      // short description, used in the workshop stage picker
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'New',            color: '#ef4444', nextStep: 'Make first contact call',   hint: 'Fresh lead, not yet contacted' },
  { id: 'Contacted',      color: '#3b82f6', nextStep: 'Qualify need & budget',     hint: 'Reached out, awaiting response' },
  { id: 'Qualified',      color: '#8b5cf6', nextStep: 'Schedule a product demo',   hint: 'Genuine need & budget confirmed' },
  { id: 'Schedule a Demo', color: '#f59e0b', nextStep: 'Book the demo date & time', hint: 'Book this lead in for a demo' },
  { id: 'Demo Done',      color: '#0ea5e9', nextStep: 'Send a quote',              hint: 'Demo delivered' },
  { id: 'Quote Sent',     color: '#d946ef', nextStep: 'Follow up to close',        hint: 'Client has received a quote' },
  { id: 'Closed Won',     color: '#16a34a', nextStep: 'Begin onboarding',          hint: 'Deal won 🎉' },
  { id: 'Closed Lost',    color: '#64748b', nextStep: '—',                          hint: 'Not proceeding' },
];

export const PIPELINE_ORDER = PIPELINE_STAGES.map(s => s.id);

const byId = (id: string) => PIPELINE_STAGES.find(s => s.id === id);

export const stageColor = (id: string): string => byId(id)?.color ?? '#94a3b8';

export function defaultNextStep(status: string): string {
  return byId(status)?.nextStep ?? 'Follow up';
}

// A very light tint of a stage's colour, for inactive filter-tab backgrounds.
export const stageTint = (id: string): string => `${stageColor(id)}1a`; // ~10% alpha
