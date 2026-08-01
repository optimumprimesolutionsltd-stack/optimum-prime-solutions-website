import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

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
export const onAccessRequestSubmitted = functions.firestore
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
    } catch (error) {
      console.error('Error sending admin notification:', error);
      // Don't throw - the request was still created successfully
    }
  });

/**
 * Sends approval email to user when request is approved
 */
export const onAccessRequestApproved = functions.firestore
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
      } catch (error) {
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
            ${
              rejectionReason
                ? `<p><strong>Reason:</strong></p><p>${rejectionReason}</p>`
                : ''
            }
            <p>If you have questions or believe this is an error, please contact us.</p>
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
 * HTTP endpoint to manually trigger email sending (for testing)
 */
export const sendTestEmail = functions.https.onRequest(async (req, res) => {
  // Add authentication check here!
  if (req.query.token !== process.env.TEST_EMAIL_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    await transporter.sendMail({
      from: ADMIN_EMAIL,
      to: req.query.to,
      subject: 'Test Email',
      html: '<p>This is a test email from Optimum Prime Solutions Cloud Functions.</p>',
    });

    res.json({ success: true, message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});
