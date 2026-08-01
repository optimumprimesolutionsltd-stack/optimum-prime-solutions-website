import * as functions from 'firebase-functions';
/**
 * Sends email when access request is submitted
 */
export declare const onAccessRequestSubmitted: functions.CloudFunction<functions.firestore.QueryDocumentSnapshot>;
/**
 * Sends approval email to user when request is approved
 */
export declare const onAccessRequestApproved: functions.CloudFunction<functions.Change<functions.firestore.QueryDocumentSnapshot>>;
/**
 * HTTP endpoint to manually trigger email sending (for testing)
 */
export declare const sendTestEmail: functions.HttpsFunction;
//# sourceMappingURL=index.d.ts.map