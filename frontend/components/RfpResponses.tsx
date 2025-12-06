import React, { useState } from 'react';
import { RFP, Proposal, Vendor } from '../types';
import { Mail, Clock, DollarSign, Calendar, FileText, CheckCircle, Zap } from 'lucide-react';

interface Props {
  rfp: RFP;
  proposals: Proposal[];
  vendors: Vendor[];
}

const RfpResponses: React.FC<Props> = ({ rfp, proposals, vendors }) => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isTriggeringWebhook, setIsTriggeringWebhook] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState('');

  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.name || 'Unknown Vendor';
  };

  // Trigger webhook manually
  const triggerWebhook = async () => {
    setIsTriggeringWebhook(true);
    setWebhookMessage('');
    
    try {
      const response = await fetch('http://localhost:4000/api/email/inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'vendor.sales@techsupply.com',
          to: `rfp-${rfp.id}@procureflow.com`,
          subject: 'Re: RFP Response - Our Proposal',
          text: `Dear Procurement Team,

Thank you for the opportunity to submit our proposal for the CCTV Surveillance project.

PRICING BREAKDOWN:
- CCTV Cameras (High Resolution): $15,000
- Installation and Cabling: $8,500
- DVR/NVR System: $6,200
- Monitoring Software: $3,800
- Training and Documentation: $2,250

TOTAL QUOTE: $35,750

DELIVERY TIMELINE: 3-4 weeks from order confirmation
WARRANTY: 2 years on all equipment, 5 years on installation
PAYMENT TERMS: 30% advance, 70% on completion
ADDITIONAL: Free maintenance for first year included

All equipment meets government specifications. We look forward to working with you.

Best regards,
Sales Team
TechSupply Co.`
        })
      });

      if (response.ok) {
        setWebhookMessage('✅ Vendor response received! Page will refresh in 3 seconds...');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setWebhookMessage('❌ Failed to process response. Check backend logs.');
      }
    } catch (error) {
      setWebhookMessage('❌ Error: Make sure backend is running on port 4000');
    } finally {
      setIsTriggeringWebhook(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={18} className="text-indigo-400" />
            <span className="text-slate-400 text-sm">Responses Received</span>
          </div>
          <div className="text-2xl font-bold text-white">{proposals.length}</div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-orange-400" />
            <span className="text-slate-400 text-sm">Vendors Invited</span>
          </div>
          <div className="text-2xl font-bold text-white">{rfp.selectedVendorIds.length}</div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-green-400" />
            <span className="text-slate-400 text-sm">Lowest Quote</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {proposals.length > 0 
              ? `$${Math.min(...proposals.map(p => p.totalAmount)).toLocaleString()}`
              : '-'}
          </div>
        </div>
      </div>

      {/* Webhook Trigger Button - ADDED HERE! */}
      {rfp.status === 'SENT' && proposals.length === 0 && (
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-500/20 p-3 rounded-lg flex-shrink-0">
              <Zap className="text-indigo-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">
                Simulate Vendor Email Response
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                In production, vendor email replies trigger this webhook automatically via SendGrid Inbound Parse. 
                Click below to simulate a vendor responding to this RFP via email.
              </p>
              <button
                onClick={triggerWebhook}
                disabled={isTriggeringWebhook}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Mail size={18} />
                {isTriggeringWebhook ? 'Processing Response...' : '📨 Trigger Vendor Response Webhook'}
              </button>
              {webhookMessage && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${
                  webhookMessage.includes('✅') 
                    ? 'bg-green-900/20 border border-green-500/30 text-green-400' 
                    : 'bg-red-900/20 border border-red-500/30 text-red-400'
                }`}>
                  {webhookMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Proposals List */}
      {proposals.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/30 border border-slate-700 rounded-xl">
          <Mail size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Awaiting Vendor Responses
          </h3>
          <p className="text-slate-400">
            Vendors have been notified. Responses will appear here as they arrive.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 rounded-xl p-6 transition-all cursor-pointer"
              onClick={() => setSelectedProposal(proposal)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {getVendorName(proposal.vendorId).charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {getVendorName(proposal.vendorId)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock size={14} />
                        {new Date(proposal.receivedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    ${proposal.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Total Quote</div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Delivery</div>
                  <div className="text-sm text-white flex items-center gap-1">
                    <Calendar size={14} />
                    {proposal.deliveryTimeline}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Payment</div>
                  <div className="text-sm text-white">{proposal.paymentTerms}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Warranty</div>
                  <div className="text-sm text-white">{proposal.warrantyTerms}</div>
                </div>
              </div>

              {/* Email Preview */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <FileText size={12} />
                  Email Preview
                </div>
                <p className="text-sm text-slate-300 line-clamp-2">
                  {proposal.rawEmailContent}
                </p>
              </div>

              <button
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProposal(proposal);
                }}
              >
                View Full Proposal
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProposal(null)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Proposal from {getVendorName(selectedProposal.vendorId)}
                </h2>
                <div className="text-sm text-slate-400">
                  Received: {new Date(selectedProposal.receivedAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedProposal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Amount */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="text-sm text-green-400 mb-1">Total Quote</div>
              <div className="text-3xl font-bold text-white">
                ${selectedProposal.totalAmount.toLocaleString()}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-2">Delivery Timeline</div>
                <div className="text-white font-medium">{selectedProposal.deliveryTimeline}</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-2">Payment Terms</div>
                <div className="text-white font-medium">{selectedProposal.paymentTerms}</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-2">Warranty</div>
                <div className="text-white font-medium">{selectedProposal.warrantyTerms}</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-2">Proposal ID</div>
                <div className="text-white font-mono text-sm">{selectedProposal.id}</div>
              </div>
            </div>

            {/* Full Email Content */}
            <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
              <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FileText size={16} />
                Full Email Content
              </div>
              <div className="text-slate-300 text-sm whitespace-pre-wrap">
                {selectedProposal.rawEmailContent}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle size={18} />
                Accept Proposal
              </button>
              <button
                onClick={() => setSelectedProposal(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RfpResponses;
