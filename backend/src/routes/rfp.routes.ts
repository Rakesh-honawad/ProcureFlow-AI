import { Router } from 'express';
import { rfpController } from '../controllers/rfp.controller';
import { db } from '../db/memoryDb';

const router = Router();

router.get('/', rfpController.getAllRfps);
router.post('/', rfpController.saveRfp);
router.post('/send', rfpController.sendRfp);

// Get all proposals
router.get('/proposals', (req, res) => {
  const proposals = db.getAllProposals();
  console.log('GET /api/proposals -', proposals.length, 'proposals');
  res.json(proposals);
});

export default router;
