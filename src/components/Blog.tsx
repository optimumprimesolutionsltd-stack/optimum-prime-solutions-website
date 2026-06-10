import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Play } from 'lucide-react';
import { useState } from 'react';
import { useSite } from '../context/SiteContext';
import BlogDetail from './BlogDetail';

const categoryStyles: Record<string, { badge: string; shadow: string }> = {
  Insights: { badge: 'from-red-500 to-orange-400 text-white', shadow: 'shadow-red-500/20' },
  Tutorial: { badge: 'from-emerald-500 to-teal-400 text-white', shadow: 'shadow-emerald-500/20' },
  Comparison: { badge: 'from-sky-600 to-indigo-500 text-white', shadow: 'shadow-sky-500/20' },
};

export default function Blog() {
  const { data } = useSite();
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  if (!data.blogs.length) return null;

  return (
    <>
      <section id="blog" className="relative py-24 bg-gradient-to-br from-slate-50 via-sky-50 to-white text-slate-950">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_65%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-gradient-to-r from-red-500 to-orange-400 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-red-500/10">Blog & Insights</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-950">Latest From Our Blog</h2>
            <p className="mt-4 text-sm text-slate-600">Read practical guidance, compliance tips, and Tally Prime success stories designed to help your business grow faster.</p>
          </motion.div>
          
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {data.blogs.slice(0,3).map((b,i)=>(
              <motion.article 
                key={b.id} 
                initial={{opacity:0,y:30}} 
                whileInView={{opacity:1,y:0}} 
                viewport={{once:true}} 
                transition={{delay:i*0.1}}
                onClick={() => setSelectedBlogId(b.id)}
                className="group rounded-[2rem] border border-slate-200 bg-white shadow-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="h-44 bg-gradient-to-br from-sky-500 via-cyan-400 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                  <span
                    className={`absolute top-4 left-4 inline-flex items-center rounded-full bg-gradient-to-r ${categoryStyles[b.category]?.badge || 'from-slate-700 to-slate-600 text-white'} px-3 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-lg ${categoryStyles[b.category]?.shadow || 'shadow-slate-900/30'}`}
                  >
                    {b.category}
                  </span>
                  {b.youtubeUrl ? (
                    <>
                      <div className="absolute inset-0 bg-slate-800/20 group-hover:bg-slate-800/30 transition-colors flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-16 h-16 bg-white/90 text-slate-900 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Play className="h-7 w-7" />
                        </motion.div>
                      </div>
                      <span className="absolute bottom-3 right-3 bg-white/90 text-slate-900 text-[11px] font-semibold px-2 py-1 rounded-full">VIDEO</span>
                    </>
                  ) : (
                    <span className="text-4xl font-extrabold text-white/20 tracking-tight">{b.category}</span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 mb-4">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3"/>{b.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3"/>{b.readTime}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${categoryStyles[b.category]?.badge || 'from-slate-700 to-slate-600 text-white'} px-2 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-lg ${categoryStyles[b.category]?.shadow || 'shadow-slate-500/10'}`}>
                      {b.category}
                    </span>
                    {b.youtubeUrl && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"><Play className="h-3 w-3"/>Video</span>}
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 group-hover:text-red-600 transition-colors">{b.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{b.excerpt}</p>
                  <span className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold ${b.youtubeUrl ? 'text-red-500' : 'text-red-600'}`}>
                    {b.youtubeUrl ? 'Watch Video' : 'Read more'} 
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          {data.blogs.length > 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <button className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 text-sm font-semibold text-white shadow-sm shadow-red-900/10 hover:bg-red-700 transition">
                View All Articles
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedBlogId && (
          <BlogDetail 
            blogId={selectedBlogId} 
            onClose={() => setSelectedBlogId(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
