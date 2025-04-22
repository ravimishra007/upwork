import mail from '@sendgrid/mail';

// Check if SendGrid API key is available
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';

// Set API key
mail.setApiKey(SENDGRID_API_KEY);

interface EmailAttachment {
  content: string;
  filename: string;
  type: string;
  disposition: string;
}

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
}

/**
 * Send an email with SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.error('SendGrid API key not provided. Email sending will fail.');
    return false;
  }
  
  try {
    // Create the email message
    const message: any = {
      to: options.to,
      from: options.from,
      subject: options.subject
    };
    
    // Add text or HTML content
    if (options.text) message.text = options.text;
    if (options.html) message.html = options.html;
    
    // Add attachments if any
    if (options.attachments && options.attachments.length > 0) {
      message.attachments = options.attachments;
    }
    
    // Send the email
    await mail.send(message);
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}