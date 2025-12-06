export interface Vendor { 
  id: string; 
  name: string; 
  email: string; 
  category: string;
  rating: number;
}

export interface RFP {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  items: any[];
  requirements?: string[];
  status: string;
  createdAt: string;
  selectedVendorIds: string[];
}

export interface Proposal { 
  id: string; 
  rfpId: string; 
  vendorId: string; 
  totalAmount: number; 
  rawEmailContent: string; 
  receivedAt: string;
  deliveryTimeline: string;
  warrantyTerms: string;
  paymentTerms: string;
  items: any[];
}
