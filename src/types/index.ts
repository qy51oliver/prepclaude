export type Screen = 'landing' | 'setup' | 'questions' | 'practice' | 'summary'

export interface Question {
  id: number
  category: string
  question: string
}

export interface JobSummary {
  role: string
  company: string
  skills: string[]
}

export interface PracticeResult {
  questionId: number
  question: string
  category: string
  answer: string
  score: number
  verdict: string
  strengths: string[]
  improvements: string[]
  idealPoints: string[]
  followUp: string
}

export interface Session {
  id: string
  role: string
  company: string
  date: string
  avgScore: number
  results: PracticeResult[]
  questions: Question[]
}
