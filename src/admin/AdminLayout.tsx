import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Building2, Briefcase, ShoppingCart, Globe,
  HelpCircle, Users, FileText, Phone, MessageCircle, CalendarDays, Video,
  LogOut, Menu, X, ExternalLink, RotateCcw, Mail
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { defaultData, type SiteData } from '../data/siteData';
import { fbSubscribe } from '../firebase/config';
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

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'company', label: 'Company Info', icon: Building2 },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'products', label: 'Products & Pricing', icon: ShoppingCart },
  { id: 'industries', label: 'Industries', icon: Globe },
  { id: 'faqs', label: 'FAQ & Chatbot', icon: HelpCircle },
  { id: 'leads', label: 'Demo Leads', icon: Users },
  { id: 'workshop', label: 'Workshop RSVPs', icon: CalendarDays },
  { id: 'webinar', label: 'Webinar RSVPs', icon: Video },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'blogs', label: 'Blog Posts', icon: FileText },
  { id: 'subscribers', label: 'Subscribers', icon: Mail },
  { id: 'contact', label: 'Contact Info', icon: Phone },
  { id: 'testimonials', label: 'Reviews & Testimonials', icon: Users },
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

  useEffect(() => {
    const unsubscribe = fbSubscribe('whatsapp_conversations', (raw: Record<string, any> | null) => {
      const count = raw ? Object.values(raw).filter((n: any) => n?.meta?.unread).length : 0;
      setUnreadWa(count);
    });
    return unsubscribe;
  }, []);

  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };
  
  const handleSave = (d: SiteData, msg: string) => { update(d); notify(msg); };
  
  const handleReset = () => {
    // Deliberately high-friction: this wipes ALL content, so require the user to
    // type the word out — a plain OK/Cancel is too easy to hit by mistake.
    const answer = prompt(
      'DANGER: this ERASES all website content and restores factory defaults. It cannot be undone.\n\n' +
      'Type RESET (capitals) to confirm, or Cancel to keep everything.',
    );
    if (answer !== null && answer.trim() === 'RESET') {
      update(defaultData);
      notify('All content reset to defaults');
    }
  };

  const newLeads = data.leads.filter(l => l.status === 'New').length;

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
      case 'contact': return <ContactEditor data={data} onSave={d => handleSave(d, 'Contact info saved!')} />;
      case 'testimonials': return <TestimonialsEditor data={data} onSave={d => handleSave(d, 'Testimonials saved!')} />;
      case 'bookdemo': return null; // merged into leads tab
    }
  };

  const SidebarNav = ({ mobile }: { mobile?: boolean }) => (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
      {tabs.map(t => {
        const Icon = t.icon;
        const isActive = tab === t.id;
        const badgeCount = t.id === 'leads' ? newLeads : t.id === 'whatsapp' ? unreadWa : 0;
        return (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); if (mobile) setSidebar(false); }}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive
                ? 'bg-navy-800 text-white shadow-lg shadow-navy-900/20'
                : 'text-navy-300 hover:bg-navy-800'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{t.label}</span>
            {badgeCount > 0 && (
              <span className={`h-5 min-w-[20px] rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
              }`}>{badgeCount}</span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen bg-navy-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[260px] flex-col border-r border-navy-200 bg-white lg:flex">
        <div className="h-16 flex items-center gap-3 border-b border-navy-100 px-5 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent to-navy-800 flex items-center justify-center font-black text-xs text-white shadow-lg shadow-accent/20">OP</div>
          <div>
            <p className="text-sm font-bold text-navy-900">Admin Panel</p>
            <p className="text-[9px] uppercase tracking-[.15em] font-semibold text-accent">Content Manager</p>
          </div>
        </div>

        <SidebarNav />

        <div className="border-t border-navy-100 p-3 space-y-0.5 shrink-0">
          <a href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50 transition">
            <ExternalLink className="h-4 w-4" />View Website
          </a>
          <button onClick={handleReset} title="Erases ALL content — requires typing RESET to confirm"
            className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium text-navy-300 hover:text-orange-600 hover:bg-orange-50/60 transition">
            <RotateCcw className="h-3 w-3" />Reset to defaults
          </button>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition">
            <LogOut className="h-4 w-4" />Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebar(false)} />
          <aside className="relative w-72 bg-white flex flex-col shadow-2xl">
            <div className="h-16 flex items-center justify-between border-b border-navy-100 px-5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center font-black text-xs text-white">OP</div>
                <div>
                  <p className="text-sm font-bold text-navy-900">Admin Panel</p>
                  <p className="text-[9px] uppercase tracking-[.15em] font-semibold text-accent">Content Manager</p>
                </div>
              </div>
              <button onClick={() => setSidebar(false)} className="rounded-lg p-1.5 hover:bg-navy-50 transition">
                <X className="h-5 w-5 text-navy-400" />
              </button>
            </div>
            <SidebarNav mobile />
            <div className="border-t border-navy-100 p-3 space-y-0.5 shrink-0">
              <button onClick={handleReset} title="Erases ALL content — requires typing RESET to confirm"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium text-navy-300 hover:text-orange-600 hover:bg-orange-50/60">
                <RotateCcw className="h-3 w-3" />Reset to defaults
              </button>
              <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" />Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between border-b border-navy-200 bg-white px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebar(true)} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-navy-900">{tabs.find(t => t.id === tab)?.label}</h1>
              <p className="text-[10px] text-navy-400">Changes save to browser storage</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {newLeads > 0 && (
              <button onClick={() => setTab('leads')} className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                {newLeads} new lead{newLeads > 1 ? 's' : ''}
              </button>
            )}
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-xs font-bold text-white">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderEditor()}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-navy-900 px-5 py-3 text-sm font-medium text-white shadow-2xl flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-accent flex items-center justify-center text-[10px]">✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}
