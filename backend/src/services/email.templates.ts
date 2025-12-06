import { RFP, Vendor } from '../models/rfp.model';

export function generateRfpEmailTemplate(rfp: RFP, vendor: Vendor) {
  const rfpId = rfp.id;
  const deadlineDate = new Date(rfp.deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const subject = `RFP #${rfpId.slice(0, 8).toUpperCase()} - ${rfp.title}`;

  const text = `Dear ${vendor.name},

We are pleased to invite you to submit a proposal for the following procurement:

PROJECT: ${rfp.title}
DESCRIPTION: ${rfp.description}
BUDGET: $${rfp.budget.toLocaleString()}
DEADLINE: ${formattedDeadline}

ITEMS REQUESTED:
${rfp.items.map((item: any, index: number) => `
${index + 1}. ${item.description}
   Quantity: ${item.quantity}
   ${item.specs ? `Specifications: ${item.specs}` : ''}
`).join('\n')}

${rfp.requirements && rfp.requirements.length > 0 ? `REQUIREMENTS:\n${rfp.requirements.map((req: string, i: number) => `${i + 1}. ${req}`).join('\n')}` : ''}

Please reply to this email with your proposal including:
• Total quote amount
• Itemized pricing breakdown
• Delivery timeline
• Warranty terms
• Payment terms

We look forward to receiving your proposal by ${formattedDeadline}.

Best regards,
Procurement Team
ProcureFlow System

---
RFP Reference: ${rfpId}
Vendor: ${vendor.name}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Request for Proposal</h1>
              <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 14px;">RFP #${rfpId.slice(0, 8).toUpperCase()}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">Dear <strong>${vendor.name}</strong>,</p>
              <p style="margin: 0 0 30px; color: #666666; font-size: 15px; line-height: 1.6;">
                We are pleased to invite you to submit a proposal for the following procurement opportunity:
              </p>
              
              <!-- Project Overview -->
              <table style="width: 100%; background-color: #f8f9ff; border-left: 4px solid #667eea; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 10px; color: #667eea; font-size: 18px;">${rfp.title}</h2>
                    <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">${rfp.description}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Budget & Deadline -->
              <table style="width: 100%; margin-bottom: 30px;">
                <tr>
                  <td style="width: 50%; padding: 15px; background-color: #f0f4ff; border-radius: 8px;">
                    <p style="margin: 0; color: #667eea; font-size: 12px; font-weight: bold; text-transform: uppercase;">Budget</p>
                    <p style="margin: 5px 0 0; color: #333333; font-size: 24px; font-weight: bold;">$${rfp.budget.toLocaleString()}</p>
                  </td>
                  <td style="width: 10px;"></td>
                  <td style="width: 50%; padding: 15px; background-color: #fff4f0; border-radius: 8px;">
                    <p style="margin: 0; color: #f97316; font-size: 12px; font-weight: bold; text-transform: uppercase;">Deadline</p>
                    <p style="margin: 5px 0 0; color: #333333; font-size: 16px; font-weight: bold;">${formattedDeadline}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Items -->
              <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📦 Items Requested</h3>
              <table style="width: 100%; margin-bottom: 30px;">
                ${rfp.items.map((item: any, index: number) => `
                <tr>
                  <td style="padding: 15px; background-color: ${index % 2 === 0 ? '#f9fafb' : '#ffffff'}; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 5px; color: #333333; font-size: 15px; font-weight: bold;">${index + 1}. ${item.description}</p>
                    <p style="margin: 0; color: #666666; font-size: 13px;">
                      <strong>Quantity:</strong> ${item.quantity}
                      ${item.specs ? `<br><strong>Specifications:</strong> ${item.specs}` : ''}
                    </p>
                  </td>
                </tr>
                `).join('')}
              </table>
              
              ${rfp.requirements && rfp.requirements.length > 0 ? `
              <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">✓ Requirements</h3>
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
                ${rfp.requirements.map((req: string) => `<li>${req}</li>`).join('')}
              </ul>
              ` : ''}
              
              <!-- How to Submit -->
              <table style="width: 100%; background-color: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #10b981; font-size: 16px;">📝 How to Submit Your Proposal</h3>
                    <p style="margin: 0; color: #333333; font-size: 14px;"><strong>Please reply to this email</strong> with:</p>
                    <ul style="margin: 10px 0 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.6;">
                      <li>Total quote amount</li>
                      <li>Itemized pricing breakdown</li>
                      <li>Delivery timeline</li>
                      <li>Warranty terms</li>
                      <li>Payment terms</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; color: #666666; font-size: 15px;">We look forward to receiving your proposal by <strong>${formattedDeadline}</strong>.</p>
              <p style="margin: 30px 0 0; color: #333333; font-size: 15px;">Best regards,<br><strong>Procurement Team</strong><br>ProcureFlow System</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 5px; color: #999999; font-size: 12px;">RFP Reference: ${rfpId}</p>
              <p style="margin: 0; color: #999999; font-size: 12px;">Vendor: ${vendor.name} (${vendor.email})</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return { subject, text, html };
}
