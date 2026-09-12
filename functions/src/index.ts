import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Resend } from 'resend';

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Lazily constructed: `new Resend('')` throws, so building it at module load
// makes the whole codebase unloadable whenever RESEND_API_KEY is absent — which
// broke `firebase deploy` for the non-email functions (the SaaS sync) even
// though they never send mail.
let _resend: Resend | null = null;
function resendClient(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || '');
  return _resend;
}

const ADMIN_EMAIL = 'optimumprimesolutionsltd@gmail.com';
const WEBSITE_URL = 'https://www.optimumprimesolutions.co.ke';

/**
 * Sends email notification to admin when access request is submitted
 */
export const onAccessRequestSubmitted = functions.region('europe-west1').firestore
  .document('access_requests/{requestId}')
  .onCreate(async (snap) => {
    const request = snap.data();
    const { email, requestedTab } = request;

    try {
      await resendClient().emails.send({
        from: 'Optimum Prime <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `New Access Request: ${requestedTab}`,
        html: `
          <h2>New Access Request</h2>
          <p><strong>User Email:</strong> ${email}</p>
          <p><strong>Requested Panel:</strong> ${requestedTab}</p>
          <p><strong>Request ID:</strong> ${snap.id}</p>
          <p>Review and approve this request in the admin panel:</p>
          <p>
            <a href="${WEBSITE_URL}/admin?tab=access-requests" style="background-color: #dc2626; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; display: inline-block;">
              Review in Admin Panel
            </a>
          </p>
          <p><em>Requested at: ${new Date(request.createdAt.toDate()).toLocaleString()}</em></p>
        `,
      });

      console.log(`[AUDIT] Admin notification sent for request ${snap.id}`);
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  });

/**
 * Sends email to user when request is approved or rejected
 */
export const onAccessRequestApproved = functions.region('europe-west1').firestore
  .document('access_requests/{requestId}')
  .onUpdate(async (change) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Only process if status changed to 'approved'
    if (beforeData.status !== 'approved' && afterData.status === 'approved') {
      const { email, requestedTab } = afterData;

      try {
        await resendClient().emails.send({
          from: 'Optimum Prime <onboarding@resend.dev>',
          to: email,
          subject: `✓ Access Approved: ${requestedTab}`,
          html: `
            <h2>Your Access Request Has Been Approved!</h2>
            <p>Hello,</p>
            <p>Your request to access the <strong>${requestedTab}</strong> panel has been approved.</p>
            <p>You can now access this panel in your admin dashboard.</p>
            <p>
              <a href="${WEBSITE_URL}/admin" style="background-color: #dc2626; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; display: inline-block;">
                Go to Admin Dashboard
              </a>
            </p>
            <p>Best regards,<br/>Optimum Prime Solutions Team</p>
          `,
        });

        console.log(`[AUDIT] Approval email sent to ${email} for ${requestedTab}`);
      } catch (error) {
        console.error('Error sending approval email:', error);
      }
    }

    // Process rejection
    if (beforeData.status !== 'rejected' && afterData.status === 'rejected') {
      const { email, requestedTab } = afterData;

      try {
        await resendClient().emails.send({
          from: 'Optimum Prime <onboarding@resend.dev>',
          to: email,
          subject: `Access Request Decision: ${requestedTab}`,
          html: `
            <h2>Access Request Decision</h2>
            <p>Hello,</p>
            <p>Your request to access the <strong>${requestedTab}</strong> panel has been reviewed.</p>
            <p><strong>Status:</strong> Not approved at this time</p>
            <p>If you have questions, please contact us.</p>
            <p>Best regards,<br/>Optimum Prime Solutions Team</p>
          `,
        });

        console.log(`[AUDIT] Rejection email sent to ${email} for ${requestedTab}`);
      } catch (error) {
        console.error('Error sending rejection email:', error);
      }
    }
  });

/**
 * HTTP endpoint to test email sending
 */
