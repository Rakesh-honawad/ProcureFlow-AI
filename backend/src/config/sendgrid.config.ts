import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const VERIFIED_EMAIL = process.env.VERIFIED_SENDER_EMAIL || 'raki1432rk@gmail.com';

export { sgMail };
