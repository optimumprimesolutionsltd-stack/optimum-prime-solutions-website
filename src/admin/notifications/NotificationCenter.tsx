import { useEffect, useRef, useState } from 'react';
import {
  Bell, BellOff, CalendarDays, CheckCheck, Monitor, Phone, Settings2,
  ShoppingBag, Video, Volume2, VolumeX, X,
} from 'lucide-react';
import type { AdminNotification, NotifKind } from './useAdminNotifications';

const KIND: Record<NotifKind, { icon: typeof Bell; tint: string; ring: string }> = {
  demo: { icon: Phone, tint: 'bg-red-100 text-red-700', ring: 'ring-red-600/20' },
  consultation: { icon: CalendarDays, tint: 'bg-violet-100 text-violet-700', ring: 'ring-violet-600/20' },
  bizanalyst: { icon: ShoppingBag, tint: 'bg-sky-100 text-sky-700', ring: 'ring-sky-600/20' },
  customization: { icon: Settings2, tint: 'bg-slate-200 text-slate-700', ring: 'ring-slate-600/20' },
  workshop: { icon: CalendarDays, tint: 'bg-amber-100 text-amber-700', ring: 'ring-amber-600/20' },
  webinar: { icon: Video, tint: 'bg-emerald-100 text-emerald-700', ring: 'ring-emerald-600/20' },
};

const timeAgo = (iso: string) => {
  const then = new Date(iso).getTime();
  if (!then) return '';
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  if (mins < 10080) return `${Math.round(mins / 1440)}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

interface BellProps {
  items: AdminNotification[];
  unreadIds: Set<string>;
  unreadCount: number;
  onOpen: (n: AdminNotification) => void;
  onMarkAllRead: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  desktop: NotificationPermission | 'unsupported';
  onEnableDesktop: () => void;
}

export function NotificationBell({
  items, unreadIds, unreadCount, onOpen, onMarkAllRead,
  soundOn, onToggleSound, desktop, onEnableDesktop,
}: BellProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => setOpen(o => !o)}
        title={unreadCount > 0 ? `${unreadCount} new notification${unreadCount > 1 ? 's' : ''}` : 'Notifications'}
        aria-label="Notifications"
        className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 hover:text-slate-900 transition-colors"
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'text-red-600' : ''}`} />
        {unreadCount > 0 && (
          <>
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white shadow">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
            <span className="absolute -right-0.5 -top-0.5 h-4 w-4 animate-ping rounded-full bg-red-600/40" />
          </>
        )}
      </button>

      {/* The panel is anchored to the bell on desktop, but pinned to the
          viewport on phones, where a bell-anchored panel hangs off the edge. */}
      {open && (
        <div className="fixed inset-x-3 top-16 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[380px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-red-50 to-red-50/40 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-slate-900">Notifications</p>
              <p className="text-[11px] text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleSound}
                title={soundOn ? 'Mute the new-lead chime' : 'Play a chime on new leads'}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 transition-colors"
              >
                {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button
                onClick={onMarkAllRead}
                disabled={unreadCount === 0}
                title="Mark all as read"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 transition-colors disabled:opacity-40"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
            </div>
          </div>

          {desktop === 'default' && (
            <button
              onClick={onEnableDesktop}
              className="flex w-full items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Monitor className="h-3.5 w-3.5 shrink-0" />
              Get desktop alerts even when this tab is in the background
            </button>
          )}

          <div className="max-h-[min(60vh,420px)] overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <BellOff className="mx-auto h-6 w-6 text-slate-300" />
                <p className="mt-2 text-xs text-slate-400">No leads or registrations yet</p>
              </div>
            ) : items.map(n => {
              const meta = KIND[n.kind];
              const Icon = meta.icon;
              const isUnread = unreadIds.has(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => { onOpen(n); setOpen(false); }}
                  className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${isUnread ? 'bg-red-50/40' : ''}`}
                >
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.tint}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-xs font-bold text-slate-900">{n.name}</span>
                      {isUnread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />}
                      <span className="ml-auto shrink-0 text-[10px] text-slate-400">{timeAgo(n.createdAt)}</span>
                    </span>
                    <span className="mt-0.5 block text-[11px] font-medium text-slate-600">{n.title}</span>
                    {n.detail && <span className="mt-0.5 block truncate text-[11px] text-slate-400">{n.detail}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface ToastProps {
  toasts: AdminNotification[];
  onOpen: (n: AdminNotification) => void;
  onDismiss: (id: string) => void;
}

export function NotificationToasts({ toasts, onOpen, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed right-4 top-20 z-[60] flex w-[min(92vw,340px)] flex-col gap-2 lg:right-8">
      {toasts.map(n => {
        const meta = KIND[n.kind];
        const Icon = meta.icon;
        return (
          <div
            key={n.id}
            className={`notif-enter rounded-xl border border-slate-200 bg-white p-3 shadow-2xl ring-4 ${meta.ring}`}
          >
            <div className="flex items-start gap-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.tint}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wide text-red-600">{n.title}</p>
                <p className="truncate text-sm font-bold text-slate-900">{n.name}</p>
                {n.detail && <p className="truncate text-[11px] text-slate-500">{n.detail}</p>}
                <button
                  onClick={() => { onOpen(n); onDismiss(n.id); }}
                  className="mt-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-red-600/20 hover:from-red-700 hover:to-red-600 transition-all"
                >
                  View now
                </button>
              </div>
              <button
                onClick={() => onDismiss(n.id)}
                aria-label="Dismiss notification"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
