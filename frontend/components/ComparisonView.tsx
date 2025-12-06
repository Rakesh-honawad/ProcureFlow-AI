import React, { useEffect, useState } from 'react';
import { RFP, Proposal, ComparisonAnalysis } from '../types';
import { useAppContext } from '../store/AppContext';
import { aiService } from '../services/aiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, ThumbsUp, ThumbsDown, Loader2, Table, Check, X, Wand2, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  rfp: RFP;
  proposals: Proposal[];
}

const ComparisonView: React.FC<Props> = ({ rfp, proposals }) => {
  const { vendors } = useAppContext();
  const [analysis, setAnalysis] = useState<ComparisonAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getVendorName = (id: string) => vendors.find(v => v.id === id)?.name || 'Unknown';

  // Sort proposals by amount for the chart
  const sortedProposals = [...proposals].sort((a, b) => a.totalAmount - b.totalAmount);

  const chartData = sortedProposals.map(p => ({
    name: getVendorName(p.vendorId).split(' ')[0], // Short name for axis
    amount: p.totalAmount,
    fullVendor: getVendorName(p.vendorId)
  }));

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = await aiService.compareProposals(rfp, proposals, vendors);
      setAnalysis({ rfpId: rfp.id, ...result });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (proposals.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center flex flex-col items-center">
        <div className="bg-slate-800 p-4 rounded-full mb-4">
           <AlertCircle className="text-slate-500" size={32} />
        </div>
        <h3 className="text-lg font-bold text-white">No Proposals Yet</h3>
        <p className="text-slate-500 mt-2">Waiting for vendor responses to generate comparison.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Feature Comparison Matrix (Raw Data) */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Table size={20} className="text-indigo-400" />
                Data Matrix
            </h3>
            <p className="text-slate-400 text-sm mt-1">Extracted data points side-by-side.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950/50 text-slate-200 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Total Quote</th>
                <th className="px-6 py-4">Delivery</th>
                <th className="px-6 py-4">Warranty</th>
                <th className="px-6 py-4">Payment Terms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {proposals.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-200">
                    {getVendorName(p.vendorId)}
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">
                    ${p.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{p.deliveryTimeline}</td>
                  <td className="px-6 py-4">{p.warrantyTerms}</td>
                  <td className="px-6 py-4">{p.paymentTerms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 2. Price Chart */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Cost Analysis</h3>
            <p className="text-sm text-slate-400 mb-6">Total quoted amount by vendor</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                  <XAxis type="number" unit="$" tick={{fontSize: 12, fill: '#94a3b8'}} stroke="#475569" />
                  <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#94a3b8'}} stroke="#475569" />
                  <Tooltip 
                    cursor={{fill: '#1e293b'}}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Quote']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                  />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. AI Evaluation Control */}
          {!analysis && !isLoading && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
               <div className="bg-indigo-500/10 p-4 rounded-full mb-4 ring-1 ring-indigo-500/30 relative z-10">
                 <Wand2 size={32} className="text-indigo-400" />
               </div>
               <h3 className="text-xl font-bold text-slate-100 mb-2 relative z-10">AI Smart Evaluation</h3>
               <p className="text-slate-400 mb-8 max-w-sm relative z-10">
                 Identify the best vendor based on price, terms, and RFP compliance requirements.
               </p>
               <button 
                 onClick={runAnalysis}
                 className="relative z-10 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-900/40 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5"
               >
                 <Sparkles size={18} /> Analyze Proposals
               </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
              <p className="text-slate-200 font-medium text-lg">AI is evaluating...</p>
              <p className="text-slate-500 text-sm mt-2">Checking compliance, calculating scores, and comparing terms.</p>
            </div>
          )}

          {/* 4. Recommendation Card (Small View) */}
          {analysis && !isLoading && (
             <div className="bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-24 bg-indigo-500/10 blur-3xl rounded-full -mr-12 -mt-12 pointer-events-none"></div>
                
                <div className="flex items-center gap-2 mb-4 relative z-10">
                    <Trophy className="text-amber-400" size={24} />
                    <span className="text-indigo-300 font-bold uppercase tracking-wider text-xs">AI Recommended Winner</span>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-2 relative z-10">{analysis.recommendation}</h3>
                <p className="text-slate-300 text-sm line-clamp-3 relative z-10">{analysis.summary}</p>
             </div>
          )}
      </div>

      {/* 5. Detailed Scores */}
      {analysis && (
        <div className="animate-fadeIn mt-8">
            <h3 className="text-lg font-bold text-slate-100 mb-5 flex items-center gap-2">
                <Check size={20} className="text-emerald-400" />
                Detailed Scorecards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {analysis.scores.map((score, idx) => (
                    <div key={idx} className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-colors group">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-lg text-slate-100 truncate pr-2 group-hover:text-indigo-400 transition-colors">
                                {score.vendorName}
                            </h4>
                            <div className={`shrink-0 px-3 py-1 rounded-full text-sm font-bold border ${
                                score.score >= 85 ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30' : 
                                score.score >= 70 ? 'bg-amber-950/30 text-amber-400 border-amber-500/30' : 'bg-red-950/30 text-red-400 border-red-500/30'
                            }`}>
                                {score.score} / 100
                            </div>
                        </div>
                        
                        <p className="text-sm text-slate-400 mb-6 italic pl-3 border-l-2 border-slate-700">
                            "{score.reasoning}"
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h5 className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase mb-2">
                                    <ThumbsUp size={12} /> Pros
                                </h5>
                                <ul className="text-xs text-slate-400 space-y-1.5">
                                    {score.pros.slice(0, 3).map((pro, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-1">•</span>{pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="flex items-center gap-1.5 text-xs font-bold text-red-500 uppercase mb-2">
                                    <ThumbsDown size={12} /> Cons
                                </h5>
                                <ul className="text-xs text-slate-400 space-y-1.5">
                                    {score.cons.slice(0, 3).map((con, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-red-500 mt-1">•</span>{con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;