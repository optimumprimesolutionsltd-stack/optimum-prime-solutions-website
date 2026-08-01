import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { getDb } from './config';

const db = getDb();

export interface AccessRequest {
  id: string;
  email: string;
  requestedTab: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  approvedAt?: Timestamp;
  approvedBy?: string;
  rejectionReason?: string;
}

// Submit a new access request
export const submitAccessRequest = async (
  email: string,
  tabId: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'access_requests'), {
      email: email.toLowerCase().trim(),
      requestedTab: tabId,
      status: 'pending',
      createdAt: Timestamp.now(),
    });

    console.log(`[AUDIT] Access request submitted for "${tabId}" from ${email}`);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting access request:', error);
    throw error;
  }
};

// Get all pending access requests (for admin)
export const getPendingRequests = async (): Promise<AccessRequest[]> => {
  try {
    const q = query(
      collection(db, 'access_requests'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as AccessRequest));
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return [];
  }
};

// Get all access requests for a specific email
export const getRequestsForEmail = async (email: string): Promise<AccessRequest[]> => {
  try {
    const q = query(
      collection(db, 'access_requests'),
      where('email', '==', email.toLowerCase().trim()),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as AccessRequest));
  } catch (error) {
    console.error('Error fetching requests for email:', error);
    return [];
  }
};

// Approve a request
export const approveAccessRequest = async (
  requestId: string,
  approvedBy: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'access_requests', requestId);
    await updateDoc(docRef, {
      status: 'approved',
      approvedAt: Timestamp.now(),
      approvedBy,
    });

    console.log(`[AUDIT] Access request ${requestId} approved by ${approvedBy}`);
  } catch (error) {
    console.error('Error approving request:', error);
    throw error;
  }
};

// Reject a request
export const rejectAccessRequest = async (
  requestId: string,
  rejectionReason: string,
  rejectedBy: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'access_requests', requestId);
    await updateDoc(docRef, {
      status: 'rejected',
      rejectionReason,
      approvedBy: rejectedBy,
      approvedAt: Timestamp.now(),
    });

    console.log(`[AUDIT] Access request ${requestId} rejected by ${rejectedBy}`);
  } catch (error) {
    console.error('Error rejecting request:', error);
    throw error;
  }
};

// Check if email has approved access to a tab
export const hasApprovedAccess = async (
  email: string,
  tabId: string
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'access_requests'),
      where('email', '==', email.toLowerCase().trim()),
      where('requestedTab', '==', tabId),
      where('status', '==', 'approved')
    );

    const snapshot = await getDocs(q);
    return snapshot.size > 0;
  } catch (error) {
    console.error('Error checking approved access:', error);
    return false;
  }
};

// Check if email has pending request for a tab
export const hasPendingRequest = async (
  email: string,
  tabId: string
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'access_requests'),
      where('email', '==', email.toLowerCase().trim()),
      where('requestedTab', '==', tabId),
      where('status', '==', 'pending')
    );

    const snapshot = await getDocs(q);
    return snapshot.size > 0;
  } catch (error) {
    console.error('Error checking pending request:', error);
    return false;
  }
};
