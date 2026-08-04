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
  tier: number;      // escalation tier: higher tiers represent more advanced stages
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'New',            color: '#ef4444', nextStep: 'Make first contact call',   hint: 'Fresh lead, not yet contacted', tier: 1 },
  { id: 'Contacted',      color: '#3b82f6', nextStep: 'Qualify need & budget',     hint: 'Reached out, awaiting response', tier: 2 },
  { id: 'Qualified',      color: '#8b5cf6', nextStep: 'Schedule a product demo',   hint: 'Genuine need & budget confirmed', tier: 3 },
  { id: 'Schedule a Demo', color: '#f59e0b', nextStep: 'Book the demo date & time', hint: 'Book this lead in for a demo', tier: 4 },
  { id: 'Demo Done',      color: '#0ea5e9', nextStep: 'Send a quote',              hint: 'Demo delivered', tier: 5 },
  { id: 'Quote Sent',     color: '#d946ef', nextStep: 'Follow up to close',        hint: 'Client has received a quote', tier: 6 },
  { id: 'Closed Won',     color: '#16a34a', nextStep: 'Begin onboarding',          hint: 'Deal won 🎉', tier: 7 },
  { id: 'Closed Lost',    color: '#64748b', nextStep: '—',                          hint: 'Not proceeding', tier: 8 },
];

export const PIPELINE_ORDER = PIPELINE_STAGES.map(s => s.id);

const byId = (id: string) => PIPELINE_STAGES.find(s => s.id === id);

export const stageColor = (id: string): string => byId(id)?.color ?? '#94a3b8';

export function defaultNextStep(status: string): string {
  return byId(status)?.nextStep ?? 'Follow up';
}

// A very light tint of a stage's colour, for inactive filter-tab backgrounds.
export const stageTint = (id: string): string => `${stageColor(id)}1a`; // ~10% alpha

// Get the tier of a stage (escalation level)
export const stageTier = (id: string): number => byId(id)?.tier ?? 0;

// Check if a transition from one stage to another is valid (escalation only, or lateral moves)
export function isValidTransition(fromStatus: string, toStatus: string): boolean {
  const fromTier = stageTier(fromStatus);
  const toTier = stageTier(toStatus);

  // Allow moving to same tier (status refreshes) or higher tiers (escalation)
  // Prevent moving backward except to Closed Lost which is a final state
  if (toStatus === 'Closed Lost') return true; // Can close lost from anywhere

  return toTier >= fromTier;
}

// Get all valid next stages from the current stage
export function getValidNextStages(currentStatus: string): PipelineStage[] {
  const currentTier = stageTier(currentStatus);
  return PIPELINE_STAGES.filter(s => {
    if (s.id === currentStatus) return true; // Can stay in same stage
    if (s.id === 'Closed Lost') return true; // Can always close lost
    return s.tier > currentTier; // Can move to higher tiers
  });
}
