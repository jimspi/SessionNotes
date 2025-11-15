import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import { parseFile, isFileSupported } from '@/lib/fileParser';
import { analyzeTranscription, AnalysisResult } from '@/lib/openai';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyzeResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  let filePath: string | undefined;

  try {
    // Parse the uploaded file
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      uploadDir: '/tmp',
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    filePath = file.filepath;

    // Validate file type
    if (!isFileSupported(file.originalFilename || '', file.mimetype || '')) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type. Please upload .docx, .pdf, .txt, .eml, or other text files.',
      });
    }

    // Parse the file content
    const transcriptionText = await parseFile(filePath, file.mimetype || '');

    if (!transcriptionText || transcriptionText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'File appears to be empty or too short to analyze.',
      });
    }

    // Analyze with OpenAI
    const analysis = await analyzeTranscription(transcriptionText);

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Error in analyze endpoint:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while processing your file',
    });
  } finally {
    // Clean up uploaded file
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting temp file:', error);
      }
    }
  }
}
