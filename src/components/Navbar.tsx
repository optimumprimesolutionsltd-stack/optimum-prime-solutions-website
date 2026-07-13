import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from './Logo';

interface NavChild {
  label: string;
  href: string;
  desc?: string;
}

interface NavLink {
  label: string;
  href: string;
  children?: NavChild[];
}

const links: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  {
    label: 'Services',
    href: '/tallyprime',
    children: [
      { label: 'TallyPrime Overview', href: '/tallyprime', desc: 'All TallyPrime services in one place' },
      { label: 'Implementation', href: '/tallyprime/implementation', desc: 'End-to-end setup & go-live' },
      { label: 'Licensing', href: '/tallyprime/licensing', desc: 'Silver, Gold & Enterprise editions' },
      { label: 'Cloud Hosting', href: '/tallyprime/cloud-hosting', desc: 'Secure remote access from anywhere' },
      { label: 'Training', href: '/tallyprime/training', desc: 'Hands-on user & admin training' },
      { label: 'Support', href: '/tallyprime/support', desc: '24/7 remote & on-site support' },
      { label: 'Customization', href: '/tallyprime/customization', desc: 'TDL & workflow customization' },
      { label: 'Data Migration', href: '/tallyprime/data-migration', desc: 'Migrate from any system' },
      { label: 'Business Consulting', href: '/tallyprime/consulting', desc: 'EOS® for business growth' },
      { label: 'Industries We Serve', href: '/industries', desc: 'Solutions for every sector' },
      { label: 'Biz Analyst App', href: '/biz-analyst', desc: 'Real-time TallyPrime data on your phone' },
      { label: 'Pricing', href: '/pricing', desc: 'Silver, Gold & Enterprise plans' },
    ],
  },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const isActive = (link: NavLink) => {
    if (link.href === '/') return location.pathname === '/';
    return location.pathname.startsWith(link.href);
  };

  return (
    <>
      <a
        href="#main-content"
        className="skip-nav"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-sm bg-gradient-to-b from-slate-100/95 via-slate-50/80 to-transparent border-b border-slate-200/10 ${scrolled ? 'shadow-[0_20px_80px_-40px_rgba(15,23,42,0.16)] border-slate-200/20' : 'shadow-none'}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={dropdownRef}>
        <div className="h-[72px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 shrink-0"
          >
            <Logo className="h-10 w-auto text-slate-950" variant="full" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={link.href}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive(link)
                      ? 'bg-slate-100 text-slate-950'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {link.children && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full left-0 mt-1 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-xl shadow-slate-200/40 overflow-hidden ${
                          link.children.length > 6 ? 'w-[560px]' : 'w-64'
                        }`}
                        onMouseEnter={() => handleMouseEnter(link.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className={`p-2 ${link.children.length > 6 ? 'grid grid-cols-2 gap-1' : ''}`}>
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={() => {
                                setActiveDropdown(null);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`block rounded-xl px-3 py-2.5 transition-colors ${
                                location.pathname === child.href
                                  ? 'bg-slate-100 text-slate-950'
                                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                              }`}
                            >
                              <div className="text-sm font-medium">{child.label}</div>
                              {child.desc && (
                                <div className="text-xs text-slate-500 mt-0.5">{child.desc}</div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="lg:hidden p-2 text-slate-900 transition hover:text-slate-700"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 bg-gradient-to-b from-slate-50/95 via-slate-50/80 to-slate-50/70"
          >
            <div className="px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">Navigation</p>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white/90 p-3 shadow-sm">
                {links.map((link) => (
                  <div key={link.href}>
                    {link.children ? (
                      <>
                        <button
                          onClick={() =>
                            setMobileExpanded(mobileExpanded === link.label ? null : link.label)
                          }
                          className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                            isActive(link) ? 'bg-slate-100 text-slate-950' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{link.label}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              mobileExpanded === link.label ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === link.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-3 border-l-2 border-slate-100 pl-3 mb-1"
                            >
                              {link.children.map((child) => (
                                <Link
                                  key={child.href}
                                  to={child.href}
                                  onClick={() => {
                                    setOpen(false);
                                    setMobileExpanded(null);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className={`block rounded-xl px-3 py-2 text-sm transition ${
                                    location.pathname === child.href
                                      ? 'bg-slate-100 text-slate-950 font-medium'
                                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => {
                          setOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                          isActive(link) ? 'bg-slate-100 text-slate-950' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
    </>
  );
}
