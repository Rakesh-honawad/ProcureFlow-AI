import { Request, Response } from 'express';
import { db } from '../db/memoryDb';
import { emailService } from '../services/email.service';
import { Vendor } from '../models/rfp.model';

export const rfpController = {
  getAllRfps: (req: Request, res: Response) => {
    const rfps = db.getAllRfps();
    console.log('GET /api/rfps -', rfps.length, 'RFPs');
    res.json(rfps);
  },

  saveRfp: (req: Request, res: Response) => {
    try {
      const rfp = db.saveRfp(req.body);
      console.log('📝 RFP saved:', rfp.id);
      res.json({ ok: true, rfp });
    } catch (error: any) {
      console.error('Error saving RFP:', error);
      res.status(500).json({ error: error.message });
    }
  },

  sendRfp: async (req: Request, res: Response) => {
    try {
      const { rfpId } = req.body;
      const rfp = db.getRfpById(rfpId);

      if (!rfp) {
        return res.status(404).json({ error: 'RFP not found' });
      }

      const vendors = db.getVendorsByIds(rfp.selectedVendorIds);

      if (vendors.length === 0) {
        return res.status(400).json({ error: 'No vendors selected' });
      }

      const results = await emailService.sendRfpToVendors(rfp, vendors);

      rfp.status = 'SENT';
      db.saveRfp(rfp);

      res.json({
        ok: true,
        sentTo: vendors.map((v: Vendor) => ({ name: v.name, email: v.email })),
        ...results
      });
    } catch (error: any) {
      console.error('❌ Error sending RFP:', error);
      res.status(500).json({ error: 'Failed to send emails' });
    }
  }
};
