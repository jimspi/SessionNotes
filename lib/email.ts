import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Check if email is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email is not configured. Please set SMTP environment variables.');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}

export function formatAnalysisEmail(analysis: {
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
}): { text: string; html: string } {
  const text = `
I Love You Bro - Session Analysis
==================================

SESSION SUMMARY
${analysis.summary}

KEY TAKEAWAYS
${analysis.keyTakeaways.map(item => `• ${item}`).join('\n')}

ACTION ITEMS
${analysis.actionItems.map(item => `• ${item}`).join('\n')}

--
Sent from I Love You Bro Transcription Platform
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
      font-size: 24px;
    }
    h2 {
      color: #34495e;
      margin-top: 30px;
      font-size: 18px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    p {
      margin: 15px 0;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      padding: 8px 0;
      padding-left: 20px;
      position: relative;
    }
    li:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #3498db;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #7f8c8d;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <h1>I Love You Bro - Session Analysis</h1>

  <h2>Session Summary</h2>
  <p>${analysis.summary.replace(/\n/g, '<br>')}</p>

  <h2>Key Takeaways</h2>
  <ul>
    ${analysis.keyTakeaways.map(item => `<li>${item}</li>`).join('\n    ')}
  </ul>

  <h2>Action Items</h2>
  <ul>
    ${analysis.actionItems.map(item => `<li>${item}</li>`).join('\n    ')}
  </ul>

  <div class="footer">
    Sent from I Love You Bro Transcription Platform
  </div>
</body>
</html>
`;

  return { text, html };
}
