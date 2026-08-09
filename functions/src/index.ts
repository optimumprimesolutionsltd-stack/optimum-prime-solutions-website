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
