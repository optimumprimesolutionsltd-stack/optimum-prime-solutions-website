import { useState } from 'react';
import { Save, Plus, X, ChevronDown, Calendar, Clock, Play, Mail, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import type { SiteData, BlogPost } from '../../data/siteData';
import { slugify } from '../../utils/slugify';

interface P { data: SiteData; onSave: (d: SiteData) => void }

type NotifyState = 'idle' | 'sending' | 'sent' | 'error';

export default function BlogEditor({ data, onSave }: P) {
  const [items, setItems] = useState<BlogPost[]>(data.blogs.map(b => ({ ...b })));
  const [exp, setExp] = useState<string | null>(null);
  const [notify, setNotify] = useState<Record<string, { state: NotifyState; message: string }>>({});

  const add = () => {
    const n: BlogPost = { id: Date.now() + '', title: '', excerpt: '', date: new Date().toISOString().split('T')[0], category: 'Insights', readTime: '5 min', content: '', youtubeUrl: '' };
    setItems([...items, n]);
    setExp(n.id);
  };

  const rm = (id: string) => { if (confirm('Remove this blog post?')) setItems(items.filter(b => b.id !== id)); };
  const upd = (id: string, u: Partial<BlogPost>) => setItems(items.map(b => b.id === id ? { ...b, ...u } : b));

  const notifySubscribers = async (b: BlogPost) => {
    const slug = b.slug || slugify(b.title);
    if (!b.title.trim() || !slug) {
      setNotify(prev => ({ ...prev, [b.id]: { state: 'error', message: 'Add a title first' } }));
      return;
    }
    if (!confirm(`Email all newsletter subscribers about "${b.title}"? Save the post first if you haven't already.`)) return;

    setNotify(prev => ({ ...prev, [b.id]: { state: 'sending', message: '' } }));
    try {
      const res = await fetch('https://optimum-prime-lead-notifier.onrender.com/notify-subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: b.title, excerpt: b.excerpt, slug }),
      });
      const result = await res.json();
      if (res.ok && result.success !== false) {
        setNotify(prev => ({
          ...prev,
          [b.id]: { state: 'sent', message: `Sent to ${result.sent ?? 0} of ${result.total_subscribers ?? 0} subscribers` },
        }));
      } else {
        setNotify(prev => ({ ...prev, [b.id]: { state: 'error', message: result.error || 'Send failed' } }));
      }
    } catch {
      setNotify(prev => ({ ...prev, [b.id]: { state: 'error', message: 'Could not reach notification service' } }));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-navy-500">{items.length} blog posts</p>
        <button onClick={add} className="flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800 transition">
          <Plus className="h-4 w-4" />New Post
        </button>
      </div>

      {items.map(b => (
        <div key={b.id} className="rounded-2xl border border-navy-200 bg-white overflow-hidden">
          <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExp(exp === b.id ? null : b.id)}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-navy-900 truncate">{b.title || 'Untitled Post'}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-navy-500">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{b.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.readTime}</span>
                <span className="rounded-full bg-navy-100 px-2 py-0.5 text-[10px] font-medium">{b.category}</span>
                {b.youtubeUrl && <span className="flex items-center gap-1 text-blue-600"><Play className="h-3 w-3" />Video</span>}
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); rm(b.id); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><X className="h-4 w-4" /></button>
            <ChevronDown className={`h-4 w-4 text-navy-400 transition-transform ${exp === b.id ? 'rotate-180' : ''}`} />
          </div>

          {exp === b.id && (
            <div className="border-t border-navy-100 p-5 space-y-4">
              <div><label className="block text-xs font-semibold text-navy-600 mb-1.5">Title</label>
                <input value={b.title} onChange={e => upd(b.id, { title: e.target.value })}
                  onBlur={() => { if (!b.slug && b.title.trim()) upd(b.id, { slug: slugify(b.title) }); }}
                  placeholder="Blog post title..."
                  className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent" /></div>
              <div><label className="block text-xs font-semibold text-navy-600 mb-1.5">URL Slug</label>
                <input value={b.slug || slugify(b.title)} onChange={e => upd(b.id, { slug: slugify(e.target.value) })} placeholder="auto-generated-from-title"
                  className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent font-mono text-xs" />
                <p className="mt-1.5 text-xs text-navy-500">optimumprimesolutions.co.ke/blog/{b.slug || slugify(b.title) || '...'} — set once when the post is created; editing the title afterward won't change this. Only change it manually if you know the old URL won't be linked anywhere.</p></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-semibold text-navy-600 mb-1.5">Date</label>
                  <input type="date" value={b.date} onChange={e => upd(b.id, { date: e.target.value })}
                    className="w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm outline-none focus:border-accent" /></div>
                <div><label className="block text-xs font-semibold text-navy-600 mb-1.5">Category</label>
                  <select value={b.category} onChange={e => upd(b.id, { category: e.target.value })}
                    className="w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm outline-none focus:border-accent">
                    {['Insights', 'Tutorial', 'Comparison', 'News', 'Case Study', 'Tips'].map(c => <option key={c}>{c}</option>)}
                  </select></div>
                <div><label className="block text-xs font-semibold text-navy-600 mb-1.5">Read Time</label>
                  <input value={b.readTime} onChange={e => upd(b.id, { readTime: e.target.value })} placeholder="5 min"
                    className="w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm outline-none focus:border-accent" /></div>
              </div>
              <div><label className="block text-xs font-semibold text-navy-600 mb-1.5">Excerpt (shown on card)</label>
                <textarea value={b.excerpt} onChange={e => upd(b.id, { excerpt: e.target.value })} rows={2} placeholder="Short summary..."
                  className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent" /></div>
              <div><label className="block text-xs font-semibold text-navy-600 mb-1.5">Full Content (Readable Preview)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-600 mb-1.5">Edit Content</label>
                    <textarea value={b.content} onChange={e => upd(b.id, { content: e.target.value })} rows={12} placeholder="Write your article..."
                      className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-600 mb-1.5">Live Preview</label>
                    <div className="h-96 overflow-y-auto rounded-lg border border-navy-200 bg-navy-50 p-4">
                      <div className="text-sm text-navy-800 leading-relaxed whitespace-pre-wrap break-words">
                        {b.content || <span className="text-navy-400">Content preview will appear here...</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div><label className="block text-xs font-semibold text-navy-600 mb-1.5">YouTube Video URL (Optional)</label>
                <input value={b.youtubeUrl || ''} onChange={e => upd(b.id, { youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent" />
                <p className="mt-1.5 text-xs text-navy-500">Paste the full YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)</p>
                {b.youtubeUrl && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-2 text-sm text-blue-700">
                    <Play className="h-4 w-4" />
                    Video preview will show in blog post
                  </div>
                )}
              </div>
              <div className="border-t border-navy-100 pt-4">
                <button
                  onClick={() => notifySubscribers(b)}
                  disabled={notify[b.id]?.state === 'sending'}
                  className="flex items-center gap-2 rounded-lg border border-navy-200 px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {notify[b.id]?.state === 'sending'
                    ? <Loader className="h-4 w-4 animate-spin" />
                    : <Mail className="h-4 w-4" />}
                  Notify Subscribers
                </button>
                {notify[b.id]?.state === 'sent' && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-green-700">
                    <CheckCircle className="h-3.5 w-3.5" />{notify[b.id].message}
                  </p>
                )}
                {notify[b.id]?.state === 'error' && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />{notify[b.id].message}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-navy-500">Emails everyone subscribed to the newsletter about this post. Save the post first — this sends whatever's currently saved, not unsaved edits.</p>
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={() => onSave({ ...data, blogs: items })}
        className="flex items-center gap-2 rounded-xl bg-navy-900 px-7 py-3 text-sm font-semibold text-white shadow-lg hover:bg-navy-800 transition">
        <Save className="h-4 w-4" />Save Blog Posts
      </button>
    </div>
  );
}
