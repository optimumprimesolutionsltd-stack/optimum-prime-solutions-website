import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { X, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import ROICalculator from './ROICalculator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const categoryStyles: Record<string, { badge: string; shadow: string }> = {
  Insights: { badge: 'from-red-500 to-orange-400 text-white', shadow: 'shadow-red-500/20' },
  Tutorial: { badge: 'from-emerald-500 to-teal-400 text-white', shadow: 'shadow-emerald-500/20' },
  Comparison: { badge: 'from-sky-600 to-indigo-500 text-white', shadow: 'shadow-sky-500/20' },
  EOS: { badge: 'from-amber-500 to-yellow-400 text-white', shadow: 'shadow-amber-500/20' },
  Cloud: { badge: 'from-cyan-500 to-teal-400 text-white', shadow: 'shadow-cyan-500/20' },
  'Product Update': { badge: 'from-violet-600 to-purple-500 text-white', shadow: 'shadow-violet-500/20' },
  Compliance: { badge: 'from-rose-600 to-red-500 text-white', shadow: 'shadow-rose-500/20' },
};

interface Props {
  blogId: string;
  onClose: () => void;
}

// Extract YouTube video ID from URL
const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return '';
  
  // Handle different YouTube URL formats
  let videoId = '';
  
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0] || '';
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.match(/^[a-zA-Z0-9_-]{11}$/)) {
    videoId = url; // Assume it's just the video ID
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

export default function BlogDetail({ blogId, onClose }: Props) {
  const { data } = useSite();
  const blog = data.blogs.find(b => b.id === blogId);

  if (!blog) return null;

  const embedUrl = getYoutubeEmbedUrl(blog.youtubeUrl || '');

  useEffect(() => {
    if (blog) {
      // Store original title to restore later
      const originalTitle = document.title;
      
      // Handle the specific eTIMS blog post SEO metadata
      if (blog.id === '7') {
        document.title = "eTIMS & June 30 Tax Deadline 2026: What Kenyan Businesses Must Do Now | Optimum Prime Solutions";
        
        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", "KRA's eTIMS validation engine is now checking every return automatically. Here's what changes before June 30, 2026, and how to get compliant fast with TallyPrime.");
        }
        
        // Update meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute("content", "eTIMS deadline 2026, KRA eTIMS compliance, TallyPrime eTIMS Kenya, income tax return deadline Kenya");
        
        // Update URL history without reloading (slug mapping)
        window.history.pushState({}, '', '/blog/etims-income-tax-deadline-june-30-2026');
      } else {
        document.title = `${blog.title} | Optimum Prime Solutions`;
        // Basic fallback for other blogs
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", blog.excerpt);
        }
        // Update URL history without reloading
        const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        window.history.pushState({}, '', `/blog/${slug}`);
      }
      
      return () => {
        document.title = originalTitle;
        // Restore default description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", "Business systems, cloud hosting, and operational consulting. Implementation and secure hosting for TallyPrime, multi-branch connectivity, reporting and process optimization in Kenya.");
        }
        // Restore URL history
        window.history.pushState({}, '', '/blog');
      };
    }
  }, [blog]);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-navy-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-navy-900 to-navy-800 p-6 flex items-center justify-between border-b border-navy-700">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white/80 hover:text-white transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-navy-600 dark:text-navy-400">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(blog.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {blog.readTime}
            </span>
            <span className={`rounded-full bg-gradient-to-r ${categoryStyles[blog.category]?.badge || 'from-slate-100 to-slate-200 text-slate-700'} px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-lg ${categoryStyles[blog.category]?.shadow || 'shadow-slate-200/30'}`}>
              {blog.category}
            </span>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-navy-900 dark:text-white mb-8 leading-tight"
          >
            {blog.title}
          </motion.h1>

          {/* YouTube Video */}
          {embedUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative w-full bg-slate-950 rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={embedUrl}
                  title={blog.title}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              </div>
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: embedUrl ? 0.3 : 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold text-navy-900 dark:text-white mt-8 mb-4 leading-tight">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-3 leading-tight border-b border-navy-200 dark:border-navy-700 pb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-semibold text-navy-900 dark:text-white mt-6 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-lg text-navy-700 dark:text-navy-300 leading-relaxed mb-4">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-navy-700 dark:text-navy-300 text-lg">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-navy-700 dark:text-navy-300 text-lg">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => <strong className="font-bold text-navy-900 dark:text-white">{children}</strong>,
                em: ({ children }) => <em className="italic text-navy-700 dark:text-navy-300">{children}</em>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-navy-600 dark:text-navy-400 my-4">{children}</blockquote>,
                a: ({ href, children }) => <a href={href} className="text-yellow-500 hover:text-yellow-400 underline font-medium transition-colors" target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>{children}</a>,
                hr: () => <hr className="border-navy-200 dark:border-navy-700 my-8" />,
                code: ({ children }) => <code className="bg-navy-100 dark:bg-navy-800 rounded px-1.5 py-0.5 text-sm font-mono text-navy-800 dark:text-navy-200">{children}</code>,
              }}
            >
              {blog.content}
            </ReactMarkdown>

            {/* Render Calculator for Comparison blogs */}
            {blog.category === 'Comparison' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <ROICalculator />
              </motion.div>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-navy-200 dark:border-navy-700"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">OP</span>
              </div>
              <div>
                <p className="font-semibold text-navy-900 dark:text-white">Optimum Prime Solutions</p>
                <p className="text-sm text-navy-600 dark:text-navy-400">
                  Your trusted TallyPrime implementation partner in East Africa.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
