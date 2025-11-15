import { useState } from 'react';
import styles from '@/styles/Results.module.css';
import type { AnalysisResult } from '@/lib/openai';

interface ResultsProps {
  results: AnalysisResult;
  onReset: () => void;
}

export default function Results({ results, onReset }: ResultsProps) {
  const [emailAddress, setEmailAddress] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopy = async () => {
    const text = `I LOVE YOU BRO - SESSION ANALYSIS\n\nSESSION SUMMARY\n${results.summary}\n\nKEY TAKEAWAYS\n${results.keyTakeaways.map(item => `• ${item}`).join('\n')}\n\nACTION ITEMS\n${results.actionItems.map(item => `• ${item}`).join('\n')}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleEmail = async () => {
    if (!emailAddress || !emailAddress.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailStatus('sending');
    setEmailError(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailAddress,
          analysis: {
            summary: results.summary,
            keyTakeaways: results.keyTakeaways,
            actionItems: results.actionItems,
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to send email');
      }

      setEmailStatus('sent');
      setTimeout(() => {
        setEmailStatus('idle');
        setEmailAddress('');
      }, 3000);
    } catch (error) {
      setEmailStatus('error');
      setEmailError(error instanceof Error ? error.message : 'Failed to send email');
    }
  };

  return (
    <div className={styles.results}>
      <div className={styles.header}>
        <h2 className={styles.greeting}>Hey bro, here&apos;s what we covered this session...</h2>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Session Summary</h3>
        <div className={styles.content}>
          {results.summary.split('\n').map((paragraph, i) => (
            paragraph.trim() && <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Key Takeaways</h3>
        <ul className={styles.list}>
          {results.keyTakeaways.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Action Items</h3>
        <ul className={styles.list}>
          {results.actionItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <div className={styles.actionGroup}>
          <button
            className={styles.buttonCopy}
            onClick={handleCopy}
          >
            {copyStatus === 'copied' ? (
              <>
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
        </div>

        <div className={styles.emailGroup}>
          <input
            type="email"
            placeholder="your@email.com"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className={styles.emailInput}
            disabled={emailStatus === 'sending'}
          />
          <button
            className={styles.buttonEmail}
            onClick={handleEmail}
            disabled={emailStatus === 'sending' || !emailAddress}
          >
            {emailStatus === 'sending' ? (
              <>
                <span className={styles.spinner}></span>
                Sending...
              </>
            ) : emailStatus === 'sent' ? (
              <>
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sent!
              </>
            ) : (
              <>
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Results
              </>
            )}
          </button>
        </div>

        {emailError && (
          <div className={styles.emailError}>
            {emailError}
          </div>
        )}
      </div>

      <div className={styles.resetSection}>
        <button className={styles.buttonReset} onClick={onReset}>
          Analyze Another Session
        </button>
      </div>
    </div>
  );
}
