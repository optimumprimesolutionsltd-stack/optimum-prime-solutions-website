import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Play } from 'lucide-react';
import { useState } from 'react';
import { useSite } from '../context/SiteContext';
import BlogDetail from './BlogDetail';

export default function Blog() {
  const { data } = useSite();
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  if (!data.blogs.length) return null;

  return (
    <>
      <section id="blog" className="py-24 bg-navy-50/50 dark:bg-navy-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">Blog & Insights</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white">Latest From Our Blog</h2>
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
                className="group rounded-2xl border border-navy-100 dark:border-navy-700 bg-white dark:bg-navy-800/50 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
              >
                {/* Image/Video Thumbnail Area */}
                <div className="h-44 bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center relative overflow-hidden">
                  {b.youtubeUrl ? (
                    <>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center"
                        >
                          <Play className="h-7 w-7 text-white fill-white ml-1" />
                        </motion.div>
                      </div>
                      <span className="absolute bottom-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">VIDEO</span>
                    </>
                  ) : (
                    <span className="text-4xl font-black text-white/10">{b.category}</span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-navy-500 dark:text-navy-600 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{b.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{b.readTime}</span>
                    {b.youtubeUrl && <span className="flex items-center gap-1 text-blue-600"><Play className="h-3 w-3"/>Video</span>}
                  </div>
                  <h3 className="text-base font-bold text-navy-900 dark:text-white group-hover:text-yellow-600 transition-colors">{b.title}</h3>
                  <p className="mt-2 text-sm text-navy-600 dark:text-navy-600 line-clamp-2">{b.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-yellow-600">
                    {b.youtubeUrl ? 'Watch Video' : 'Read more'} 
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform"/>
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          {/* View All Blog Posts Link */}
          {data.blogs.length > 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <button className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-8 py-3 text-sm font-semibold text-white hover:bg-navy-800 transition">
                View All Articles
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Blog Detail Modal */}
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
