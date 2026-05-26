import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, ArrowRight } from 'lucide-react';
import TallyLogo from './TallyLogo';

export default function StickyDownloadBar() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      setShow(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          className="fixed top-0 inset-x-0 z-[60] border-b border-slate-200 bg-white shadow-xl"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Download className="h-4 w-4" />
                </div>
                <div className="inline-flex items-center gap-2">
                  <TallyLogo className="h-5 w-auto" />
                  <span>Try TallyPrime free — Education Mode, no license needed.</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://tallysolutions.com/ssa/download/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                >
                  Download Now
                  <ArrowRight className="h-3 w-3" />
                </a>
                <button onClick={() => setDismissed(true)} className="rounded-full p-2 text-slate-500 transition hover:text-slate-900">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
