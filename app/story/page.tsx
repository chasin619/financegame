'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getStory, Story, StoryChoice, GameState } from '@/lib/story';
import { getMoodEmoji } from '@/lib/story/utils';

function StoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get chapter and story from URL params
  const chapterParam = searchParams.get('chapter');
  const storyParam = searchParams.get('story');
  const currentChapter = parseInt(chapterParam || '1', 10);
  const currentStoryIndex = parseInt(storyParam || '0', 10);

  const [story, setStory] = useState<Story | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentChapter,
    currentStory: currentStoryIndex,
    currentMoment: 0,
    coins: 5, // Starting coins
    mood: 'calm',
    choiceHistory: [],
    showFeedback: false,
    lastChoice: null,
    isStoryComplete: false,
  });

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

  // Reset story when chapter/story index changes
  useEffect(() => {
    setStory(null);
    setGameState({
      currentChapter,
      currentStory: currentStoryIndex,
      currentMoment: 0,
      coins: 5,
      mood: 'calm',
      choiceHistory: [],
      showFeedback: false,
      lastChoice: null,
      isStoryComplete: false,
    });
  }, [currentChapter, currentStoryIndex]);

  // Load story (with shuffled choices)
  useEffect(() => {
    if (isAuthenticated && !story) {
      const loadedStory = getStory(currentChapter, currentStoryIndex);
      setStory(loadedStory);
    }
  }, [isAuthenticated, currentChapter, currentStoryIndex, story]);

  const currentMoment = story?.moments[gameState.currentMoment];

  const handleChoiceSelect = (choice: StoryChoice) => {
    if (gameState.showFeedback) return;

    // Update coins based on choice
    const newCoins = Math.max(0, gameState.coins + (choice.emotionalImpact.coins || 0));

    setGameState((prev) => ({
      ...prev,
      coins: newCoins,
      mood: choice.emotionalImpact.mood,
      lastChoice: choice,
      showFeedback: true,
      choiceHistory: [...prev.choiceHistory, choice.id],
    }));
  };

  const handleNextMoment = () => {
    if (!story) return;

    if (gameState.currentMoment + 1 >= story.moments.length) {
      // Story complete
      setGameState((prev) => ({ ...prev, isStoryComplete: true }));
    } else {
      // Next moment
      setGameState((prev) => ({
        ...prev,
        currentMoment: prev.currentMoment + 1,
        showFeedback: false,
        lastChoice: null,
      }));
    }
  };

  const handleNextStory = () => {
    // Go to next story in chapter
    const nextStoryIndex = currentStoryIndex + 1;
    if (nextStoryIndex < 5) {
      // Save progress to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentChapter', String(currentChapter));
        localStorage.setItem('currentStory', String(nextStoryIndex));
      }
      router.push(`/story?chapter=${currentChapter}&story=${nextStoryIndex}`);
    } else {
      // Chapter complete - reset progress
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentChapter', '1');
        localStorage.setItem('currentStory', '0');
      }
      router.push('/chapters');
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <div className="text-2xl font-bold text-gray-800">Loading story...</div>
        </div>
      </div>
    );
  }

  if (!story || !currentMoment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <div className="text-2xl font-bold text-gray-800">Story not found</div>
          <button
            onClick={() => router.push('/chapters')}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-xl"
          >
            Back to Chapters
          </button>
        </div>
      </div>
    );
  }

  // Story complete screen
  if (gameState.isStoryComplete) {
    // Determine ending based on choices
    const bestChoices = gameState.choiceHistory.filter((choiceId) => {
      // Find the choice in the story
      for (const moment of story.moments) {
        const choice = moment.choices.find((c) => c.id === choiceId);
        if (choice?.isBest) return true;
      }
      return false;
    }).length;

    const totalMoments = story.moments.length;
    const percentage = (bestChoices / totalMoments) * 100;

    let ending = story.happyEnding.learning;
    if (percentage >= 70) {
      ending = story.happyEnding.good;
    } else if (percentage >= 40) {
      ending = story.happyEnding.okay;
    }

    const isLastStory = currentStoryIndex >= 4;

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-amber-200">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">🎉</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Story Complete!</h1>
              <p className="text-2xl text-amber-600 font-medium">{story.title}</p>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 mb-6">
              <p className="text-lg text-gray-800 leading-relaxed">{ending}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="text-sm text-yellow-800 mb-1">Your Coins</div>
                <div className="text-3xl font-bold text-yellow-900">🪙 {gameState.coins}</div>
              </div>
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                <div className="text-sm text-pink-800 mb-1">How You Feel</div>
                <div className="text-3xl font-bold text-pink-900">{getMoodEmoji(gameState.mood)}</div>
              </div>
            </div>

            <div className="space-y-3">
              {!isLastStory && (
                <button
                  onClick={handleNextStory}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-105"
                >
                  Next Story →
                </button>
              )}
              {isLastStory && (
                <button
                  onClick={() => router.push('/chapters')}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-105"
                >
                  🎊 Chapter Complete!
                </button>
              )}
              <button
                onClick={() => router.push('/chapters')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl text-lg transition-all"
              >
                ← Back to Chapters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main story UI
  const progress = ((gameState.currentMoment + 1) / story.moments.length) * 100;
  const moodEmoji = getMoodEmoji(gameState.mood);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4">
      <div className="max-w-3xl mx-auto py-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                📖 {story.title}
              </div>
              <div className="text-sm font-bold text-gray-700">
                Moment {gameState.currentMoment + 1}/{story.moments.length}
              </div>
            </div>
            <button
              onClick={() => router.push('/chapters')}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg font-medium transition-all"
            >
              Exit
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Character status */}
          <div className="flex items-center gap-4 text-sm">
            <span className="font-mono">🪙 {gameState.coins} coins</span>
            <span className="font-mono">{moodEmoji} {gameState.mood}</span>
          </div>
        </div>

        {/* Teaser (if exists) */}
        {currentMoment.teaser && !gameState.showFeedback && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-lg p-4 mb-4 border-2 border-purple-200">
            <p className="text-center text-purple-800 font-medium italic">{currentMoment.teaser}</p>
          </div>
        )}

        {/* Moment Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4 border-2 border-amber-200">
          <p className="text-xl font-medium text-gray-900 leading-relaxed">
            {currentMoment.text}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-3 mb-4">
          {currentMoment.choices.map((choice) => {
            const isSelected = gameState.lastChoice?.id === choice.id;
            const showResult = gameState.showFeedback;

            let className = 'w-full text-left p-4 rounded-xl font-medium transition-all border-2 ';

            if (showResult) {
              if (isSelected) {
                className += choice.isBest
                  ? 'bg-green-100 border-green-500 text-green-900'
                  : 'bg-orange-100 border-orange-500 text-orange-900';
              } else {
                className += 'bg-gray-100 border-gray-300 text-gray-600';
              }
            } else {
              className += 'bg-white border-amber-300 text-gray-800 hover:border-amber-500 hover:bg-amber-50 hover:shadow-lg transform hover:scale-102';
            }

            return (
              <button
                key={choice.id}
                onClick={() => handleChoiceSelect(choice)}
                disabled={gameState.showFeedback}
                className={className}
              >
                <div className="flex items-start">
                  <span className="flex-1">{choice.text}</span>
                  {showResult && isSelected && (
                    <span className="ml-3 text-2xl">
                      {choice.isBest ? '💛' : '💭'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Consequence Card (Feedback) */}
        {gameState.showFeedback && gameState.lastChoice && (
          <div className={`rounded-2xl shadow-lg p-6 mb-4 border-2 ${
            gameState.lastChoice.isBest
              ? 'bg-green-50 border-green-500'
              : 'bg-orange-50 border-orange-500'
          }`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="text-4xl">
                {gameState.lastChoice.isBest ? '✨' : '💭'}
              </div>
              <div className="flex-1">
                <p className={`text-lg font-medium ${
                  gameState.lastChoice.isBest
                    ? 'text-green-900'
                    : 'text-orange-900'
                }`}>
                  {gameState.lastChoice.consequenceText}
                </p>
              </div>
            </div>

            <button
              onClick={handleNextMoment}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-105"
            >
              {gameState.currentMoment + 1 >= story.moments.length ? 'Finish Story' : 'Continue →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <div className="text-2xl font-bold text-gray-800">Loading story...</div>
        </div>
      </div>
    }>
      <StoryContent />
    </Suspense>
  );
}
