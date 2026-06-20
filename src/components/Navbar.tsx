import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Zap, Cloud, Users, BookOpen, HelpCircle, Mail, BarChart3, Cpu, Shield, Briefcase } from 'lucide-react';
import Logo from './Logo';

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: null,
    submenu: null,
  },
  {
    label: 'About',
    href: '/about',
    icon: Briefcase,
    submenu: null,
  },
  {
    label: 'Services',
    href: '/features',
    icon: Zap,
    submenu: [
      { label: 'TallyPrime Setup', desc: 'Complete installation & configuration', icon: BarChart3, href: '/features#service-1' },
      { label: 'Cloud Hosting', desc: 'Secure remote access & backups', icon: Cloud, href: '/features#service-9' },
      { label: 'Payroll Systems', desc: 'KRA-compliant payroll automation', icon: Users, href: '/features#service-3' },
      { label: 'KRA Compliance', desc: 'VAT & eTIMS integration', icon: Shield, href: '/features#service-5' },
    ],
  },
  {
    label: 'Products',
    href: '/products',
    icon: Cpu,
    submenu: [
      { label: 'TallyPrime Silver', desc: 'Single-user accounting solution', icon: Zap, href: '/products' },
      { label: 'TallyPrime Gold', desc: 'Multi-user with advanced features', icon: BarChart3, href: '/products' },
      { label: 'Cloud Hosting', desc: 'From KES 3,000/month', icon: Cloud, href: '/products' },
      { label: 'EOS® Consulting', desc: 'Business operating system', icon: Briefcase, href: '/products' },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
    icon: BookOpen,
    submenu: null,
  },
  {
    label: 'FAQ',
    href: '/faq',
    icon: HelpCircle,
    submenu: null,
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: Mail,
    submenu: null,
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-sm bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-900/80 border-b border-white/10 ${scrolled ? 'shadow-[0_20px_80px_-40px_rgba(15,23,42,0.16)] border-slate-200/20' : 'shadow-none'}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-[72px] flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 flex-shrink-0">
            <Logo className="h-10 sm:h-12 w-auto" variant="full" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to={item.href}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    location.pathname === item.href
                      ? 'text-red-400 bg-red-600/10 border border-red-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                  {item.submenu && <span className="text-xs ml-1">▼</span>}
                </Link>

                {/* Mega Menu Dropdown */}
                {item.submenu && (
                  <AnimatePresence>
                    {activeMenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-80 rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 shadow-2xl shadow-black/50 p-4 space-y-2"
                        onMouseEnter={() => setActiveMenu(item.label)}
                        onMouseLeave={() => setActiveMenu(null)}
                      >
                        {item.submenu.map((subitem, idx) => (
                          <Link
                            key={subitem.label}
                            to={subitem.href || item.href}
                            onClick={() => { setActiveMenu(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="block p-3 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer group/item"
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-1 p-2 rounded-lg bg-slate-700/50 group-hover/item:bg-red-600/20 transition-all">
                                <subitem.icon className="h-4 w-4 text-slate-300 group-hover/item:text-red-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-white group-hover/item:text-red-400 transition-all">{subitem.label}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{subitem.desc}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* CTA + Mobile Menu Button */}
          <div className="flex items-center gap-3 ml-auto">
            <a
              href="tel:+254116246074"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition text-sm font-medium border border-red-500/20"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden md:inline">+254 116 246 074</span>
            </a>

            <button
              onClick={() => setOpen((prev) => !prev)}
              className="lg:hidden p-2 text-white transition hover:text-sky-400"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-gradient-to-b from-slate-900/98 via-slate-900/95 to-slate-900/90"
          >
            <div className="px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Menu</p>
              </div>
              <div className="max-h-[60vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-800/90 p-3 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <div key={item.label}>
                      <Link
                        to={item.href}
                        onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                          isActive ? 'bg-red-600/20 text-red-400 border border-red-500/20' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                      </Link>

                      {/* Mobile Submenu */}
                      {item.submenu && (
                        <div className="ml-4 mt-2 space-y-1 border-l border-slate-700 pl-3">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.label}
                              to={subitem.href || item.href}
                              onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                              className="block p-2 rounded-lg bg-slate-700/30 text-xs text-slate-300 hover:bg-slate-700 transition"
                            >
                              <p className="font-medium text-slate-200">{subitem.label}</p>
                              <p className="text-slate-400 mt-0.5">{subitem.desc}</p>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
