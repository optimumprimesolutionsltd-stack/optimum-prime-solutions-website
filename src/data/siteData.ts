export interface ServiceItem { id:string; title:string; desc:string; icon:string; features:string[]; link?:string }
export interface ProductItem { id:string; name:string; edition:string; price:string; period:string; features:string[]; popular?:boolean; cta:string }
export interface TestimonialItem { id:string; name:string; role:string; company:string; text:string; rating:number }
export interface FaqItem { id:string; q:string; a:string; cat:string }
export interface IndustryItem { id:string; name:string; icon:string; desc:string }
export interface BlogPost { id:string; title:string; excerpt:string; date:string; category:string; readTime:string; content:string; youtubeUrl?:string }
export interface Lead { id:string; name:string; company:string; phone:string; email:string; businessType:string; demoDate:string; currentSoftware:string; message:string; createdAt:string; status:string }
export interface ContactInfo { location:string; phones:string[]; emails:string[]; workingHours:string[]; whatsapp:string; mapUrl:string }
export interface CompanyInfo { name:string; tagline:string; mission:string; vision:string; about:string[]; stats:{label:string;value:string}[] }

export interface SiteData {
  company: CompanyInfo; contact: ContactInfo; services: ServiceItem[]; products: ProductItem[];
  testimonials: TestimonialItem[]; faqs: FaqItem[]; industries: IndustryItem[];
  blogs: BlogPost[]; leads: Lead[];
  // Optional mapping of page/theme -> hero image URL (use real photos of African users)
  heroImages?: Record<string, string>;
}

