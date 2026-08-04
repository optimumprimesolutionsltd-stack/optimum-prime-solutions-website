import type { TabId } from './DashboardHome';

export const ADMIN_EMAILS = ['optimumprimesolutionsltd@gmail.com'];

export const LIMITED_ALLOWED_TABS: TabId[] = [
  'dashboard',
  'leads',
  // 'workshop', // Uncomment to allow limited users to access workshops
  // 'webinar',  // Uncomment to allow limited users to access webinars
];

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const canAccessTab = (tab: TabId, isFullAdmin: boolean): boolean => {
  if (isFullAdmin) return true;
  return LIMITED_ALLOWED_TABS.includes(tab);
};
