import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rfpRoutes from './routes/rfp.routes';
import vendorRoutes from './routes/vendor.routes';
import emailRoutes from './routes/email.routes';
import { db } from './db/memoryDb';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount routes
app.use('/api/rfps', rfpRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/email', emailRoutes);

// Proposals endpoint
app.get('/api/proposals', (req, res) => {
  const proposals = db.getAllProposals();
  console.log('GET /api/proposals -', proposals.length, 'proposals');
  res.json(proposals);
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`🚀 Backend LIVE on http://localhost:${port}`);
  console.log(`📧 SendGrid: ${process.env.SENDGRID_API_KEY ? 'Configured ✅' : 'NOT configured ❌'}`);
  console.log(`💾 Data stores initialized (in-memory)`);
});
