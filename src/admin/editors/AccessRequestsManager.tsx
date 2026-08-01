import { useEffect, useState } from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import {
  getPendingRequests,
  approveAccessRequest,
  rejectAccessRequest,
  type AccessRequest,
} from '../../firebase/accessRequests';

export default function AccessRequestsManager() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadRequests = async () => {
    try {
      const data = await getPendingRequests();
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading requests:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await approveAccessRequest(requestId, 'admin@optimumprimesolutions.co.ke');
      setNotification('✓ Access approved and email sent to user');
      await loadRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      setNotification('✗ Error approving request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!rejectionReason.trim()) {
      setNotification('Please provide a rejection reason');
      return;
    }

    setProcessingId(requestId);
    try {
      await rejectAccessRequest(requestId, rejectionReason, 'admin@optimumprimesolutions.co.ke');
      setNotification('✓ Request rejected and email sent to user');
      setSelectedRequest(null);
      setRejectionReason('');
      await loadRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      setNotification('✗ Error rejecting request');
    } finally {
      setProcessingId(null);
    }
  };

  const getTabLabel = (tabId: string): string => {
    const tabLabels: Record<string, string> = {
      company: 'Company Info',
      services: 'Services',
      products: 'Products & Pricing',
      industries: 'Industries',
      faqs: 'FAQ & Chatbot',
      whatsapp: 'WhatsApp',
      blogs: 'Blog Posts',
      subscribers: 'Subscribers',
      contact: 'Contact Info',
      testimonials: 'Reviews & Testimonials',
    };
    return tabLabels[tabId] || tabId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-red-600"></div>
          <p className="mt-2 text-sm text-slate-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Access Requests</h1>
        <p className="mt-2 text-slate-600">Manage user requests to access restricted admin panels</p>
      </div>

      {notification && (
        <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
          {notification}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-8 py-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No pending requests</h3>
          <p className="text-slate-600">All access requests have been processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">Pending</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{request.email}</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Requesting access to:{' '}
                    <span className="font-semibold text-slate-900">{getTabLabel(request.requestedTab)}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Requested on:{' '}
                    {request.createdAt.toDate().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(request.id)}
                    disabled={processingId !== null}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => setSelectedRequest(request.id)}
                    disabled={processingId !== null}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>

              {/* Rejection reason dialog */}
              {selectedRequest === request.id && (
                <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rejection reason (will be sent to user):
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., This panel is currently restricted to super-admins only."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={processingId !== null}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(null);
                        setRejectionReason('');
                      }}
                      className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-lg bg-blue-50 border border-blue-200 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">How it works:</p>
            <ul className="space-y-1 text-xs">
              <li>• Users request access to restricted panels via email</li>
              <li>• Requests appear here in real-time</li>
              <li>• Approve to grant immediate access + send confirmation email</li>
              <li>• Reject with a reason explanation for future reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
