
import { Button, Tag } from './UI'
import type { Question, JobSummary, PracticeResult } from '../types'

interface QuestionListProps {
  jobSummary: JobSummary
  questions: Question[]
  results: Map<number, PracticeResult>
  onOpenQuestion: (id: number) => void
  onNewSession: () => void
  onFinish: () => void
}

export function QuestionList({
  jobSummary, questions, results, onOpenQuestion, onNewSession, onFinish,
}: QuestionListProps) {
  const practiced = results.size
  const total = questions.length
  const pct = Math.round((practiced / total) * 100)
  const allDone = practiced === total

  return (
    <div style={{ paddingTop: 24 }}>

      {/* Job summary */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '20px 24px', marginBottom: 24,
      }}>
        <div style={{ fontSize: 19, fontWeight: 500, marginBottom: 4 }}>{jobSummary.role}</div>
        <div style={{ fontSize: 13, color: 'var(--muted2)', marginBottom: 14 }}>{jobSummary.company}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {jobSummary.skills.map(s => <Tag key={s}>{s}</Tag>)}
        </div>
      </div>

      {/* Progress */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '14px 18px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ flex: 1, background: 'var(--surface3)', borderRadius: 99, height: 4 }}>
          <div style={{
            background: 'var(--accent)', height: 4, borderRadius: 99,
            width: `${pct}%`, transition: 'width 0.4s ease',
          }} />
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted2)', whiteSpace: 'nowrap' }}>
          {practiced} / {total} practiced
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 500 }}>Your questions</h2>
        <Button variant="ghost" small onClick={onNewSession}>← New session</Button>
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {questions.map(q => {
          const result = results.get(q.id)
          return (
            <div
              key={q.id}
              onClick={() => onOpenQuestion(q.id)}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${result ? 'var(--accent-border)' : 'var(--border)'}`,
                borderRadius: 12, padding: '16px 20px', cursor: 'pointer',
                display: 'flex', alignItems: 'flex-start', gap: 14,
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 11,
                color: result ? 'var(--accent)' : 'var(--muted)',
                background: result ? 'var(--accent-dim)' : 'var(--surface2)',
                borderRadius: 4, padding: '2px 7px', flexShrink: 0, marginTop: 2,
              }}>
                {String(q.id).padStart(2, '0')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 4 }}>{q.question}</div>
                <div style={{ fontSize: 11, color: 'var(--muted2)', fontFamily: "'DM Mono', monospace" }}>
                  {q.category}
                </div>
              </div>
              {result && (
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 12,
                  color: 'var(--accent)', flexShrink: 0, marginTop: 2,
                }}>
                  {result.score}/10
                </div>
              )}
            </div>
          )
        })}
      </div>

      {allDone && (
        <div style={{ marginTop: 24 }}>
          <Button onClick={onFinish} style={{ fontSize: 15, padding: '12px 28px' }}>
            See my results →
          </Button>
        </div>
      )}
    </div>
  )
}
