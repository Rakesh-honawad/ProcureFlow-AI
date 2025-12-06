import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Sidebar from './components/Sidebar';
import RfpList from './components/RfpList';
import RfpCreation from './components/RfpCreation';
import RfpDetail from './components/RfpDetail';
import VendorList from './components/VendorList';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import RfpHistory from './components/RfpHistory';
import GlobalResponses from './components/GlobalResponses';
import { Menu, Hexagon } from 'lucide-react';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <HashRouter>
        <div className="flex bg-slate-950 min-h-screen font-sans text-slate-100">
          
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          {/* Main Content Wrapper */}
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
            
            {/* Mobile Header */}
            <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
               <div className="flex items-center gap-2">
                  <div className="bg-indigo-600 p-1 rounded-md">
                     <Hexagon className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-lg font-bold text-white tracking-tight">ProcureFlow</span>
               </div>
               <button 
                 onClick={() => setIsSidebarOpen(true)}
                 className="text-slate-400 p-1 hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
               >
                 <Menu size={24} />
               </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto">
               <Routes>
                 <Route path="/" element={<RfpList />} />
                 <Route path="/create-rfp" element={<RfpCreation />} />
                 <Route path="/vendors" element={<VendorList />} />
                 <Route path="/analytics" element={<AnalyticsDashboard />} />
                 <Route path="/history" element={<RfpHistory />} />
                 <Route path="/responses" element={<GlobalResponses />} />
                 <Route path="/rfp/:id" element={<RfpDetail />} />
                 <Route path="*" element={<Navigate to="/" replace />} />
               </Routes>
            </div>
          </div>
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;