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
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="w-full mt-18 border-b border-sky-400/10 bg-gradient-to-r from-sky-800 via-sky-700 to-cyan-700 shadow-[0_20px_70px_-45px_rgba(2,32,91,0.35)]"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 py-2 text-white">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-shrink-0 h-12 w-28 rounded-xl bg-white/90 p-2 shadow-[0_10px_28px_rgba(0,0,0,0.16)] flex items-center justify-center">
                  <img
                    src="/tally-solutions-new-logo.png"
                    alt="Tally Solutions logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-sm sm:text-base font-semibold text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)]">Try TallyPrime free — Education Mode, no license needed.</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://tallysolutions.com/ssa/download/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100/95 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-white"
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
