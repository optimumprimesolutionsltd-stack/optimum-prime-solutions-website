import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node scripts/set-admin-claim.mjs <grant|revoke> <email> [admin|staff]');
  console.error('Example: node scripts/set-admin-claim.mjs grant user@example.com');
  console.error('Example: node scripts/set-admin-claim.mjs grant user@example.com staff');
  console.error('');
  console.error('Roles mirror the split in database.rules.json:');
  console.error('  admin  full access, including write to /siteData (the public site content)');
  console.error('  staff  the CRM and registrant nodes, but NOT /siteData');
  console.error('');
  console.error('Environment: Set GOOGLE_APPLICATION_CREDENTIALS to your service account key path');
  process.exit(1);
}

const [action, email, role = 'admin'] = args;

if (!['grant', 'revoke'].includes(action)) {
  console.error('Action must be "grant" or "revoke"');
  process.exit(1);
}

if (!['admin', 'staff'].includes(role)) {
  console.error('Role must be "admin" or "staff"');
  process.exit(1);
}

if (!email || !email.includes('@')) {
  console.error('Invalid email address');
  process.exit(1);
}

const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credsPath) {
  console.error('Error: GOOGLE_APPLICATION_CREDENTIALS environment variable not set');
  console.error('Set it to your Firebase service account key path');
  process.exit(1);
}

if (!fs.existsSync(credsPath)) {
  console.error(`Error: Service account key not found at ${credsPath}`);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(credsPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://optimum-prime-website-default-rtdb.europe-west1.firebasedatabase.app',
});

const auth = admin.auth();

(async () => {
  try {
    const user = await auth.getUserByEmail(email);
    console.log(`Found user: ${user.email} (UID: ${user.uid})`);

    // setCustomUserClaims replaces the whole claims object rather than merging,
    // so carry over the role we are not touching. Without this, granting staff
    // to someone who is already an admin would silently strip their admin.
    const existing = user.customClaims || {};
    const claims = {
      admin: existing.admin === true,
      staff: existing.staff === true,
      [role]: action === 'grant',
    };

    await auth.setCustomUserClaims(user.uid, claims);
    console.log(
      `✓ ${action === 'grant' ? 'Granted' : 'Revoked'} ${role} for ${email} — claims now ${JSON.stringify(claims)}`,
    );
    console.log('  They must sign out and back in before the new token takes effect.');

    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`Error: No user found with email ${email}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
})();
