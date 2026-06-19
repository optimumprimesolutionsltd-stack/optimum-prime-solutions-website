import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import Logo from './Logo';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/features' },
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
        <div className="h-[72px] flex items-center justify-between gap-4">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
            <Logo className="h-10 w-auto text-slate-950" variant="full" />
          </Link>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="p-2 text-white transition hover:text-sky-400"
            aria-label={open ? 'Close quick links' : 'Open quick links'}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-gradient-to-b from-slate-900/98 via-slate-900/95 to-slate-900/90"
          >
            <div className="px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Quick Links</p>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-slate-300 transition hover:bg-slate-700"
                  aria-label="Close quick links"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[40vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-800/90 p-3 shadow-sm">
                {links.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive ? 'bg-red-600/20 text-red-400 border border-red-500/20' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
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
