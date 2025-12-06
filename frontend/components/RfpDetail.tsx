import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { RFPStatus } from '../types';
import RfpResponses from './RfpResponses';
import ComparisonView from './ComparisonView';
import { Send, Check, ChevronLeft, Building2, Calendar, DollarSign, Package, Loader2, AlertCircle, X, ScrollText, Clock, CheckCircle, Mail, Zap } from 'lucide-react';

const RfpDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rfps, vendors, updateRfp, getProposalsByRfpId } = useAppContext();
  
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'proposals' | 'compare'>('overview');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTriggeringWebhook, setIsTriggeringWebhook] = useState(false);

  // Safety check for invalid ID
  if (!id) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
        <p className="text-red-400 text-lg">Invalid RFP ID</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 text-indigo-400 hover:text-indigo-300"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const rfp = rfps.find(r => r.id === id);
  
  // Loading state while RFP loads
  if (!rfp) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-slate-700 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  const proposals = getProposalsByRfpId(id);

  const toggleVendorSelection = (vendorId: string) => {
    if (rfp.status !== RFPStatus.DRAFT) return;

    const currentSelected = rfp.selectedVendorIds || [];
    const newSelected = currentSelected.includes(vendorId)
      ? currentSelected.filter(vid => vid !== vendorId)
      : [...currentSelected, vendorId];
    
    updateRfp(rfp.id, { selectedVendorIds: newSelected });
  };

  const handleSendRfp = async () => {
    if (!id) return;
    
    setIsSending(true);
    setError(null);
    
    try {
      const selectedVendors = vendors.filter(v => rfp.selectedVendorIds.includes(v.id));
      
      if (selectedVendors.length === 0) {
        setError("Please select at least one vendor");
        setIsSending(false);
        return;
      }

      console.log('📤 Sending RFP to backend...');
      
      // Call backend to send email
      const response = await fetch('http://localhost:4000/api/rfps/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfpId: id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send RFP');
      }

      const result = await response.json();
      console.log('✅ RFP sent successfully:', result);

      // Update RFP status in frontend
      updateRfp(id, { 
        status: RFPStatus.SENT
      });

      // Switch to proposals tab
      setActiveTab('proposals');
      setError(null);
      
    } catch (err: any) {
      console.error('❌ Send RFP error:', err);
      setError(err.message || 'Failed to send RFP emails. Please check your connection and try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Trigger webhook for demo
 // Trigger webhook for demo
const triggerWebhook = async () => {
  setIsTriggeringWebhook(true);
  
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
      // ✅ NO RELOAD - Just show success message
      alert('✅ Vendor response received! Check the proposals list below.');
      setIsTriggeringWebhook(false);
      // Proposals will appear automatically via polling (every 3 seconds)
    } else {
      alert('❌ Failed to process response. Check backend logs.');
      setIsTriggeringWebhook(false);
    }
  } catch (error) {
    alert('❌ Error: Make sure backend is running on port 4000');
    setIsTriggeringWebhook(false);
  }
};


  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 pt-6 pb-0 shadow-sm relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-slate-400 hover:text-white text-sm mb-6 transition-colors font-medium"
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{rfp.title}</h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-3 text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} className="text-slate-500"/>
                Due {new Date(rfp.deadline).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign size={16} className="text-slate-500"/>
                Budget ${rfp.budget.toLocaleString()}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                rfp.status === RFPStatus.DRAFT ? 'bg-slate-800 border-slate-700 text-slate-300' : 
                rfp.status === RFPStatus.SENT ? 'bg-blue-900/30 border-blue-800 text-blue-300' :
                rfp.status === RFPStatus.RESPONSE_RECEIVED ? 'bg-indigo-900/30 border-indigo-500/50 text-indigo-300' :
                'bg-emerald-900/30 border-emerald-800 text-emerald-300'
              }`}>
                {rfp.status}
              </span>
            </div>
          </div>
          
          {/* Send Button with Loading State */}
          {rfp.status === RFPStatus.DRAFT && (
            <button 
              onClick={handleSendRfp}
              disabled={rfp.selectedVendorIds.length === 0 || isSending}
              className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              {isSending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending Emails...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send to {rfp.selectedVendorIds.length} Vendor{rfp.selectedVendorIds.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          )}

          {/* Sent Status */}
          {rfp.status === RFPStatus.SENT && proposals.length === 0 && (
            <div className="flex items-center gap-2 text-blue-400 text-sm bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-800/50">
              <Clock size={16} className="animate-pulse" />
              <span>Awaiting vendor responses...</span>
            </div>
          )}

          {rfp.status === RFPStatus.SENT && proposals.length > 0 && (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 px-4 py-2 rounded-lg border border-green-800/50">
              <CheckCircle size={16} />
              <span>{proposals.length} Response{proposals.length !== 1 ? 's' : ''} Received</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-8 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            Overview & Vendors
          </button>
          <button 
            onClick={() => setActiveTab('proposals')}
            className={`pb-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'proposals' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            Incoming Responses 
            {proposals.length > 0 && (
              <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full text-xs font-bold border border-indigo-500/30">
                {proposals.length}
              </span>
            )}
          </button>
          {proposals.length > 0 && (
            <button 
              onClick={() => setActiveTab('compare')}
              className={`pb-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'compare' 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              AI Comparison
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full">
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-900/50 text-red-300 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <span className="font-medium text-sm sm:text-base">{error}</span>
            </div>
            <button 
              onClick={() => setError(null)} 
              className="text-red-400 hover:text-red-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Requirements Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-lg">
                  <div className="bg-indigo-500/10 p-1.5 rounded-lg text-indigo-400">
                    <Package size={20} /> 
                  </div>
                  Requirements
                </h3>
                <p className="text-slate-300 mb-8 text-sm sm:text-base leading-relaxed">{rfp.description}</p>
                
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Line Items</h4>
                <div className="space-y-3">
                  {rfp.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-colors">
                      <div className="min-w-0 pr-4">
                        <div className="font-semibold text-slate-200 truncate">{item.description}</div>
                        {item.specs && <div className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">{item.specs}</div>}
                      </div>
                      <div className="bg-slate-900 text-slate-300 border border-slate-700 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {rfp.requirements && rfp.requirements.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Vendor Requirements</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {rfp.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-slate-300 bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800">
                          <ScrollText size={16} className="text-indigo-400 shrink-0" />
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Vendors Column */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm sticky top-6">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-lg">
                  <div className="bg-indigo-500/10 p-1.5 rounded-lg text-indigo-400">
                    <Building2 size={20} /> 
                  </div>
                  Select Vendors
                </h3>
                <div className="space-y-3">
                  {vendors.map(vendor => {
                    const isSelected = rfp.selectedVendorIds.includes(vendor.id);
                    return (
                      <div 
                        key={vendor.id}
                        onClick={() => toggleVendorSelection(vendor.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                          isSelected 
                            ? 'bg-indigo-900/20 border-indigo-500/50 shadow-sm' 
                            : 'bg-slate-950/30 border-slate-800 hover:border-indigo-500/30'
                        } ${rfp.status !== RFPStatus.DRAFT ? 'cursor-not-allowed opacity-60' : ''}`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className={`font-semibold truncate transition-colors ${isSelected ? 'text-indigo-300' : 'text-slate-300 group-hover:text-white'}`}>
                            {vendor.name}
                          </div>
                          <div className="text-xs text-slate-500 truncate mt-0.5">
                            {vendor.category} • ⭐ {vendor.rating}
                          </div>
                        </div>
                        {isSelected ? (
                          <div className="bg-indigo-500 text-white p-1 rounded-full shadow-sm">
                            <Check size={12} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-700 group-hover:border-indigo-500 transition-colors"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {rfp.status === RFPStatus.DRAFT && (
                  <p className="text-xs text-slate-500 mt-6 text-center font-medium">
                    {rfp.selectedVendorIds.length === 0 
                      ? 'Select vendors above to enable sending.'
                      : `${rfp.selectedVendorIds.length} vendor${rfp.selectedVendorIds.length !== 1 ? 's' : ''} selected`
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Proposals Tab with Trigger Button */}
        {activeTab === 'proposals' && (
          <div>
            {/* TRIGGER BUTTON - ADDED HERE! */}
            {rfp.status === RFPStatus.SENT && proposals.length === 0 && (
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
                  </div>
                </div>
              </div>
            )}

            {/* Original RfpResponses Component */}
            <RfpResponses rfp={rfp} proposals={proposals} vendors={vendors} />
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'compare' && (
          <ComparisonView rfp={rfp} proposals={proposals} />
        )}

      </main>
    </div>
  );
};

export default RfpDetail;
