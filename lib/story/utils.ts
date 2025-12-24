import { StoryChoice } from './types';

/**
 * Shuffle array using Fisher-Yates algorithm
 * CRITICAL: Call this ONCE when loading story, NOT on every render
 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Shuffle choices for a moment - preserves choice data, just changes order
 */
export function shuffleChoices(choices: StoryChoice[]): StoryChoice[] {
  return shuffle(choices);
}

/**
 * Get random feedback variation to avoid repetition
 */
export function getRandomFeedback(type: 'good' | 'okay' | 'weak'): string {
  const feedbacks = {
    good: [
      'Nice choice! 💛',
      'You did it! ✨',
      'Smart thinking! 🌟',
      'Well done! 🎉',
      'Great job! 💫',
    ],
    okay: [
      'Hmm, maybe next time... 💭',
      'That works, but... 🤔',
      'Not bad! 👍',
      'Interesting choice! 💬',
      'Okay! 👌',
    ],
    weak: [
      'Oops... that felt good for a moment 😊',
      'Uh oh... 😬',
      'Next time you\'ll know! 💡',
      'Learning moment! 📚',
      'That\'s okay, everyone makes choices! 💛',
    ],
  };

  const options = feedbacks[type];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Get character mood emoji
 */
export function getMoodEmoji(mood: string): string {
  const emojis: Record<string, string> = {
    happy: '😄',
    calm: '😊',
    worried: '😬',
    excited: '🤩',
  };
  return emojis[mood] || '😊';
}
