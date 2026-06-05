import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, ArrowRight } from 'lucide-react';

export default function StickyDownloadBar() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    setShow(true);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          className="fixed top-0 inset-x-0 z-[60] border-b border-slate-800 bg-slate-950 shadow-2xl"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 text-white">
              <div className="flex flex-wrap items-center gap-4">
                <img
                  src="/tally-solutions-new-logo.png"
                  alt="Tally Solutions logo"
                  className="h-20 w-auto min-w-[80px] rounded-2xl border border-white/20 bg-white/10 p-2 shadow-xl"
                />
                <span className="text-base sm:text-xl font-bold text-white leading-tight">Try TallyPrime free — Education Mode, no license needed.</span>
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
