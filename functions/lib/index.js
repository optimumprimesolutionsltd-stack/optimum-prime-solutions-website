"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSaasSubscriptionsNow = exports.syncSaasSubscriptions = exports.sendTestEmail = exports.onAccessRequestApproved = exports.onAccessRequestSubmitted = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const resend_1 = require("resend");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY || '');
const ADMIN_EMAIL = 'optimumprimesolutionsltd@gmail.com';
const WEBSITE_URL = 'https://www.optimumprimesolutions.co.ke';
/**
 * Sends email notification to admin when access request is submitted
 */
exports.onAccessRequestSubmitted = functions.region('europe-west1').firestore
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
    }
    catch (error) {
        console.error('Error sending admin notification:', error);
    }
});
/**
 * Sends email to user when request is approved or rejected
 */
exports.onAccessRequestApproved = functions.region('europe-west1').firestore
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
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('Error sending rejection email:', error);
        }
    }
});
/**
 * HTTP endpoint to test email sending
 */
exports.sendTestEmail = functions.region('europe-west1').https.onRequest(async (req, res) => {
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
    const provided = (typeof req.get === 'function' ? req.get('x-test-email-token') : undefined) ||
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
    }
    catch (error) {
        res.status(500).json({ error: String(error) });
    }
});
function saasSources() {
    return [
        { product: 'mavuno', label: 'Mavuno HR', url: process.env.MAVUNO_ORGS_URL, key: process.env.MAVUNO_SYNC_KEY },
        { product: 'jamvi', label: 'Jamvi', url: process.env.JAMVI_ORGS_URL, key: process.env.JAMVI_SYNC_KEY },
    ];
}
function mapOrgToSubscription(src, o, now) {
    const admins = Array.isArray(o?.admins) ? o.admins : [];
    const firstAdmin = admins[0];
    const adminEmail = typeof firstAdmin === 'string' ? firstAdmin : firstAdmin?.email ?? null;
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
async function runSaasSync() {
    const rtdb = admin.database();
    const now = new Date().toISOString();
    const summary = { ranAt: now };
    // Read once — the node holds a handful of orgs, so an index isn't worth it.
    const currentSnap = await rtdb.ref('saasSubscriptions').once('value');
    const current = currentSnap.val() || {};
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
            const updates = {};
            const seen = new Set();
            for (const o of orgs) {
                const id = String(o?.id ?? o?.orgId ?? '');
                if (!id)
                    continue;
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
        }
        catch (err) {
            summary[src.product] = `error — ${err.message}`;
            functions.logger.error(`saas-sync ${src.product}`, err);
        }
    }
    functions.logger.info('saas-sync complete', summary);
    return summary;
}
/** Scheduled pull, every 6 hours. */
exports.syncSaasSubscriptions = functions
    .region('europe-west1')
    .runWith({ timeoutSeconds: 120 })
    .pubsub.schedule('every 6 hours')
    .onRun(async () => {
    await runSaasSync();
    return null;
});
/** Manual trigger for the CRM "Sync now" button. Guarded by a token. */
exports.syncSaasSubscriptionsNow = functions
    .region('europe-west1')
    .runWith({ timeoutSeconds: 120 })
    .https.onRequest(async (req, res) => {
    const expected = process.env.SAAS_SYNC_TRIGGER_TOKEN;
    if (!expected) {
        res.status(503).json({ error: 'Endpoint not configured' });
        return;
    }
    const provided = (typeof req.get === 'function' ? req.get('x-sync-token') : undefined) ||
        (typeof req.query.token === 'string' ? req.query.token : undefined);
    if (provided !== expected) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const summary = await runSaasSync();
        res.json(summary);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
//# sourceMappingURL=index.js.map