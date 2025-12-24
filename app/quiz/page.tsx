'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { QuizQuestion, GameSession, LifelineType } from '@/lib/quiz/types';
import { getRandomQuestions } from '@/lib/quiz/questions';

const TOTAL_QUESTIONS = 15;
const POINTS_PER_CORRECT = 100;
const STREAK_BONUS_PERCENT = 10;
const MAX_STREAK_MULTIPLIER = 2.5;

export default function QuizPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [session, setSession] = useState<GameSession>({
    currentQuestionIndex: 0,
    score: 0,
    streak: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    totalQuestions: TOTAL_QUESTIONS,
    selectedQuestions: [],
    usedLifelines: {
      fiftyFifty: false,
      skip: false,
      askGuru: false,
    },
    removedAnswers: new Set<string>(),
    showFeedback: false,
    lastAnswerCorrect: null,
    lastExplanation: '',
    isComplete: false,
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showGuruHint, setShowGuruHint] = useState(false);
  const [guruRecommendation, setGuruRecommendation] = useState<string>('');

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setIsAuthenticated(true);
      setIsLoading(false);
    };
    checkAuth();
  }, [router, supabase.auth]);

  // Initialize game
  useEffect(() => {
    if (isAuthenticated && session.selectedQuestions.length === 0) {
      const questions = getRandomQuestions(TOTAL_QUESTIONS);
      setSession(prev => ({ ...prev, selectedQuestions: questions }));
    }
  }, [isAuthenticated, session.selectedQuestions.length]);

  const currentQuestion = session.selectedQuestions[session.currentQuestionIndex];

  const handleLifeline = (type: LifelineType) => {
    if (session.usedLifelines[type] || session.showFeedback) return;

    if (type === 'fiftyFifty') {
      // Remove two wrong answers
      const wrongAnswers = currentQuestion.answers
        .filter(a => !a.isCorrect && !session.removedAnswers.has(a.id))
        .map(a => a.id);

      const toRemove = wrongAnswers.slice(0, 2);
      setSession(prev => ({
        ...prev,
        removedAnswers: new Set([...prev.removedAnswers, ...toRemove]),
        usedLifelines: { ...prev.usedLifelines, fiftyFifty: true },
      }));
    } else if (type === 'skip') {
      // Skip to next question
      setSession(prev => ({
        ...prev,
        usedLifelines: { ...prev.usedLifelines, skip: true },
        questionsAnswered: prev.questionsAnswered + 1,
        streak: 0,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        removedAnswers: new Set<string>(),
      }));
      setSelectedAnswer(null);
      setShowGuruHint(false);
    } else if (type === 'askGuru') {
      // Show hint pointing to best answer
      const correctAnswer = currentQuestion.answers.find(a => a.isCorrect);
      if (correctAnswer) {
        setGuruRecommendation(`The Money Guru says: "${correctAnswer.explanationShort}"`);
        setShowGuruHint(true);
        setSession(prev => ({
          ...prev,
          usedLifelines: { ...prev.usedLifelines, askGuru: true },
        }));
      }
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    if (session.showFeedback) return;
    setSelectedAnswer(answerId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || session.showFeedback) return;

    const answer = currentQuestion.answers.find(a => a.id === selectedAnswer);
    if (!answer) return;

    const isCorrect = answer.isCorrect;
    const newStreak = isCorrect ? session.streak + 1 : 0;
    const streakMultiplier = Math.min(1 + (newStreak * STREAK_BONUS_PERCENT) / 100, MAX_STREAK_MULTIPLIER);
    const pointsEarned = isCorrect ? Math.round(POINTS_PER_CORRECT * streakMultiplier) : 0;

    setSession(prev => ({
      ...prev,
      showFeedback: true,
      lastAnswerCorrect: isCorrect,
      lastExplanation: answer.explanationShort,
      score: prev.score + pointsEarned,
      streak: newStreak,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      questionsAnswered: prev.questionsAnswered + 1,
    }));
  };

  const handleNextQuestion = () => {
    if (session.currentQuestionIndex + 1 >= TOTAL_QUESTIONS) {
      setSession(prev => ({ ...prev, isComplete: true }));
    } else {
      setSession(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showFeedback: false,
        lastAnswerCorrect: null,
        lastExplanation: '',
        removedAnswers: new Set<string>(),
      }));
      setSelectedAnswer(null);
      setShowGuruHint(false);
      setGuruRecommendation('');
    }
  };

  const handlePlayAgain = () => {
    const questions = getRandomQuestions(TOTAL_QUESTIONS);
    setSession({
      currentQuestionIndex: 0,
      score: 0,
      streak: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      totalQuestions: TOTAL_QUESTIONS,
      selectedQuestions: questions,
      usedLifelines: {
        fiftyFifty: false,
        skip: false,
        askGuru: false,
      },
      removedAnswers: new Set<string>(),
      showFeedback: false,
      lastAnswerCorrect: null,
      lastExplanation: '',
      isComplete: false,
    });
    setSelectedAnswer(null);
    setShowGuruHint(false);
    setGuruRecommendation('');
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💰</div>
          <div className="text-2xl font-bold text-gray-800">Loading...</div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-2xl font-bold text-gray-800">Preparing questions...</div>
        </div>
      </div>
    );
  }

  // End screen
  if (session.isComplete) {
    const accuracy = Math.round((session.correctAnswers / session.questionsAnswered) * 100);
    const grade = accuracy >= 90 ? 'A' : accuracy >= 80 ? 'B' : accuracy >= 70 ? 'C' : accuracy >= 60 ? 'D' : 'F';
    const gradeColor = accuracy >= 80 ? 'text-green-600' : accuracy >= 60 ? 'text-yellow-600' : 'text-red-600';

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">🎉</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
              <p className="text-gray-600">Great job! Here's how you did:</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
                <div className="text-center">
                  <div className="text-sm uppercase tracking-wide mb-2">Final Score</div>
                  <div className="text-6xl font-black">{session.score}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Accuracy</div>
                  <div className={`text-3xl font-bold ${gradeColor}`}>{accuracy}%</div>
                  <div className="text-xs text-gray-500 mt-1">Grade: {grade}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Correct</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {session.correctAnswers}/{session.questionsAnswered}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-yellow-800 font-medium">Best Streak</div>
                    <div className="text-2xl font-bold text-yellow-900">🔥 {session.streak} in a row</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePlayAgain}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-105"
              >
                🎮 Play Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl text-lg transition-all"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main quiz UI
  const progress = ((session.currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;
  const visibleAnswers = currentQuestion.answers.filter(a => !session.removedAnswers.has(a.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto py-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="text-sm font-bold text-gray-700">
                Question {session.currentQuestionIndex + 1}/{TOTAL_QUESTIONS}
              </div>
              <div className="text-sm font-bold text-blue-600">
                Score: {session.score}
              </div>
              {session.streak > 0 && (
                <div className="text-sm font-bold text-orange-600">
                  🔥 {session.streak} streak
                </div>
              )}
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg font-medium transition-all"
            >
              Exit
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Lifelines */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 border border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-bold text-gray-700">Lifelines:</div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLifeline('fiftyFifty')}
                disabled={session.usedLifelines.fiftyFifty || session.showFeedback}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  session.usedLifelines.fiftyFifty || session.showFeedback
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
                }`}
              >
                50/50
              </button>
              <button
                onClick={() => handleLifeline('skip')}
                disabled={session.usedLifelines.skip || session.showFeedback}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  session.usedLifelines.skip || session.showFeedback
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-400 hover:bg-blue-500 text-blue-900'
                }`}
              >
                Skip
              </button>
              <button
                onClick={() => handleLifeline('askGuru')}
                disabled={session.usedLifelines.askGuru || session.showFeedback}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  session.usedLifelines.askGuru || session.showFeedback
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-400 hover:bg-green-500 text-green-900'
                }`}
              >
                🧙 Ask Guru
              </button>
            </div>
          </div>
        </div>

        {/* Guru Hint */}
        {showGuruHint && (
          <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl shadow-lg p-4 mb-4 border-2 border-green-500 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🧙</div>
              <div className="flex-1">
                <div className="font-bold text-green-900 mb-1">Money Guru Wisdom:</div>
                <div className="text-green-800">{guruRecommendation}</div>
              </div>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4 border-2 border-gray-200">
          <div className="mb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentQuestion.difficulty.toUpperCase()}
            </span>
            <span className="ml-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {currentQuestion.category.toUpperCase()}
            </span>
          </div>

          <p className="text-xl font-medium text-gray-900 leading-relaxed">
            {currentQuestion.prompt}
          </p>
        </div>

        {/* Answers */}
        <div className="space-y-3 mb-4">
          {visibleAnswers.map((answer) => {
            const isSelected = selectedAnswer === answer.id;
            const showResult = session.showFeedback;
            const isCorrectAnswer = answer.isCorrect;

            let className = 'w-full text-left p-4 rounded-xl font-medium transition-all border-2 ';

            if (showResult) {
              if (isCorrectAnswer) {
                className += 'bg-green-100 border-green-500 text-green-900';
              } else if (isSelected && !isCorrectAnswer) {
                className += 'bg-red-100 border-red-500 text-red-900';
              } else {
                className += 'bg-gray-100 border-gray-300 text-gray-600';
              }
            } else {
              if (isSelected) {
                className += 'bg-blue-100 border-blue-500 text-blue-900 shadow-lg transform scale-105';
              } else {
                className += 'bg-white border-gray-300 text-gray-800 hover:border-blue-400 hover:bg-blue-50';
              }
            }

            return (
              <button
                key={answer.id}
                onClick={() => handleAnswerSelect(answer.id)}
                disabled={session.showFeedback}
                className={className}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold ${
                    showResult && isCorrectAnswer ? 'bg-green-500 text-white' :
                    showResult && isSelected && !isCorrectAnswer ? 'bg-red-500 text-white' :
                    isSelected ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {showResult && isCorrectAnswer ? '✓' :
                     showResult && isSelected && !isCorrectAnswer ? '✗' :
                     answer.id.toUpperCase()}
                  </div>
                  <span className="flex-1">{answer.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {session.showFeedback && (
          <div className={`rounded-2xl shadow-lg p-6 mb-4 border-2 ${
            session.lastAnswerCorrect
              ? 'bg-green-50 border-green-500'
              : 'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="text-4xl">
                {session.lastAnswerCorrect ? '✅' : '❌'}
              </div>
              <div className="flex-1">
                <div className={`text-2xl font-bold mb-2 ${
                  session.lastAnswerCorrect ? 'text-green-900' : 'text-red-900'
                }`}>
                  {session.lastAnswerCorrect ? 'Correct!' : 'Incorrect'}
                </div>
                <p className={`text-lg ${
                  session.lastAnswerCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {session.lastExplanation}
                </p>
                {session.lastAnswerCorrect && session.streak > 1 && (
                  <div className="mt-2 text-orange-600 font-bold">
                    🔥 {session.streak} in a row! Streak bonus active!
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-105"
            >
              {session.currentQuestionIndex + 1 >= TOTAL_QUESTIONS ? 'See Results' : 'Next Question →'}
            </button>
          </div>
        )}

        {/* Submit button */}
        {!session.showFeedback && (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className={`w-full font-bold py-4 rounded-xl text-lg transition-all ${
              selectedAnswer
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transform hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedAnswer ? 'Submit Answer' : 'Select an answer'}
          </button>
        )}
      </div>
    </div>
  );
}
