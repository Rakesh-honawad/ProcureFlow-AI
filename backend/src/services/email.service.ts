import { sgMail, VERIFIED_EMAIL } from '../config/sendgrid.config';
import { RFP, Vendor } from '../models/rfp.model';
import { generateRfpEmailTemplate } from './email.templates';

export const emailService = {
  async sendRfpToVendors(rfp: RFP, vendors: Vendor[]) {
    console.log(`📤 Sending RFP to ${vendors.length} vendor(s)`);

    const emailPromises = vendors.map(async (vendor) => {
      const { subject, text, html } = generateRfpEmailTemplate(rfp, vendor);

      await sgMail.send({
        to: vendor.email,
        from: {
          email: VERIFIED_EMAIL,
          name: 'ProcureFlow Procurement'
        },
        replyTo: VERIFIED_EMAIL,
        subject,
        text,
        html
      });

      console.log(`   ✅ Sent to: ${vendor.name} <${vendor.email}>`);
      return { vendor: vendor.email, success: true };
    });

    const results = await Promise.allSettled(emailPromises);
    
    return {
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      total: vendors.length
    };
  }
};
