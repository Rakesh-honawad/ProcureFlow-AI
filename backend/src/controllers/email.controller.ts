import { Request, Response } from 'express';
import { db } from '../db/memoryDb';
import { Proposal } from '../models/rfp.model';
import { geminiService } from '../services/gemini.service';

export const emailController = {
  handleInbound: async (req: Request, res: Response) => {
    console.log('📨 INCOMING EMAIL WEBHOOK');
    
    try {
      const { from, to, subject, text, html, attachments } = req.body;
      
      const toAddr = (to || '').toString();
      const match = /rfp-([^@]+)@/.exec(toAddr);
      const rfpId = match ? match[1] : 'unknown';
      
      console.log('📧 From:', from);
      console.log('📧 Subject:', subject);
      console.log('📧 RFP ID:', rfpId);
      
      const rfp = db.getRfpById(rfpId);
      const rfpContext = rfp 
        ? `${rfp.title} - Budget: $${rfp.budget}`
        : 'Unknown RFP';

      // 🤖 Use AI to parse the proposal
      let parsedData;
      try {
        parsedData = await geminiService.parseVendorProposal(
          { 
            text: text || html,
            // If you have attachments, add: file: { mimeType: '...', data: '...' }
          },
          rfpContext
        );
        console.log('✅ AI parsed proposal:', parsedData);
      } catch (aiError) {
        console.warn('⚠️ AI parsing failed, using defaults:', aiError);
        parsedData = {
          totalAmount: 0,
          deliveryTimeline: 'Not specified',
          warrantyTerms: 'Not specified',
          paymentTerms: 'Not specified',
          items: []
        };
      }
      
      const newProposal: Proposal = {
        id: 'prop-' + Date.now(),
        rfpId: rfpId,
        vendorId: 'vendor-unknown',
        receivedAt: new Date().toISOString(),
        rawEmailContent: text || html || 'No content',
        totalAmount: parsedData.totalAmount,
        deliveryTimeline: parsedData.deliveryTimeline,
        warrantyTerms: parsedData.warrantyTerms,
        paymentTerms: parsedData.paymentTerms,
        items: parsedData.items
      };
      
      db.addProposal(newProposal);
      console.log('✅ Added proposal:', newProposal.id);
      
      if (rfp) {
        rfp.status = 'RESPONSE_RECEIVED';
        db.saveRfp(rfp);
      }
      
      res.status(200).send('OK');
    } catch (error: any) {
      console.error('❌ Webhook error:', error);
      res.status(500).send('Error');
    }
  }
};
