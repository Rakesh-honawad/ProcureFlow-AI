import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Vendor } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Mail, Tag, Star, Search, X, Building2, Filter, ChevronDown } from 'lucide-react';

const VendorList: React.FC = () => {
  const { vendors, addVendor, deleteVendor } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState(0);
  
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: '',
    email: '',
    category: '',
    rating: 0 // Default
  });

  // Extract unique categories for the filter dropdown
  const uniqueCategories = ['All', ...Array.from(new Set(vendors.map(v => v.category))).sort()];

  const filteredVendors = vendors.filter(v => {
    // 1. Text Search
    const term = searchTerm.toLowerCase().trim();
    const keywords = term.split(/\s+/).filter(Boolean);
    const vendorText = `${v.name} ${v.category} ${v.email}`.toLowerCase();
    const matchesSearch = keywords.every(keyword => vendorText.includes(keyword));

    // 2. Category Filter
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;

    // 3. Rating Filter
    const matchesRating = v.rating >= minRating;

    return matchesSearch && matchesCategory && matchesRating;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.email || !newVendor.category) return;

    if (vendors.some(v => v.email.toLowerCase() === newVendor.email?.toLowerCase())) {
      alert('A vendor with this email address already exists.');
      return;
    }

    const vendor: Vendor = {
      id: uuidv4(),
      name: newVendor.name || 'Unknown',
      email: newVendor.email || '',
      category: newVendor.category || 'General',
      rating: 4.2
    };

    addVendor(vendor);
    setSearchTerm('');
    setSelectedCategory('All'); // Reset filters to show new vendor
    setMinRating(0);
    setIsAdding(false);
    setNewVendor({ name: '', email: '', category: '', rating: 0 });
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your vendor list?`)) {
      deleteVendor(id);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Hardware': 'bg-blue-900/30 text-blue-300 border-blue-800',
      'Software': 'bg-fuchsia-900/30 text-fuchsia-300 border-fuchsia-800',
      'Services': 'bg-emerald-900/30 text-emerald-300 border-emerald-800',
      'Office Supplies': 'bg-orange-900/30 text-orange-300 border-orange-800',
      'Electronics': 'bg-cyan-900/30 text-cyan-300 border-cyan-800',
      'General': 'bg-slate-800 text-slate-300 border-slate-700',
    };
    return colors[category] || 'bg-slate-800 text-slate-300 border-slate-700';
  };

  // Generate a distinct gradient for the avatar based on the name length
  const getAvatarGradient = (name: string) => {
    const gradients = [
      'from-indigo-500 to-blue-600',
      'from-violet-500 to-purple-600',
      'from-fuchsia-500 to-pink-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-red-600',
    ];
    return gradients[name.length % gradients.length];
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Vendor Management</h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">Maintain your database of approved suppliers.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={18} />
          Add Vendor
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        
        {/* Text Search */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or keywords..."
            className="pl-11 w-full border border-slate-700 bg-slate-900 rounded-xl py-3.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="relative min-w-[200px] group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <Filter className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
             <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-11 pr-10 w-full border border-slate-700 bg-slate-900 rounded-xl py-3.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none shadow-sm transition-all appearance-none cursor-pointer"
          >
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Departments' : cat}</option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="relative min-w-[180px] group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <Star className="h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
          </div>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
             <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="pl-11 pr-10 w-full border border-slate-700 bg-slate-900 rounded-xl py-3.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none shadow-sm transition-all appearance-none cursor-pointer"
          >
            <option value={0}>All Ratings</option>
            <option value={4.5}>4.5+ Stars Only</option>
            <option value={4}>4+ Stars Only</option>
            <option value={3}>3+ Stars Only</option>
          </select>
        </div>

      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <div 
              key={vendor.id} 
              className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarGradient(vendor.name)} rounded-2xl flex items-center justify-center text-white shadow-md transform group-hover:scale-105 transition-transform duration-300 border border-white/10`}>
                     <span className="font-bold text-xl">{vendor.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(vendor.id, vendor.name);
                    }}
                    className="text-slate-500 hover:text-red-400 hover:bg-red-900/20 p-2 rounded-lg transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    title="Delete Vendor"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <h3 className="font-bold text-lg text-white mb-1 line-clamp-1" title={vendor.name}>
                  {vendor.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-5" title={`Rating: ${vendor.rating}`}>
                   {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < Math.floor(vendor.rating) ? "text-amber-400 fill-amber-400 drop-shadow-sm" : "text-slate-700 fill-slate-700"} 
                      />
                   ))}
                   <span className="text-xs text-slate-500 font-medium ml-1">({vendor.rating})</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <div className="p-1.5 bg-slate-800 rounded-md group-hover:bg-indigo-500/20 transition-colors">
                     <Mail size={14} className="text-slate-500 group-hover:text-indigo-400 shrink-0" />
                  </div>
                  <span className="truncate" title={vendor.email}>{vendor.email}</span>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                   <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getCategoryColor(vendor.category)}`}>
                      {vendor.category}
                   </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border-dashed">
               <Search className="text-slate-500" size={32} />
            </div>
            <h3 className="text-lg font-medium text-white">No vendors found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
            <button 
               onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setMinRating(0); }}
               className="mt-4 text-indigo-400 font-medium hover:text-indigo-300"
            >
               Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 ring-1 ring-indigo-500/20">
            <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h2 className="text-lg font-bold text-white">Add New Vendor</h2>
              <button 
                onClick={() => setIsAdding(false)} 
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-3 top-3 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={newVendor.name}
                    onChange={e => setNewVendor({...newVendor, name: e.target.value})}
                    className="w-full border border-slate-700 bg-slate-950 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-slate-600"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    value={newVendor.email}
                    onChange={e => setNewVendor({...newVendor, email: e.target.value})}
                    className="w-full border border-slate-700 bg-slate-950 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-slate-600"
                    placeholder="sales@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                <div className="relative group">
                   <Tag className="absolute left-3 top-3 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                   <select
                    required
                    value={newVendor.category}
                    onChange={e => setNewVendor({...newVendor, category: e.target.value})}
                    className="w-full border border-slate-700 bg-slate-950 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all appearance-none"
                   >
                    <option value="">Select Category...</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Services">Services</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Electronics">Electronics</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-4 py-3 border border-slate-700 rounded-xl text-slate-400 font-medium hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-900/20 transition-all transform active:scale-95"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;