

const s: Record<string, React.CSSProperties> = {
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 500,
    background: 'var(--accent)', color: '#0a0a0a', border: 'none',
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 18px', borderRadius: 8, fontSize: 14, fontWeight: 400,
    background: 'transparent', color: 'var(--muted2)',
    border: '1px solid var(--border)', cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  btnSmall: { padding: '6px 14px', fontSize: 12 },
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  small?: boolean
}

export function Button({ variant = 'primary', small, style, ...props }: ButtonProps) {
  const base = variant === 'primary' ? s.btnPrimary : s.btnGhost
  return <button style={{ ...base, ...(small ? s.btnSmall : {}), ...style }} {...props} />
}

export function Dots() {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      {[0, 200, 400].map(delay => (
        <span key={delay} style={{
          width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)',
          display: 'inline-block',
          animation: `pulse 1.2s ${delay}ms infinite`,
        }} />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:.2}50%{opacity:1}}`}</style>
    </span>
  )
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace", fontSize: 11,
      padding: '3px 10px', borderRadius: 99,
      background: 'var(--accent-dim)', color: 'var(--accent)',
      border: '1px solid var(--accent-border)',
    }}>
      {children}
    </span>
  )
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '20px 24px', ...style,
    }}>
      {children}
    </div>
  )
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontFamily: "'DM Mono', monospace",
      color: 'var(--muted2)', textTransform: 'uppercase',
      letterSpacing: '0.08em', marginBottom: 8,
    }}>
      {children}
    </div>
  )
}

export function Input({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input style={{
      width: '100%', background: '#111111', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif",
      fontSize: 14, padding: '12px 14px', outline: 'none', colorScheme: 'dark',
      ...style,
    }} {...props} />
  )
}

export function Textarea({ style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea style={{
      width: '100%', background: '#111111', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif",
      fontSize: 14, padding: '12px 14px', outline: 'none',
      resize: 'vertical', lineHeight: 1.6, minHeight: 140,
      colorScheme: 'dark',
      ...style,
    }} {...props} />
  )
}

export function ErrorBox({ message }: { message: string }) {
  if (!message) return null
  return (
    <div style={{
      background: 'var(--red-dim)', border: '1px solid rgba(255,95,95,0.2)',
      borderRadius: 8, padding: '12px 16px', color: 'var(--red)',
      fontSize: 13, marginTop: 14,
    }}>
      {message}
    </div>
  )
}

export function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '14px 0' }} />
}

export function FeedbackSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: 10,
        color: 'var(--muted)', textTransform: 'uppercase',
        letterSpacing: '0.08em', marginBottom: 6,
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 14, lineHeight: 1.6, paddingLeft: 16, position: 'relative', marginBottom: 4 }}>
          <span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>→</span>
          {item}
        </li>
      ))}
    </ul>
  )
}