export const defaultData: SiteData = {
  company: {
    name:'Optimum Prime Solutions',
    tagline:'Certified TallyPrime Partner · Cloud Hosting · EOS® Consulting',
    mission:'To empower Kenyan businesses with world-class TallyPrime solutions, secure cloud infrastructure, and the Entrepreneurial Operating System (EOS®) — helping leadership teams get aligned, gain traction, and achieve sustainable growth.',
    vision:'To be the leading TallyPrime partner and EOS® consulting firm in East Africa, transforming how businesses manage their finances, operations, and leadership systems.',
    about:[
      'Optimum Prime Solutions is Kenya\'s certified TallyPrime partner, delivering end-to-end business automation and cloud solutions. With over 15 years of combined experience, our certified team has helped 500+ businesses across East Africa transform their operations using TallyPrime Silver, Gold, and Enterprise editions.',
      'Beyond accounting software, we are licensed EOS® implementers — helping entrepreneurial leadership teams run their businesses on the Entrepreneurial Operating System by Gino Wickman. EOS strengthens the Six Key Components of any business: Vision, People, Data, Issues, Process, and Traction. We combine TallyPrime\'s financial power with EOS® operational discipline to give your business both the numbers and the systems to grow.',
    ],
    stats:[{label:'Clients Served',value:'500+'},{label:'Years Experience',value:'15+'},{label:'Uptime Guarantee',value:'99.9%'},{label:'Support Response',value:'< 1hr'}],
  },
  contact: {
    location:'Ruiru, Kenya',
    phones:['+254 116 246 074','+254 727 209 720'],
    emails:['optimumprimesolutionsltd@gmail.com','Info@optimumprimesolutionsltd.co.ke'],
    workingHours:['Mon – Fri: 8:00 AM – 6:00 PM','Sat: 9:00 AM – 1:00 PM'],
    whatsapp:'254116246074',
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
    {id:'7',title:'Remote & On-site Support',desc:'24/7 remote assistance plus scheduled on-site visits. Average response time under 1 hour.',icon:'Headphones',features:['24/7 remote support','On-site visits','Software updates','Troubleshooting'],link:'https://tallysolutions.com/ssa/download/?srsltid=AfmBOooMSwVbv50rP24g8n8IKqi92cdz3NFhSuqpfprrxIcgj7DZLXym'},
    {id:'8',title:'EOS® Business Operating System',desc:'We are certified EOS implementers. Help your leadership team get aligned, gain traction, and achieve your vision using the Entrepreneurial Operating System by Gino Wickman.',icon:'BarChart3',features:['EOS® full implementation','Vision/Traction Organizer (V/TO)','Rocks & accountability meetings','L10 meeting cadence','People Analyser & RPRS','Quarterly & annual planning'],link:'/contact'},
    {id:'9',title:'TallyPrime Cloud Hosting',desc:'Access your TallyPrime data securely from anywhere. We set up and manage cloud infrastructure so your team can work remotely without compromising data security.',icon:'Cloud',features:['Cloud server setup','Remote access configuration','Automated daily backups','99.9% uptime SLA','Multi-user concurrent access','Disaster recovery planning'],link:'/contact'},
    {id:'10',title:'HubSpot CRM Integration',desc:'We implement and integrate HubSpot CRM with TallyPrime to give your business a 360° view — from first lead to final payment. Manage your sales pipeline, customer relationships, and financial data in one connected ecosystem.',icon:'Users',features:['HubSpot CRM setup & onboarding','TallyPrime + HubSpot data sync','Sales pipeline & deal tracking','Customer communication history','Automated follow-up sequences','Reporting across CRM & accounts'],link:'/contact'},
  ],
  products: [
    {id:'1',name:'TallyPrime',edition:'Silver',price:'KES 57,600 +VAT',period:'one-time license',features:['Single user license','Full accounting & invoicing','Inventory & stock reports','KRA VAT & eTIMS ready','Payroll — PAYE, NHIF, NSSF','Free updates for 1 year','Email & remote support'],cta:'Get Silver'},
    {id:'2',name:'TallyPrime',edition:'Gold',price:'KES 172,800 +VAT',period:'one-time license',popular:true,features:['Unlimited multi-user access','All Silver features included','Multi-location inventory control','Advanced user roles & security','Remote data access setup','Priority implementation support','On-site team training included'],cta:'Get Gold — Best Value'},
    {id:'3',name:'TallyPrime',edition:'Cloud Hosting',price:'From KES 8,000',period:'per month',features:['Secure cloud server setup','Remote access from any device','Automated daily backups','99.9% uptime SLA guarantee','Multi-user concurrent access','Disaster recovery planning','Monthly system health checks'],cta:'Start Cloud Hosting'},
    {id:'4',name:'EOS®',edition:'Implementation',price:'Contact for Quote',period:'per engagement',features:['Full EOS® implementation program','Vision/Traction Organizer (V/TO)','Rocks & 90-day priority setting','L10 weekly leadership meetings','People Analyser & accountability','Quarterly & annual planning days','Certified EOS Implementer® led'],cta:'Book EOS Session'},
  ],
  testimonials: [
    {id:'1',name:'James Mwangi',role:'CEO',company:'Mwangi Enterprises Ltd',text:'Optimum Prime Solutions transformed our accounting. The KRA compliance module alone has saved us countless hours. Their team is professional and responsive.',rating:5},
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
    {id:'7',q:'Do you offer after-sales support?',a:'Absolutely. We provide 24/7 remote support with average response under 1 hour, plus scheduled on-site visits. Support plans start from KES 5,000/month.',cat:'Support'},
    {id:'8',q:'Can I migrate from Excel or other software?',a:'Yes, we handle full data migration from Excel, spreadsheets, and other systems. All historical data is accurately transferred with zero downtime, ensuring no loss of critical information.',cat:'Services'},
    {id:'9',q:'Is my data secure?',a:'Tally Prime provides enterprise-grade security with role-based access, audit trails, encrypted storage, and automated backups. We also set up disaster recovery plans.',cat:'Security'},
    {id:'10',q:'Do you serve businesses outside Nairobi?',a:'Yes! We serve clients across Kenya and East Africa. Remote support is available nationwide, and we schedule on-site visits for implementation anywhere in the region.',cat:'General'},
    {id:'11',q:'Which Tally Prime edition is best for my business?',a:'We recommend Tally Prime Silver for single-user small businesses and Tally Prime Gold for multi-user teams with remote access needs. For branch operations or advanced reporting, we often advise Plus or Enterprise deployments.',cat:'Products'},
    {id:'12',q:'Can Tally Prime integrate with our POS or bank systems?',a:'Yes. We build Tally Prime integrations using custom TDL and available APIs so your POS, banking, or payment systems sync with accounting and inventory data automatically.',cat:'Integration'},
    {id:'13',q:'How do you train our staff on Tally Prime?',a:'We provide tailored training sessions for accountants, managers, and operations teams. Training is available on-site or remote and includes real-world workflows, compliance reports, and support best practices.',cat:'Training'},
    {id:'14',q:'What support options do you offer after implementation?',a:'We offer support plans covering remote assistance, regular health checks, software updates, and on-site visits. Our support response is typically under 1 hour for urgent issues.',cat:'Support'},
    {id:'15',q:'How can I access Tally Prime remotely?',a:'Tally Prime Gold supports remote access. We can also set up secure cloud hosting so your team accesses Tally Prime from multiple locations while keeping your data centralized and backed up.',cat:'Remote Access'},
    {id:'16',q:'What is EOS® and how can it help my business?',a:'EOS® (Entrepreneurial Operating System) is a complete business operating system developed by Gino Wickman and detailed in his book \"Traction\". It strengthens the Six Key Components of any business: Vision, People, Data, Issues, Process, and Traction. As certified EOS implementers, we help your leadership team get aligned on where the business is going, who is doing what, and how you will get there — through proven tools like the Vision/Traction Organizer (V/TO), Rocks, L10 meetings, and the People Analyser.',cat:'EOS'},
    {id:'17',q:'How does EOS® work with TallyPrime?',a:'EOS® provides the operating system for your leadership team — clarity on vision, accountability, and meeting rhythms. TallyPrime provides the financial and operational data that feeds into your EOS scorecards and dashboards. Together, they give your business both the management discipline and the real-time numbers to make better decisions faster.',cat:'EOS'},
    {id:'18',q:'What is the EOS® implementation process?',a:'Our EOS® implementation typically runs over 12–24 months. We start with a 90-minute meeting to introduce the tools, then a Focus Day to align the leadership team, followed by quarterly and annual planning sessions. Between sessions, we coach your team on running L10 meetings, setting 90-day Rocks, and using the People Analyser. The result is a business that runs on a consistent, proven rhythm.',cat:'EOS'},
    {id:'19',q:'Do you offer TallyPrime cloud hosting?',a:'Yes! We set up and manage secure cloud servers for TallyPrime so your team can access data from anywhere. Our cloud hosting includes automated daily backups, 99.9% uptime SLA, multi-user concurrent access, and disaster recovery planning. Pricing starts from KES 8,000 per month depending on the number of users and data volume.',cat:'Cloud'},
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
    {id:'1',title:'Why Every Kenyan Business Needs Tally Prime in 2025',excerpt:'Discover how Tally Prime is transforming business operations across Kenya with automated accounting, KRA compliance, and real-time reporting.',date:'2025-01-15',category:'Insights',readTime:'5 min',content:`Tally Prime has become the backbone of business operations across Kenya. Whether you're a small retail shop, a manufacturing facility, or a growing services company, the need for accurate financial management and KRA compliance is non-negotiable.

Why should your business invest in Tally Prime in 2025?

1. KRA Compliance Made Easy
Kenya's tax environment demands precision. Tally Prime simplifies VAT calculations, PAYE processing, and e-filing integration. The eTIMS module ensures real-time invoice tracking, and automated compliance reports keep your business audit-ready. No more manual calculations or missed deadlines.

2. Real-Time Business Insights
Stop relying on spreadsheets. Tally Prime provides instant access to your:
- Daily sales and expense reports
- Inventory levels across multiple locations
- Cash flow projections
- Profit & loss statements
- Customer and supplier analyses

Decision-making becomes data-driven, not guesswork-based.

3. Inventory Management at Scale
Whether you have 1 warehouse or 10 branches, Tally Prime tracks inventory in real-time. Automated reorder points prevent stockouts, batch management prevents expired stock, and multi-location visibility ensures optimal stock distribution.

4. Automated Payroll Processing
Calculating payroll manually is error-prone and time-consuming. Tally Prime automates:
- Salary calculations
- PAYE, NHIF, NSSF, and Housing Levy deductions
- Statutory compliance
- Leave management
- Payslip generation

Your HR team gains 3+ hours daily that can be redirected to strategic work.

5. Cost Reduction & Efficiency
Implementing Tally Prime typically reduces operational costs by 15-25% through:
- Reduced data entry errors (95% fewer manual entries)
- Faster month-end closing (from 5 days to 1 day)
- Minimized accounting staff requirements
- Fewer compliance penalties and fines

6. Scalability Built-In
As your business grows, Tally Prime grows with you. Multi-user access, role-based controls, and unlimited transaction capacity ensure you're never outgrowing your system.

The Bottom Line
In 2025, manual accounting is not just inefficient—it's risky. Tally Prime eliminates operational friction, ensures compliance, and gives you the visibility needed to scale confidently.

Ready to transform your business? The businesses that embrace Tally Prime this year will be the ones leading their industries next year.`},
    {id:'2',title:'Complete Guide to KRA e-Filing with Tally Prime',excerpt:'Step-by-step guide to setting up and filing your KRA returns directly from Tally Prime. Save time and avoid penalties.',date:'2025-02-01',category:'Tutorial',readTime:'8 min',content:`KRA compliance can be intimidating, but with Tally Prime, it's surprisingly straightforward. This guide walks you through the entire e-filing process.

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
    {id:'3',title:'Tally Prime Silver vs Gold: Which Edition Is Right for You?',excerpt:'A detailed comparison of Tally Prime Silver and Gold editions to help you choose the perfect solution for your business size.',date:'2025-02-15',category:'Comparison',readTime:'6 min',content:`Choosing between Tally Prime Silver and Gold is one of the first decisions you'll make. This comprehensive comparison helps you pick the right fit for your business.

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
    {id:'4',title:'What is EOS® and Why Kenyan Businesses Are Adopting It',excerpt:'The Entrepreneurial Operating System (EOS®) by Gino Wickman is transforming how leadership teams in Kenya run their businesses. Here\'s what it is and how to get started.',date:'2025-03-01',category:'EOS',readTime:'7 min',content:`The Entrepreneurial Operating System (EOS®) is a complete, practical system for running a business. Developed by Gino Wickman and detailed in his bestselling book \"Traction\", EOS is used by over 280,000 companies worldwide to get more of what they want from their businesses.

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

As certified EOS implementers, Optimum Prime Solutions can guide your leadership team through the full EOS journey. We start with a 90-minute introductory meeting, then a Focus Day, followed by quarterly and annual planning sessions over 12-24 months.

The result: a business where everyone is aligned, accountable, and moving in the same direction.

Ready to gain traction? Contact us to book your first EOS session.`},
    {id:'5',title:'TallyPrime Cloud Hosting: Access Your Business Data From Anywhere',excerpt:'Learn how cloud-hosted TallyPrime gives your team secure, real-time access to accounting and inventory data from any location in Kenya and beyond.',date:'2025-03-15',category:'Cloud',readTime:'5 min',content:`One of the most common challenges for growing Kenyan businesses is data access. Your accountant is at the office, your sales manager is in the field, and you\'re at a client meeting — but the TallyPrime data is locked on one computer.

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

Our cloud hosting packages start from KES 8,000 per month. Setup takes 1-2 days and includes migration of your existing TallyPrime data to the cloud, user access configuration, and training on remote access.

Contact us today to get your TallyPrime on the cloud.`},
    {id:'6',title:'TallyPrime 7.1 Is Here: What\'s New and What It Means for Your Business',excerpt:'Tally Solutions has released TallyPrime 7.1 Beta with major upgrades to invoicing, banking, compliance, and reporting. Here\'s everything you need to know as a Kenyan business owner.',date:'2026-06-01',category:'Product Update',readTime:'6 min',content:`Tally Solutions has officially released TallyPrime 7.1 as an early access Beta — and it is packed with features that will make a real difference for Kenyan businesses.

As Kenya\'s certified TallyPrime partner, we have reviewed all the new features and here is what you need to know.

What\'s New in TallyPrime 7.1?

1. 8 Professional Invoice Print Templates
Your invoices now look as professional as your business. TallyPrime 7.1 includes eight ready-to-use invoice templates that you can personalise with your logo, watermark, brand colours, header and footer images, and terms & conditions. Set your preferred template as the default for each voucher type.

2. Connected Banking — Now with ICICI Bank
TallyPrime 7.1 extends its connected banking ecosystem to include ICICI Bank, joining Axis Bank, State Bank of India, and Kotak Mahindra Bank. You can now initiate direct payments, view real-time account balances, and reconcile transactions — all without leaving TallyPrime.

3. HSN/SAC Online Validation
Validate your HSN and SAC codes directly within TallyPrime using live data from the GST portal. This ensures your invoices and returns are always accurate and reduces the risk of compliance notices.

4. Schedule III Financial Statements
For companies with net worth below Rs 250 Crore, TallyPrime 7.1 introduces an Excel-based tool to generate Schedule III compliant financial statements — ready for auditors and stakeholders.

5. IMS Reconciliation Upgrades
The Inward Supplies (IMS) module now lets you fetch supplier details using GSTIN directly from the GST portal, even if the party ledger is not yet created. A new Books View shows reconciled, mismatched, and unmatched vouchers at a glance.

6. Auto-Wrap Text
Long vendor names, descriptions, and notes now wrap automatically across reports and printouts — no more truncated text.

7. Flexible Discounts & Voucher Enhancements
Apply discounts as a percentage, an amount, or both in purchase and sales transactions. Reuse deleted voucher numbers to maintain clean numbering sequences.

When Will TallyPrime 7.1 Be Fully Released?

TallyPrime 7.1 is currently in Beta (early access). The full release is expected soon. As your certified TallyPrime partner, we will handle your upgrade seamlessly — including data migration, staff training, and post-upgrade support.

How to Get TallyPrime 7.1

You can download the Beta directly from the official Tally Solutions website at: https://tallysolutions.com/download-tallyprime-7-1-beta/

Or contact us to book an upgrade consultation. We will assess your current setup, plan the upgrade, and ensure zero disruption to your business operations.

Ready to upgrade? Get in touch with our team today.`},
  ],
  leads: [],
};

const KEY = 'ops_site_v2';
export const load = (): SiteData => { try { const r=localStorage.getItem(KEY); if(r){ const p=JSON.parse(r); return {...defaultData,...p, leads:p.leads||[]}; } } catch{} return defaultData; };
export const save = (d: SiteData) => localStorage.setItem(KEY, JSON.stringify(d));
