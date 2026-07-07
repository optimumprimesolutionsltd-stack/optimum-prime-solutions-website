import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, AlertCircle, ExternalLink, ThumbsUp } from 'lucide-react';
import { fbSet } from '../firebase/config';

interface ReviewFormData {
  name: string;
  company: string;
  role: string;
  rating: number;
  text: string;
}

const GOOGLE_REVIEW_URL =
  'https://maps.google.com/?cid=2714284919514249977&action=write-review';

const GoogleLogo = () => (
  <svg viewBox="0 0 48 48" className="h-9 w-9">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

export default function ReviewForm() {
  const [form, setForm] = useState<ReviewFormData>({
    name: '',
    company: '',
    role: '',
    rating: 5,
    text: '',
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const ratingLabels: Record<number, string> = {
    1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim() || form.rating === 0) {
      setErrorMsg('Please fill in your name, a review, and select a star rating.');
      return;
    }
      setStatus('submitting');
    setErrorMsg('');
    try {
      const id = `review_${Date.now()}`;
      const reviewData = {
        id,
        name: form.name.trim(),
        company: form.company.trim(),
        role: form.role.trim(),
        rating: form.rating,
        text: form.text.trim(),
        submittedAt: new Date().toISOString(),
        status: 'pending',
      };
      await fbSet(`pending_reviews/${id}`, reviewData);
      // Notify team via WhatsApp (fire-and-forget — don't block on this)
      fetch('https://optimum-prime-lead-notifier.onrender.com/new-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      }).catch(() => {}); // silently ignore if backend is sleeping
      setStatus('success');
    } catch (err) {
      console.error('Review submission error:', err);
      setErrorMsg('Something went wrong. Please try again or contact us directly.');
      setStatus('error');
    }
  };

  return (
    <section id="review-form" className="relative py-20 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute top-10 left-1/4 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
            Share Your Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            How has working with us been?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Choose how you'd like to leave a review — on Google or directly on our website.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 items-start">

          {/* LEFT: Google Review */}
          <motion.a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="group block rounded-2xl border border-white/10 bg-slate-800/60 p-8 cursor-pointer transition-colors hover:border-blue-500/40 hover:bg-slate-800"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-xl flex-shrink-0">
                <GoogleLogo />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-0.5">Google Reviews</p>
                <h3 className="text-lg font-bold text-white">Leave a Google Review</h3>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Google reviews help other businesses in Nairobi and Kiambu County discover us. Takes less than a minute.
            </p>
            <div className="flex gap-0.5 mb-6">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 text-xs text-slate-400 font-medium self-center">Leave a 5-star review</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-[#0070c0] group-hover:bg-[#005fa3] text-white font-semibold px-5 py-3 text-sm shadow-lg transition-colors">
              <ThumbsUp className="h-4 w-4" />
              Write on Google
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </div>
          </motion.a>

          {/* RIGHT: Website review form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-green-500/30 bg-green-900/20 p-10 text-center flex flex-col items-center gap-4 h-full"
                >
                  <CheckCircle className="h-14 w-14 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Thank you for your review!</h3>
                  <p className="text-slate-400 max-w-sm text-sm">
                    Your review has been submitted and will appear on this page after our team approves it.
                  </p>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setForm({ name: '', company: '', role: '', rating: 5, text: '' });
                    }}
                    className="mt-2 text-sm text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
                  >
                    Submit another review
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-white/10 bg-slate-800/60 p-8 space-y-4"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-0.5">Website Review</p>
                    <h3 className="text-lg font-bold text-white">Leave a review here</h3>
                    <p className="text-xs text-slate-400 mt-1">Moderated before publishing. Your details are kept private.</p>
                  </div>

                  {/* Star rating */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Your Rating <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setForm((f) => ({ ...f, rating: s }))}
                          className="transition-transform hover:scale-110"
                        >
                          <Star className={`h-8 w-8 transition-colors ${s <= (hoverRating || form.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                      {(hoverRating || form.rating) > 0 && (
                        <span className="ml-2 text-sm font-medium text-amber-400">
                          {ratingLabels[hoverRating || form.rating]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name + Company */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. James Mwangi"
                        className="w-full rounded-xl border border-white/10 bg-slate-700/50 text-white placeholder-slate-500 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company (optional)</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                        placeholder="e.g. Mwangi Traders Ltd"
                        className="w-full rounded-xl border border-white/10 bg-slate-700/50 text-white placeholder-slate-500 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition"
                      />
                    </div>
                  </div>

                  {/* Review text */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Review <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={form.text}
                      onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                      rows={4}
                      maxLength={500}
                      placeholder="Tell us about your experience with Optimum Prime Solutions..."
                      className="w-full rounded-xl border border-white/10 bg-slate-700/50 text-white placeholder-slate-500 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition resize-none"
                      required
                    />
                    <p className="text-xs text-slate-500 mt-1">{form.text.length}/500 characters</p>
                  </div>

                  {/* Error */}
                  {(status === 'error' || errorMsg) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 rounded-xl bg-red-900/30 border border-red-500/30 px-4 py-3 text-sm text-red-300"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {errorMsg || 'Something went wrong. Please try again.'}
                    </motion.div>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={status === 'submitting'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 text-sm shadow-lg shadow-red-900/30 transition-colors"
                  >
                    {status === 'submitting' ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Review
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
