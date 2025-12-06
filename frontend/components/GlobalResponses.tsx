import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Search, Mail, Clock, DollarSign, Calendar } from 'lucide-react';

const GlobalResponses: React.FC = () => {
  const { proposals, rfps, vendors } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProposals = proposals.filter(proposal => {
    const rfp = rfps.find(r => r.id === proposal.rfpId);
    const vendor = vendors.find(v => v.id === proposal.vendorId);
    const searchLower = searchTerm.toLowerCase();
    
    return (
      rfp?.title.toLowerCase().includes(searchLower) ||
      vendor?.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Global Response Inbox</h1>
        <p className="text-slate-400">Centralized view of all incoming vendor proposals.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search responses by vendor or RFP title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Responses List */}
      {filteredProposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Mail size={64} className="text-slate-600 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No responses found</h2>
          <p className="text-slate-400">
            {proposals.length === 0 
              ? "Wait for vendors to reply to your RFPs."
              : "No responses match your search criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => {
            const rfp = rfps.find(r => r.id === proposal.rfpId);
            const vendor = vendors.find(v => v.id === proposal.vendorId);

            return (
              <div
                key={proposal.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer"
                onClick={() => window.location.href = `/rfp/${proposal.rfpId}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={18} className="text-indigo-400" />
                      <h3 className="text-lg font-semibold text-white">
                        {vendor?.name || 'Unknown Vendor'}
                      </h3>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Response to: <span className="text-indigo-400">{rfp?.title || 'Unknown RFP'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      ${proposal.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 justify-end mt-1">
                      <Clock size={12} />
                      {new Date(proposal.receivedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

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

                {/* Preview of email content */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Email Preview</div>
                  <p className="text-sm text-slate-300 line-clamp-2">
                    {proposal.rawEmailContent}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GlobalResponses;
