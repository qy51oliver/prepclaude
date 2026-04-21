const CLAUDE_API = 'https://api.anthropic.com/v1/messages'

async function callClaude(apiKey: string, system: string, user: string): Promise<string> {
  const res = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } }
    throw new Error(err?.error?.message ?? `API error ${res.status}`)
  }

  const data = await res.json() as { content: Array<{ text: string }> }
  return data.content[0].text
}

function parseJSON<T>(raw: string): T {
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as T
}

export interface GenerateResult {
  role: string
  company: string
  skills: string[]
  questions: Array<{ id: number; category: string; question: string }>
}

export async function generateQuestions(
  apiKey: string,
  jd: string,
  resumeText: string
): Promise<GenerateResult> {
  const resumeContext = resumeText ? `\n\nCandidate resume:\n${resumeText.slice(0, 1500)}` : ''

  const raw = await callClaude(
    apiKey,
    'You are a technical interview coach. Return ONLY valid JSON, no markdown, no explanation.',
    `Analyze this job description and generate 10 interview questions tailored to this specific role.

Return exactly this JSON structure:
{
  "role": "Job title",
  "company": "Company name or Unknown",
  "skills": ["skill1","skill2","skill3","skill4","skill5"],
  "questions": [
    {"id":1,"category":"<relevant category>","question":"<specific question>"},
    ... 10 questions total
  ]
}

Rules:
- Choose categories that make sense for THIS specific role. A medical role should have clinical categories. A finance role should have finance categories. A software role should have technical categories. Do NOT default to CS categories for non-CS roles.
- Example categories for medical roles: Clinical Knowledge, Patient Safety, Pharmacology, Behavioral, Case Management, Procedures, Ethics, Communication, Diagnostics, Systems/EMR
- Example categories for software roles: Algorithms, System Design, Behavioral, Domain Knowledge, Architecture, Problem Solving, Language-Specific, Databases, Testing, DevOps
- Make every question specific to this company and role — reference actual requirements from the JD
${resumeText ? '- Tailor questions to the candidate resume where relevant' : ''}

Job Description: ${jd}${resumeContext}`
  )

  return parseJSON<GenerateResult>(raw)
}

export async function generateExampleAnswer(
  apiKey: string,
  role: string,
  category: string,
  question: string
): Promise<string> {
  return callClaude(
    apiKey,
    'You are a senior engineer with 8 years of experience being interviewed for a top tech company. Give a strong, realistic interview answer — not a textbook answer. Be specific, use examples, show your thinking.',
    `Give a strong example answer to this interview question. Write it as if you are actually answering in an interview — first person, conversational but precise. 3-5 paragraphs.

Role: ${role} | Category: ${category}
Question: ${question}`
  )
}

export interface EvalResult {
  score: number
  verdict: string
  strengths: string[]
  improvements: string[]
  idealPoints: string[]
  followUp: string
}

export async function evaluateAnswer(
  apiKey: string,
  role: string,
  category: string,
  question: string,
  answer: string
): Promise<EvalResult> {
  const raw = await callClaude(
    apiKey,
    'You are a senior technical interviewer at a top tech company. Return ONLY valid JSON, no markdown.',
    `Evaluate this interview answer. Return JSON:
{
  "score": 7,
  "verdict": "One honest sentence overall verdict",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2"],
  "idealPoints": ["key point 1", "key point 2", "key point 3"],
  "followUp": "A follow-up question the interviewer would ask"
}
Score 1-10. Be direct and honest. This person is preparing for a real interview.
Role: ${role} | Category: ${category}
Question: ${question}
Candidate answer: ${answer}`
  )

  return parseJSON<EvalResult>(raw)
}
