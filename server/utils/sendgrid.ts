import { MailService } from '@sendgrid/mail';

// Check if SendGrid API key is available
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';

const mailService = new MailService();
mailService.setApiKey(SENDGRID_API_KEY);

export interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }[];
}

/**
 * Send an email with SendGrid
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.error('SendGrid API key not provided. Email sending will fail.');
    return false;
  }
  
  try {
    const msg: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || '',
      html: params.html || ''
    };
    
    // Only add attachments if they exist
    if (params.attachments && params.attachments.length > 0) {
      msg.attachments = params.attachments;
    }
    
    await mailService.send(msg);
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}