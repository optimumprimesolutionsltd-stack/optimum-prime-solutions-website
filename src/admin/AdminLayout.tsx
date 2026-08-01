import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Building2, Briefcase, ShoppingCart, Globe,
  HelpCircle, Users, FileText, Phone, MessageCircle, CalendarDays, Video,
  LogOut, Menu, X, ExternalLink, RotateCcw, Mail, Lock
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { defaultData, type SiteData } from '../data/siteData';
import { fbSubscribe } from '../firebase/config';
import { submitAccessRequest } from '../firebase/accessRequests';
import DashboardHome, { type TabId } from './DashboardHome';
import CompanyEditor from './editors/CompanyEditor';
import ServicesEditor from './editors/ServicesEditor';
import ProductsEditor from './editors/ProductsEditor';
import IndustriesEditor from './editors/IndustriesEditor';
import FaqEditor from './editors/FaqEditor';
import LeadsManager from './editors/LeadsManager';
import BlogEditor from './editors/BlogEditor';
import ContactEditor from './editors/ContactEditor';
import TestimonialsEditor from './editors/TestimonialsEditor';
import WhatsAppManager from './editors/WhatsAppManager';
import WorkshopRegistrationsManager from './editors/WorkshopRegistrationsManager';
import WebinarRegistrationsManager from './editors/WebinarRegistrationsManager';
import SubscribersManager from './editors/SubscribersManager';
import AccessRequestsManager from './editors/AccessRequestsManager';
// import ContactsDirectory from './editors/ContactsDirectory';

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Demo Leads', icon: Users },
  { id: 'workshop', label: 'Workshop RSVPs', icon: CalendarDays },
  { id: 'webinar', label: 'Webinar RSVPs', icon: Video },
  // Restricted tabs require email approval
  { id: 'company', label: 'Company Info', icon: Building2 },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'products', label: 'Products & Pricing', icon: ShoppingCart },
  { id: 'industries', label: 'Industries', icon: Globe },
  { id: 'faqs', label: 'FAQ & Chatbot', icon: HelpCircle },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'blogs', label: 'Blog Posts', icon: FileText },
  { id: 'subscribers', label: 'Subscribers', icon: Mail },
  { id: 'contact', label: 'Contact Info', icon: Phone },
  { id: 'testimonials', label: 'Reviews & Testimonials', icon: Users },
  // Admin-only tabs
  { id: 'access-requests', label: 'Access Requests', icon: Lock },
  // Book a Demo is now embedded inside Demo Leads tab
];

interface Props { onLogout: () => void }

