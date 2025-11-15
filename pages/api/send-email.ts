import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail, formatAnalysisEmail } from '@/lib/email';

interface SendEmailRequest {
  to: string;
  analysis: {
    summary: string;
    keyTakeaways: string[];
    actionItems: string[];
  };
}

interface SendEmailResponse {
  success: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SendEmailResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { to, analysis } = req.body as SendEmailRequest;

    if (!to || !to.includes('@')) {
      return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    if (!analysis || !analysis.summary) {
      return res.status(400).json({ success: false, error: 'Invalid analysis data' });
    }

    const { text, html } = formatAnalysisEmail(analysis);

    await sendEmail({
      to,
      subject: 'Your I Love You Bro Session Analysis',
      text,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    });
  }
}
