import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Resend } from 'resend';

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const resend = new Resend(process.env.RESEND_API_KEY || '');

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
      await resend.emails.send({
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
        await resend.emails.send({
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
        await resend.emails.send({
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
    await resend.emails.send({
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

  functions.logger.info('saas-sync complete', summary);
  return summary;
}

/** Scheduled pull, every 6 hours. */
export const syncSaasSubscriptions = functions
  .region('europe-west1')
  .runWith({ timeoutSeconds: 120 })
  .pubsub.schedule('every 6 hours')
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

/** Manual trigger for the CRM "Sync now" button. Guarded by a token. */
export const syncSaasSubscriptionsNow = functions
  .region('europe-west1')
  .runWith({ timeoutSeconds: 120 })
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