export const sendTestEmail = functions.region('europe-west1').https.onRequest(async (req, res) => {
  // Fail closed. Comparing straight against process.env.TEST_EMAIL_TOKEN meant
  // that with the variable unset, a request carrying no token compared
  // undefined !== undefined — false — so the guard passed and this became a
  // public endpoint that emails arbitrary addresses from the Resend account.
  const expectedToken = process.env.TEST_EMAIL_TOKEN;
  if (!expectedToken) {
    functions.logger.error('sendTestEmail called but TEST_EMAIL_TOKEN is not set; refusing.');
    res.status(503).json({ error: 'Endpoint not configured' });
    return;
  }

  // Accept the token from a header so it stays out of URLs, server logs and
  // proxy logs; the query parameter is still honoured for existing callers.
  const provided =
    (typeof req.get === 'function' ? req.get('x-test-email-token') : undefined) ||
    (typeof req.query.token === 'string' ? req.query.token : undefined);

  if (provided !== expectedToken) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  const toEmail = typeof req.query.to === 'string' ? req.query.to : undefined;
  if (!toEmail) {
    res.status(400).json({ error: 'Missing email parameter' });
    return;
  }

  try {
    await resendClient().emails.send({
      from: 'Optimum Prime <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Test Email',
      html: '<p>This is a test email from Optimum Prime Solutions Cloud Functions.</p>',
    });

    res.json({ success: true, message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/* ======================================================================
 * SaaS subscription sync — Jamvi + Mavuno HR
 *
 * Each product exposes GET <ORGS_URL> that returns the org list when called
 * with `Authorization: Bearer <SYNC_KEY>` (a read-only credential). We pull it
 * on a schedule and mirror it into RTDB `saasSubscriptions/<product>_<orgId>`,
 * which the CRM's Subscriptions tab renders. Orgs that disappear from a source
 * are removed.
 *
 * Env (functions/.env, gitignored — see functions/.env.example):
 *   MAVUNO_ORGS_URL, MAVUNO_SYNC_KEY
 *   JAMVI_ORGS_URL,  JAMVI_SYNC_KEY        (optional until Jamvi exposes it)
 *   SAAS_SYNC_TRIGGER_TOKEN                (guards the manual HTTP trigger)
 * ==================================================================== */

interface SaasSource {
  product: 'mavuno' | 'jamvi';
  label: string;
  url?: string;
  key?: string;
}

function saasSources(): SaasSource[] {
  return [
    { product: 'mavuno', label: 'Mavuno HR', url: process.env.MAVUNO_ORGS_URL, key: process.env.MAVUNO_SYNC_KEY },
    { product: 'jamvi', label: 'Jamvi', url: process.env.JAMVI_ORGS_URL, key: process.env.JAMVI_SYNC_KEY },
  ];
}

function mapOrgToSubscription(src: SaasSource, o: any, now: string) {
  const admins = Array.isArray(o?.admins) ? o.admins : [];
  const firstAdmin = admins[0];
  const adminEmail =
    typeof firstAdmin === 'string' ? firstAdmin : firstAdmin?.email ?? null;
  const monthly = Number(o?.monthlyCharge ?? o?.monthlyChargeCents ?? 0) || 0;
  return {
    product: src.product,
    productLabel: src.label,
    orgId: String(o?.id ?? o?.orgId ?? ''),
    orgName: o?.name ?? o?.orgName ?? '(unnamed)',
    orgSlug: o?.slug ?? null,
    plan: o?.plan ?? 'unknown',
    status: o?.status ?? 'active',
    billingCycle: o?.billingCycle === 'annual' ? 'annual' : 'monthly',
    seats: Number(o?.activeEmployees ?? o?.seats ?? o?.memberCount ?? 0) || 0,
    seatLimit: Number(o?.seatLimit ?? 0) || 0,
    // Usage signal — how much the customer actually runs the product.
    // Mavuno HR only; products without payroll report 0 / null.
    payrollRuns: Number(o?.payrollRuns ?? 0) || 0,
    lastPayrollRun: o?.lastPayrollRun ?? null,
    monthlyChargeCents: monthly,
    cycleChargeCents: Number(o?.cycleCharge ?? o?.cycleChargeCents ?? monthly) || 0,
    currency: o?.currencyCode ?? o?.currency ?? 'KES',
    trialEndsAt: o?.trialEndsAt ?? null,
    createdAt: o?.createdAt ?? null,
    adminEmail,
    lastSyncedAt: now,
  };
}

async function runSaasSync(): Promise<Record<string, unknown>> {
  const rtdb = admin.database();
  const now = new Date().toISOString();
  const summary: Record<string, unknown> = { ranAt: now };

  // Read once — the node holds a handful of orgs, so an index isn't worth it.
  const currentSnap = await rtdb.ref('saasSubscriptions').once('value');
  const current: Record<string, any> = currentSnap.val() || {};

  for (const src of saasSources()) {
    if (!src.url || !src.key) {
      summary[src.product] = 'skipped — not configured';
      continue;
    }
    try {
      const resp = await fetch(src.url, {
        headers: { Authorization: `Bearer ${src.key}` },
      });
      if (!resp.ok) {
        summary[src.product] = `error — HTTP ${resp.status}`;
        functions.logger.error(`saas-sync ${src.product}: HTTP ${resp.status}`);
        continue;
      }
      const orgs = await resp.json();
      if (!Array.isArray(orgs)) {
        summary[src.product] = 'error — unexpected response';
        continue;
      }

      const updates: Record<string, unknown> = {};
      const seen = new Set<string>();
      for (const o of orgs) {
        const id = String(o?.id ?? o?.orgId ?? '');
        if (!id) continue;
        const nodeKey = `${src.product}_${id}`;
        seen.add(nodeKey);
        updates[`saasSubscriptions/${nodeKey}`] = mapOrgToSubscription(src, o, now);
      }
      // Prune orgs that no longer exist in this source.
      for (const k of Object.keys(current)) {
        if (current[k]?.product === src.product && !seen.has(k)) {
          updates[`saasSubscriptions/${k}`] = null;
        }
      }
      await rtdb.ref().update(updates);
      summary[src.product] = `${orgs.length} synced`;
    } catch (err) {
      summary[src.product] = `error — ${(err as Error).message}`;
      functions.logger.error(`saas-sync ${src.product}`, err);
    }
  }

  // Demo requests and newsletter signups ride along with the subscription
  // pull: same host, same key, same cadence. A second scheduler would be a
  // second thing to notice had stopped.
  Object.assign(summary, await runMavunoMarketingSync());

  functions.logger.info('saas-sync complete', summary);
  return summary;
}

/* ======================================================================
 * Marketing capture sync — Mavuno HR
 *
 * mavunohr.co.ke has its own demo form and newsletter box. Those rows live in
 * Mavuno's Postgres, which nobody in this CRM can see, so a demo request could
 * sit there for a week with no one aware of it.
 *
 * GET <MARKETING_URL> returns everything captured in the last 30 days when
 * called with the same read-only Bearer key the subscription sync uses. We
 * mirror demo requests into `leads` (tagged source 'mavuno') and signups into
 * `newsletter_subscribers`, keyed deterministically — mavuno_demo_<id> and
 * mavuno_sub_<id> — so a repeated pull is an upsert. Neither side has to
 * remember what was already synced, and a missed run repairs itself.
 *
 * ADDITIVE ONLY, and that is the whole design.
 *
 * A lead in this CRM gets worked: someone changes its status, adds a next
 * step, schedules a demo, marks it Closed Won. All of that lives here and
 * nowhere else. A sync that wrote the source record over the top every fifteen
 * minutes would erase that work on a loop, so an existing key is never
 * overwritten and never pruned.
 *
 * The one exception runs one way only: if Mavuno reports a subscriber as
 * unsubscribed and this CRM still has them active, we mark them unsubscribed
 * here too. The reverse is deliberately not done — re-activating someone who
 * opted out inside the CRM would mean mailing a person who asked us not to.
 * ==================================================================== */

interface MavunoDemoRequest {
  id: number | string;
  name?: string;
  email?: string;
  company?: string | null;
  phone?: string | null;
  employeeCount?: string | null;
  message?: string | null;
  pagePath?: string | null;
  createdAt?: string | null;
}

interface MavunoSubscriber {
  id: number | string;
  email?: string;
  name?: string | null;
  pagePath?: string | null;
  status?: string | null;
  createdAt?: string | null;
}

/**
 * Where to pull from. Derived from the orgs URL so this works off the config
 * that is already deployed — both endpoints live on the same host behind the
 * same key, and requiring a second secret before the sync could run at all
 * would mean shipping something that silently does nothing.
 */
function mavunoMarketingUrl(): string | undefined {
  const explicit = process.env.MAVUNO_MARKETING_URL;
  if (explicit) return explicit;
  const orgs = process.env.MAVUNO_ORGS_URL;
  return orgs ? orgs.replace(/\/orgs\/?$/, '/marketing-capture') : undefined;
}

/** A demo request as this CRM's `leads` node expects it. */
function mapDemoToLead(d: MavunoDemoRequest, now: string) {
  // Everything Mavuno collected that this CRM has no field for goes into the
  // message, because the alternative is losing it. Headcount in particular is
  // the single most useful thing on the form when sizing the conversation.
  const extras = [
    d.message?.trim(),
    d.employeeCount ? `Team size: ${d.employeeCount}` : '',
    d.pagePath ? `Submitted from: ${d.pagePath}` : '',
  ].filter(Boolean);

  return {
    name: d.name || 'Unknown',
    email: d.email || '',
    phone: d.phone || '',
    company: d.company || '',
    businessType: '',
    demoDate: '',
    currentSoftware: '',
    message: extras.join('\n'),
    createdAt: d.createdAt || now,
    status: 'New',
    source: 'mavuno',
    requestType: 'demo',
    // The attribution is complete the moment it arrives — it came off a known
    // form on a known site — so it must not land in the "needs a source" queue.
    sourceSetBy: 'Mavuno HR sync',
    sourceSetAt: now,
  };
}

async function runMavunoMarketingSync(): Promise<Record<string, unknown>> {
  const rtdb = admin.database();
  const now = new Date().toISOString();

  const url = mavunoMarketingUrl();
  const key = process.env.MAVUNO_SYNC_KEY;
  if (!url || !key) return { mavunoMarketing: 'skipped — not configured' };

  try {
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
    if (!resp.ok) {
      functions.logger.error(`marketing-sync: HTTP ${resp.status}`);
      return { mavunoMarketing: `error — HTTP ${resp.status}` };
    }
    const body: any = await resp.json();
    const demos: MavunoDemoRequest[] = Array.isArray(body?.demoRequests) ? body.demoRequests : [];
    const subs: MavunoSubscriber[] = Array.isArray(body?.newsletterSubscribers)
      ? body.newsletterSubscribers
      : [];

    const updates: Record<string, unknown> = {};
    let newLeads = 0;
    let newSubs = 0;
    let unsubscribed = 0;

    // One small read per record rather than pulling the whole leads node. The
    // window holds a handful of rows, and `leads` holds every lead we have ever
    // had — reading all of it every fifteen minutes to check a few keys would
    // be the expensive way round.
    for (const d of demos) {
      if (!d?.id || !d?.email) continue;
      const nodeKey = `mavuno_demo_${d.id}`;
      const existing = await rtdb.ref(`leads/${nodeKey}`).once('value');
      if (existing.exists()) continue; // already here, and possibly worked since
      updates[`leads/${nodeKey}`] = mapDemoToLead(d, now);
      newLeads += 1;
    }

    for (const s of subs) {
      if (!s?.id || !s?.email) continue;
      const nodeKey = `mavuno_sub_${s.id}`;
      const snap = await rtdb.ref(`newsletter_subscribers/${nodeKey}`).once('value');
      const sourceUnsubscribed = s.status === 'unsubscribed';

      if (!snap.exists()) {
        updates[`newsletter_subscribers/${nodeKey}`] = {
          email: String(s.email).trim().toLowerCase(),
          ...(s.name ? { name: s.name } : {}),
          status: sourceUnsubscribed ? 'unsubscribed' : 'active',
          subscribedAt: s.createdAt || now,
          source: 'mavuno',
        };
        newSubs += 1;
        continue;
      }

      // One-way only: an unsubscribe propagates in, a re-subscribe does not.
      if (sourceUnsubscribed && snap.val()?.status !== 'unsubscribed') {
        updates[`newsletter_subscribers/${nodeKey}/status`] = 'unsubscribed';
        unsubscribed += 1;
      }
    }

    if (Object.keys(updates).length > 0) await rtdb.ref().update(updates);

    const summary = {
      mavunoMarketing: `${demos.length} demo requests, ${subs.length} subscribers seen`,
      newLeads,
      newSubscribers: newSubs,
      unsubscribesApplied: unsubscribed,
    };
    functions.logger.info('marketing-sync complete', summary);
    return summary;
  } catch (err) {
    functions.logger.error('marketing-sync', err);
    return { mavunoMarketing: `error — ${(err as Error).message}` };
  }
}

/** Scheduled pull, every 15 minutes. */
export const syncSaasSubscriptions = functions
  .region('europe-west1')
  .runWith({ timeoutSeconds: 120 })
  .pubsub.schedule('every 15 minutes')
  .onRun(async () => {
    await runSaasSync();
    return null;
  });

// The "Sync now" button calls this from the admin SPA with an `x-sync-token`
// header, which is not CORS-safelisted, so the browser sends a preflight. The
// admin is served from a different origin than *.cloudfunctions.net, so without
// these headers the preflight fails and the button never reaches the handler.
const SAAS_SYNC_ALLOWED_ORIGINS = new Set([
  'https://optimumprimesolutions.co.ke',
  'https://www.optimumprimesolutions.co.ke',
  'https://optimum-prime-website.web.app',
  'https://optimum-prime-website.firebaseapp.com',
  'http://localhost:5173',
]);

function applySaasSyncCors(req: functions.https.Request, res: functions.Response): void {
  const origin = req.get('origin');
  if (origin && SAAS_SYNC_ALLOWED_ORIGINS.has(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'x-sync-token, Content-Type');
    res.set('Access-Control-Max-Age', '3600');
  }
}

/**
 * Manual trigger for the CRM "Sync now" button. Guarded by a token.
 *
 * `invoker: 'public'` because the admin SPA calls this with `fetch` and no
 * Firebase Auth bearer — reachability is intentional, and the `x-sync-token`
 * check below is what actually protects it (same model as `sendTestEmail`).
 */
export const syncSaasSubscriptionsNow = functions
  .region('europe-west1')
  .runWith({ timeoutSeconds: 120, invoker: 'public' })
  .https.onRequest(async (req, res) => {
    applySaasSyncCors(req, res);
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    const expected = process.env.SAAS_SYNC_TRIGGER_TOKEN;
    if (!expected) {
      res.status(503).json({ error: 'Endpoint not configured' });
      return;
    }
    const provided =
      (typeof req.get === 'function' ? req.get('x-sync-token') : undefined) ||
      (typeof req.query.token === 'string' ? req.query.token : undefined);
    if (provided !== expected) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const summary = await runSaasSync();
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });
