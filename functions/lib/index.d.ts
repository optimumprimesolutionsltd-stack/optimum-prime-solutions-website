import * as functions from 'firebase-functions';
/**
 * Sends email notification to admin when access request is submitted
 */
export declare const onAccessRequestSubmitted: functions.CloudFunction<functions.firestore.QueryDocumentSnapshot>;
/**
 * Sends email to user when request is approved or rejected
 */
export declare const onAccessRequestApproved: functions.CloudFunction<functions.Change<functions.firestore.QueryDocumentSnapshot>>;
/**
 * HTTP endpoint to test email sending
 */
export declare const sendTestEmail: functions.HttpsFunction;
/** Scheduled pull, every 6 hours. */
export declare const syncSaasSubscriptions: functions.CloudFunction<unknown>;
/** Manual trigger for the CRM "Sync now" button. Guarded by a token. */
export declare const syncSaasSubscriptionsNow: functions.HttpsFunction;
//# sourceMappingURL=index.d.ts.map