
import { Nav } from './components/Nav'
import { Landing } from './components/Landing'
import { Setup } from './components/Setup'
import { QuestionList } from './components/QuestionList'
import { Practice } from './components/Practice'
import { Summary } from './components/Summary'
import { useSession } from './hooks/useSession'

export function App() {
  const {
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
  } = useSession()

  const currentIndex = currentQuestionId != null
    ? questions.findIndex(q => q.id === currentQuestionId)
    : 0

  function handleNextQuestion() {
    if (!currentQuestionId) return
    const nextIndex = (currentIndex + 1) % questions.length
    openQuestion(questions[nextIndex].id)
  }

  return (
    <>
      <Nav sessions={sessions} />
      <main style={{
        maxWidth: 780, margin: '0 auto', width: '100%', padding: '0 24px 100px',
      }}>
        {screen === 'landing' && (
          <Landing onStart={() => setScreen('setup')} />
        )}

        {screen === 'setup' && (
          <Setup
            onBack={() => setScreen('landing')}
            onGenerate={(key, qs, summary) => startSession(key, qs, summary)}
          />
        )}

        {screen === 'questions' && jobSummary && (
          <QuestionList
            jobSummary={jobSummary}
            questions={questions}
            results={results}
            onOpenQuestion={openQuestion}
            onNewSession={resetSession}
            onFinish={finishSession}
          />
        )}

        {screen === 'practice' && currentQuestion && jobSummary && (
          <Practice
            key={currentQuestion.id}
            question={currentQuestion}
            jobSummary={jobSummary}
            apiKey={apiKey}
            existingResult={results.get(currentQuestion.id)}
            questionIndex={currentIndex}
            totalQuestions={questions.length}
            onBack={() => setScreen('questions')}
            onSave={saveResult}
            onNext={handleNextQuestion}
          />
        )}

        {screen === 'summary' && (
          <Summary
            results={results}
            totalQuestions={questions.length}
            onNewSession={resetSession}
            onReview={() => setScreen('questions')}
          />
        )}
      </main>
    </>
  )
}
