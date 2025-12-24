import { QuizQuestion } from '../types';
import * as level1 from './level1';
import * as level2 from './level2';
import * as level3 from './level3';
import * as level4 from './level4';
import * as level5 from './level5';

const levelModules = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5,
};

export const MAX_LEVEL = 5;

/**
 * Get all questions for a specific level
 */
export function getQuestionsForLevel(level: number): QuizQuestion[] {
  if (level < 1 || level > MAX_LEVEL) {
    console.warn(`Invalid level ${level}, defaulting to level 1`);
    return level1.questions;
  }

  const levelModule = levelModules[level as keyof typeof levelModules];
  return levelModule?.questions || level1.questions;
}

/**
 * Get a random subset of questions for a specific level
 */
export function getRandomQuestionsForLevel(level: number, count: number = 10): QuizQuestion[] {
  const allQuestions = getQuestionsForLevel(level);

  // Shuffle the questions using Fisher-Yates algorithm
  const shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Return the requested count, or all if count is greater
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get the level number constant from a level module
 */
export function getLevelNumber(level: number): number {
  if (level < 1 || level > MAX_LEVEL) {
    return 1;
  }

  const levelModule = levelModules[level as keyof typeof levelModules];
  return levelModule?.LEVEL_NUMBER || 1;
}
