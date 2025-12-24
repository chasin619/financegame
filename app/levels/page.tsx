'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MAX_LEVEL } from '@/lib/quiz/levels';

export default function LevelsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [bestScore, setBestScore] = useState<Record<number, number>>({});

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

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      try {
        const savedUnlockedLevel = parseInt(localStorage.getItem('unlockedLevel') || '1', 10);
        const savedLevelStars = JSON.parse(localStorage.getItem('levelStars') || '{}');
        const savedBestScore = JSON.parse(localStorage.getItem('bestScore') || '{}');

        setUnlockedLevel(savedUnlockedLevel);
        setLevelStars(savedLevelStars);
        setBestScore(savedBestScore);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, [isAuthenticated]);

  const handleResetProgress = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Are you sure you want to reset all progress? This cannot be undone!');
      if (confirmed) {
        localStorage.setItem('unlockedLevel', '1');
        localStorage.setItem('levelStars', '{}');
        localStorage.setItem('bestScore', '{}');
        setUnlockedLevel(1);
        setLevelStars({});
        setBestScore({});
      }
    }
  };

  const handleLevelClick = (level: number) => {
    if (level <= unlockedLevel) {
      router.push(`/quiz?level=${level}`);
    }
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

  const levels = Array.from({ length: MAX_LEVEL }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Level Map</h1>
          <p className="text-xl text-gray-700">
            Complete each level to unlock the next. Get 3 stars to progress!
          </p>
        </div>

        {/* Levels Grid */}
        <div className="grid gap-4 mb-8">
          {levels.map((level) => {
            const isUnlocked = level <= unlockedLevel;
            const stars = levelStars[level] || 0;
            const best = bestScore[level] || 0;
            const starsDisplay = stars > 0 ? '⭐'.repeat(stars) + '☆'.repeat(3 - stars) : '☆☆☆';

            return (
              <div
                key={level}
                onClick={() => handleLevelClick(level)}
                className={`relative bg-white rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isUnlocked
                    ? 'border-blue-300 hover:border-blue-500 hover:shadow-xl cursor-pointer transform hover:scale-102'
                    : 'border-gray-300 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left side: Level info */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black ${
                        isUnlocked ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {isUnlocked ? level : '🔒'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Level {level}
                        {!isUnlocked && <span className="text-gray-500 ml-2">(Locked)</span>}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {level === 1 && 'Learn basic money skills'}
                        {level === 2 && 'Practice budgeting basics'}
                        {level === 3 && 'Handle small emergencies'}
                        {level === 4 && 'Avoid common traps'}
                        {level === 5 && 'Make smart real-world choices'}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Stats */}
                  <div className="text-right">
                    <div className="text-3xl mb-1">{starsDisplay}</div>
                    {best > 0 && (
                      <div className="text-sm text-gray-600">
                        Best: {best}/10
                      </div>
                    )}
                    {!isUnlocked && stars === 0 && (
                      <div className="text-sm text-gray-500 italic">
                        Complete Level {level - 1} with 3 stars
                      </div>
                    )}
                  </div>
                </div>

                {/* Play button for unlocked levels */}
                {isUnlocked && (
                  <div className="absolute bottom-4 right-4">
                    <div className="text-blue-600 font-bold text-sm">
                      {stars === 0 ? 'Start Level →' : 'Play Again →'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-105"
          >
            ← Back to Home
          </button>
          <button
            onClick={handleResetProgress}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl text-sm transition-all"
          >
            🔄 Reset All Progress
          </button>
        </div>

        {/* Progress Summary */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="text-sm text-blue-800 mb-1">Levels Unlocked</div>
              <div className="text-3xl font-bold text-blue-900">{unlockedLevel}/{MAX_LEVEL}</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <div className="text-sm text-yellow-800 mb-1">Total Stars</div>
              <div className="text-3xl font-bold text-yellow-900">
                {Object.values(levelStars).reduce((a, b) => a + b, 0)}/{MAX_LEVEL * 3}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
