# Firebase Cloud Functions Deployment Guide

This guide will walk you through deploying the email notification system for access requests.

## Prerequisites

✅ **Already Completed:**
- Firebase CLI installed (`firebase@15.25.1`)
- Functions code compiled and ready
- `.firebaserc` configured for project `optimum-prime-website`
- `firebase.json` configured
- Firestore security rules created
- Environment variables template created

## Step 1: Authenticate with Firebase

Run this command in your terminal:

```bash
firebase login
```

This will open your browser and ask you to:
1. Sign in with your Google account
2. Grant Firebase CLI permission to manage your project
3. Close the browser window when complete

## Step 2: Configure Email Credentials

You have two options for sending emails:

### Option A: Gmail (Recommended)

1. **Enable 2-Factor Authentication** on your Google account
2. **Create an App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Generate a password (16 characters)
   - Copy the password
3. **Update `.env` file** in `functions/` folder:
   ```bash
   ADMIN_EMAIL=admin@optimumprimesolutions.co.ke
   ADMIN_EMAIL_PASSWORD=your-16-char-app-password
   ```

### Option B: SendGrid (More Reliable)

1. **Create SendGrid Account:** https://sendgrid.com/free
2. **Get API Key:** https://app.sendgrid.com/settings/api_keys
3. **Update Cloud Function** to use SendGrid instead of Nodemailer
4. Replace the transporter setup in `functions/src/index.ts`

## Step 3: Set Firebase Environment Variables

Set the environment variables in Firebase:

```bash
firebase functions:config:set gmail.address="admin@optimumprimesolutions.co.ke"
firebase functions:config:set gmail.password="your-app-password"
firebase functions:config:set email.test_token="your-test-token-12345"
```

Or use the Firebase Console:
1. Go to: https://console.firebase.google.com/project/optimum-prime-website/functions
2. Click "Environment variables" tab
3. Add the variables above

## Step 4: Deploy Functions

Run this command:

```bash
firebase deploy --only functions
```

Expected output:
```
i  deploying functions, hosting
i  functions: ensuring required API client-functions.googleapis.com is enabled...
i  functions: ensuring required API artifactregistry.googleapis.com is enabled...
...
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/optimum-prime-website/overview
Functions Dashboard: https://console.firebase.google.com/project/optimum-prime-website/functions
```

## Step 5: Enable Firestore Database

1. Go to: https://console.firebase.google.com/project/optimum-prime-website/firestore
2. Click "Create database"
3. Choose "Start in production mode"
4. Select region: `eur3` (Europe)
5. Click "Create"

## Step 6: Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Step 7: Test Email Functionality

Once deployed, test the email function:

```bash
curl "https://your-region-optimum-prime-website.cloudfunctions.net/sendTestEmail?to=test@email.com&token=your-test-token-12345"
```

Expected response:
```json
{
  "success": true,
  "message": "Email sent"
}
```

## Step 8: Verify in Production

1. Go to admin panel: https://www.optimumprimesolutions.co.ke/admin
2. Try requesting access to a restricted tab
3. Check admin email for notification
4. Approve the request
5. Verify user receives approval email

## Troubleshooting

### "Failed to authenticate"
- Run `firebase login` again
- Make sure you're logged in with the correct Google account

### "Function deployment failed"
- Check for TypeScript compilation errors: `cd functions && npx tsc`
- Ensure all dependencies are installed: `cd functions && npm install`
- Check that `.firebaserc` has the correct project ID

### "Email not sending"
- Verify Gmail app password is correct (16 characters, no spaces)
- Check Firebase logs: `firebase functions:log`
- Ensure 2FA is enabled on Gmail account
- For SendGrid, verify API key is valid

### "Permission denied" errors
- Go to: https://console.firebase.google.com/project/optimum-prime-website/settings/serviceaccounts
- Enable "Cloud Functions" service account
- Grant it "Cloud Functions Developer" role

## Environment Variables Checklist

Make sure you have:

```bash
# In functions/.env.local (for local testing)
ADMIN_EMAIL=admin@optimumprimesolutions.co.ke
ADMIN_EMAIL_PASSWORD=your-app-password
TEST_EMAIL_TOKEN=test-token-12345

# In Firebase Console (for production)
ADMIN_EMAIL=admin@optimumprimesolutions.co.ke
ADMIN_EMAIL_PASSWORD=your-app-password
TEST_EMAIL_TOKEN=test-token-12345
```

## Files Created

- ✅ `.firebaserc` - Project configuration
- ✅ `firebase.json` - Firebase settings
- ✅ `firestore.rules` - Database security rules
- ✅ `firestore.indexes.json` - Database indexes
- ✅ `functions/src/index.ts` - Cloud Functions code
- ✅ `functions/package.json` - Dependencies
- ✅ `functions/tsconfig.json` - TypeScript config
- ✅ `functions/.env.local` - Environment variables template

## Next Steps

After deployment:
1. Monitor access requests in admin panel
2. Approve/reject requests from users
3. Users receive email notifications immediately
4. Track all actions in Firebase logs

## Support

For issues:
1. Check Firebase logs: `firebase functions:log`
2. Review Firestore rules: Console → Firestore → Rules
3. Test email endpoint: See "Step 7" above
4. Check function execution: Console → Functions → Logs

---

**Status:** Ready for deployment ✅
**Commands needed:** `firebase login` → `firebase deploy --only functions`
