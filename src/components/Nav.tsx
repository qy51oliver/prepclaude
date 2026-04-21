import { useState } from 'react'

import type { Session } from '../types'

interface NavProps {
  sessions: Session[]
}

export function Nav({ sessions }: NavProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav style={{
        padding: '16px 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(12px)', zIndex: 100,
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 15,
          fontWeight: 500, color: 'var(--accent)',
        }}>
          PrepClaude
        </div>
        <button
          onClick={() => setOpen(true)}
          style={{
            background: 'none', border: 'none', color: 'var(--muted2)',
            fontSize: 13, cursor: 'pointer',
          }}
        >
          History
        </button>
      </nav>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 190,
            }}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, width: 400, height: '100vh',
            background: 'var(--surface)', borderLeft: '1px solid var(--border)',
            zIndex: 200, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 15, fontWeight: 500 }}>Past sessions</span>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--muted2)', fontSize: 22, cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              {sessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted2)', fontSize: 14 }}>
                  No sessions yet. Complete your first practice to see history.
                </div>
              ) : sessions.map(s => (
                <div key={s.id} style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: 16, marginBottom: 10,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{s.role}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted2)', fontFamily: "'DM Mono', monospace" }}>
                    {s.company} · {s.date}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6, fontFamily: "'DM Mono', monospace" }}>
                    avg {s.avgScore}/10 · {s.results.length}/{s.questions.length} questions
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
