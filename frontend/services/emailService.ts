import { RFP, Vendor } from '../types';

const API_BASE = 'http://localhost:4000';

export const emailService = {
  async sendRfpToVendors(rfp: RFP, vendors: Vendor[]): Promise<void> {
    console.log('📤 Sending RFP to backend:', rfp.id);
    
    const response = await fetch(`${API_BASE}/api/rfps/send`, {  // ✅ FIXED PATH
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rfpId: rfp.id }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to send RFP');
    }

    console.log('✅ Backend received RFP successfully');
  }
};
