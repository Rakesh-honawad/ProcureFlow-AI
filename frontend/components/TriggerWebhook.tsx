import React, { useState } from 'react';
import { Mail, Zap } from 'lucide-react';

interface Props {
  rfpId: string;
}

const TriggerWebhook: React.FC<Props> = ({ rfpId }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const triggerWebhook = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:4000/api/email/inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'vendor.sales@techsupply.com',
          to: `rfp-${rfpId}@procureflow.com`,
          subject: 'Re: RFP Response - Our Proposal',
          text: `Dear Procurement Team,

Thank you for the opportunity to submit our proposal.

PRICING BREAKDOWN:
- Laptop Computers (15 units): $1,200 each = $18,000
- 27" LED Monitors (15 units): $350 each = $5,250
- Ergonomic Chairs (20 units): $400 each = $8,000
- Standing Desks (10 units): $650 each = $6,500

TOTAL QUOTE: $37,750

DELIVERY TIMELINE: 2-3 weeks from order confirmation
WARRANTY: 3 years on all electronics, 5 years on furniture
PAYMENT TERMS: Net 30 days
SHIPPING: Free delivery and installation included

All items meet your specifications. We look forward to working with you.

Best regards,
Sales Team
TechSupply Co.`
        })
      });

      if (response.ok) {
        setMessage('✅ Vendor response received! Refresh in 3 seconds...');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      setMessage('❌ Error: Make sure backend is running on port 4000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="bg-indigo-500/20 p-3 rounded-lg flex-shrink-0">
          <Zap className="text-indigo-400" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-2">
            Simulate Vendor Email Response
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            In production, vendor replies trigger this webhook automatically via SendGrid Inbound Parse. 
            Click below to simulate a vendor responding to this RFP.
          </p>
          <button
            onClick={triggerWebhook}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Mail size={18} />
            {loading ? 'Processing Response...' : '📨 Trigger Vendor Response Webhook'}
          </button>
          {message && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${
              message.includes('✅') 
                ? 'bg-green-900/20 border border-green-500/30 text-green-400' 
                : 'bg-red-900/20 border border-red-500/30 text-red-400'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriggerWebhook;
