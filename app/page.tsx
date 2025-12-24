'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-800">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      {/* Header with Logout */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Logged in as: <span className="font-bold">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">💰</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Financial Wisdom Quiz
          </h1>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
            Test your money smarts with real-world scenarios. Learn the difference between smart choices and costly mistakes.
          </p>
        </div>

        {/* Main Quiz Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Quiz Mode</h2>
                <p className="text-blue-100 text-lg">
                  15 questions • Lifelines • Instant feedback
                </p>
              </div>
              <div className="text-6xl">🎯</div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Real Scenarios</h3>
                <p className="text-gray-600">
                  Face realistic financial decisions covering spending, debt, savings, investing, and mindset.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Learning</h3>
                <p className="text-gray-600">
                  Get immediate feedback with clear explanations for every answer. Learn why each choice matters.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="text-3xl mb-3">🎮</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fun Mechanics</h3>
                <p className="text-gray-600">
                  Build streaks for bonus points. Use lifelines (50/50, Skip, Ask Guru) when you need help.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile Friendly</h3>
                <p className="text-gray-600">
                  Clean, fast interface. No game engine loading. Pure React performance on any device.
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/quiz')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black py-6 rounded-2xl text-2xl shadow-lg transition-all transform hover:scale-105"
            >
              🚀 Start Quiz
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">How It Works</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Answer 15 Random Questions</h3>
                <p className="text-gray-600">
                  Each quiz draws from a bank of 35+ questions covering all aspects of personal finance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Earn Points & Build Streaks</h3>
                <p className="text-gray-600">
                  Correct answers = 100 points. Consecutive correct answers give you streak bonuses up to 2.5x!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Use Strategic Lifelines</h3>
                <p className="text-gray-600">
                  <span className="font-bold">50/50:</span> Remove 2 wrong answers.
                  <span className="font-bold ml-3">Skip:</span> Move to next question.
                  <span className="font-bold ml-3">Ask Guru:</span> Get a helpful hint.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Learn & Improve</h3>
                <p className="text-gray-600">
                  Every answer includes a short explanation. Play multiple times to master all scenarios.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 mt-8">
          <p className="mb-2">This quiz teaches real financial concepts through scenario-based learning.</p>
          <p>All scenarios are educational - no real money involved!</p>
        </div>
      </div>
    </div>
  );
}
