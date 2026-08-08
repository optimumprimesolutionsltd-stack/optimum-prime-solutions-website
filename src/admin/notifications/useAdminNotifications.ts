import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fbSubscribe } from '../../firebase/config';
import type { Lead } from '../../data/siteData';
import type { TabId } from '../DashboardHome';

// Everything that should make the admin panel go "ping": a website enquiry
// (demo / consultation / Biz Analyst / customization) and a workshop or
// webinar sign-up.
export type NotifKind = 'demo' | 'consultation' | 'bizanalyst' | 'customization' | 'workshop' | 'webinar';

export interface AdminNotification {
  id: string;        // namespaced so a lead and a registrant can't collide
  kind: NotifKind;
  tab: TabId;        // where clicking it takes you
  title: string;     // "New demo request"
  name: string;
  detail: string;    // company · phone, or the message they left
  createdAt: string; // ISO
}

interface Registrant {
  id: string; name?: string; company?: string; phone?: string; email?: string;
  createdAt?: string; staff?: boolean;
}

// Read notifications are tracked by id, not by timestamp: the workshop and
// webinar managers rewrite createdAt to the event day when they push attendees
// into the pipeline, so a "newer than X" check would resurface old rows.
const SEEN_KEY = 'ops-admin-notifications-seen';
const SOUND_KEY = 'ops-admin-notifications-sound';
const MAX_SEEN = 800;
// Firebase delivers /leads, workshop and webinar registrants in separate
// snapshots; wait for them all to land before anything counts as "just
// arrived", otherwise opening the panel pops a toast per existing record.
const SETTLE_MS = 4000;
const MAX_TOASTS = 3;
const TOAST_MS = 12000;

const readSeen = (): string[] | null => {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch { return null; }
};

const writeSeen = (ids: Set<string>) => {
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...ids].slice(-MAX_SEEN))); } catch { /* private mode */ }
};

const TITLES: Record<NotifKind, string> = {
  demo: 'New demo request',
  consultation: 'New consultation request',
  bizanalyst: 'New Biz Analyst enquiry',
  customization: 'New customization enquiry',
  workshop: 'New workshop registration',
  webinar: 'New webinar registration',
};

const joinDetail = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' · ');

// A short two-note chime, synthesised so there's no audio file to ship.
const playChime = () => {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [880, 1174.7].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.16;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.16, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.32);
    });
    setTimeout(() => ctx.close().catch(() => {}), 1200);
  } catch { /* autoplay blocked until the admin interacts — fine */ }
};

