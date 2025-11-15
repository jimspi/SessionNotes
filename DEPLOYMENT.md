# Deployment Guide

This guide walks you through deploying the I Love You Bro Transcription Analysis Platform to Vercel.

## Quick Deploy to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: I Love You Bro Transcription Platform"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project

### Step 3: Configure Environment Variables

Before deploying, add these environment variables in Vercel:

**Required:**
- `OPENAI_API_KEY`: Your OpenAI API key from https://platform.openai.com/api-keys

**Optional (for email functionality):**
- `SMTP_HOST`: smtp.gmail.com (or your SMTP server)
- `SMTP_PORT`: 587
- `SMTP_USER`: your-email@gmail.com
- `SMTP_PASS`: your-app-password (see Gmail setup below)
- `SMTP_FROM`: your-email@gmail.com

### Step 4: Deploy

Click "Deploy" and Vercel will:
1. Build your application
2. Deploy it to a production URL
3. Set up automatic deployments for future pushes

## Gmail SMTP Setup

To use Gmail for sending email results:

1. **Enable 2-Factor Authentication:**
   - Go to your Google Account
   - Security > 2-Step Verification
   - Follow the setup process

2. **Create App Password:**
   - Go to Google Account > Security > 2-Step Verification
   - Scroll to "App passwords"
   - Select app: "Mail"
   - Select device: "Other" (enter "I Love You Bro App")
   - Click "Generate"
   - Copy the 16-character password
   - Use this as your `SMTP_PASS` in Vercel

3. **Add to Vercel:**
   - Project Settings > Environment Variables
   - Add all SMTP variables listed above

## Alternative SMTP Providers

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<your-sendgrid-api-key>
SMTP_FROM=<your-verified-sender>
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=<your-mailgun-username>
SMTP_PASS=<your-mailgun-password>
SMTP_FROM=<your-verified-sender>
```

### AWS SES
```env
SMTP_HOST=email-smtp.<region>.amazonaws.com
SMTP_PORT=587
SMTP_USER=<your-ses-smtp-username>
SMTP_PASS=<your-ses-smtp-password>
SMTP_FROM=<your-verified-sender>
```

## Continuous Deployment

Once connected to Vercel:
- Every push to `main` branch will automatically deploy to production
- Pull requests will get preview deployments
- You can configure branch deployments in Vercel settings

## Custom Domain

To use a custom domain:

1. Go to your Vercel project
2. Settings > Domains
3. Add your domain
4. Follow the DNS configuration instructions
5. Vercel automatically provisions SSL certificates

## Monitoring

Vercel provides:
- Real-time logs in the dashboard
- Performance analytics
- Error tracking
- Usage statistics

Access these in your project dashboard.

## Environment Variables Update

To update environment variables after deployment:

1. Go to Vercel dashboard
2. Select your project
3. Settings > Environment Variables
4. Update the variable
5. Redeploy (or automatic on next push)

## Troubleshooting Deployment

### Build Fails
- Check the build logs in Vercel
- Ensure all dependencies are in package.json
- Verify TypeScript has no errors: `npm run build` locally

### API Routes Don't Work
- Check that formidable is installed
- Verify environment variables are set
- Check function logs in Vercel dashboard

### OpenAI API Errors
- Verify API key is correct
- Check you have credits available
- Review API usage in OpenAI dashboard

## Production Checklist

Before going live:
- [ ] OpenAI API key is set and has credits
- [ ] SMTP credentials are configured (if using email)
- [ ] Test file upload with various formats
- [ ] Test analysis with real transcription
- [ ] Test email functionality
- [ ] Test copy to clipboard
- [ ] Verify mobile responsiveness
- [ ] Check error handling
- [ ] Review Vercel logs for any issues

## Rollback

If you need to rollback to a previous deployment:

1. Go to Vercel dashboard
2. Deployments tab
3. Find the working deployment
4. Click "Promote to Production"

## Cost Considerations

**Vercel:**
- Hobby plan is free for personal projects
- Pro plan ($20/month) for teams and custom domains

**OpenAI:**
- GPT-4 Turbo: ~$0.01 per analysis (varies by length)
- Monitor usage in OpenAI dashboard
- Set usage limits to control costs

**Email (if using third-party):**
- Gmail: Free with App Passwords
- SendGrid: Free tier (100 emails/day)
- Mailgun: Free tier (limited emails/month)
