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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <div className="text-2xl font-bold text-gray-800">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4">
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
          <div className="text-7xl mb-4">📖</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            My Money Stories
          </h1>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
            Play through stories about your first coins. Every choice you make matters!
          </p>
        </div>

        {/* Main Story Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-200 mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Chapter 1: My First Money</h2>
                <p className="text-amber-100 text-lg">
                  5 stories • Your choices shape the adventure
                </p>
              </div>
              <div className="text-6xl">🪙</div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">5 Continuous Stories</h3>
                <p className="text-gray-600">
                  Each story builds on the last. Feel what it's like to make choices with your first coins!
                </p>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                <div className="text-3xl mb-3">💛</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Emotional Journey</h3>
                <p className="text-gray-600">
                  Your choices affect how you feel! Experience pride, safety, and happiness as you play.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <div className="text-3xl mb-3">🪙</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your Coins Matter</h3>
                <p className="text-gray-600">
                  Watch your coins grow and shrink based on your decisions. Every moment is a new choice!
                </p>
              </div>

              <div className="bg-pink-50 rounded-2xl p-6 border border-pink-200">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Always Happy Endings</h3>
                <p className="text-gray-600">
                  No matter what you choose, every story ends with safety, happiness, and learning!
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/chapters')}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-6 rounded-2xl text-2xl shadow-lg transition-all transform hover:scale-105"
            >
              📖 Start Your Story
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-amber-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Your Story Adventure</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Choose a Chapter</h3>
                <p className="text-gray-600">
                  Start with Chapter 1: "My First Money" - 5 stories about your first coins and the choices you make.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Play Through Each Story</h3>
                <p className="text-gray-600">
                  Each story has about 10 moments. Make choices, see what happens, and feel the consequences!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Watch Your Coins & Mood</h3>
                <p className="text-gray-600">
                  See how your choices affect your coins (🪙) and how you feel (😊 😬 😄). Every choice matters!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Enjoy Happy Endings</h3>
                <p className="text-gray-600">
                  Every story ends with you feeling proud, safe, and happy. No failures, just learning and fun!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 mt-8">
          <p className="mb-2">This is a story you play, not a test you take.</p>
          <p>Every choice teaches you something new about money and yourself!</p>
        </div>
      </div>
    </div>
  );
}
