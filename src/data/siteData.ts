export interface ServiceItem { id:string; title:string; desc:string; icon:string; features:string[]; link?:string }
export interface ProductItem { id:string; name:string; edition:string; price:string; period:string; features:string[]; popular?:boolean; cta:string }
export interface TestimonialItem { id:string; name:string; role:string; company:string; text:string; rating:number }
export interface FaqItem { id:string; q:string; a:string; cat:string }
export interface IndustryItem { id:string; name:string; icon:string; desc:string }
export interface BlogPost {
  id:string; title:string; slug?:string; excerpt:string; date:string; category:string; readTime:string; content:string; youtubeUrl?:string;
  // Auto-send-to-subscribers scheduling — notifyAt is a UTC ISO string set
  // from the admin's local time picker; notified flips true once the
  // backend has actually sent it, so it's never sent twice.
  notifyAt?: string; notified?: boolean;
}
export interface Lead {
  id:string; name:string; company:string; phone:string; email:string;
  businessType:string; demoDate:string; demoTime?:string; currentSoftware:string; message:string;
  createdAt:string; status:string;
  // Scheduling fields (set when status → Schedule a Demo)
  scheduledDate?: string; scheduledTime?: string;
  demoType?: 'online' | 'physical'; demoLocation?: string;
  teamMemberName?: string; teamMemberPhone?: string; teamMemberEmail?: string;
  extraTeam?: { name: string; phone: string; email?: string }[];
  meetLink?: string; meetSent?: boolean;
  // Where the lead came from. 'field' = met on the road — field storming,
  // road shows, market visits and other outbound marketing.
  source?: 'website' | 'manual' | 'workshop' | 'webinar' | 'email' | 'whatsapp' | 'referral' | 'phone' | 'direct' | 'field';
  fieldCampaign?: string;         // which drive/area a field lead was captured on
  industry?: string; demoNotes?: string;
  requestType?: 'demo' | 'consultation' | 'bizanalyst' | 'customization' | 'other'; // demo, consultation, biz analyst, customization/add-on/TDL, or other enquiry
  // CRM follow-up fields
  nextStep?: string;              // free-text next action, shown in CRM report
  attendedWorkshop?: boolean;     // true if this lead came from a breakfast-workshop attendee
  workshopRegId?: string;         // links back to the workshop_registrants entry
  workshopEventId?: string;       // WHICH workshop event this lead came from (tells one workshop from another)
  workshopTitle?: string;         // snapshot of that workshop's title at conversion, for display/exports
  attendedWebinar?: boolean;      // true if this lead came from an online-webinar attendee
  webinarRegId?: string;          // links back to the webinar_registrants entry
  webinarEventId?: string;        // WHICH webinar event this lead came from
  webinarTitle?: string;          // snapshot of that webinar's title at conversion
  // ── Closed Lost / restart ────────────────────────────────────────────────
  lostReason?: string;            // why the deal was lost
  lostAt?: string;                // when it was marked Closed Lost
  reopenedAt?: string;            // when the pipeline was last restarted
  reopenCount?: number;           // how many times this lead has been restarted
  originalCreatedAt?: string;     // the first period it was domiciled in, kept when re-dated
  // Link to the delivery job created once the deal is won.
  wipJobId?: string;
}

// ── Work in progress ────────────────────────────────────────────────────────
// Client work being delivered after the sale — training, implementation,
// migration, support. Kept alongside leads so a won deal flows straight into
// delivery instead of falling off the end of the pipeline.
export type WipJobType = 'Training' | 'Implementation' | 'Migration' | 'Customization' | 'Support' | 'Other';
export type WipStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Completed';

export interface WipTask { id: string; label: string; done: boolean }

export interface WipJob {
  id: string;
  client: string;                 // contact person
  company: string;
  phone?: string;
  email?: string;
  jobType: WipJobType;
  title: string;                  // e.g. "TallyPrime 6.0 rollout — 3 branches"
  assignedStaff: string[];        // names from the shared staff directory
  startDate?: string;             // YYYY-MM-DD
  targetDate?: string;            // YYYY-MM-DD — agreed completion
  completedAt?: string;           // ISO, set when status → Completed
  status: WipStatus;
  progress: number;               // 0–100
  value?: string;                 // contract value, free text (e.g. "KES 120,000")
  notes?: string;
  tasks?: WipTask[];              // simple delivery checklist
  leadId?: string;                // the won lead this came from, if any
  createdAt: string;
  updatedAt?: string;
}
export interface ContactInfo { location:string; phones:string[]; emails:string[]; workingHours:string[]; whatsapp:string; mapUrl:string }
export interface CompanyInfo { name:string; tagline:string; mission:string; vision:string; about:string[]; stats:{label:string;value:string}[] }

export interface SiteData {
  company: CompanyInfo; contact: ContactInfo; services: ServiceItem[]; products: ProductItem[];
  testimonials: TestimonialItem[]; faqs: FaqItem[]; industries: IndustryItem[];
  blogs: BlogPost[]; leads: Lead[];
  // Client work being delivered (training, implementation, …)
  wipJobs?: WipJob[];
  // Optional mapping of page/theme -> hero image URL (use real photos of African users)
  heroImages?: Record<string, string>;
}

