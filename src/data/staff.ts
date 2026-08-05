// ─────────────────────────────────────────────────────────────────────────────
// The Optimum Prime team — one source of truth for who does the work.
// Every admin surface that assigns a person (Book a Demo, Schedule a
// Demo/Consultation, Work in Progress) picks from this list, so a name, phone
// and email can never drift apart between screens.
// ─────────────────────────────────────────────────────────────────────────────
export interface StaffMember {
  name: string;
  phone: string;
  email: string;
  // The people who run demos, consultations, training and implementations.
  // They are offered first and pre-filled on every booking form.
  demoTeam?: boolean;
}

export const OPTIMUM_STAFF: StaffMember[] = [
  { name: 'Mr. Kenneth Wamiatu',   phone: '+254 736 711057', email: 'ken@optimumprimesolutions.co.ke',   demoTeam: true },
  { name: 'Mr. John Mark Kiruki',  phone: '+254 701 146343', email: 'john@optimumprimesolutions.co.ke',  demoTeam: true },
  { name: 'Mr. Frederick Chege',   phone: '+254 758449475',  email: 'chege@optimumprimesolutions.co.ke' },
  { name: 'Ms. Joan Wairimu',      phone: '+254 796 808316', email: 'joan@optimumprimesolutions.co.ke' },
  { name: 'Ms. Jane Njoki',        phone: '+254 726 006085', email: 'jane@optimumprimesolutions.co.ke' },
];

// Kenneth and John — the two who deliver demos, consultations and client work.
export const DEMO_TEAM = OPTIMUM_STAFF.filter(s => s.demoTeam);

// The name a fresh booking form starts on. One click switches to the other.
export const DEFAULT_STAFF = DEMO_TEAM[0];

// The shared office calendar / mailbox that is copied on every online booking.
export const COMPANY_EMAIL = 'info@optimumprimesolutions.co.ke';

export const staffByName = (name?: string): StaffMember | undefined =>
  name ? OPTIMUM_STAFF.find(s => s.name === name) : undefined;

export const staffEmail = (name?: string): string => staffByName(name)?.email || '';
export const staffPhone = (name?: string): string => staffByName(name)?.phone || '';
