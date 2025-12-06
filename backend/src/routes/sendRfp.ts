import { Router } from 'express';
import { db } from '../db/memoryDb';
import { sendRfpEmails } from '../services/emailProvider';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { rfpId } = req.body;
    const rfp = db.findRfpById(rfpId);
    if (!rfp) return res.status(404).json({ error: 'RFP not found' });

    const vendors = db.vendors.filter(v => rfp.selectedVendorIds.includes(v.id));
    await sendRfpEmails(rfp, vendors);

    rfp.status = 'SENT' as any;

    res.json({ ok: true });
  } catch (err) {
    console.error('Error in /api/send-rfp:', err);
    res.status(500).json({ error: 'Failed to send RFP' });
  }
});

export default router;
