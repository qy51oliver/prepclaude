
import { Button } from './UI'

interface LandingProps {
  onStart: () => void
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div style={{ paddingTop: 64 }}>
      <h1 style={{
        fontSize: 42, fontWeight: 300, lineHeight: 1.15,
        letterSpacing: '-0.04em', marginBottom: 14,
      }}>
        Prep smarter.<br />
        <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>Interview better.</em>
      </h1>

      <p style={{ fontSize: 16, color: 'var(--muted2)', marginBottom: 48, maxWidth: 480, lineHeight: 1.7 }}>
        Paste any job description. Get 10 tailored technical questions.
        Practice with real AI feedback. See your weak areas. Improve fast.
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12, marginBottom: 48, maxWidth: 520,
      }}>
        {[
          { num: '10', label: 'role-specific questions' },
          { num: 'AI', label: 'scored feedback' },
          { num: '∞', label: 'practice sessions' },
        ].map(({ num, label }) => (
          <div key={label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '18px 16px', textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 26,
              fontWeight: 500, color: 'var(--accent)', marginBottom: 4,
            }}>
              {num}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted2)' }}>{label}</div>
          </div>
        ))}
      </div>

      <Button onClick={onStart} style={{ fontSize: 15, padding: '13px 30px' }}>
        Start prepping →
      </Button>
    </div>
  )
}
