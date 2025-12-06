export enum RFPStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  RESPONSE_RECEIVED = 'RESPONSE_RECEIVED',
  AWARDED = 'AWARDED',
  CLOSED = 'CLOSED'
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
  budget: number;
  deadline: string;
  items: RFPItem[];
  requirements?: string[];
  status: RFPStatus;
  createdAt: string;
  selectedVendorIds: string[];
}

export interface ProposalItem {
  description: string;
  unitPrice?: number;
  totalPrice?: number;
}

export interface Proposal {
  id: string;
  rfpId: string;
  vendorId: string;
  receivedAt: string;
  rawEmailContent: string;
  attachmentName?: string;
  totalAmount: number;
  items: ProposalItem[];
  deliveryTimeline: string;
  warrantyTerms: string;
  paymentTerms: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface ComparisonScore {
  vendorName: string;
  score: number;
  reasoning: string;
  pros: string[];
  cons: string[];
}

export interface ComparisonAnalysis {
  rfpId: string;
  recommendation: string;
  summary: string;
  scores: ComparisonScore[];
}
