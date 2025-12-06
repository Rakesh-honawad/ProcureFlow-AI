import fetch from 'node-fetch';
import { RFP, Vendor } from '../types';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;
const FROM_DOMAIN = 'rfp.yourdomain.com';

export async function sendRfpEmails(rfp: RFP, vendors: Vendor[]) {
  const url = 'https://api.sendgrid.com/v3/mail/send';

  for (const vendor of vendors) {
    const replyToAddress = `rfp-${rfp.id}@${FROM_DOMAIN}`;

    const body = {
      personalizations: [{
        to: [{ email: vendor.email, name: vendor.name }],
        subject: `Request for Proposal: ${rfp.title}`,
      }],
      from: { email: `no-reply@${FROM_DOMAIN}`, name: 'ProcureFlow' },
      reply_to: { email: replyToAddress },
      content: [{
        type: 'text/plain',
        value:
`Dear ${vendor.name},

We are inviting you to submit a proposal for:

${rfp.description}

Budget: $${rfp.budget.toLocaleString()}
Deadline: ${new Date(rfp.deadline).toLocaleDateString()}

Line Items:
${rfp.items.map((i: any) => `- ${i.description} (Qty: ${i.quantity}) ${i.specs ? '['+i.specs+']' : ''}`).join('\n')}

Please reply to this email with your quote attached by ${new Date(rfp.deadline).toLocaleDateString()}.

Regards,
ProcureFlow Procurement Team`
      }]
    };

    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
}
