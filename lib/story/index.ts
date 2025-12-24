import { Chapter, Story, StoryMoment } from './types';
import { chapter1 } from './chapter1';
import { shuffleChoices } from './utils';

/**
 * Get all available chapters
 */
export function getAllChapters(): Chapter[] {
  return [chapter1];
}

/**
 * Get a specific chapter by number
 */
export function getChapter(chapterNumber: number): Chapter | null {
  const chapters = getAllChapters();
  return chapters.find((c) => c.number === chapterNumber) || null;
}

/**
 * Get a specific story from a chapter
 * IMPORTANT: This shuffles choices ONCE when loading
 */
export function getStory(chapterNumber: number, storyIndex: number): Story | null {
  const chapter = getChapter(chapterNumber);
  if (!chapter || storyIndex < 0 || storyIndex >= chapter.stories.length) {
    return null;
  }

  const story = chapter.stories[storyIndex];

  // Shuffle choices for each moment ONCE on load
  // This prevents the "always pick first answer" pattern
  const shuffledStory: Story = {
    ...story,
    moments: story.moments.map((moment) => ({
      ...moment,
      choices: shuffleChoices(moment.choices),
    })),
  };

  return shuffledStory;
}

/**
 * Get the total number of stories in a chapter
 */
export function getStoryCount(chapterNumber: number): number {
  const chapter = getChapter(chapterNumber);
  return chapter?.stories.length || 0;
}

export { chapter1 };
export * from './types';
export * from './utils';