export const defaultData: SiteData = {
  company: {
    name:'Optimum Prime Solutions',
    tagline:'Certified TallyPrime Partner · Cloud Hosting · EOS® Consulting · Biz Analyst',
    mission:'To empower Kenyan businesses with world-class TallyPrime solutions, secure cloud infrastructure, and the Entrepreneurial Operating System (EOS®) — helping leadership teams get aligned, gain traction, and achieve sustainable growth.',
    vision:'To be the leading TallyPrime partner and EOS® consulting firm in East Africa, transforming how businesses manage their finances, operations, and leadership systems.',
    about:[
      'Optimum Prime Solutions is Kenya\'s certified TallyPrime partner, delivering end-to-end business automation and cloud solutions. With over 15 years of combined experience, our certified team helps Kenyan businesses join the 2.5 million+ companies worldwide already running on TallyPrime — across Silver, Gold, and Enterprise editions.',
      'Beyond accounting software, we apply the principles of the Entrepreneurial Operating System (EOS®) — helping entrepreneurial leadership teams run their businesses on the framework created by Gino Wickman. EOS strengthens the Six Key Components of any business: Vision, People, Data, Issues, Process, and Traction. We combine TallyPrime\'s financial power with EOS® operational discipline to give your business both the numbers and the systems to grow.',
    ],
    stats:[{label:'TallyPrime Users Worldwide',value:'2.5M+'},{label:'Years Experience',value:'15+'},{label:'Uptime Guarantee',value:'99.9%'},{label:'Support Response',value:'< 1hr'}],
  },
  contact: {
    location:'Ruiru, Kenya',
    phones:['+254 116 246 074','+254 727 209 720'],
    emails:['info@optimumprimesolutions.co.ke'],
    workingHours:['Mon – Fri: 8:00 AM – 5:00 PM','Sat: 8:00 AM – 12:00 PM'],
    whatsapp:'254727209720',
    mapUrl:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.37!2d36.96!3d-1.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRuiru!5e0!3m2!1sen!2ske!4v1',
  },
  heroImages: {
    // About: African business team in a modern office setting
    about: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600',
    // Products: African professional reviewing software/products on laptop
    products: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600',
    // Features/Services: African IT professional demonstrating software to client
    features: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600',
    // FAQ: African business professional at desk with laptop
    faq: 'https://images.pexels.com/photos/4342352/pexels-photo-4342352.jpeg?auto=compress&cs=tinysrgb&w=1600',
    // Testimonials: African business people in a meeting/discussion
    testimonials: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1600',
    // Blog: African professional reading/writing at a desk
    blog: 'https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg?auto=compress&cs=tinysrgb&w=1600',
    // Contact: African customer service / support professional
    contact: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  services: [
    {id:'1',title:'Tally Prime Installation & Setup',desc:'Complete installation, configuration, and data migration for Tally Prime Silver & Gold editions. Get up and running in 24 hours.',icon:'Download',features:['License activation','Data migration','Multi-user setup','Initial training'],link:'https://tallysolutions.com/ssa/download/?srsltid=AfmBOooMSwVbv50rP24g8n8IKqi92cdz3NFhSuqpfprrxIcgj7DZLXym'},
    {id:'2',title:'Inventory Management',desc:'Real-time stock tracking, batch management, reorder alerts, and multi-location inventory control powered by Tally Prime.',icon:'Package',features:['Real-time tracking','Batch & expiry management','Reorder alerts','Multi-location support'],link:'https://tallysolutions.com/ssa/download/?srsltid=AfmBOooMSwVbv50rP24g8n8IKqi92cdz3NFhSuqpfprrxIcgj7DZLXym'},
    {id:'3',title:'Payroll Systems',desc:'Automated payroll processing fully configured for Kenyan statutory requirements — PAYE, NHIF, NSSF, Housing Levy.',icon:'Wallet',features:['Auto salary processing','PAYE/NHIF/NSSF','Payslip generation','Leave management'],link:'https://tallysolutions.com/ssa/download/?srsltid=AfmBOooMSwVbv50rP24g8n8IKqi92cdz3NFhSuqpfprrxIcgj7DZLXym'},
    {id:'4',title:'Manufacturing Solutions',desc:'Streamline production with Bill of Materials, production orders, work-in-progress tracking, and cost analysis.',icon:'Factory',features:['BOM management','Production orders','Cost tracking','Quality control'],link:'https://tallysolutions.com/ssa/download/?srsltid=AfmBOooMSwVbv50rP24g8n8IKqi92cdz3NFhSuqpfprrxIcgj7DZLXym'},
    {id:'5',title:'KRA Compliance',desc:'Stay 100% compliant with KRA. Automated VAT, income tax, PAYE calculations, and e-filing integration.',icon:'FileCheck',features:['VAT management','e-Filing integration','Tax reports','Audit trail'],link:'https://tallysolutions.com/ssa/download/?srsltid=AfmBOooMSwVbv50rP24g8n8IKqi92cdz3NFhSuqpfprrxIcgj7DZLXym'},
    {id:'6',title:'TDL Customization',desc:'Custom Tally Definition Language development to tailor Tally Prime to your exact business workflows.',icon:'Code',features:['Custom reports','Workflow automation','Integration APIs','Module extensions'],link:'https://tallysolutions.com/ssa/download/?srsltid=AfmBOooMSwVbv50rP24g8n8IKqi92cdz3NFhSuqpfprrxIcgj7DZLXym'},
    {id:'7',title:'Remote & On-site Support',desc:'Remote assistance during business hours plus scheduled on-site visits. Average response time under 1 hour.',icon:'Headphones',features:['Business-hours remote support','On-site visits','Software updates','Troubleshooting'],link:'https://tallysolutions.com/ssa/download/?srsltid=AfmBOooMSwVbv50rP24g8n8IKqi92cdz3NFhSuqpfprrxIcgj7DZLXym'},
    {id:'8',title:'EOS® Business Operating System',desc:'We apply EOS® tools and principles. Help your leadership team get aligned, gain traction, and achieve your vision using the Entrepreneurial Operating System by Gino Wickman.',icon:'BarChart3',features:['EOS® full implementation','Vision/Traction Organizer (V/TO)','Rocks & accountability meetings','L10 meeting cadence','People Analyser & RPRS','Quarterly & annual planning'],link:'/contact'},
    {id:'9',title:'TallyPrime Cloud Hosting',desc:'Access your TallyPrime data securely from anywhere. We set up and manage cloud infrastructure so your team can work remotely without compromising data security.',icon:'Cloud',features:['Cloud server setup','Remote access configuration','Automated daily backups','99.9% uptime SLA','Multi-user concurrent access','Disaster recovery planning'],link:'/contact'},
  ],
  products: [
    {id:'1',name:'TallyPrime',edition:'Silver',price:'KES 57,600 +VAT',period:'one-time license',features:['Single user license','Full accounting & invoicing','Inventory & stock reports','KRA VAT & eTIMS ready','Payroll — PAYE, NHIF, NSSF','Free updates for 1 year','Email & remote support'],cta:'Get Silver'},
    {id:'2',name:'TallyPrime',edition:'Gold',price:'KES 172,800 +VAT',period:'one-time license',popular:true,features:['Unlimited multi-user access','All Silver features included','Multi-location inventory control','Advanced user roles & security','Remote data access setup','Priority implementation support','On-site team training included'],cta:'Get Gold — Best Value'},
    {id:'3',name:'TallyPrime',edition:'Cloud Hosting',price:'From as low as KES 3,000',period:'per month',features:['Secure cloud server setup','Remote access from any device','Automated daily backups','99.9% uptime SLA guarantee','Multi-user concurrent access','Disaster recovery planning','Monthly system health checks'],cta:'Start Cloud Hosting'},
    {id:'4',name:'EOS®',edition:'Implementation',price:'Contact for Quote',period:'per engagement',features:['Full EOS® implementation program','Vision/Traction Organizer (V/TO)','Rocks & 90-day priority setting','L10 weekly leadership meetings','People Analyser & accountability','Quarterly & annual planning days','Delivered using EOS® tools & principles'],cta:'Book EOS Session'},
  ],
  testimonials: [
    {id:'1',name:'Frederick Chege',role:'CEO',company:'Ujenzi Distributors Ltd',text:'Optimum Prime Solutions transformed our accounting. The KRA compliance module alone has saved us countless hours. Their team is professional and responsive.',rating:5},
    {id:'2',name:'Grace Wanjiku',role:'Finance Director',company:'Wanjiku Manufacturing',text:'The manufacturing module is a game-changer. Real-time production cost tracking and BOM management have improved our margins by 18%.',rating:5},
    {id:'3',name:'Peter Ochieng',role:'Managing Director',company:'Ochieng Trading Co.',text:'Complete visibility of stock across 5 locations. Inventory discrepancies dropped by 95% after implementing their solution.',rating:5},
    {id:'4',name:'Mary Njeri',role:'HR Manager',company:'Njeri Group',text:'Payroll processing that used to take 3 days now takes 2 hours. The PAYE, NHIF, and NSSF calculations are always accurate.',rating:5},
    {id:'5',name:'David Kamau',role:'Owner',company:'Kamau Pharmacy',text:'From POS to inventory to KRA returns — everything runs on Tally Prime now. Best investment we\'ve made for our pharmacy chain.',rating:5},
    {id:'6',name:'Sarah Achieng',role:'Operations Manager',company:'Lake Victoria SACCO',text:'Their SACCO solution handles member accounts, loan tracking, and dividends seamlessly. Support response time is incredible.',rating:5},
  ],
  faqs: [
    {id:'1',q:'What is Tally Prime?',a:'Tally Prime is a complete business management software for accounting, inventory, payroll, manufacturing, taxation, and more. It\'s used by millions of businesses worldwide and is the leading ERP solution in East Africa.',cat:'General'},
    {id:'2',q:'How much does Tally Prime cost?',a:'Tally Prime Silver (single user) costs KES 54,000 and Tally Prime Gold (multi-user) costs KES 162,000. Both are one-time purchases with 1 year of free updates. Contact us for volume discounts.',cat:'Pricing'},
    {id:'3',q:'Do you provide training?',a:'Yes! We provide comprehensive training covering all Tally Prime modules — accounting, inventory, payroll, manufacturing, and KRA compliance. Training can be on-site or remote.',cat:'Services'},
    {id:'4',q:'How does Tally handle KRA compliance?',a:'Tally Prime is fully configured for KRA including VAT computation, PAYE calculations, income tax reports, and supports e-filing integration for iTax returns.',cat:'KRA & Tax'},
    {id:'5',q:'Can I access Tally Prime remotely?',a:'Yes! Tally Prime Gold supports remote access. With our cloud setup, you can access your data from anywhere — perfect for teams working across multiple locations.',cat:'General'},
    {id:'6',q:'How long does implementation take?',a:'Basic setup takes 1-2 days. Full enterprise implementation with data migration and training typically takes 1-2 weeks, depending on complexity.',cat:'Services'},
    {id:'7',q:'Do you offer after-sales support?',a:'Absolutely. We provide remote support during business hours (Mon – Fri: 8:00 AM – 5:00 PM, Sat: 8:00 AM – 12:00 PM) with average response under 1 hour, plus scheduled on-site visits. Support plans start from KES 5,000/month.',cat:'Support'},
    {id:'8',q:'Can I migrate from Excel or other software?',a:'Yes, we handle full data migration from Excel, spreadsheets, and other systems. All historical data is accurately transferred with zero downtime, ensuring no loss of critical information.',cat:'Services'},
    {id:'9',q:'Is my data secure?',a:'Tally Prime provides enterprise-grade security with role-based access, audit trails, encrypted storage, and automated backups. We also set up disaster recovery plans.',cat:'Security'},
    {id:'10',q:'Do you serve businesses outside Nairobi?',a:'Yes! We serve clients across Kenya and East Africa. Remote support is available nationwide, and we schedule on-site visits for implementation anywhere in the region.',cat:'General'},
    {id:'11',q:'Which Tally Prime edition is best for my business?',a:'We recommend Tally Prime Silver for single-user small businesses and Tally Prime Gold for multi-user teams with remote access needs. For branch operations or advanced reporting, we often advise Plus or Enterprise deployments.',cat:'Products'},
    {id:'12',q:'Can Tally Prime integrate with our POS or bank systems?',a:'Yes. We build Tally Prime integrations using custom TDL and available APIs so your POS, banking, or payment systems sync with accounting and inventory data automatically.',cat:'Integration'},
    {id:'13',q:'How do you train our staff on Tally Prime?',a:'We provide tailored training sessions for accountants, managers, and operations teams. Training is available on-site or remote and includes real-world workflows, compliance reports, and support best practices.',cat:'Training'},
    {id:'14',q:'What support options do you offer after implementation?',a:'We offer support plans covering remote assistance, regular health checks, software updates, and on-site visits. Our support response is typically under 1 hour for urgent issues.',cat:'Support'},
    {id:'15',q:'How can I access Tally Prime remotely?',a:'Tally Prime Gold supports remote access. We can also set up secure cloud hosting so your team accesses Tally Prime from multiple locations while keeping your data centralized and backed up.',cat:'Remote Access'},
    {id:'16',q:'What is EOS® and how can it help my business?',a:'EOS® (Entrepreneurial Operating System) is a complete business operating system developed by Gino Wickman and detailed in his book \"Traction\". It strengthens the Six Key Components of any business: Vision, People, Data, Issues, Process, and Traction. Applying its tools and principles, we help your leadership team get aligned on where the business is going, who is doing what, and how you will get there — through proven tools like the Vision/Traction Organizer (V/TO), Rocks, L10 meetings, and the People Analyser.',cat:'EOS'},
    {id:'17',q:'How does EOS® work with TallyPrime?',a:'EOS® provides the operating system for your leadership team — clarity on vision, accountability, and meeting rhythms. TallyPrime provides the financial and operational data that feeds into your EOS scorecards and dashboards. Together, they give your business both the management discipline and the real-time numbers to make better decisions faster.',cat:'EOS'},
    {id:'18',q:'What is the EOS® implementation process?',a:'Our EOS® implementation typically runs over 12–24 months. We start with a 90-minute meeting to introduce the tools, then a Focus Day to align the leadership team, followed by quarterly and annual planning sessions. Between sessions, we coach your team on running L10 meetings, setting 90-day Rocks, and using the People Analyser. The result is a business that runs on a consistent, proven rhythm.',cat:'EOS'},
    {id:'19',q:'Do you offer TallyPrime cloud hosting?',a:'Yes! We set up and manage secure cloud servers for TallyPrime so your team can access data from anywhere. Our cloud hosting includes automated daily backups, 99.9% uptime SLA, multi-user concurrent access, and disaster recovery planning. Pricing starts from as low as KES 3,000 per month depending on the number of users and data volume.',cat:'Cloud'},
    {id:'20',q:'What is the difference between TallyPrime on-premise and cloud?',a:'On-premise TallyPrime runs on your local computer or office server — fast and secure but limited to your physical location. Cloud-hosted TallyPrime runs on a remote server managed by us, allowing your team to access it from anywhere with an internet connection. Cloud hosting is ideal for businesses with multiple branches, remote workers, or owners who need visibility on the go.',cat:'Cloud'},
  ],
  industries: [
    {id:'1',name:'Retail & Shops',icon:'ShoppingBag',desc:'POS integration, stock management, and multi-branch retail solutions.'},
    {id:'2',name:'Wholesale & Distribution',icon:'Truck',desc:'Bulk inventory, supplier management, and order processing systems.'},
    {id:'3',name:'Manufacturing',icon:'Factory',desc:'BOM, production orders, quality control, and cost tracking.'},
    {id:'4',name:'SACCOs & MFIs',icon:'Landmark',desc:'Member management, loans, dividends, and regulatory compliance.'},
    {id:'5',name:'Hardware & Construction',icon:'Wrench',desc:'Project costing, material tracking, and contractor management.'},
    {id:'6',name:'Pharmacies & Healthcare',icon:'Heart',desc:'Drug inventory, expiry tracking, and PPOA compliance.'},
    {id:'7',name:'Supermarkets',icon:'ShoppingCart',desc:'Multi-POS, barcode scanning, and real-time stock updates.'},
    {id:'8',name:'Education & NGOs',icon:'GraduationCap',desc:'Fee management, donor tracking, and grant accounting.'},
  ],
  blogs: [
    {id:'1',title:'Why Every Kenyan Business Needs TallyPrime in 2026',slug:'why-every-kenyan-business-needs-tally-prime-in-2025',excerpt:'From the 2026 Year of Income, KRA validates the expenses you claim against electronic tax invoices. Here is why TallyPrime has moved from useful to unavoidable for Kenyan businesses.',date:'2026-01-15',category:'Insights',readTime:'7 min',content:`TallyPrime has become the backbone of business operations across Kenya. Whether you run a small retail shop, a manufacturing facility, or a growing services company, accurate financial management and KRA compliance are non-negotiable. As a [certified TallyPrime partner in Kenya](/), we've helped hundreds of businesses streamline their accounting and stay KRA-compliant.

What changed in 2026 is the cost of getting it wrong. Compliance has stopped being a year-end clean-up exercise — KRA now checks your numbers as you file, against records it already holds. Here is why TallyPrime has moved from useful to unavoidable.

1. eTIMS Now Decides What You Can Deduct
This is the single biggest shift for 2026. From the 2026 Year of Income, the income and expenses you declare need to be supported by valid electronic tax invoices — transmitted correctly, and carrying the buyer PIN where it applies. KRA validates at the point of filing and cross-references your claims against what your suppliers actually reported.

The transitional concession that let taxpayers declare non-eTIMS income and expenses for the 2025 period was a one-time arrangement. In practice, that means:
- An expense with no matching electronic tax invoice is an expense you may not be able to claim
- Your supplier's compliance is now your tax problem too
- Fixing it after filing is far harder than getting the invoice right the first time

Sectors that buy from a lot of small or informal suppliers — construction, hospitality, logistics, hardware — feel this first. TallyPrime handles it at source: invoices are raised in the required format, transmitted to eTIMS, and reconciled against your books, so what you file matches what KRA already has.

2. Payroll Rules That Have Already Moved
If your payroll template still says NHIF, it is out of date. Kenyan payroll now runs on:
- PAYE on the current progressive bands
- SHIF at 2.75% of gross pay — employee-only, with a minimum of KES 300 per month and no upper cap
- Affordable Housing Levy at 1.5% from the employee, matched by 1.5% from the employer
- NSSF Tier I and Tier II at the prevailing statutory rates and pensionable earnings limits
- Remittance by the 9th of the following month

Rates and limits change, and they change mid-year. TallyPrime's payroll module calculates the deductions, generates payslips, and produces the statutory reports — so a rate change is a configuration update, not a spreadsheet rebuild.

3. Real-Time Business Insights
Stop relying on spreadsheets. TallyPrime provides instant access to your:
- Daily sales and expense reports
- Inventory levels across multiple locations
- Cash flow position and projections
- Profit & loss statements
- Customer and supplier ageing analyses

Decision-making becomes data-driven, not guesswork-based.

4. Inventory Management at Scale
Whether you have 1 warehouse or 10 branches, TallyPrime tracks inventory in real time. Automated reorder points prevent stockouts, batch management prevents expired stock, and multi-location visibility ensures optimal stock distribution — and every movement carries the documentation trail your returns now depend on.

5. Cost Reduction & Efficiency
Implementing TallyPrime typically reduces operational costs by 15-25% through:
- Reduced data entry errors (95% fewer manual entries)
- Faster month-end closing (from 5 days to 1 day)
- Minimized accounting staff requirements
- Fewer compliance penalties and fines

That last line carries more weight in 2026 than it did two years ago. A disallowed expense is not a fine you can negotiate down — it is tax you pay on profit you never made.

6. A Platform That Keeps Up
TallyPrime 7.0, released in December 2025, moved the product from an accounting tool towards a connected business platform: scheduled cloud backup, SmartFind search across your data, and noticeably faster performance on large company files. TallyPrime 7.1 follows it. Multi-user access, role-based controls, and unlimited transaction capacity mean you are never outgrowing the system — and staying on a current release is how you stay ahead of the next compliance change instead of scrambling after it.

The Bottom Line
In 2026, manual accounting is not just inefficient — it is expensive in a way that shows up directly on your tax bill. TallyPrime eliminates operational friction, keeps your filings defensible, and gives you the visibility needed to scale confidently.

Ready to transform your business? The businesses that get their invoice trail right this year will be the ones leading their industries next year.`},
    {id:'2',title:'Complete Guide to KRA e-Filing with Tally Prime',slug:'complete-guide-to-kra-e-filing-with-tally-prime',excerpt:'Step-by-step guide to setting up and filing your KRA returns directly from Tally Prime. Save time and avoid penalties.',date:'2025-02-01',category:'Tutorial',readTime:'8 min',content:`KRA compliance can be intimidating, but with Tally Prime, it's surprisingly straightforward. This guide walks you through the entire e-filing process. If you need expert setup, [we offer hands-on TallyPrime training and compliance support in Ruiru and across Kenya](/)

What You Need Before Starting
✓ Active KRA PIN
✓ Valid iTax login credentials
✓ Tally Prime configured with your business details
✓ Up-to-date transaction records (should already be in Tally Prime)

Step 1: Enable eTIMS in Tally Prime
Navigate to F11 (Features) and ensure eTIMS is activated. This enables invoice-level tracking required by KRA.

Step 2: Configure Your Invoice Format
All invoices must include:
- Sequential numbering
- Buyer and seller details
- Item descriptions with quantities and rates
- Total amount and tax amount
- Invoice date

Tally Prime automatically formats this correctly when eTIMS is enabled.

Step 3: Generate VAT Reports
From the Gateway of Tally, go to:
Reports → Tax Analysis → VAT Reports

Review your:
- Input VAT (VAT paid on purchases)
- Output VAT (VAT collected on sales)
- Net VAT payable

Tally Prime calculates this automatically based on your invoices.

Step 4: Export Data for iTax
Tally Prime integrates with KRA's iTax system. The process is automatic:
1. Period selection (monthly or quarterly)
2. One-click export to iTax format
3. Upload directly from Tally Prime to KRA portal

Step 5: File Your Returns
Through iTax:
1. Log in with your credentials
2. Import the exported Tally Prime data
3. Review calculations
4. File returns
5. Keep acknowledgment receipt

Common Mistakes to Avoid
❌ Incomplete invoice details (missing buyer PIN)
❌ Manual invoice adjustments without proper vouchers
❌ Mixing personal and business transactions
❌ Missing supporting documents
❌ Filing late (penalties increase after the due date)

Pro Tips for Smooth Filing
✓ File on the 10th of the following month (not on deadline)
✓ Keep digital copies of all invoices for 5 years
✓ Reconcile bank statements monthly
✓ Run reconciliation reports weekly
✓ Maintain a VAT register separate from invoices

Troubleshooting Common Issues
If your VAT doesn't match:
1. Check opening inventory values
2. Verify all purchases are recorded
3. Confirm VAT rates (16% standard, 0% exempt items)
4. Check for duplicate entries

If eTIMS upload fails:
1. Verify internet connection
2. Check invoice format compliance
3. Ensure all mandatory fields are populated
4. Contact your Tally partner if issue persists

After Filing
Keep records of:
- Filing confirmation from KRA
- VAT payment proof
- Reconciliation reports
- Monthly bank statements

The entire process, once set up correctly, takes just 2-3 hours per month. Tally Prime handles the heavy lifting—you just need to ensure accurate data entry daily.

Need help with your first filing? Our team can guide you through every step.`},
    {id:'3',title:'Tally Prime Silver vs Gold: Which Edition Is Right for You?',slug:'tally-prime-silver-vs-gold-which-edition-is-right-for-you',excerpt:'A detailed comparison of Tally Prime Silver and Gold editions to help you choose the perfect solution for your business size.',date:'2025-02-15',category:'Comparison',readTime:'6 min',content:`Choosing between Tally Prime Silver and Gold is one of the first decisions you'll make. This comprehensive comparison helps you pick the right fit for your business.

Quick Comparison Table:

Feature                  | Silver Edition    | Gold Edition
User Licenses           | Single User       | Unlimited Users
Network Access          | Standalone Only   | Yes (Multi-Location)
Price                   | KES 57,600 +VAT   | KES 172,800 +VAT
Invoice Limit           | Unlimited         | Unlimited
Transactions            | Unlimited         | Unlimited
Remote Access           | Not Built-in      | Yes (with setup)
Backup Options          | Local Backup      | Cloud Ready
Support Tier            | Email/Chat        | Priority Support

Tally Prime Silver: Best For

✓ Small businesses with 1-3 employees handling finances
✓ Sole traders and freelancers
✓ Startup companies testing the market
✓ Shops and trading businesses
✓ Service providers (consultants, plumbers, electricians)
✓ One-person operations that need professional accounting

Real-World Silver User Profile:
Meet Sarah, a retail shop owner. She has one checkout counter, manages inventory herself, and needs basic accounting for tax filing. Silver handles everything: sales tracking, inventory, payroll (if needed), and KRA compliance. Cost savings matter, and she'll upgrade later if the business scales.

Tally Prime Gold: Best For

✓ Multi-location businesses (2+ branches)
✓ Growing companies with 5+ employees
✓ Manufacturing facilities
✓ Wholesale and distribution businesses
✓ Retail chains
✓ Organizations requiring remote access
✓ Businesses planning significant growth

Real-World Gold User Profile:
Meet John, who owns 4 retail outlets. Each branch manager needs access to the system. Head office needs consolidated reporting. Teams work from different locations. Gold's multi-user, multi-location capabilities are essential. The higher investment (KES 172,800) is justified by efficiency gains and consolidated control.

Key Feature Deep-Dives

1. Single User vs. Multi-User
Silver: One person at a time
- Perfect if you handle all accounting yourself
- Safe from concurrent data access issues
- No additional setup needed

Gold: Many people simultaneously
- Branch managers can enter their sales
- Multiple departments work in parallel
- Headquarters has real-time consolidated view

2. Network Access (Local Area Network)
Silver: Standalone computer only
- Good for security (data stays on your computer)
- No networking complexity
- Not suitable for multi-location setups

Gold: Connects multiple computers
- All branches on same network
- Real-time data synchronization
- Centralized database

3. Remote Access
Silver: Not available
- You must be at the office

Gold: Built-in remote capability
- Access from home, branch, or client site
- VPN-ready
- Perfect for post-COVID flexible work

4. Cloud Integration
Silver: Basic cloud backup guidance
- Manual backup procedures
- You manage the cloud storage

Gold: Cloud-ready architecture
- Automated backup compatibility
- Cloud Sync integration options
- Less manual management

Cost-Benefit Analysis

Silver Math:
Initial cost: KES 57,600 +VAT = KES 67,392
Perfect if:
- You have 1 location
- You manage finances personally
- Annual revenue < KES 5 million
- Team won't expand

Gold Math:
Initial cost: KES 172,800 +VAT = KES 200,256
ROI achieved when:
- Operating 2+ branches (saves KES 5,000-10,000/branch in admin costs)
- Managing 5+ team members (saves 20+ hours/month in coordination)
- Annual revenue > KES 10 million
- Planned growth within 2 years

The Growth Path

Most businesses follow this journey:
Year 1: Silver Edition (establish systems, learn Tally)
Year 2-3: Gold Edition (scale operations, add branches)
Year 5+: Enterprise/Plus (advanced analytics, cloud hosting)

Switching Costs:
Upgrading from Silver to Gold later requires:
- One-time upgrade cost: KES 115,200 (difference)
- Data migration: Usually 4-6 hours
- Re-training: 2-4 hours for new features

Making Your Decision

Ask yourself:
1. How many people will use this system? (1-2 = Silver; 3+ = Gold)
2. Do you have multiple locations? (Yes = Gold)
3. What's your annual turnover? (<KES 5M = Silver; >KES 10M = Gold)
4. Are you planning to expand within 2 years? (Yes = Gold)
5. Does team need remote access? (Yes = Gold)

If you answered yes to 2+ questions above #2, choose Gold. Otherwise, Silver is perfect.

The Bottom Line

Don't overthink it. Both Silver and Gold are excellent investments. Silver gets you started affordably. Gold is when you've outgrown single-user limitations. Many successful businesses started with Silver and upgraded—that's perfectly normal.

Ready to get started? Our team can help you choose and implement the right edition for your situation.`},
    {id:'4',title:'What is EOS® and Why Kenyan Businesses Are Adopting It',slug:'what-is-eos-and-why-kenyan-businesses-are-adopting-it',excerpt:'The Entrepreneurial Operating System (EOS®) by Gino Wickman is transforming how leadership teams in Kenya run their businesses. Here\'s what it is and how to get started.',date:'2025-03-01',category:'EOS',readTime:'7 min',content:`The Entrepreneurial Operating System (EOS®) is a complete, practical system for running a business. Developed by Gino Wickman and detailed in his bestselling book \"Traction\", EOS is used by over 280,000 companies worldwide to get more of what they want from their businesses.

What Problem Does EOS Solve?

Most entrepreneurial businesses struggle with the same issues:
- Lack of clear vision shared by the whole team
- The wrong people in the wrong seats
- No reliable data to make decisions
- Issues that keep coming back without resolution
- Inconsistent processes
- Lack of execution and accountability

EOS addresses all six of these through its Six Key Components framework.

The Six Key Components of EOS®

1. Vision — Where are you going and how will you get there? EOS uses the Vision/Traction Organizer (V/TO) to capture your 10-year target, 3-year picture, 1-year plan, and 90-day Rocks.

2. People — The right people in the right seats. EOS uses the People Analyser and the GWC (Get it, Want it, Capacity to do it) framework to evaluate your team.

3. Data — A handful of numbers that give you a pulse on the business. Your EOS Scorecard tracks weekly metrics so you always know where you stand.

4. Issues — Identify, discuss, and solve issues permanently. The IDS (Identify, Discuss, Solve) process ensures problems don\'t recur.

5. Process — Document and follow your core processes. When everyone follows the same way, you get consistent, scalable results.

6. Traction — Execution. Rocks (90-day priorities), L10 meetings (weekly leadership meetings), and a meeting pulse that keeps the team focused and accountable.

How EOS Works with TallyPrime

TallyPrime gives you the financial and operational data. EOS gives you the management system to act on it. Your EOS Scorecard can pull key metrics directly from TallyPrime — sales, collections, inventory levels, payroll costs — giving your leadership team a real-time view of the business every week.

Getting Started with EOS in Kenya

Applying EOS® tools and principles, Optimum Prime Solutions can guide your leadership team through the full EOS journey. We start with a 90-minute introductory meeting, then a Focus Day, followed by quarterly and annual planning sessions over 12-24 months.

The result: a business where everyone is aligned, accountable, and moving in the same direction.

Ready to gain traction? Contact us to book your first EOS session.`},
    {id:'5',title:'TallyPrime Cloud Hosting: Access Your Business Data From Anywhere',slug:'tallyprime-cloud-hosting-access-your-business-data-from-anywhere',excerpt:'Learn how cloud-hosted TallyPrime gives your team secure, real-time access to accounting and inventory data from any location in Kenya and beyond.',date:'2025-03-15',category:'Cloud',readTime:'5 min',content:`One of the most common challenges for growing Kenyan businesses is data access. Your accountant is at the office, your sales manager is in the field, and you\'re at a client meeting — but the TallyPrime data is locked on one computer.

Cloud hosting solves this completely.

What is TallyPrime Cloud Hosting?

Instead of running TallyPrime on a local computer or office server, cloud hosting places TallyPrime on a secure remote server that your team can access from anywhere with an internet connection. All your data stays centralized, backed up, and available 24/7.

Benefits of TallyPrime Cloud Hosting

1. Access From Anywhere
Your accountant can work from home. Your MD can check reports from their phone. Branch managers can enter data from their location. Everyone works on the same live data.

2. Automatic Daily Backups
No more worrying about hard drive failures or accidental deletions. Your data is backed up automatically every day and stored securely off-site.

3. Multi-User Concurrent Access
With TallyPrime Gold on the cloud, multiple users can work simultaneously from different locations — perfect for businesses with branches across Kenya.

4. 99.9% Uptime SLA
Our cloud infrastructure is monitored 24/7. We guarantee 99.9% uptime so your business operations are never interrupted.

5. Disaster Recovery
In the event of a hardware failure, power outage, or cyber incident, your data is safe and can be restored quickly from our cloud backups.

Is Cloud Hosting Right for Your Business?

Cloud hosting is ideal if you:
✓ Have multiple branches or locations
✓ Have team members who work remotely
✓ Want the MD/owner to have real-time visibility on the go
✓ Are concerned about data security and backup
✓ Want to eliminate IT infrastructure costs

Getting Started

Our cloud hosting packages start from as low as KES 3,000 per month. Setup takes 1-2 days and includes migration of your existing TallyPrime data to the cloud, user access configuration, and training on remote access.

Contact us today to get your TallyPrime on the cloud.`},
    {id:'6',title:'TallyPrime 7.1 Is Here: What\'s New and What It Means for Your Business',slug:'tallyprime-71-is-here-whats-new-and-what-it-means-for-your-business',excerpt:'Tally Solutions has released TallyPrime 7.1 Beta with major upgrades to invoicing, banking, compliance, and reporting. Here\'s everything you need to know as a Kenyan business owner.',date:'2026-06-01',category:'Product Update',readTime:'6 min',content:`Tally Solutions has officially released TallyPrime 7.1 as an early access Beta — and it is packed with features that will make a real difference for Kenyan businesses.

As Kenya\'s certified TallyPrime partner, we have reviewed all the new features and here is what you need to know.

What\'s New in TallyPrime 7.1?

1. 8 Professional Invoice Print Templates
Your invoices now look as professional as your business. TallyPrime 7.1 includes eight ready-to-use invoice templates that you can personalise with your logo, watermark, brand colours, header and footer images, and terms & conditions. Set your preferred template as the default for each voucher type.

2. Scheduled Auto Backup
Never lose your business data again. TallyPrime 7.1 lets you schedule automatic backups to a local drive — set it once and your data is protected around the clock without any manual intervention.

3. Auto-Wrap Text
Long vendor names, item descriptions, narrations, and notes now wrap automatically across masters, transactions, reports, and printouts. No more truncated text — everything is fully readable at a glance.

4. Reuse Deleted Voucher Numbers
If a voucher is deleted, you can now reuse that voucher number across any voucher type. This keeps your numbering sequence clean, continuous, and audit-ready — particularly useful for businesses that issue sequential invoice numbers as required by KRA.

5. Flexible Discounts
Apply discounts in transactions as a percentage, an amount, or both — giving your sales team more flexibility when processing customer orders and quotations.

6. KRA eTIMS Compliance
TallyPrime continues to support Kenya Revenue Authority eTIMS e-invoicing requirements, ensuring your VAT invoices are generated and transmitted in the correct format. As your certified TallyPrime partner, we configure and maintain your eTIMS integration so you remain fully compliant.

7. Payroll Compliance — PAYE, NHIF, NSSF & Housing Levy
TallyPrime handles all Kenyan statutory deductions automatically — including the latest Housing Levy rates — so your payroll is always accurate and ready for KRA filing.

TallyPrime 7.1 Is Now Officially Released

TallyPrime 7.1 is now fully available. As your certified TallyPrime partner, we handle your upgrade seamlessly — including data migration, staff training, and post-upgrade support — with zero disruption to your business operations.

How to Get TallyPrime 7.1

Contact us to book an upgrade consultation. We will assess your current setup, plan the upgrade, and ensure everything runs smoothly from day one.

Ready to upgrade? Get in touch with our team today.`},
    {id:'7',title:'How TallyPrime Helps Distributors in Kenya Run a Leaner Business',slug:'how-tallyprime-helps-distributors-in-kenya',excerpt:'Discover how TallyPrime helps Kenyan distributors manage multi-location inventory, automate VAT and eTIMS compliance, and track field sales performance with the Biz Analyst app.',date:'2026-07-21',category:'Insights',readTime:'7 min',content:`Distributors sit at one of the toughest points in the supply chain — juggling inventory across multiple warehouses, invoicing hundreds of retailers, chasing outstanding payments, and staying compliant with KRA's eTIMS requirements. A single spreadsheet error or a delayed invoice can ripple through an entire distribution network. This is exactly where TallyPrime has become a go-to solution for distributors of all sizes — not just as accounting software, but as a complete business management tool. Our [TallyPrime implementation and support team in Kenya](/), has worked with over 50 distributors to solve exactly these challenges.

As Kenya's certified TallyPrime partner, Optimum Prime Solutions is the go-to team distributors turn to for getting this right — from licensing and implementation through to ongoing support. Here is what changes when a distributor runs on TallyPrime.

1. Real-Time Inventory Visibility Across Locations
Distributors typically manage stock across multiple godowns, branches, or warehouses. TallyPrime lets you track inventory in real time — by location, batch, expiry date, and even serial number. You always know what's in stock, what's moving fast, and what needs reordering, without physically checking every warehouse.

2. Faster, Error-Free Billing
With hundreds of SKUs and varying price lists for different retailers or regions, manual billing is a recipe for errors. TallyPrime supports multiple price levels, bulk discounts, and scheme-based pricing, so invoices go out accurately and quickly — even during peak order volumes.

3. Simplified VAT and eTIMS Compliance
Tax compliance is one of the biggest headaches for distributors handling large transaction volumes. TallyPrime automates VAT calculations, generates KRA-ready reports for VAT returns filed through iTax, and supports compliant electronic tax invoicing in line with KRA's eTIMS requirements. It also flags mismatches before they become filing problems — saving distributors hours of manual reconciliation every month.

4. Better Credit and Receivables Management
Distributors often extend credit to dozens or hundreds of retailers. TallyPrime's outstanding management and ageing analysis reports make it easy to see who owes what, for how long, and set credit limits automatically — reducing bad debt and improving cash flow.

5. Multi-User, Multi-Location Access
As distribution businesses grow, so does the need for multiple people — salespeople, warehouse staff, accountants — to access the system simultaneously. TallyPrime supports multi-user environments with role-based access, so the right people see the right data without compromising control.

6. Profitability Tracking with Cost Centres
Distributors rarely run just one uniform business — there are different routes, vans, territories, sales reps, or product lines, each with its own cost and revenue profile. TallyPrime's cost centre feature lets you tag every transaction to a specific route, rep, branch, or product category, so you can see exactly which parts of the business are profitable — without maintaining separate books for each.

7. Field Sales Tracking and Commission Payouts with Biz Analyst
For most distributors, the sales team is the hardest part of the business to see. Reps are out on the road all day, and management often relies on end-of-day call reports or month-end totals to judge how things went. Pairing TallyPrime with the Biz Analyst mobile app closes that blind spot.
- Live visibility, from anywhere — stock, outstanding balances, ledgers, and sales figures on the owner's or manager's phone in real time.
- GPS tracking of the sales team — see which retailers a rep actually visited, time spent per stop, and whether movement matches the planned route.
- Real profit visibility, per sale — an add-on layer computes the actual margin behind each sale, factoring in cost price, scheme discounts, and final selling price, not just the revenue total.
- Commission tied to profit, not turnover — profit data feeds an automated commission structure with slabs or percentages by product or category, calculated and settled without manual spreadsheet work.
- Why it matters commercially — revenue-only incentive schemes quietly reward over-discounting. Tying pay to actual profit, backed by GPS-verified activity, aligns sales behaviour with what keeps the business healthy.

8. Actionable Reports Without Extra Effort
TallyPrime generates ready-to-use reports — stock summaries, sales analysis, profitability by product or customer, and cash flow statements — without needing a data analyst. Distributors can make faster decisions on what to stock, who to extend credit to, and where margins are shrinking.

9. Affordable and Scalable
Unlike heavyweight ERP systems, TallyPrime is affordable to license and quick to deploy, yet scales well as a distribution business adds more SKUs, locations, or staff — enterprise-grade capability without enterprise-grade cost or complexity.

The Bottom Line
For distributors, the real value of TallyPrime is not just bookkeeping — it is the ability to run a leaner, more visible, more compliant operation without hiring a large back-office team. Real-time stock data, automated VAT compliance, cost centre-level profitability, and field sales visibility through Biz Analyst translate directly into fewer errors, faster cash cycles, better-motivated sales teams, and smarter decisions.

Ready to bring this to your distribution business? Talk to Kenya's certified TallyPrime partner today.`},
    {id:'8',title:'Converting from Sole Proprietorship to a Limited Company: What KRA Expects',slug:'sole-proprietorship-to-limited-company-kenya-kra-stock-transfer',excerpt:'Registering the company and getting a new KRA PIN are the easy, visible steps. Here is the paper trail most Kenyan business owners forget — moving stock from a personal PIN to the company PIN.',date:'2026-07-21',category:'Compliance',readTime:'7 min',content:`Growing past a sole proprietorship into a limited company is one of the healthiest moves a business owner can make. It separates your personal liability from the business, makes you more credible to banks, suppliers, and tenders, and sets you up to bring in partners or investors later.

Most owners get the visible parts right: registering the company at the Business Registration Service (BRS) via eCitizen, applying for a new KRA PIN, and opening a company bank account. What trips people up is everything that happens quietly in the background — especially what becomes of the stock, equipment, and assets that were bought and sold under your personal PIN for years before the company existed.

Register the Company as a Separate Legal Entity

A limited company is not "your business with a new name" — it is a completely new legal person under the Companies Act, 2015. Register it via eCitizen/BRS with its own memorandum, directors, and shareholding structure. Until this is done, nothing else in this process can happen, because there is no second entity for anything to be transferred to.

Apply for a Brand-New Company KRA PIN

The company gets its own PIN on iTax — entirely separate from your personal PIN, even though you may be the sole director and shareholder. This is the detail many owners misunderstand: to KRA, you (the individual) and the company are two different taxpayers from day one, even if the same person signs both.

The Step Almost Everyone Forgets: Selling Your Stock from Personal PIN to Company PIN

This is where most conversions quietly go wrong. If you simply keep trading the same stock under the new company name without any paper trail, KRA sees inventory appear in the company's hands with no purchase invoice behind it, and no corresponding sale recorded under your personal PIN.

- Treat it as a genuine sale — because to KRA, it is one. Your sole proprietorship (personal PIN) sells the existing stock to the new company (company PIN) at a fair value, exactly as you would to any other buyer.
- Issue a proper eTIMS invoice — the sale must be captured through eTIMS under your personal PIN, with the company as the buyer, so the transaction is visible on both sides of iTax.
- Declare output VAT on your side, if VAT registered — the transfer is a taxable supply. Skipping this doesn't avoid the VAT; it just means KRA calculates it for you later, with penalties and interest attached.
- Give the company a legitimate opening stock figure — the invoice becomes the company's purchase record and input VAT claim, and its documented starting inventory for future audits.

Why it matters: without this trail, a VAT or income tax audit finds stock movement and bank deposits with no invoices to explain them. That reads as unexplained income or undeclared sales, and KRA will assess tax on the worst-case interpretation, not the true one.

Transfer Other Business Assets the Same Way

Vehicles, machinery, furniture, and equipment bought under the sole proprietorship need the same treatment as stock — a documented sale or capital contribution from you to the company, with a value assigned and, where applicable, VAT and capital gains implications considered. Log-books, asset registers, and insurance need updating to reflect the company as the new owner.

Move Banking, Contracts, and Licenses Over

Open a company bank account and route all business income and expenses through it — mixing personal and company funds after conversion is one of the fastest ways to lose the legal protection a limited company is supposed to give you. Supplier agreements, leases, trading licenses, and county permits should be re-issued or formally novated in the company's name, not left running on the old sole proprietorship.

Transfer Staff, NSSF, and SHIF Registrations

Employees technically move from being employed by you personally to being employed by the company. Update NSSF, SHIF (formerly NHIF), and PAYE registrations accordingly, and issue new employment contracts under the company's name so statutory deductions are remitted against the correct employer PIN.

Close Out the Sole Proprietorship's Tax Obligations

Don't let the old business name go quiet while unfiled. File final VAT and income tax returns for the sole proprietorship up to the point of transfer, settle any outstanding tax compliance certificate (TCC) requirements, and formally deregister or cease the business name registration where it's no longer trading, so it doesn't sit as a loose thread KRA later flags as non-compliance.

Bring in an Accountant Before You Convert, Not After

The valuation used for the stock and asset transfer, the VAT treatment, and the timing of the switch all have tax consequences that are far cheaper to plan for than to fix during an audit. A few hours with an accountant or tax agent before you flip the switch is far less costly than a KRA assessment after the fact.

The Bottom Line

Converting to a limited company is a legal and tax event, not just a rebrand. The registration and the new PIN are the easy, visible parts — the part that actually protects you from KRA is making sure the paper trail between your old personal PIN and your new company PIN is clean, especially for stock and assets. Get that documented properly at the point of conversion, and the switch strengthens your business. Skip it, and it becomes the exact gap an audit is designed to find.

This article is general guidance and not a substitute for advice from a licensed accountant or tax agent — speak to a professional about your specific figures and filing dates.

Ready to upgrade to a limited company structure? Our [certified TallyPrime implementation team in Kenya](/), can help you migrate your accounting records, ensure KRA compliance throughout the transition, and train your team on the new system. [Book a free consultation with our experts](/contact#demo-form)—no obligation.`},
    {id:'9',title:'TallyPrime Reports Every Business Owner Should Know',slug:'tallyprime-reports-every-business-owner-should-know',excerpt:'From P&L to Funds Flow, here are the TallyPrime reports that separate business owners who catch problems early from those who find out too late.',date:'2026-07-21',category:'Tips',readTime:'6 min',content:`Most business owners open TallyPrime once a month — usually when the accountant needs a signature or the auditor wants a number. That's a missed opportunity. TallyPrime isn't just a data-entry tool for your bookkeeper; it's a reporting engine that can tell you, in real time, whether your business is healthy, where cash is leaking, and which product, customer, or branch is actually making you money.

Here are the reports worth 20 minutes of your time every month.

## 1. Profit & Loss Account — "Am I actually making money?"

The P&L (Gateway of Tally → Profit & Loss A/c) shows your income, direct and indirect expenses, and net profit or loss for a period. It's the most-checked report for a reason — it answers the first question every owner asks.

**What to actually look for:** Don't just check the bottom line. Compare this month against last month and against the same month last year (TallyPrime lets you view multiple periods side by side). A profit that looks fine on paper but is shrinking as a percentage of sales is an early warning sign that expenses are creeping.

## 2. Balance Sheet — "What do I own, and what do I owe?"

The Balance Sheet is a snapshot, not a story — it shows assets, liabilities, and capital as of a specific date. Where owners get into trouble is treating profit and cash as the same thing. A business can show a healthy P&L and still have a Balance Sheet loaded with unpaid receivables and shrinking cash — which is exactly why the next report matters more than most owners realize.

## 3. Cash Flow Statement — "Where did the cash actually go?"

Cash Flow (Gateway of Tally → Display More Reports → Cash Flow) tracks the actual movement of cash in and out of your bank and cash accounts, split into operating, investing, and financing activities. This is the report that catches the classic trap: profitable on paper, broke in the bank — usually because money is sitting in unpaid invoices, excess stock, or loan repayments that don't show up in the P&L at all.

## 4. Funds Flow Statement — and how it's different from Cash Flow

This is the one most owners mix up, so it's worth being precise about.

- **Cash Flow** tracks movement of *cash* only — actual rupees/shillings in and out of cash and bank accounts, over a period.
- **Funds Flow** tracks movement of *working capital* — it compares two Balance Sheet dates and shows where your **net working capital** (current assets minus current liabilities) came from and where it went, including non-cash items like a rise in receivables or a new long-term loan.

In practice: Cash Flow tells you why your bank balance moved. Funds Flow tells you why your *financial position* moved — including changes that never touched the bank account, like stock building up or debtors not paying. Cash Flow is a short-term, operational lens; Funds Flow is a structural, medium-term lens. A business can have a "flat" cash flow quarter and still have a Funds Flow statement revealing that working capital is quietly being sucked into inventory or debtors — a problem Cash Flow alone won't show clearly.

If cash flow is your monthly check-up, funds flow is closer to a structural X-ray — run it quarterly.

## 5. Stock Summary — "What's actually sitting on my shelves?"

Stock Summary (Gateway of Tally → Stock Summary) gives you real-time inventory value, quantity, and movement by item, group, or godown. Drill down into it for:

- **Ageing analysis** — stock that hasn't moved in 90+ days is tied-up cash, not an asset.
- **Fast vs. slow movers** — reallocate purchasing budget toward what's actually selling.
- **Negative stock warnings** — a sign of billing errors or theft worth investigating immediately.

## 6. Cost Centre / Cost Category Reports — "Which part of the business is earning its keep?"

If you've set up Cost Centres (departments, projects, sales reps, product lines), TallyPrime can break P&L numbers down by each one. This turns a single blended profit number into a map: which sales rep is actually profitable, which project is bleeding money, which department is overstaffed relative to what it brings in. Most owners set up cost centres and then never look at the reports they generate — that's the expensive mistake, not the setup itself.

## 7. Location / Godown-wise Reports — "Which branch is carrying the business?"

For multi-branch or multi-warehouse businesses, Location/Godown-wise reports (stock, sales, and P&L split by location) reveal what a consolidated report hides: one branch subsidizing another, stock imbalances between locations, or a warehouse with disproportionate losses or shrinkage. If you operate more than one outlet and you're only looking at the combined P&L, you're flying blind on which location actually deserves the next investment.

## 8. Budgets vs. Actuals — "Did we stick to the plan?"

TallyPrime lets you set budgets against ledgers, cost centres, or groups, then run Budget vs. Actual comparisons. This flips reporting from reactive to proactive — instead of discovering an overspend in next month's P&L, you catch it mid-month while there's still time to correct course. Set budgets at the start of the year, review variance monthly, and use recurring overruns as a trigger to either fix a process or revise the budget itself.

## 9. Outstanding Receivables & Payables (Bills Payable/Receivable)

Easy to overlook, hard to overstate. The Outstanding reports (Gateway of Tally → Display More Reports → Statements of Accounts) show exactly who owes you money and how overdue it is, and what you owe suppliers and when it's due. Paired with an ageing analysis, this is often the single fastest way to improve cash position — chasing a 60-day-overdue invoice usually beats chasing a new sale.

## The habit that actually matters

None of these reports need to be read daily. What separates owners who use Tally well from owners who just use it to file returns is a simple monthly rhythm:

1. P&L and Balance Sheet — health check
2. Cash Flow and Funds Flow — where the money actually moved, and why
3. Stock Summary and Outstanding reports — what's tying up cash
4. Cost Centre / Location reports — what's actually profitable
5. Budget vs. Actual — course-correct before the quarter closes

Twenty minutes a month, same day every month, is enough to catch most problems while they're still cheap to fix.`},
  ],
  leads: [],
  wipJobs: [],
};

const KEY = 'ops_site_v2';
export const load = (): SiteData => { try { const r=localStorage.getItem(KEY); if(r){ const p=JSON.parse(r); return {...defaultData,...p, leads:p.leads||[], wipJobs:p.wipJobs||[]}; } } catch{} return defaultData; };
export const save = (d: SiteData) => localStorage.setItem(KEY, JSON.stringify(d));
