import { Building2, Briefcase, ShoppingCart, Globe, HelpCircle, Users, FileText, Phone, Star, MessageCircle, CalendarDays, Video, Mail, Wrench } from 'lucide-react';
import type { SiteData } from '../data/siteData';

export type TabId = 'dashboard' | 'company' | 'services' | 'products' | 'industries' | 'faqs' | 'leads' | 'blogs' | 'contact' | 'testimonials' | 'bookdemo' | 'whatsapp' | 'workshop' | 'webinar' | 'subscribers' | 'contacts' | 'access-requests' | 'wip';

interface P { data: SiteData; onNav: (t: TabId) => void }

export default function DashboardHome({ data, onNav }: P) {
  const newLeads = data.leads.filter(l => l.status === 'New').length;
  const openJobs = (data.wipJobs || []).filter(j => j.status !== 'Completed').length;

  const cards: { id: TabId; label: string; icon: typeof Building2; stat: string; desc: string; alert?: boolean }[] = [
    { id: 'company', label: 'Company Info', icon: Building2, stat: '1', desc: 'Edit name, tagline, mission, vision, stats' },
    { id: 'services', label: 'Services', icon: Briefcase, stat: `${data.services.length}`, desc: 'Manage service cards & features' },
    { id: 'products', label: 'Products & Pricing', icon: ShoppingCart, stat: `${data.products.length}`, desc: 'Edit products, pricing, features' },
    { id: 'industries', label: 'Industries', icon: Globe, stat: `${data.industries.length}`, desc: 'Manage industry cards' },
    { id: 'faqs', label: 'FAQ & Chatbot', icon: HelpCircle, stat: `${data.faqs.length}`, desc: 'FAQs also power the chatbot' },
    { id: 'leads', label: 'Demo Requests', icon: Users, stat: `${data.leads.length}`, desc: 'View & manage submitted leads', alert: newLeads > 0 },
    { id: 'wip', label: 'Work in Progress', icon: Wrench, stat: `${openJobs}`, desc: 'Client training, implementation & support being delivered' },
    { id: 'workshop', label: 'Workshop RSVPs', icon: CalendarDays, stat: 'Live', desc: 'Inventory Management Breakfast Workshop signups' },
    { id: 'webinar', label: 'Webinar RSVPs', icon: Video, stat: 'Live', desc: 'Online webinar registrations & attendance' },
    { id: 'blogs', label: 'Blog Posts', icon: FileText, stat: `${data.blogs.length}`, desc: 'Create & manage blog articles' },
    { id: 'contact', label: 'Contact Info', icon: Phone, stat: `${data.contact.phones.length} phones`, desc: 'Edit phones, emails, WhatsApp' },
    { id: 'testimonials', label: 'Reviews & Testimonials', icon: Star, stat: `${data.testimonials.length}`, desc: 'Approve pending reviews, manage published testimonials' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, stat: 'Live', desc: 'View and reply to WhatsApp conversations' },
    { id: 'subscribers', label: 'Newsletter Subscribers', icon: Mail, stat: 'Live', desc: 'View subscribers, add manually, manage unsubscribes' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Welcome to your Admin Panel</h2>
        <p className="mt-1.5 text-slate-500">Manage every section of your website. Changes are saved instantly and update the live site.</p>
      </div>

      {newLeads > 0 && (
        <button onClick={() => onNav('leads')}
          className="mb-6 w-full rounded-2xl border border-accent/30 bg-accent/5 p-5 text-left hover:bg-accent/10 transition">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">🔔 {newLeads} new demo request{newLeads > 1 ? 's' : ''} waiting</p>
              <p className="text-xs text-slate-500">Click to view and manage incoming leads</p>
            </div>
          </div>
        </button>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(c => {
          const I = c.icon;
          return (
            <button key={c.id} onClick={() => onNav(c.id)}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left hover:border-accent/30 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-accent/10 transition">
                  <I className="h-5 w-5 text-slate-600 group-hover:text-accent transition" />
                </div>
                <div className="flex items-center gap-2">
                  {c.alert && <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />}
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{c.stat}</span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{c.label}</h3>
              <p className="mt-1 text-xs text-slate-500">{c.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-6">
        <h3 className="font-bold text-slate-800 text-base">💡 Admin Panel Guide</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2"><span className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent shrink-0 mt-0.5">1</span>Click any section card above to open its editor</li>
          <li className="flex items-start gap-2"><span className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent shrink-0 mt-0.5">2</span>Make your changes — add, edit, reorder, or remove items</li>
          <li className="flex items-start gap-2"><span className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent shrink-0 mt-0.5">3</span>Press <strong className="text-slate-800">Save</strong> — changes update the live website instantly</li>
          <li className="flex items-start gap-2"><span className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent shrink-0 mt-0.5">4</span>FAQ changes also improve chatbot responses automatically</li>
          <li className="flex items-start gap-2"><span className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent shrink-0 mt-0.5">5</span>Use <strong className="text-slate-800">Reset to Defaults</strong> in sidebar to undo all changes</li>
        </ul>
        <p className="mt-4 text-xs text-slate-400">Access this panel anytime by visiting <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-600">/admin</code></p>
      </div>
    </div>
  );
}
