import { useState, useCallback } from 'react'
import type { Question, JobSummary, PracticeResult, Session, Screen } from '../types'

const SESSIONS_KEY = 'prepclaude-sessions'

function loadSessions(): Session[] {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) ?? '[]') as Session[]
  } catch {
    return []
  }
}

function saveSessions(sessions: Session[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 20)))
}

export function useSession() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [apiKey, setApiKey] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [jobSummary, setJobSummary] = useState<JobSummary | null>(null)
  const [results, setResults] = useState<Map<number, PracticeResult>>(new Map())
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null)
  const [sessions, setSessions] = useState<Session[]>(loadSessions)

  const currentQuestion = questions.find(q => q.id === currentQuestionId) ?? null

  const startSession = useCallback((
    key: string,
    qs: Question[],
    summary: JobSummary
  ) => {
    setApiKey(key)
    setQuestions(qs)
    setJobSummary(summary)
    setResults(new Map())
    setScreen('questions')
  }, [])

  const openQuestion = useCallback((id: number) => {
    setCurrentQuestionId(id)
    setScreen('practice')
  }, [])

  const saveResult = useCallback((result: PracticeResult) => {
    setResults(prev => new Map(prev).set(result.questionId, result))
  }, [])

  const finishSession = useCallback(() => {
    if (!jobSummary) return
    const allResults = Array.from(results.values())
    const avg = allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length

    const session: Session = {
      id: Date.now().toString(),
      role: jobSummary.role,
      company: jobSummary.company,
      date: new Date().toLocaleDateString(),
      avgScore: Math.round(avg * 10) / 10,
      results: allResults,
      questions,
    }

    const updated = [session, ...loadSessions()]
    saveSessions(updated)
    setSessions(updated)
    setScreen('summary')
  }, [jobSummary, results, questions])

  const resetSession = useCallback(() => {
    setQuestions([])
    setJobSummary(null)
    setResults(new Map())
    setCurrentQuestionId(null)
    setScreen('setup')
  }, [])

  return {
    screen, setScreen,
    apiKey,
    questions,
    jobSummary,
    results,
    currentQuestion,
    currentQuestionId,
    sessions,
    startSession,
    openQuestion,
    saveResult,
    finishSession,
    resetSession,
  }
}
