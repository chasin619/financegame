export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type QuestionCategory = 'spending' | 'debt' | 'savings' | 'investing' | 'mindset';

export interface QuizAnswer {
  id: string;
  label: string;
  isCorrect: boolean;
  explanationShort: string;
  impactTag?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  answers: QuizAnswer[];
  difficulty: DifficultyLevel;
  category: QuestionCategory;
}

export interface GameSession {
  currentQuestionIndex: number;
  score: number;
  streak: number;
  questionsAnswered: number;
  correctAnswers: number;
  totalQuestions: number;
  selectedQuestions: QuizQuestion[];
  usedLifelines: {
    fiftyFifty: boolean;
    skip: boolean;
    askGuru: boolean;
  };
  removedAnswers: Set<string>;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
  lastExplanation: string;
  isComplete: boolean;
}

export type LifelineType = 'fiftyFifty' | 'skip' | 'askGuru';
