import { RFP, Vendor, Proposal } from '../models/rfp.model';

export const db = {
  rfps: [] as RFP[],
  vendors: [] as Vendor[],
  proposals: [] as Proposal[],

  // RFP methods
  getAllRfps: () => db.rfps,
  getRfpById: (id: string) => db.rfps.find(r => r.id === id),
  saveRfp: (rfp: RFP) => {
    const index = db.rfps.findIndex(r => r.id === rfp.id);
    if (index >= 0) {
      db.rfps[index] = rfp;
    } else {
      db.rfps.push(rfp);
    }
    return rfp;
  },

  // Vendor methods
  getAllVendors: () => db.vendors,
  getVendorsByIds: (ids: string[]) => db.vendors.filter(v => ids.includes(v.id)),
  saveVendor: (vendor: Vendor) => {
    const index = db.vendors.findIndex(v => v.id === vendor.id);
    if (index >= 0) {
      db.vendors[index] = vendor;
    } else {
      db.vendors.push(vendor);
    }
    return vendor;
  },

  // Proposal methods
  getAllProposals: () => db.proposals,
  addProposal: (proposal: Proposal) => {
    db.proposals.push(proposal);
    return proposal;
  }
};
