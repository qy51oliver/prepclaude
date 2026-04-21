
import { Button, Card } from './UI'
import type { PracticeResult } from '../types'

interface SummaryProps {
  results: Map<number, PracticeResult>
  totalQuestions: number
  onNewSession: () => void
  onReview: () => void
}

export function Summary({ results, totalQuestions, onNewSession, onReview }: SummaryProps) {
  const all = Array.from(results.values())
  const avg = all.reduce((sum, r) => sum + r.score, 0) / all.length
  const best = Math.max(...all.map(r => r.score))
  const worst = Math.min(...all.map(r => r.score))
  const avgColor = avg >= 7 ? 'var(--accent)' : avg >= 5 ? 'var(--yellow)' : 'var(--red)'

  const weakAreas = all
    .filter(r => r.score < 8)
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)

  function handleShare() {
    const weakList = weakAreas.map(r => `  • ${r.category}: ${r.score}/10`).join('\n')
    const text = `Just finished a PrepClaude interview prep session!\n\nRole: ${weakAreas[0]?.category ? 'AI/ML Engineer' : 'Software Engineer'}\nAvg score: ${avg.toFixed(1)}/10\nQuestions practiced: ${all.length}/${totalQuestions}\n\nAreas to improve:\n${weakList || '  None — strong across the board!'}\n\nPrepare for your next interview → prepclaude.vercel.app`
    if (navigator.share) {
      navigator.share({ text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Results copied to clipboard!'))
    }
  }

  return (
    <div style={{ paddingTop: 32 }}>
      <h2 style={{ fontSize: 26, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 6 }}>
        Session complete
      </h2>
      <p style={{ color: 'var(--muted2)', fontSize: 14, marginBottom: 28 }}>
        Here's how you did and where to focus next.
      </p>

      {/* Score grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 28 }}>
        {[
          { label: 'Average score', val: `${avg.toFixed(1)}/10`, color: avgColor },
          { label: 'Questions done', val: `${all.length}/${totalQuestions}`, color: 'var(--text)' },
          { label: 'Best answer', val: `${best}/10`, color: 'var(--accent)' },
          { label: 'Needs work', val: `${worst}/10`, color: 'var(--red)' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px 18px',
          }}>
            <div style={{ fontSize: 11, color: 'var(--muted2)', fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>
              {label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 500, fontFamily: "'DM Mono', monospace", color }}>
              {val}
            </div>
          </div>
        ))}
      </div>

      {/* Weak areas */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: weakAreas.length ? 14 : 0 }}>
          {weakAreas.length === 0 ? 'Strong performance across the board.' : 'Focus on these areas'}
        </h3>
        {weakAreas.map((r, i) => (
          <div key={r.questionId} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            paddingTop: 12, borderTop: i === 0 ? 'none' : '1px solid var(--border)',
            marginTop: i === 0 ? 0 : 12,
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 13,
              padding: '2px 8px', borderRadius: 6, flexShrink: 0, marginTop: 1,
              background: r.score < 5 ? 'var(--red-dim)' : 'rgba(255,201,77,0.1)',
              color: r.score < 5 ? 'var(--red)' : 'var(--yellow)',
            }}>
              {r.score}/10
            </div>
            <div>
              <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 3 }}>{r.question}</div>
              <div style={{ fontSize: 12, color: 'var(--muted2)' }}>{r.improvements[0]}</div>
            </div>
          </div>
        ))}
      </Card>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Button onClick={onNewSession} style={{ fontSize: 15, padding: '12px 28px' }}>New session →</Button>
        <Button variant="ghost" onClick={onReview}>Review questions</Button>
        <Button variant="ghost" onClick={handleShare}>Share results ↗</Button>
      </div>
    </div>
  )
}
