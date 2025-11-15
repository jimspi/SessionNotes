import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { simpleParser } from 'mailparser';
import fs from 'fs/promises';

export async function parseFile(filePath: string, mimeType: string): Promise<string> {
  try {
    // Parse DOCX files
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || filePath.endsWith('.docx')) {
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    // Parse PDF files
    if (mimeType === 'application/pdf' || filePath.endsWith('.pdf')) {
      const buffer = await fs.readFile(filePath);
      const data = await pdfParse(buffer);
      return data.text;
    }

    // Parse EML files
    if (mimeType === 'message/rfc822' || filePath.endsWith('.eml')) {
      const buffer = await fs.readFile(filePath);
      const parsed = await simpleParser(buffer);
      let content = `Subject: ${parsed.subject || 'N/A'}\n`;
      content += `From: ${parsed.from?.text || 'N/A'}\n`;
      content += `Date: ${parsed.date || 'N/A'}\n\n`;
      content += parsed.text || parsed.html || '';
      return content;
    }

    // Parse plain text files (TXT, MD, etc.)
    if (
      mimeType.startsWith('text/') ||
      filePath.endsWith('.txt') ||
      filePath.endsWith('.md') ||
      filePath.endsWith('.log')
    ) {
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    }

    throw new Error(`Unsupported file type: ${mimeType}`);
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function getSupportedFormats(): string[] {
  return [
    '.docx',
    '.pdf',
    '.txt',
    '.eml',
    '.md',
    '.log'
  ];
}

export function isFileSupported(filename: string, mimeType: string): boolean {
  const supportedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'message/rfc822',
    'text/plain',
    'text/markdown',
  ];

  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  const supportedExtensions = getSupportedFormats();

  return supportedMimeTypes.includes(mimeType) ||
         supportedExtensions.includes(extension) ||
         mimeType.startsWith('text/');
}
