# PrepClaude

**AI-powered technical interview prep. Built with React + TypeScript + Claude API.**

Paste a job description → get 10 role-specific questions → practice answers → get scored feedback → see your weak areas.

**[Try it live →](https://qy51oliver.github.io/prepclaude/)**

---

## Features

- Role-specific questions generated from the actual JD you're applying to
- Resume upload — questions tailored to your background
- AI-scored feedback: score, strengths, improvements, ideal answer points
- Persistent session history across visits
- Results summary with weak area analysis after completing all 10 questions

## Tech stack

- React 18 + TypeScript
- Vite
- Claude API (claude-sonnet) for question generation and answer evaluation
- localStorage for session persistence
- Zero backend — runs entirely in the browser

## Run locally

```bash
git clone https://github.com/qy51oliver/prepclaude
cd prepclaude
npm install
npm run dev
```

Get a free API key at [console.anthropic.com](https://console.anthropic.com)

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Why I built this

Applying for AI Engineer roles as an MSCS grad. Found that generic interview prep doesn't match what companies actually ask. This generates questions from the real JD so you're practicing for that specific interview.

---

Built by [Oliver](https://github.com/qy51oliver) · MSCS Computer Science
