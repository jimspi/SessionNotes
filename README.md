# I Love You Bro - Transcription Analysis Platform

A sophisticated web application for analyzing session transcriptions using AI-powered insights. Built for the I Love You Bro community to provide meaningful, actionable feedback from session recordings.

## Features

- **Multi-Format File Upload**: Support for .docx, .pdf, .txt, .eml, .md, .log, and other text-based formats
- **AI-Powered Analysis**: Uses OpenAI's GPT-4 to generate:
  - Comprehensive session summaries
  - Key takeaways and insights
  - Actionable items from the discussion
- **Bro-Friendly Tone**: Analysis output matches the I Love You Bro brand voice - supportive, genuine, and substantive
- **Easy Sharing**: Copy results to clipboard or send via email
- **Clean, Unique Design**: Professional yet approachable interface with no generic AI aesthetics

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **AI**: OpenAI API (GPT-4)
- **File Parsing**:
  - mammoth (DOCX)
  - pdf-parse (PDF)
  - mailparser (EML)
- **Email**: Nodemailer
- **Deployment**: Vercel
- **Styling**: CSS Modules

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- SMTP credentials (optional, for email functionality)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SessionNotes
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your credentials:
```env
# Required
OPENAI_API_KEY=sk-your-openai-api-key

# Optional (for email functionality)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables in the Vercel dashboard:
   - `OPENAI_API_KEY`
   - `SMTP_HOST` (optional)
   - `SMTP_PORT` (optional)
   - `SMTP_USER` (optional)
   - `SMTP_PASS` (optional)
   - `SMTP_FROM` (optional)
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Adding Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SMTP_HOST`: Your SMTP server (e.g., smtp.gmail.com)
   - `SMTP_PORT`: Your SMTP port (e.g., 587)
   - `SMTP_USER`: Your email address
   - `SMTP_PASS`: Your email app password
   - `SMTP_FROM`: Sender email address

## Email Configuration

To enable email functionality, you need SMTP credentials. Here's how to set up Gmail:

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password
   - Use this password in `SMTP_PASS`

## Usage

1. **Upload a transcription file**: Drag and drop or click to browse
2. **Analyze**: Click "Analyze Session" to process the file
3. **Review results**: Read the AI-generated summary, takeaways, and action items
4. **Share**: Copy to clipboard or email the results
5. **Analyze another**: Click "Analyze Another Session" to start over

## Supported File Formats

- `.docx` - Microsoft Word documents
- `.pdf` - PDF documents
- `.txt` - Plain text files
- `.eml` - Email files
- `.md` - Markdown files
- `.log` - Log files
- Any text-based format

## OpenAI System Prompt

The application uses a carefully crafted system prompt that:
- Analyzes specific content (not generic responses)
- Extracts actual details and quotes from the conversation
- Identifies real action items mentioned or implied
- Uses a warm, bro-friendly tone matching the brand voice
- Structures output clearly with Summary, Takeaways, and Action Items
- Provides substantive, specific feedback

## Project Structure

```
SessionNotes/
├── components/          # React components
│   └── Results.tsx     # Results display component
├── lib/                # Utility functions
│   ├── fileParser.ts   # File parsing logic
│   ├── openai.ts       # OpenAI integration
│   └── email.ts        # Email functionality
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   │   ├── analyze.ts  # File analysis endpoint
│   │   └── send-email.ts # Email sending endpoint
│   ├── _app.tsx        # App wrapper
│   └── index.tsx       # Main page
├── styles/             # CSS modules
│   ├── globals.css     # Global styles
│   ├── Home.module.css # Home page styles
│   └── Results.module.css # Results component styles
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore file
├── next.config.js      # Next.js configuration
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript configuration
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### File upload fails
- Check that the file is in a supported format
- Ensure the file is under 10MB
- Verify the file contains readable text

### Analysis fails
- Verify your `OPENAI_API_KEY` is valid and has credits
- Check that the transcription text is at least 50 characters
- Review server logs for specific error messages

### Email not sending
- Verify all SMTP environment variables are set correctly
- For Gmail, ensure you're using an App Password (not your regular password)
- Check that 2-factor authentication is enabled on your Google account

## License

Built with care for the I Love You Bro community.

## Support

For issues or questions, please open an issue in the GitHub repository.
