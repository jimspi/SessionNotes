import { useState, useRef } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Results from '@/components/Results';
import type { AnalysisResult } from '@/lib/openai';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResults(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
      setResults(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze file');
      }

      setResults(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Head>
        <title>I Love You Bro - Session Analysis</title>
        <meta name="description" content="Analyze your session transcriptions with AI-powered insights" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>I Love You Bro</h1>
            <p className={styles.subtitle}>Session Transcription Analysis</p>
          </header>

          {!results ? (
            <div className={styles.uploadSection}>
              <div
                className={`${styles.dropzone} ${file ? styles.hasFile : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx,.pdf,.txt,.eml,.md,.log,text/*"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />

                {file ? (
                  <div className={styles.fileInfo}>
                    <svg className={styles.fileIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className={styles.fileName}>{file.name}</p>
                    <p className={styles.fileSize}>{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div className={styles.uploadPrompt}>
                    <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className={styles.uploadText}>Drop your transcription file here</p>
                    <p className={styles.uploadHint}>or click to browse</p>
                    <p className={styles.formats}>Supports .docx, .pdf, .txt, .eml, and more</p>
                  </div>
                )}
              </div>

              {error && (
                <div className={styles.error}>
                  <svg className={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className={styles.actions}>
                {file && (
                  <>
                    <button
                      className={styles.buttonSecondary}
                      onClick={handleReset}
                      disabled={loading}
                    >
                      Clear
                    </button>
                    <button
                      className={styles.buttonPrimary}
                      onClick={handleAnalyze}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className={styles.spinner}></span>
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Session'
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <Results results={results} onReset={handleReset} />
          )}

          <footer className={styles.footer}>
            <p>Built with care for the I Love You Bro community</p>
          </footer>
        </div>
      </main>
    </>
  );
}