export default function AdminLayout({ onLogout }: Props) {
  const { data, update } = useSite();
  const [tab, setTab] = useState<TabId>('dashboard');
  // A lead id handed from Webinar RSVPs when the user wants to book a demo for
  // an attendee — the Demo Leads tab opens that lead's booking pop-up.
  const [scheduleLeadId, setScheduleLeadId] = useState<string | null>(null);
  const [sidebar, setSidebar] = useState(false);
  const [toast, setToast] = useState('');
  const [unreadWa, setUnreadWa] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetStep, setResetStep] = useState<'confirm' | 'email' | 'verify'>('confirm');
  const [resetVerifyCode, setResetVerifyCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  // Access control: only these tabs are accessible by default
  // Admin tabs (access-requests, dashboard) are always accessible
  const accessibleTabs = new Set(['dashboard', 'leads', 'workshop', 'webinar', 'access-requests']);
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  const [requestedTab, setRequestedTab] = useState<string | null>(null);
  const [requestEmail, setRequestEmail] = useState('');
  const [accessApprovals, setAccessApprovals] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = fbSubscribe('whatsapp_conversations', (raw: Record<string, any> | null) => {
      const count = raw ? Object.values(raw).filter((n: any) => n?.meta?.unread).length : 0;
      setUnreadWa(count);
    });
    return unsubscribe;
  }, []);

  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };
  
  const handleSave = (d: SiteData, msg: string) => { update(d); notify(msg); };
  
  const handleResetOpen = () => {
    setShowResetDialog(true);
    setResetStep('confirm');
    setResetVerifyCode('');
    setGeneratedCode('');
  };

  const handleResetConfirm = () => {
    // Generate a 6-digit verification code
    const code = Math.random().toString().slice(2, 8);
    setGeneratedCode(code);
    setResetStep('email');
    notify(`Verification code: ${code} (shown for demo - in production would be emailed)`);
  };

  const handleResetVerify = () => {
    if (resetVerifyCode.trim() === generatedCode) {
      setResetStep('verify');
    } else {
      notify('Invalid verification code');
      setResetVerifyCode('');
    }
  };

  const handleResetExecute = () => {
    // Log the reset action for audit trail
    const timestamp = new Date().toISOString();
    console.log(`[AUDIT] Content reset executed at ${timestamp}`);

    update(defaultData);
    setShowResetDialog(false);
    notify('✓ All content reset to defaults');
  };

  const handleTabClick = (tabId: string) => {
    if (accessibleTabs.has(tabId) || accessApprovals.has(tabId)) {
      setTab(tabId as TabId);
    } else {
      setRequestedTab(tabId);
      setShowAccessRequest(true);
    }
  };

  const handleRequestAccess = async () => {
    if (!requestEmail.trim()) {
      notify('Please enter your email address');
      return;
    }

    try {
      // Save request to Firebase
      await submitAccessRequest(requestEmail, requestedTab || '');
      notify(`✓ Access request sent to admin for "${requestedTab}"`);
      setShowAccessRequest(false);
      setRequestEmail('');
      setRequestedTab(null);
    } catch (error) {
      console.error('Error submitting access request:', error);
      notify('✗ Error sending request. Please try again.');
    }
  };

  const newLeads = data.leads.filter(l => l.status === 'New').length;

  // Safety check: prevent rendering content for restricted tabs
  const hasAccessToCurrentTab = accessibleTabs.has(tab) || accessApprovals.has(tab);
  if (!hasAccessToCurrentTab) {
    console.warn(`[SECURITY] Attempt to access restricted tab: ${tab}`);
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Access Restricted</h2>
          <p className="text-slate-600 mb-8 max-w-sm">You don't have permission to view this section. Please request access from an administrator.</p>
          <button
            type="button"
            onClick={() => setTab('dashboard')}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-8 py-3 text-white font-semibold hover:bg-red-700 active:bg-red-800 transition-colors cursor-pointer shadow-lg"
          >
            ← Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const renderEditor = () => {
    switch (tab) {
      case 'dashboard': return <DashboardHome data={data} onNav={setTab} />;
      case 'company': return <CompanyEditor data={data} onSave={d => handleSave(d, 'Company info saved!')} />;
      case 'services': return <ServicesEditor data={data} onSave={d => handleSave(d, 'Services saved!')} />;
      case 'products': return <ProductsEditor data={data} onSave={d => handleSave(d, 'Products & pricing saved!')} />;
      case 'industries': return <IndustriesEditor data={data} onSave={d => handleSave(d, 'Industries saved!')} />;
      case 'faqs': return <FaqEditor data={data} onSave={d => handleSave(d, 'FAQs saved!')} />;
      case 'leads': return <LeadsManager data={data} onSave={d => handleSave(d, 'Leads updated!')}
        openScheduleLeadId={scheduleLeadId} onScheduleConsumed={() => setScheduleLeadId(null)} />;
      case 'workshop': return <WorkshopRegistrationsManager data={data} onSave={d => handleSave(d, 'Workshop updated!')}
        onBookDemo={leadId => { setScheduleLeadId(leadId); setTab('leads'); }} />;
      case 'webinar': return <WebinarRegistrationsManager data={data} onSave={d => handleSave(d, 'Webinar updated!')}
        onBookDemo={leadId => { setScheduleLeadId(leadId); setTab('leads'); }} />;
      case 'whatsapp': return <WhatsAppManager />;
      case 'blogs': return <BlogEditor data={data} onSave={d => handleSave(d, 'Blog posts saved!')} />;
      case 'subscribers': return <SubscribersManager />;
      // case 'contacts': return <ContactsDirectory leads={data.leads} subscribers={[]} whatsappContacts={[]} />;
      case 'contact': return <ContactEditor data={data} onSave={d => handleSave(d, 'Contact info saved!')} />;
      case 'testimonials': return <TestimonialsEditor data={data} onSave={d => handleSave(d, 'Testimonials saved!')} />;
      case 'access-requests': return <AccessRequestsManager />;
      case 'bookdemo': return null; // merged into leads tab
    }
  };

  const SidebarNav = ({ mobile }: { mobile?: boolean }) => (
    <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1">
      {tabs.map(t => {
        const Icon = t.icon;
        const isActive = tab === t.id;
        const hasAccess = accessibleTabs.has(t.id) || accessApprovals.has(t.id);
        const badgeCount = t.id === 'leads' ? newLeads : t.id === 'whatsapp' ? unreadWa : 0;
        const isRestricted = !hasAccess;

        return (
          <button
            key={t.id}
            onClick={() => {
              handleTabClick(t.id);
              if (mobile && hasAccess) setSidebar(false);
            }}
            disabled={isRestricted}
            title={isRestricted ? `Restricted. Click to request access to "${t.label}"` : t.label}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isRestricted
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : isActive
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-600/25'
                : 'text-slate-600 hover:bg-red-50 hover:text-slate-900'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{t.label}</span>
            {isRestricted && (
              <span className="text-xs">🔒</span>
            )}
            {!isRestricted && badgeCount > 0 && (
              <span className={`h-5 min-w-[20px] rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? 'bg-white text-red-600' : 'bg-red-100 text-red-700'
              }`}>{badgeCount}</span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[260px] flex-col border-r border-slate-200 bg-white lg:flex shadow-sm">
        <div className="h-16 flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-50/50 border-b border-red-100 px-5 shrink-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-red-700 flex items-center justify-center font-black text-xs text-white shadow-lg shadow-red-600/30">OP</div>
          <div>
            <p className="text-sm font-bold text-slate-900">Admin Panel</p>
            <p className="text-[8px] uppercase tracking-[.2em] font-semibold text-red-600">Content Manager</p>
          </div>
        </div>

        <SidebarNav />

        <div className="border-t border-slate-200 p-3 space-y-2 shrink-0">
          <a href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <ExternalLink className="h-4 w-4" />View Website
          </a>
          <button onClick={handleResetOpen} title="Erases ALL content — requires email verification to confirm"
            className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
            <RotateCcw className="h-3.5 w-3.5" />Reset to defaults
          </button>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
            <LogOut className="h-4 w-4" />Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebar(false)} />
          <aside className="relative w-72 bg-white flex flex-col shadow-2xl">
            <div className="h-16 flex items-center justify-between bg-gradient-to-r from-red-50 to-red-50/50 border-b border-red-100 px-5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-600 via-red-500 to-red-700 flex items-center justify-center font-black text-xs text-white shadow-md shadow-red-600/25">OP</div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Admin Panel</p>
                  <p className="text-[8px] uppercase tracking-[.2em] font-semibold text-red-600">Content Manager</p>
                </div>
              </div>
              <button onClick={() => setSidebar(false)} className="rounded-lg p-1.5 hover:bg-red-100/50 transition-colors">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <SidebarNav mobile />
            <div className="border-t border-slate-200 p-3 space-y-2 shrink-0">
              <button onClick={handleResetOpen} title="Erases ALL content — requires email verification to confirm"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50">
                <RotateCcw className="h-3.5 w-3.5" />Reset to defaults
              </button>
              <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700">
                <LogOut className="h-4 w-4" />Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between bg-white border-b border-slate-200 px-4 lg:px-8 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebar(true)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900">{tabs.find(t => t.id === tab)?.label}</h1>
              <p className="text-[10px] text-slate-500">Changes save to browser storage</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {newLeads > 0 && (
              <button onClick={() => setTab('leads')} className="flex items-center gap-1.5 rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors">
                <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                {newLeads} new lead{newLeads > 1 ? 's' : ''}
              </button>
            )}
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-red-600/20">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderEditor()}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-gradient-to-r from-red-700 to-red-600 px-6 py-4 text-sm font-medium text-white shadow-2xl shadow-red-600/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">✓</span>
          {toast}
        </div>
      )}

      {/* Access Request Dialog */}
      {showAccessRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="border-b border-slate-200 bg-gradient-to-r from-red-50 to-red-50/50 px-6 py-4">
              <h3 className="text-lg font-bold text-red-700">🔒 Request Access</h3>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-900 font-medium mb-2">Access Restricted</p>
                <p className="text-xs text-red-800">
                  The "<strong>{tabs.find(t => t.id === requestedTab)?.label}</strong>" panel is restricted. An admin must approve your access request via email.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                />
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-xs text-slate-600">
                  <strong>What happens next:</strong> An admin will review your request and send you an approval email if authorized.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end bg-slate-50">
              <button onClick={() => setShowAccessRequest(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button onClick={handleRequestAccess}
                className="rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-medium text-white hover:from-red-700 hover:to-red-600 transition-all shadow-md shadow-red-600/20">
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Reset Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Step 1: Initial Confirmation */}
            {resetStep === 'confirm' && (
              <>
                <div className="border-b border-slate-200 bg-gradient-to-r from-red-50 to-red-50/50 px-6 py-4">
                  <h3 className="text-lg font-bold text-red-700">⚠️ Reset All Content</h3>
                </div>
                <div className="px-6 py-6 space-y-4">
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-900 font-medium mb-2">This action cannot be undone!</p>
                    <ul className="text-xs text-red-800 space-y-1">
                      <li>✗ All website content will be deleted</li>
                      <li>✗ All leads and inquiries will be cleared</li>
                      <li>✗ Factory defaults will be restored</li>
                    </ul>
                  </div>
                  <p className="text-sm text-slate-600">
                    To proceed, you'll need to verify your identity via email. Continue?
                  </p>
                </div>
                <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end bg-slate-50">
                  <button onClick={() => setShowResetDialog(false)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleResetConfirm}
                    className="rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-medium text-white hover:from-red-700 hover:to-red-600 transition-all shadow-md shadow-red-600/20">
                    Continue to Verification
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Email Verification */}
            {resetStep === 'email' && (
              <>
                <div className="border-b border-slate-200 bg-gradient-to-r from-red-50 to-red-50/50 px-6 py-4">
                  <h3 className="text-lg font-bold text-red-700">Verify Your Email</h3>
                </div>
                <div className="px-6 py-6 space-y-4">
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-900 font-medium">
                      A verification code has been sent to your admin email. Check your inbox for a 6-digit code.
                    </p>
                    <p className="text-xs text-red-700 mt-2">
                      (Demo: Check the notification in the bottom right)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Enter Verification Code
                    </label>
                    <input
                      type="text"
                      value={resetVerifyCode}
                      onChange={(e) => setResetVerifyCode(e.target.value.toUpperCase())}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-lg tracking-widest font-mono focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                    />
                  </div>
                </div>
                <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end bg-slate-50">
                  <button onClick={() => setResetStep('confirm')}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                    Back
                  </button>
                  <button onClick={handleResetVerify} disabled={resetVerifyCode.length !== 6}
                    className="rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-medium text-white hover:from-red-700 hover:to-red-600 transition-all shadow-md shadow-red-600/20 disabled:opacity-50">
                    Verify Code
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Final Confirmation */}
            {resetStep === 'verify' && (
              <>
                <div className="border-b border-slate-200 bg-gradient-to-r from-green-50 to-green-50/50 px-6 py-4">
                  <h3 className="text-lg font-bold text-green-700">Identity Verified ✓</h3>
                </div>
                <div className="px-6 py-6 space-y-4">
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-900 font-medium mb-2">Final Confirmation Required</p>
                    <p className="text-xs text-red-800">
                      You're about to permanently reset all website content. This is your last chance to cancel.
                    </p>
                  </div>
                  <div className="bg-slate-100 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-2">Log entry will be created:</p>
                    <p className="text-xs font-mono text-slate-700">
                      [AUDIT] Content reset executed at {new Date().toISOString()}
                    </p>
                  </div>
                </div>
                <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end bg-slate-50">
                  <button onClick={() => setShowResetDialog(false)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleResetExecute}
                    className="rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-bold text-white hover:from-red-700 hover:to-red-600 transition-all shadow-md shadow-red-600/20">
                    ⚠️ RESET ALL CONTENT
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
