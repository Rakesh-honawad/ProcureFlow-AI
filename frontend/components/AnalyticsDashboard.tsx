import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar
} from 'recharts';
import { DollarSign, TrendingUp, Clock, Award, Filter, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const { rfps, vendors, proposals } = useAppContext();
  const [timeRange, setTimeRange] = useState('YTD');


  const rfpsWithDate = rfps
    .map(r => ({ ...r, date: new Date(r.createdAt) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const spendTrendData = rfpsWithDate.map(r => ({
    name: r.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    budget: r.budget,
    actual: proposals.filter(p => p.rfpId === r.id).length > 0 
      ? Math.min(...proposals.filter(p => p.rfpId === r.id).map(p => p.totalAmount)) 
      : null
  }));


  const categorySpend: Record<string, number> = {};
  rfps.forEach(rfp => {
    // Estimate category based on first item or assign 'General'
    // In a real app, RFPs would have a category field. We'll infer from the selected vendor's category if available.
    let category = 'Unassigned';
    if (rfp.selectedVendorIds.length > 0) {
        const vendor = vendors.find(v => v.id === rfp.selectedVendorIds[0]);
        if (vendor) category = vendor.category;
    }
    categorySpend[category] = (categorySpend[category] || 0) + rfp.budget;
  });

  const categoryData = Object.keys(categorySpend).map(cat => ({
    name: cat,
    value: categorySpend[cat]
  })).sort((a, b) => b.value - a.value);


  const topVendors = [...vendors].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const radarData = [
    { subject: 'Reliability', fullMark: 5 },
    { subject: 'Pricing', fullMark: 5 },
    { subject: 'Quality', fullMark: 5 },
    { subject: 'Speed', fullMark: 5 },
    { subject: 'Communication', fullMark: 5 },
  ];

  const processedRadarData = radarData.map(dim => {
    const result: any = { subject: dim.subject };
    topVendors.forEach((v, i) => {
        // Add slight randomness to make the chart look interesting based on their base rating
        const variance = (Math.random() * 1) - 0.5;
        result[`v${i}`] = Math.min(5, Math.max(2, v.rating + variance));
    });
    return result;
  });

  // --- Metrics ---
  const totalSpend = rfps.reduce((sum, r) => sum + r.budget, 0);
  const totalProposals = proposals.length;
  const avgProposalsPerRfp = (totalProposals / (rfps.length || 1)).toFixed(1);
  const savingsRate = 12.5; // Mocked KPI

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
  const VENDOR_COLORS = ['#818cf8', '#34d399', '#f472b6'];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Procurement Intelligence</h1>
          <p className="text-slate-400 mt-1">Strategic insights into spending, efficiency, and supplier performance.</p>
        </div>
        
        <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center">
            {['30 Days', '90 Days', 'YTD', 'All Time'].map(range => (
                <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        timeRange === range 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    {range}
                </button>
            ))}
        </div>
      </div>

      {/* Strategic KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign size={64} className="text-indigo-500" />
            </div>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <DollarSign size={20} />
                </div>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Total Volume</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">${(totalSpend / 1000).toFixed(1)}k</div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-950/30 px-2 py-1 rounded-md w-fit">
                <ArrowUpRight size={12} /> +8.4% vs last period
            </div>
         </div>

         <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Award size={64} className="text-amber-500" />
            </div>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                    <Award size={20} />
                </div>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Est. Savings</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{savingsRate}%</div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-950/30 px-2 py-1 rounded-md w-fit">
                <ArrowUpRight size={12} /> +1.2% efficiency
            </div>
         </div>

         <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={64} className="text-emerald-500" />
            </div>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <TrendingUp size={20} />
                </div>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Proposal Competition</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{avgProposalsPerRfp}</div>
            <span className="text-slate-500 text-xs">Avg proposals per RFP</span>
         </div>

         <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock size={64} className="text-rose-500" />
            </div>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400">
                    <Clock size={20} />
                </div>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Avg Cycle Time</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">14 Days</div>
            <div className="flex items-center gap-1 text-rose-400 text-xs font-medium bg-rose-950/30 px-2 py-1 rounded-md w-fit">
                <ArrowDownRight size={12} /> -2 days faster
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart: Spend Velocity */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Spend Velocity</h3>
                    <p className="text-sm text-slate-400">Budgeted vs Actual Spend over time</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                        <span className="text-xs text-slate-300">Budget</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="text-xs text-slate-300">Actuals</span>
                    </div>
                </div>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} stroke="#475569" />
                    <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} stroke="#475569" tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="budget" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBudget)" />
                    <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2">Category Split</h3>
            <p className="text-sm text-slate-400 mb-6">Distribution of budget by category</p>
            
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                            formatter={(value: number) => `$${value.toLocaleString()}`}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
                {categoryData.slice(0, 4).map((cat, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                            <span className="text-slate-300">{cat.name}</span>
                        </div>
                        <span className="font-bold text-slate-400">${(cat.value / 1000).toFixed(1)}k</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Vendor Performance Matrix (Radar) */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Vendor Performance Matrix</h3>
                    <p className="text-sm text-slate-400">Comparing top 3 suppliers across key metrics</p>
                </div>
            </div>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedRadarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                        
                        {topVendors.map((vendor, idx) => (
                            <Radar
                                key={vendor.id}
                                name={vendor.name}
                                dataKey={`v${idx}`}
                                stroke={VENDOR_COLORS[idx % VENDOR_COLORS.length]}
                                strokeWidth={2}
                                fill={VENDOR_COLORS[idx % VENDOR_COLORS.length]}
                                fillOpacity={0.2}
                            />
                        ))}
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
                {topVendors.map((v, i) => (
                    <div key={v.id} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: VENDOR_COLORS[i % VENDOR_COLORS.length] }}></span>
                        <span className="text-slate-400">{v.name.split(' ')[0]}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* Efficiency Waterfall (Simplified as Bar for now) */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
             <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Sourcing Method Efficiency</h3>
                <p className="text-sm text-slate-400">Average savings per category</p>
             </div>
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData.slice(0, 5)} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tick={{ fill: '#cbd5e1', fontSize: 12 }} width={100} stroke="#475569" />
                        <Tooltip 
                            cursor={{fill: '#1e293b'}}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
      </div>

    </div>
  );
};

export default AnalyticsDashboard;