export function useAdminNotifications(leads: Lead[]) {
  const [workshopRegs, setWorkshopRegs] = useState<Registrant[]>([]);
  const [webinarRegs, setWebinarRegs] = useState<Registrant[]>([]);
  const [seen, setSeen] = useState<Set<string>>(() => new Set(readSeen() ?? []));
  const [toasts, setToasts] = useState<AdminNotification[]>([]);
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem(SOUND_KEY) !== 'off');
  const [desktop, setDesktop] = useState<NotificationPermission | 'unsupported'>(
    () => (typeof Notification === 'undefined' ? 'unsupported' : Notification.permission),
  );

  // Ids already accounted for. Populated from the first settled snapshot so a
  // page refresh never re-announces what was already there.
  const knownRef = useRef<Set<string>>(new Set());
  const settledRef = useRef(false);
  // No stored read-state means this browser has never opened the panel: adopt
  // the existing backlog as read so the badge starts from today's arrivals.
  const firstRunRef = useRef(readSeen() === null);

  useEffect(() => {
    const parse = (raw: Record<string, any> | null): Registrant[] =>
      raw ? Object.entries(raw).map(([id, v]) => ({ id, ...(v as object) } as Registrant)) : [];
    const unsubWorkshop = fbSubscribe('workshop_registrants', raw => setWorkshopRegs(parse(raw)));
    const unsubWebinar = fbSubscribe('webinar_registrants', raw => setWebinarRegs(parse(raw)));
    const t = setTimeout(() => { settledRef.current = true; }, SETTLE_MS);
    return () => { unsubWorkshop(); unsubWebinar(); clearTimeout(t); };
  }, []);

  const all = useMemo<AdminNotification[]>(() => {
    // Only inbound leads: every other source ('manual', 'field', 'workshop',
    // 'phone', …) is typed in by the team in this very panel, so announcing
    // them is just an echo of your own keystrokes.
    const fromLeads = leads
      .filter(l => !l.source || l.source === 'website')
      .map<AdminNotification>(l => {
        const kind: NotifKind =
          l.requestType === 'consultation' ? 'consultation'
          : l.requestType === 'bizanalyst' ? 'bizanalyst'
          : l.requestType === 'customization' ? 'customization'
          : 'demo';
        return {
          id: `lead:${l.id}`,
          kind,
          tab: 'leads',
          title: TITLES[kind],
          name: l.name || 'Unknown',
          detail: joinDetail(l.company, l.phone || l.email, l.message?.slice(0, 60)),
          createdAt: l.createdAt || '',
        };
      });

    const fromRegs = (regs: Registrant[], kind: 'workshop' | 'webinar'): AdminNotification[] =>
      regs.filter(r => !r.staff).map(r => ({
        id: `${kind}:${r.id}`,
        kind,
        tab: kind as TabId,
        title: TITLES[kind],
        name: r.name || 'Unknown',
        detail: joinDetail(r.company, r.phone || r.email),
        createdAt: r.createdAt || '',
      }));

    return [...fromLeads, ...fromRegs(workshopRegs, 'workshop'), ...fromRegs(webinarRegs, 'webinar')]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [leads, workshopRegs, webinarRegs]);

  // Announce whatever showed up after the first settled snapshot.
  useEffect(() => {
    const fresh = all.filter(n => !knownRef.current.has(n.id));
    if (fresh.length === 0) return;
    fresh.forEach(n => knownRef.current.add(n.id));

    if (!settledRef.current) {
      if (firstRunRef.current) {
        setSeen(prev => {
          const next = new Set(prev);
          fresh.forEach(n => next.add(n.id));
          writeSeen(next);
          return next;
        });
      }
      return;
    }

    const unseen = fresh.filter(n => !seen.has(n.id));
    if (unseen.length === 0) return;

    setToasts(prev => [...unseen, ...prev].slice(0, MAX_TOASTS));
    if (soundOn) playChime();
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      unseen.slice(0, MAX_TOASTS).forEach(n => {
        try {
          new Notification(n.title, { body: joinDetail(n.name, n.detail), tag: n.id, icon: '/favicon-192x192.png' });
        } catch { /* some browsers require a service worker */ }
      });
    }
  }, [all, seen, soundOn]);

  // Auto-retire toasts, oldest first.
  useEffect(() => {
    if (toasts.length === 0) return;
    const t = setTimeout(() => setToasts(prev => prev.slice(0, -1)), TOAST_MS);
    return () => clearTimeout(t);
  }, [toasts]);

  const unread = useMemo(() => all.filter(n => !seen.has(n.id)), [all, seen]);

  const markRead = useCallback((ids: string[]) => {
    setSeen(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      writeSeen(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    firstRunRef.current = false;
    markRead(all.map(n => n.id));
  }, [all, markRead]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn(prev => {
      localStorage.setItem(SOUND_KEY, prev ? 'off' : 'on');
      if (!prev) playChime();
      return !prev;
    });
  }, []);

  const enableDesktop = useCallback(async () => {
    if (typeof Notification === 'undefined') return;
    try { setDesktop(await Notification.requestPermission()); } catch { /* denied */ }
  }, []);

  return {
    items: all.slice(0, 40),
    unreadIds: useMemo(() => new Set(unread.map(n => n.id)), [unread]),
    unreadCount: unread.length,
    toasts,
    markRead,
    markAllRead,
    dismissToast,
    soundOn,
    toggleSound,
    desktop,
    enableDesktop,
  };
}
