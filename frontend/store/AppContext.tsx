import React, { createContext, useContext, useState, useEffect } from 'react';
import { RFP, Vendor, Proposal, RFPStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';


const INITIAL_VENDORS: Vendor[] = [
  { id: uuidv4(), name: 'Raki service', email: 'rakeshhonawad46@gmail.com', category: 'service', rating: 4.5 },
  { id: uuidv4(), name: 'Office Solutions Ltd', email: 'info@officesolutions.com', category: 'Office Supplies', rating: 4.2 },
  { id: uuidv4(), name: 'ElectroWorld', email: 'contact@electroworld.com', category: 'Electronics', rating: 4.8 },
];

interface AppContextType {
  rfps: RFP[];
  vendors: Vendor[];
  proposals: Proposal[];
  addRfp: (rfp: RFP) => void;
  updateRfp: (id: string, updates: Partial<RFP>) => void;
  deleteRfp: (id: string) => void;
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  addProposal: (proposal: Proposal) => void;
  getProposalsByRfpId: (rfpId: string) => Proposal[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [proposals, setProposals] = useState<Proposal[]>([]);


  useEffect(() => {
    const savedRfps = localStorage.getItem('rfps');
    const savedVendors = localStorage.getItem('vendors');
    const savedProposals = localStorage.getItem('proposals');

    if (savedRfps) setRfps(JSON.parse(savedRfps));
    if (savedVendors) setVendors(JSON.parse(savedVendors));
    if (savedProposals) setProposals(JSON.parse(savedProposals));
  }, []);


  useEffect(() => {
    localStorage.setItem('rfps', JSON.stringify(rfps));
  }, [rfps]);

  useEffect(() => {
    localStorage.setItem('vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('proposals', JSON.stringify(proposals));
  }, [proposals]);


  const API_BASE = 'http://localhost:4000';

  useEffect(() => {
 
    const loadFromBackend = async () => {
      try {
        const [rfpsRes, vendorsRes, proposalsRes] = await Promise.all([
          fetch(`${API_BASE}/api/rfps`),
          fetch(`${API_BASE}/api/vendors`),
          fetch(`${API_BASE}/api/proposals`),
        ]);

        if (rfpsRes.ok) {
          const backendRfps = await rfpsRes.json();
          if (backendRfps.length > 0) {
            setRfps(backendRfps);
          }
        }
        if (vendorsRes.ok) {
          const backendVendors = await vendorsRes.json();
          if (backendVendors.length > 0) {
            setVendors(backendVendors);
          }
        }
        if (proposalsRes.ok) {
          setProposals(await proposalsRes.json());
        }
      } catch (e) {
        console.error('Backend load failed, using localStorage', e);
      }
    };

    loadFromBackend();

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/proposals`);
        if (res.ok) {
          setProposals(await res.json());
        }
      } catch (e) {
        console.log('Backend polling (normal if not running)');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

 
  useEffect(() => {
    if (rfps.length === 0) return;
    
    rfps.forEach(async (rfp) => {
      try {
        await fetch(`${API_BASE}/api/rfps`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rfp)
        });
      } catch (e) {
        console.log('Backend sync skipped (offline mode)');
      }
    });
  }, [rfps]);

  
  useEffect(() => {
    if (vendors.length === 0) return;
    
    vendors.forEach(async (vendor) => {
      try {
        await fetch(`${API_BASE}/api/vendors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vendor)
        });
      } catch (e) {
        console.log('Backend sync skipped');
      }
    });
  }, [vendors]);

 
  const addRfp = (rfp: RFP) => {
    setRfps(prev => [...prev, rfp]);
  };

  const updateRfp = (id: string, updates: Partial<RFP>) => {
    setRfps(prev => prev.map(rfp => rfp.id === id ? { ...rfp, ...updates } : rfp));
  };

  const deleteRfp = (id: string) => {
    setRfps(prev => prev.filter(rfp => rfp.id !== id));
  };

  const addVendor = (vendor: Vendor) => {
    setVendors(prev => [...prev, vendor]);
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deleteVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
  };

  const addProposal = (proposal: Proposal) => {
    setProposals(prev => [...prev, proposal]);
  };

  const getProposalsByRfpId = (rfpId: string): Proposal[] => {
    return proposals.filter(p => p.rfpId === rfpId);
  };

 
  const value: AppContextType = {
    rfps,
    vendors,
    proposals,
    addRfp,
    updateRfp,
    deleteRfp,
    addVendor,
    updateVendor,
    deleteVendor,
    addProposal,
    getProposalsByRfpId,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 
