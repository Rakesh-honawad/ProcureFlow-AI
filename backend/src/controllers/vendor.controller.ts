import { Request, Response } from 'express';
import { db } from '../db/memoryDb';

export const vendorController = {
  getAllVendors: (req: Request, res: Response) => {
    const vendors = db.getAllVendors();
    console.log('GET /api/vendors -', vendors.length, 'vendors');
    res.json(vendors);
  },

  saveVendor: (req: Request, res: Response) => {
    try {
      const vendor = db.saveVendor(req.body);
      console.log('👥 Vendor saved:', vendor.name);
      res.json({ ok: true, vendor });
    } catch (error: any) {
      console.error('Error saving vendor:', error);
      res.status(500).json({ error: error.message });
    }
  }
};
