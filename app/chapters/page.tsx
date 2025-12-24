'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getAllChapters } from '@/lib/story';

export default function ChaptersPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStory, setCurrentStory] = useState<{ chapter: number; story: number }>({ chapter: 1, story: 0 });

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
        const savedChapter = parseInt(localStorage.getItem('currentChapter') || '1', 10);
        const savedStory = parseInt(localStorage.getItem('currentStory') || '0', 10);
        setCurrentStory({ chapter: savedChapter, story: savedStory });
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, [isAuthenticated]);

  const chapters = getAllChapters();

  const handleStartChapter = (chapterNumber: number) => {
    // Start at story 0
    router.push(`/story?chapter=${chapterNumber}&story=0`);
  };

  const handleContinueStory = () => {
    router.push(`/story?chapter=${currentStory.chapter}&story=${currentStory.story}`);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <div className="text-2xl font-bold text-gray-800">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Your Story Collection</h1>
          <p className="text-xl text-gray-700">
            Choose a chapter and enjoy the stories!
          </p>
        </div>

        {/* Continue button */}
        {currentStory.story > 0 && (
          <div className="mb-8">
            <button
              onClick={handleContinueStory}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-6 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-xl"
            >
              📚 Continue Your Story
            </button>
          </div>
        )}

        {/* Chapters Grid */}
        <div className="grid gap-6 mb-8">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Chapter Icon */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-3xl font-black text-white flex-shrink-0">
                  {chapter.number}
                </div>

                {/* Chapter Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{chapter.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {chapter.stories.length} stories about making smart choices with your first coins!
                  </p>

                  {/* Story List */}
                  <div className="space-y-2 mb-4">
                    {chapter.stories.map((story, index) => (
                      <div
                        key={story.id}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <span className="text-amber-500">📚</span>
                        <span className="font-medium">{index + 1}. {story.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={() => handleStartChapter(chapter.number)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all transform hover:scale-105"
                  >
                    Start Chapter {chapter.number} →
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Coming Soon */}
          <div className="bg-gray-100 rounded-2xl shadow-lg p-6 border-2 border-gray-300 opacity-60">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center text-3xl text-white flex-shrink-0">
                🔒
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-600 mb-2">More Chapters Coming Soon!</h2>
                <p className="text-gray-500">
                  More exciting stories are on the way. Complete Chapter 1 to unlock new adventures!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-105"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
