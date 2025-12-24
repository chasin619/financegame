// Story-driven game types (NOT quiz!)

export type CharacterMood = 'happy' | 'calm' | 'worried' | 'excited';

export interface StoryChoice {
  id: string;
  text: string;
  isBest: boolean; // Exactly one per moment
  consequenceText: string; // "Candy is gone 🍬💨"
  emotionalImpact: {
    coins?: number;
    mood: CharacterMood;
  };
}

export interface StoryMoment {
  id: string;
  text: string; // Emotionally framed ("You feel...", "You notice...")
  teaser?: string; // Optional anticipation text before moment
  choices: StoryChoice[]; // 2-3 choices, shuffled once on load
}

export interface Story {
  id: string;
  title: string; // "Pocket Coins Day", "Candy Now or Later?"
  description: string; // Brief story intro
  moments: StoryMoment[]; // ~10 moments
  happyEnding: {
    good: string; // If mostly good choices
    okay: string; // If mixed choices
    learning: string; // If mostly weak choices (STILL POSITIVE!)
  };
}

export interface Chapter {
  id: string;
  number: number;
  title: string; // "My First Money"
  stories: Story[]; // 5 stories played in order
}

export interface GameState {
  currentChapter: number;
  currentStory: number;
  currentMoment: number;
  coins: number;
  mood: CharacterMood;
  choiceHistory: string[]; // Track choices for continuity
  showFeedback: boolean;
  lastChoice: StoryChoice | null;
  isStoryComplete: boolean;
}
