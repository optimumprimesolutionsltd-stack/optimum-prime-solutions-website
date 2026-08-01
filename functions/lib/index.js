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
exports.sendTestEmail = exports.onAccessRequestApproved = exports.onAccessRequestSubmitted = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const nodemailer = __importStar(require("nodemailer"));
// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
// Configure email service - Update with your email settings
// For Gmail: Use an App Password (2FA enabled account)
// Or use SendGrid, Mailgun, etc.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL || 'admin@optimumprimesolutions.co.ke',
        pass: process.env.ADMIN_EMAIL_PASSWORD || 'your-app-password-here',
    },
});
const ADMIN_EMAIL = 'admin@optimumprimesolutions.co.ke';
const WEBSITE_URL = 'https://www.optimumprimesolutions.co.ke';
/**
 * Sends email when access request is submitted
 */
exports.onAccessRequestSubmitted = functions.firestore
    .document('access_requests/{requestId}')
    .onCreate(async (snap) => {
    const request = snap.data();
    const { email, requestedTab, id } = request;
    try {
        // Send notification to admin
        await transporter.sendMail({
            from: ADMIN_EMAIL,
            to: ADMIN_EMAIL,
            subject: `New Access Request: ${requestedTab}`,
            html: `
          <h2>New Access Request</h2>
          <p><strong>User Email:</strong> ${email}</p>
          <p><strong>Requested Panel:</strong> ${requestedTab}</p>
          <p><strong>Request ID:</strong> ${snap.id}</p>
          <p>
            <a href="${WEBSITE_URL}/admin" style="background-color: #dc2626; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; display: inline-block;">
              Review Request in Admin Panel
            </a>
          </p>
          <p><em>Requested at: ${new Date(request.createdAt.toDate()).toLocaleString()}</em></p>
        `,
        });
        console.log(`[AUDIT] Notification sent to admin for request ${snap.id}`);
    }
    catch (error) {
        console.error('Error sending admin notification:', error);
        // Don't throw - the request was still created successfully
    }
});
/**
 * Sends approval email to user when request is approved
 */
exports.onAccessRequestApproved = functions.firestore
    .document('access_requests/{requestId}')
    .onUpdate(async (change) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    // Only process if status changed to 'approved'
    if (beforeData.status !== 'approved' && afterData.status === 'approved') {
        const { email, requestedTab } = afterData;
        try {
            await transporter.sendMail({
                from: ADMIN_EMAIL,
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
            <p>If you have any questions, please contact us.</p>
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
        const { email, requestedTab, rejectionReason } = afterData;
        try {
            await transporter.sendMail({
                from: ADMIN_EMAIL,
                to: email,
                subject: `Access Request Decision: ${requestedTab}`,
                html: `
            <h2>Access Request Decision</h2>
            <p>Hello,</p>
            <p>Your request to access the <strong>${requestedTab}</strong> panel has been reviewed.</p>
            <p><strong>Status:</strong> Not Approved at this time</p>
            ${rejectionReason
                    ? `<p><strong>Reason:</strong></p><p>${rejectionReason}</p>`
                    : ''}
            <p>If you have questions or believe this is an error, please contact us.</p>
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
 * HTTP endpoint to manually trigger email sending (for testing)
 */
exports.sendTestEmail = functions.https.onRequest(async (req, res) => {
    // Add authentication check here!
    if (req.query.token !== process.env.TEST_EMAIL_TOKEN) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
    }
    const toEmail = typeof req.query.to === 'string' ? req.query.to : undefined;
    if (!toEmail) {
        res.status(400).json({ error: 'Missing email parameter' });
        return;
    }
    try {
        await transporter.sendMail({
            from: ADMIN_EMAIL,
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
//# sourceMappingURL=index.js.map