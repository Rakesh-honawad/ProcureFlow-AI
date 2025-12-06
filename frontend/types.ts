export enum RFPStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  RESPONSE_RECEIVED = 'Response Received',
  CLOSED = 'Closed',
  AWARDED = 'Awarded'
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  category: string;
  rating: number;
}

export interface RFPItem {
  description: string;
  quantity: number;
  specs?: string;
}

export interface RFP {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  budget: number;
  deadline: string;
  items: RFPItem[];
  status: RFPStatus;
  selectedVendorIds: string[];
  requirements?: string[];
}

export interface ProposalItem {
  description: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Proposal {
  id: string;
  rfpId: string;
  vendorId: string;
  receivedAt: string;
  totalAmount: number;
  items: ProposalItem[];
  deliveryTimeline: string;
  warrantyTerms: string;
  paymentTerms: string;
  rawEmailContent: string; // To simulate the source
  attachmentName?: string; // New field for file uploads
}

export interface ComparisonAnalysis {
  rfpId: string;
  scores: {
    vendorName: string;
    score: number; // 0-100
    reasoning: string;
    pros: string[];
    cons: string[];
  }[];
  recommendation: string; // Vendor Name
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}