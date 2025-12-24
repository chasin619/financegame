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
const QUESTION_TIME_SECONDS = 10;
const BOSS_MULTIPLIER = 2;

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
  const [guruHighlightAnswerId, setGuruHighlightAnswerId] = useState<string | null>(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS);
  const [timedOut, setTimedOut] = useState(false);

  // Meters state
  const [wallet, setWallet] = useState(50);
  const [debt, setDebt] = useState(0);
  const [stress, setStress] = useState(10);

  // Tracking state for badges
  const [bestStreak, setBestStreak] = useState(0);
  const [maxStress, setMaxStress] = useState(10);
  const [neverIncreasedDebt, setNeverIncreasedDebt] = useState(true);
  const [clutchCorrectCount, setClutchCorrectCount] = useState(0);

  // Streak juice state
  const [streakBroken, setStreakBroken] = useState(false);
  const [streakIncreased, setStreakIncreased] = useState(false);

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

  // Timer effect
  useEffect(() => {
    // Only run timer when: question is active, not showing feedback, not complete, not timed out
    if (!currentQuestion || session.showFeedback || session.isComplete || timedOut) {
      return;
    }

    // Reset timer for new question
    setTimeLeft(QUESTION_TIME_SECONDS);
    setTimedOut(false);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = QUESTION_TIME_SECONDS - elapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setTimedOut(true);

        // Auto-submit as incorrect
        const wasStreaking = session.streak > 0;
        setSession(prev => ({
          ...prev,
          showFeedback: true,
          lastAnswerCorrect: false,
          lastExplanation: "Time's up! Make a choice faster next time.",
          streak: 0,
          questionsAnswered: prev.questionsAnswered + 1,
        }));

        // Show streak broken toast if applicable
        if (wasStreaking) {
          setStreakBroken(true);
          setTimeout(() => setStreakBroken(false), 900);
        }
      } else {
        setTimeLeft(remaining);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentQuestion, session.showFeedback, session.isComplete, session.currentQuestionIndex]);

  const handleLifeline = (type: LifelineType) => {
    if (session.usedLifelines[type] || session.showFeedback) return;

    const isBoss = (session.currentQuestionIndex + 1) % 5 === 0;

    if (type === 'fiftyFifty') {
      // Disable 50/50 on boss questions
      if (isBoss) return;

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
      // Skip to next question - reset timer cleanly
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
      setGuruHighlightAnswerId(null);
      setTimedOut(false);
    } else if (type === 'askGuru') {
      // Show hint and highlight best answer
      const correctAnswer = currentQuestion.answers.find(a => a.isCorrect);
      if (correctAnswer) {
        // Create a short hint instead of repeating explanation
        const hints = [
          "Think long-term — avoid debt traps.",
          "Consider what builds wealth, not just comfort.",
          "Remember: cash flow beats appearance.",
          "Focus on the choice that reduces stress.",
          "What would your future self thank you for?"
        ];
        const hint = hints[Math.floor(Math.random() * hints.length)];

        setGuruRecommendation(`Guru: ${hint}`);
        setShowGuruHint(true);
        setGuruHighlightAnswerId(correctAnswer.id);
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
    const isBoss = (session.currentQuestionIndex + 1) % 5 === 0;
    const wasStreaking = session.streak > 0;

    // Calculate streak and points
    const newStreak = isCorrect ? session.streak + 1 : 0;
    const streakMultiplier = Math.min(1 + (newStreak * STREAK_BONUS_PERCENT) / 100, MAX_STREAK_MULTIPLIER);
    const basePoints = isBoss ? POINTS_PER_CORRECT * BOSS_MULTIPLIER : POINTS_PER_CORRECT;
    const pointsEarned = isCorrect ? Math.round(basePoints * streakMultiplier) : 0;

    // Track clutch correct (answered with <= 2 sec left)
    if (isCorrect && timeLeft <= 2) {
      setClutchCorrectCount(prev => prev + 1);
    }

    // Track best streak
    if (newStreak > bestStreak) {
      setBestStreak(newStreak);
    }

    // Apply meter impacts
    const impact = answer.impact || { wallet: 0, debt: 0, stress: 0 };
    const newWallet = Math.max(0, Math.min(100, wallet + (impact.wallet || 0)));
    const newDebt = Math.max(0, Math.min(100, debt + (impact.debt || 0)));
    const newStress = Math.max(0, Math.min(100, stress + (impact.stress || 0)));

    setWallet(newWallet);
    setDebt(newDebt);
    setStress(newStress);

    // Track max stress and debt increase
    if (newStress > maxStress) {
      setMaxStress(newStress);
    }
    if ((impact.debt || 0) > 0) {
      setNeverIncreasedDebt(false);
    }

    // Determine feedback message based on grade
    let feedbackMessage = answer.explanationShort;
    if (!isCorrect && answer.grade === 'ok') {
      feedbackMessage = `🟡 Close! ${answer.explanationShort}`;
    } else if (isCorrect && isBoss) {
      feedbackMessage = `💥 Boss cleared! ${answer.explanationShort}`;
    }

    setSession(prev => ({
      ...prev,
      showFeedback: true,
      lastAnswerCorrect: isCorrect,
      lastExplanation: feedbackMessage,
      score: prev.score + pointsEarned,
      streak: newStreak,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      questionsAnswered: prev.questionsAnswered + 1,
    }));

    // Streak juice animations
    if (isCorrect && newStreak > session.streak) {
      setStreakIncreased(true);
      setTimeout(() => setStreakIncreased(false), 600);
    }
    if (!isCorrect && wasStreaking) {
      setStreakBroken(true);
      setTimeout(() => setStreakBroken(false), 900);
    }
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
      setGuruHighlightAnswerId(null);
      setTimedOut(false);
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
    setGuruHighlightAnswerId(null);
    setTimeLeft(QUESTION_TIME_SECONDS);
    setTimedOut(false);
    setWallet(50);
    setDebt(0);
    setStress(10);
    setBestStreak(0);
    setMaxStress(10);
    setNeverIncreasedDebt(true);
    setClutchCorrectCount(0);
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

    // Calculate badges
    const badges = [];
    if (neverIncreasedDebt && debt === 0) {
      badges.push({ name: 'No Credit Used', icon: '💳', desc: 'Never increased debt' });
    }
    if (bestStreak >= 7) {
      badges.push({ name: 'Perfect Streak', icon: '🔥', desc: `${bestStreak} in a row!` });
    }
    if (stress <= 30 && maxStress <= 60) {
      badges.push({ name: 'Calm Mind', icon: '🧘', desc: 'Stayed calm under pressure' });
    }
    if (clutchCorrectCount > 0) {
      badges.push({ name: 'Clutch', icon: '⚡', desc: `${clutchCorrectCount} last-second win${clutchCorrectCount > 1 ? 's' : ''}` });
    }

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
                    <div className="text-2xl font-bold text-yellow-900">🔥 {bestStreak} in a row</div>
                  </div>
                </div>
              </div>
            </div>

            {badges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Badges Earned</h3>
                <div className="grid grid-cols-2 gap-3">
                  {badges.map((badge, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <div className="text-2xl mb-1">{badge.icon}</div>
                      <div className="text-sm font-bold text-gray-900">{badge.name}</div>
                      <div className="text-xs text-gray-600">{badge.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
  const isBoss = (session.currentQuestionIndex + 1) % 5 === 0;

  // Calculate scar icons based on meter thresholds
  const scarIcons = [];
  if (debt >= 60) scarIcons.push('👻');
  if (stress >= 70) scarIcons.push('🌫️');
  if (wallet <= 15) scarIcons.push('🚨');
  const scarsDisplay = scarIcons.slice(0, 3).join(' ');

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
                <div className={`text-sm font-bold text-orange-600 ${streakIncreased ? 'animate-pulse' : ''}`}>
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
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Timer */}
          {!session.showFeedback && (
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={timeLeft <= 3 ? 'text-red-600 font-bold' : ''}>
                    ⏱ {timeLeft}s
                  </span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${timeLeft <= 3 ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${(timeLeft / QUESTION_TIME_SECONDS) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Meters and scars */}
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono">💵 {wallet}</span>
            <span className="font-mono">💳 {debt}</span>
            <span className="font-mono">😬 {stress}</span>
            {scarsDisplay && <span className="ml-auto">{scarsDisplay}</span>}
          </div>
        </div>

        {/* Streak broken toast */}
        {streakBroken && (
          <div className="text-center mb-2 text-sm text-red-600 font-bold animate-pulse">
            Streak broken 💔
          </div>
        )}

        {/* Lifelines */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 border border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-bold text-gray-700">Lifelines:</div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLifeline('fiftyFifty')}
                disabled={session.usedLifelines.fiftyFifty || session.showFeedback || isBoss}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  session.usedLifelines.fiftyFifty || session.showFeedback || isBoss
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
            {isBoss && (
              <span className="ml-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
                BOSS
              </span>
            )}
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
            const isGuruHighlight = !showResult && guruHighlightAnswerId === answer.id;

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
              } else if (isGuruHighlight) {
                className += 'bg-green-50 border-green-400 text-green-900 shadow-md';
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
              : timedOut
                ? 'bg-orange-50 border-orange-500'
                : session.lastExplanation.startsWith('🟡')
                  ? 'bg-yellow-50 border-yellow-500'
                  : 'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="text-4xl">
                {session.lastAnswerCorrect ? '✅' : timedOut ? '⏱' : session.lastExplanation.startsWith('🟡') ? '🟡' : '❌'}
              </div>
              <div className="flex-1">
                <div className={`text-2xl font-bold mb-2 ${
                  session.lastAnswerCorrect
                    ? 'text-green-900'
                    : timedOut
                      ? 'text-orange-900'
                      : session.lastExplanation.startsWith('🟡')
                        ? 'text-yellow-900'
                        : 'text-red-900'
                }`}>
                  {session.lastAnswerCorrect
                    ? 'Correct!'
                    : timedOut
                      ? "Time's Up!"
                      : session.lastExplanation.startsWith('🟡')
                        ? 'Close!'
                        : 'Incorrect'}
                </div>
                <p className={`text-lg ${
                  session.lastAnswerCorrect
                    ? 'text-green-800'
                    : timedOut
                      ? 'text-orange-800'
                      : session.lastExplanation.startsWith('🟡')
                        ? 'text-yellow-800'
                        : 'text-red-800'
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
