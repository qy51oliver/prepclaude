import { useState, useRef } from 'react'

import { Button, Label, Input, Textarea, ErrorBox, Dots } from './UI'
import { generateQuestions } from '../lib/claude'
import type { JobSummary, Question } from '../types'

interface SetupProps {
  onBack: () => void
  onGenerate: (apiKey: string, questions: Question[], summary: JobSummary) => void
}

export function Setup({ onBack, onGenerate }: SetupProps) {
  const [apiKey, setApiKey] = useState('')
  const [jd, setJd] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.name.match(/\.(txt)$/i)) {
      const text = `[Resume: ${file.name}, ${Math.round(file.size / 1024)}KB]`
      setResumeText(text)
    } else {
      setResumeText(await file.text())
    }
    setFileName(file.name)
  }

  async function handleGenerate() {
    setError('')
    if (!apiKey) return setError('Please enter your API key.')
    if (!apiKey.startsWith('sk-ant-')) return setError('API key should start with sk-ant-')
    if (jd.length < 80) return setError('Please paste a full job description.')

    setLoading(true)
    try {
      const result = await generateQuestions(apiKey, jd, resumeText)
      onGenerate(apiKey, result.questions, {
        role: result.role,
        company: result.company,
        skills: result.skills,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Check your API key.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 32 }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--muted2)', fontSize: 13, cursor: 'pointer', marginBottom: 28, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: 28, fontWeight: 400, letterSpacing: '-0.03em', marginBottom: 8 }}>
        New session
      </h1>
      <p style={{ color: 'var(--muted2)', fontSize: 14, marginBottom: 36 }}>
        Paste the job description you're actually applying to.
      </p>

      <div style={{ marginBottom: 20 }}>
        <Label>Anthropic API key</Label>
        <Input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="sk-ant-..."
          autoComplete="off"
        />
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
          Free key at{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">
            console.anthropic.com
          </a>{' '}
          — never stored, only used in this browser session.
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <Label>Job description</Label>
        <Textarea
          value={jd}
          onChange={e => setJd(e.target.value)}
          placeholder="Paste the full job description here..."
          style={{ minHeight: 160 }}
        />
      </div>

      <div style={{ marginBottom: 28 }}>
        <Label>
          Resume{' '}
          <span style={{ color: 'var(--muted)', fontSize: 10, textTransform: 'none', letterSpacing: 0 }}>
            (optional — makes questions more personal)
          </span>
        </Label>
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
          }}
          style={{
            border: `1px dashed ${dragOver ? 'var(--accent)' : 'var(--border-hi)'}`,
            borderRadius: 10, padding: '20px', textAlign: 'center', cursor: 'pointer',
            background: dragOver ? 'var(--accent-dim)' : 'transparent',
            transition: 'all 0.15s',
          }}
        >
          <div style={{ fontSize: 20, color: 'var(--muted)', marginBottom: 6 }}>↑</div>
          <p style={{ fontSize: 13, color: 'var(--muted2)' }}>
            {fileName ? fileName : 'Click to upload or drag your resume (.txt or .pdf)'}
          </p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.txt"
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
        />
        {fileName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: 12,
              color: 'var(--accent)', background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)', borderRadius: 99,
              padding: '3px 10px',
            }}>
              {fileName}
            </span>
            <button
              onClick={() => { setFileName(''); setResumeText('') }}
              style={{ background: 'none', border: 'none', color: 'var(--muted2)', cursor: 'pointer', fontSize: 16 }}
            >
              ×
            </button>
          </div>
        )}
      </div>

      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? <Dots /> : 'Generate questions →'}
      </Button>

      <ErrorBox message={error} />
    </div>
  )
}
