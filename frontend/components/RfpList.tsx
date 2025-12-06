import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { Calendar, DollarSign, ChevronRight, FileText, CheckCircle2, Clock, PieChart, TrendingUp, Layers } from 'lucide-react';
import { RFPStatus } from '../types';

const RfpList: React.FC = () => {
  const { rfps, getProposalsByRfpId } = useAppContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const getStatusColor = (status: RFPStatus) => {
    switch (status) {
      case RFPStatus.DRAFT: return 'bg-slate-800 text-slate-300 border-slate-700';
      case RFPStatus.SENT: return 'bg-blue-900/30 text-blue-300 border-blue-800';
      case RFPStatus.RESPONSE_RECEIVED: return 'bg-indigo-900/30 text-indigo-300 border-indigo-800';
      case RFPStatus.AWARDED: return 'bg-emerald-900/30 text-emerald-300 border-emerald-800';
      case RFPStatus.CLOSED: return 'bg-rose-900/30 text-rose-300 border-rose-800';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  // KPI Calculations
  const totalRfps = rfps.length;
  const activePipeline = rfps.filter(r => [RFPStatus.DRAFT, RFPStatus.SENT, RFPStatus.RESPONSE_RECEIVED].includes(r.status)).length;
  const completed = rfps.filter(r => [RFPStatus.AWARDED, RFPStatus.CLOSED].includes(r.status)).length;
  const totalVolume = rfps.reduce((sum, r) => sum + (r.budget || 0), 0);

  // Filtering
  const filteredRfps = rfps.filter(r => {
    if (filter === 'active') return [RFPStatus.DRAFT, RFPStatus.SENT, RFPStatus.RESPONSE_RECEIVED].includes(r.status);
    if (filter === 'completed') return [RFPStatus.AWARDED, RFPStatus.CLOSED].includes(r.status);
    return true;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of your procurement activities</p>
        </div>
        <button 
          onClick={() => navigate('/create-rfp')}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-900/50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <FileText size={18} />
          New RFP
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-indigo-500/30 transition-all relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
           <div className="relative">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
                  <Layers size={22} />
                </div>
             </div>
             <div className="text-3xl font-bold text-white">{totalRfps}</div>
             <div className="text-sm font-medium text-slate-400 mt-1">Total RFPs</div>
           </div>
        </div>
        
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-blue-500/30 transition-all relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
           <div className="relative">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/30">
                  <TrendingUp size={22} />
                </div>
             </div>
             <div className="text-3xl font-bold text-white">{activePipeline}</div>
             <div className="text-sm font-medium text-slate-400 mt-1">Active Pipeline</div>
           </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
           <div className="relative">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 size={22} />
                </div>
             </div>
             <div className="text-3xl font-bold text-white">{completed}</div>
             <div className="text-sm font-medium text-slate-400 mt-1">Completed</div>
           </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-amber-500/30 transition-all relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
           <div className="relative">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/30">
                  <DollarSign size={22} />
                </div>
             </div>
             <div className="text-3xl font-bold text-white">${(totalVolume / 1000).toFixed(1)}k</div>
             <div className="text-sm font-medium text-slate-400 mt-1">Est. Volume</div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-800 overflow-x-auto pb-1">
        {[
            { id: 'all', label: 'All Requests' }, 
            { id: 'active', label: 'Active Pipeline' }, 
            { id: 'completed', label: 'Completed' }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap relative ${
                    filter === tab.id 
                    ? 'text-indigo-400 bg-slate-900 border border-slate-800 border-b-slate-900 z-10' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'
                }`}
            >
                {tab.label}
                {filter === tab.id && <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-lg"></div>}
            </button>
        ))}
      </div>

      {/* List */}
      {filteredRfps.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed backdrop-blur-sm">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-slate-500" size={32} />
          </div>
          <h3 className="text-lg font-medium text-white">No RFPs found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">Create a new request to get started.</p>
          <button 
            onClick={() => navigate('/create-rfp')}
            className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline"
          >
            Create your first RFP &rarr;
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRfps.map((rfp) => {
             const proposalCount = getProposalsByRfpId(rfp.id).length;
             return (
              <div 
                key={rfp.id} 
                onClick={() => navigate(`/rfp/${rfp.id}`)}
                className="bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all cursor-pointer group hover:-translate-y-0.5"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors truncate max-w-full">
                        {rfp.title}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide border ${getStatusColor(rfp.status)}`}>
                        {rfp.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-1 mb-4">
                      {rfp.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/50 border border-slate-800 group-hover:border-indigo-500/30 transition-colors">
                        <Calendar size={15} className="text-slate-500 group-hover:text-indigo-400" />
                        <span>Due {new Date(rfp.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/50 border border-slate-800 group-hover:border-indigo-500/30 transition-colors">
                        <DollarSign size={15} className="text-slate-500 group-hover:text-indigo-400" />
                        <span>Est. ${rfp.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/50 border border-slate-800 group-hover:border-indigo-500/30 transition-colors">
                        <Clock size={15} className="text-slate-500 group-hover:text-indigo-400" />
                        <span>{proposalCount} Proposals</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden sm:flex items-center text-slate-600 group-hover:text-indigo-400 transition-colors pl-4 border-l border-slate-800">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RfpList;