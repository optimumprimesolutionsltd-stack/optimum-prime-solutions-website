import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'optimumprimesolutionsltd@gmail.com',
    pass: 'cmrizlkufctbjief',
  },
});

const ADMIN_EMAIL = 'optimumprimesolutionsltd@gmail.com';
const WEBSITE_URL = 'https://www.optimumprimesolutions.co.ke';

// Generate approval token for email links
function generateApprovalToken(requestId: string): string {
  return crypto.createHash('sha256').update(requestId + ADMIN_EMAIL).digest('hex');
}

/**
 * Sends email to admin when access request is submitted
 * Admin approves/rejects directly via email links
 */
export const onAccessRequestSubmitted = functions.region('europe-west1').firestore
  .document('access_requests/{requestId}')
  .onCreate(async (snap) => {
    const request = snap.data();
    const { email, requestedTab } = request;
    const requestId = snap.id;
    const token = generateApprovalToken(requestId);

    try {
      // Send notification to admin with approve/reject links
      await transporter.sendMail({
        from: ADMIN_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Access Request: ${requestedTab} from ${email}`,
        html: `
          <h2>New Access Request</h2>
          <p><strong>User Email:</strong> ${email}</p>
          <p><strong>Requested Panel:</strong> ${requestedTab}</p>
          <p><strong>Request ID:</strong> ${requestId}</p>
          <p>Approve or reject this request directly from your email:</p>
          <p style="margin: 20px 0;">
            <a href="${WEBSITE_URL}/api/access-approval?id=${requestId}&action=approve&token=${token}" style="background-color: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-right: 10px; font-weight: bold;">
              ✓ APPROVE
            </a>
            <a href="${WEBSITE_URL}/api/access-approval?id=${requestId}&action=reject&token=${token}" style="background-color: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold;">
              ✗ REJECT
            </a>
          </p>
          <p><em>Requested at: ${new Date(request.createdAt.toDate()).toLocaleString()}</em></p>
        `,
      });

      console.log(`[AUDIT] Admin notification sent for request ${requestId}`);
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  });

/**
 * HTTP endpoint to approve/reject access requests via email links
 */
export const handleAccessApproval = functions.region('europe-west1').https.onRequest(async (req, res) => {
  const { id, action, token } = req.query;

  // Validate parameters
  if (!id || !action || !token) {
    res.status(400).send('Missing required parameters: id, action, token');
    return;
  }

  // Validate action
  if (action !== 'approve' && action !== 'reject') {
    res.status(400).send('Invalid action. Must be "approve" or "reject"');
    return;
  }

  // Verify token
  const expectedToken = generateApprovalToken(id as string);
  if (token !== expectedToken) {
    res.status(403).send('Invalid approval token');
    return;
  }

  try {
    const requestRef = db.collection('access_requests').doc(id as string);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      res.status(404).send('Request not found');
      return;
    }

    const requestData = requestDoc.data() as any;
    const { email, requestedTab, status } = requestData;

    // Prevent double approval/rejection
    if (status !== 'pending') {
      res.status(400).send(`Request already ${status}`);
      return;
    }

    // Update request status
    await requestRef.update({
      status: action === 'approve' ? 'approved' : 'rejected',
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Send email to user
    const subject = action === 'approve'
      ? `✓ Access Approved: ${requestedTab}`
      : `Access Request Decision: ${requestedTab}`;

    const html = action === 'approve'
      ? `
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
      `
      : `
        <h2>Access Request Decision</h2>
        <p>Hello,</p>
        <p>Your request to access the <strong>${requestedTab}</strong> panel has been reviewed.</p>
        <p><strong>Status:</strong> Not approved at this time</p>
        <p>If you have questions, please contact us.</p>
        <p>Best regards,<br/>Optimum Prime Solutions Team</p>
      `;

    await transporter.sendMail({
      from: ADMIN_EMAIL,
      to: email,
      subject,
      html,
    });

    console.log(`[AUDIT] Access ${action === 'approve' ? 'approved' : 'rejected'} for ${email} on ${requestedTab}`);

    // Return success page
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Access Request ${action === 'approve' ? 'Approved' : 'Rejected'}</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .container { max-width: 500px; margin: 0 auto; }
            .success { color: #22c55e; }
            .reject { color: #ef4444; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="${action === 'approve' ? 'success' : 'reject'}">
              ${action === 'approve' ? '✓ Access Approved' : '✗ Access Rejected'}
            </h1>
            <p>User <strong>${email}</strong> has been ${action === 'approve' ? 'granted' : 'denied'} access to <strong>${requestedTab}</strong>.</p>
            <p>A confirmation email has been sent to the user.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error handling approval:', error);
    res.status(500).send('Error processing request');
  }
});
