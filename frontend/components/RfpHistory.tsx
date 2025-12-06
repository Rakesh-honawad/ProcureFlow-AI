import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { RFPStatus } from '../types';
import { Search, Filter, Calendar, ChevronRight, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';

const RfpHistory: React.FC = () => {
  const { rfps, getProposalsByRfpId } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');

  const filteredRfps = rfps.filter(rfp => {
    // Search
    const matchesSearch = rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rfp.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter
    let matchesFilter = true;
    if (statusFilter === 'COMPLETED') {
      matchesFilter = [RFPStatus.AWARDED, RFPStatus.CLOSED].includes(rfp.status);
    } else if (statusFilter === 'PENDING') {
      matchesFilter = [RFPStatus.DRAFT, RFPStatus.SENT].includes(rfp.status);
    }

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: RFPStatus) => {
    switch (status) {
      case RFPStatus.AWARDED:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 size={12}/> Awarded</span>;
      case RFPStatus.CLOSED:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle size={12}/> Closed</span>;
      case RFPStatus.SENT:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20"><Clock size={12}/> Sent</span>;
      default:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20"><FileText size={12}/> Draft</span>;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Procurement History</h1>
          <p className="text-slate-500 mt-1">Archive and audit log of all procurement requests.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search history..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none placeholder-slate-600 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'PENDING', label: 'In Progress' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setStatusFilter(opt.id as any)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                statusFilter === opt.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-900/20'
                  : 'bg-slate-950 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-300 uppercase font-bold text-xs border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">RFP Title</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4">Est. Budget</th>
                <th className="px-6 py-4">Proposals</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRfps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                    No records found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRfps.map(rfp => (
                  <tr key={rfp.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-200">
                      <div className="truncate max-w-xs" title={rfp.title}>{rfp.title}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs mt-0.5">{rfp.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(rfp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      ${rfp.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {getProposalsByRfpId(rfp.id).length}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(rfp.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/rfp/${rfp.id}`)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 hover:underline"
                      >
                        View <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RfpHistory;