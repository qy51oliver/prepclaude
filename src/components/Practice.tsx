import { useState, useEffect } from 'react'

import {
  Button, Label, Textarea, Dots,
  Card, Divider, FeedbackSection, BulletList,
} from './UI'
import { evaluateAnswer, generateExampleAnswer } from '../lib/claude'
import type { Question, JobSummary, PracticeResult } from '../types'

interface PracticeProps {
  question: Question
  jobSummary: JobSummary
  apiKey: string
  existingResult?: PracticeResult
  questionIndex: number
  totalQuestions: number
  onBack: () => void
  onSave: (result: PracticeResult) => void
  onNext: () => void
}

export function Practice({
  question, jobSummary, apiKey, existingResult,
  questionIndex, totalQuestions,
  onBack, onSave, onNext,
}: PracticeProps) {
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<PracticeResult | null>(existingResult ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [exampleAnswer, setExampleAnswer] = useState('')
  const [exampleLoading, setExampleLoading] = useState(false)
  const [showExample, setShowExample] = useState(false)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    setAnswer('')
    setResult(existingResult ?? null)
    setError('')
    setShowExample(false)
    setExampleAnswer('')
    setRetrying(false)
  }, [question.id, existingResult])

  async function handleEvaluate() {
    if (answer.trim().length < 20) { setError('Write at least a few sentences first.'); return }
    setError(''); setLoading(true)
    try {
      const ev = await evaluateAnswer(apiKey, jobSummary.role, question.category, question.question, answer)
      const r: PracticeResult = { questionId: question.id, question: question.question, category: question.category, answer, score: ev.score, verdict: ev.verdict, strengths: ev.strengths, improvements: ev.improvements, idealPoints: ev.idealPoints, followUp: ev.followUp }
      setResult(r); setRetrying(false); onSave(r)
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.') }
    finally { setLoading(false) }
  }

  async function handleExample() {
    if (exampleAnswer) { setShowExample(v => !v); return }
    setExampleLoading(true)
    try {
      const ex = await generateExampleAnswer(apiKey, jobSummary.role, question.category, question.question)
      setExampleAnswer(ex); setShowExample(true)
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not generate example.') }
    finally { setExampleLoading(false) }
  }

  const scoreColor = result ? result.score >= 8 ? 'var(--accent)' : result.score >= 5 ? 'var(--yellow)' : 'var(--red)' : ''

  return (
    <div style={{ paddingTop: 24 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--muted2)', fontSize: 13, cursor: 'pointer', marginBottom: 28, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>← All questions</button>

      <div style={{ background: 'var(--surface)', borderLeft: '2px solid var(--accent)', borderRadius: '0 12px 12px 0', padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{question.category} · Q{questionIndex + 1} of {totalQuestions}</div>
        <div style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.5 }}>{question.question}</div>
      </div>

      {result && !retrying && (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'var(--muted2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Last score: <strong style={{ color: scoreColor }}>{result.score}/10</strong></span>
          <button onClick={() => setRetrying(true)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Try again ↺</button>
        </div>
      )}

      {(!result || retrying) && (
        <>
          <div style={{ marginBottom: 20 }}>
            <Label>Your answer</Label>
            <Textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={8} placeholder="Think out loud — explain your reasoning, walk through your approach, give examples..." />
            <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right', marginTop: 4, fontFamily: "'DM Mono', monospace" }}>{answer.length} characters</div>
          </div>
          {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button onClick={handleEvaluate} disabled={loading}>{loading ? <Dots /> : 'Get feedback →'}</Button>
            <Button variant="ghost" onClick={handleExample} disabled={exampleLoading}>{exampleLoading ? <Dots /> : showExample ? 'Hide example' : 'See example answer'}</Button>
            <Button variant="ghost" onClick={onNext}>Skip →</Button>
          </div>
        </>
      )}

      {showExample && exampleAnswer && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--accent-border)', borderRadius: 12, padding: '20px 24px', marginTop: 20 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Example strong answer</div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{exampleAnswer}</div>
        </div>
      )}

      {result && (
        <Card style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 500, color: scoreColor }}>{result.score}/10</div>
            <div style={{ fontSize: 14, color: 'var(--muted2)' }}>{result.verdict}</div>
          </div>

          <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Your answer</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted2)', whiteSpace: 'pre-wrap' }}>{result.answer}</div>
          </div>

          <Divider />
          <FeedbackSection title="Strengths"><BulletList items={result.strengths} /></FeedbackSection>
          <FeedbackSection title="What to improve"><BulletList items={result.improvements} /></FeedbackSection>
          <FeedbackSection title="Key points to hit"><BulletList items={result.idealPoints} /></FeedbackSection>
          <Divider />
          <FeedbackSection title="Likely follow-up">
            <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '12px 14px', fontSize: 14, fontStyle: 'italic' }}>{result.followUp}</div>
          </FeedbackSection>

          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            {!retrying && <Button onClick={() => { setRetrying(true); setAnswer(result.answer) }}>Try again ↺</Button>}
            <Button variant="ghost" onClick={handleExample} disabled={exampleLoading}>{exampleLoading ? <Dots /> : showExample ? 'Hide example' : 'See example answer'}</Button>
            <Button variant="ghost" onClick={onNext}>Next question →</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
