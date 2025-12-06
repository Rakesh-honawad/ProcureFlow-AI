import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Users, BarChart3, Settings, Hexagon, X, Clock, Inbox } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const navItemClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
    ${isActive(path) 
      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/50 translate-x-1' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-indigo-400'}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-900/30">
              <Hexagon className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">ProcureFlow</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <Link to="/" className={navItemClass('/')}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/responses" className={navItemClass('/responses')}>
            <Inbox size={20} />
            Responses
          </Link>
          <Link to="/create-rfp" className={navItemClass('/create-rfp')}>
            <PlusCircle size={20} />
            Create RFP
          </Link>
          
          <div className="pt-6 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Management
          </div>
          
          <Link to="/vendors" className={navItemClass('/vendors')}>
            <Users size={20} />
            Vendors
          </Link>
          
          <Link to="/analytics" className={navItemClass('/analytics')}>
            <BarChart3 size={20} />
            Analytics
          </Link>

          <Link to="/history" className={navItemClass('/history')}>
            <Clock size={20} />
            History
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-all">
            <Settings size={20} />
            Settings( future implementation)
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;