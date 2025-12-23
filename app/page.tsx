'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function HomePage() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    // Check authentication
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

  const startGame = async (mode: 'normal' | 'hard', gameType: 'strategy' | 'platformer') => {
    setIsStarting(true);
    
    try {
      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start game');
      }
      
      const data = await response.json();
      
      // Route to correct game type
      if (gameType === 'platformer') {
        router.push(`/game/platformer?runId=${data.runId}`);
      } else {
        router.push(`/game/play?runId=${data.runId}`);
      }
    } catch (error: any) {
      console.error('Start game error:', error);
      alert(error.message || 'Failed to start game. Please try again.');
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
      {/* Header with Logout */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Logged in as: <span className="font-bold">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-blue-900 mb-4">
            💰 Financial Life Simulator
          </h1>
          <p className="text-2xl text-gray-700">
            Learn how credit, debt, and financial decisions shape your future
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-center mb-6">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border-2 border-blue-500 rounded-lg p-6">
              <div className="text-4xl mb-2">👤</div>
              <h3 className="text-xl font-bold mb-2">You (The Player)</h3>
              <p className="text-gray-600">
                Make any decisions you want. Buy things with cash or credit. 
                Pay minimum or full balance. Learn from consequences.
              </p>
            </div>
            
            <div className="border-2 border-green-500 rounded-lg p-6">
              <div className="text-4xl mb-2">🧙</div>
              <h3 className="text-xl font-bold mb-2">Money Guru</h3>
              <p className="text-gray-600">
                Makes disciplined decisions with the SAME income and opportunities. 
                See how different choices create different outcomes.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">⚡ Key Facts:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ You start at age 16 with your first job ($2,400/month)</li>
              <li>✓ Play through 5 years (60 months) in about 10 minutes</li>
              <li>✓ Both you and Guru have identical incomes and offers</li>
              <li>✓ All differences come from DECISIONS, not luck</li>
              <li>✓ Learn how credit card interest compounds</li>
              <li>✓ Understand why minimum payments trap you</li>
            </ul>
          </div>

          {/* GAME MODE SELECTION */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-4">🎮 Choose Your Game Style</h2>
            
            {/* PLATFORMER MODE - NEW! */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-4xl mb-2">🎮 PLATFORMER MODE</div>
                  <h3 className="text-2xl font-bold mb-2">Run, Jump, Learn!</h3>
                  <p className="text-purple-100 mb-4">
                    Play a Mario-style game where you learn by DOING! Hit blocks for offers, 
                    avoid debt ghosts, feel consequences through gameplay.
                  </p>
                  <ul className="space-y-1 text-sm text-purple-100">
                    <li>✓ Interactive 2D platformer</li>
                    <li>✓ Learn through natural gameplay</li>
                    <li>✓ Visual feedback (ghosts chase you!)</li>
                    <li>✓ Perfect for kids 7-14</li>
                    <li>✓ No boring menus!</li>
                  </ul>
                </div>
                <div className="text-8xl animate-bounce">🕹️</div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => startGame('normal', 'platformer')}
                  disabled={isStarting}
                  className="bg-white text-purple-600 text-xl font-bold py-6 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition hover:bg-purple-50"
                >
                  <div className="text-3xl mb-2">🌟</div>
                  Easy Platformer
                  <div className="text-sm font-normal mt-2 text-purple-500">
                    Simple lessons, forgiving gameplay
                  </div>
                </button>
                
                <button
                  onClick={() => startGame('hard', 'platformer')}
                  disabled={isStarting}
                  className="bg-yellow-400 text-purple-900 text-xl font-bold py-6 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition hover:bg-yellow-300"
                >
                  <div className="text-3xl mb-2">⚡</div>
                  Challenge Mode
                  <div className="text-sm font-normal mt-2">
                    Faster pace, tougher choices
                  </div>
                </button>
              </div>
            </div>

            {/* STRATEGY MODE - ORIGINAL */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-4xl mb-2">📊 STRATEGY MODE</div>
                  <h3 className="text-2xl font-bold mb-2">Turn-Based Decisions</h3>
                  <p className="text-blue-100 mb-4">
                    Classic menu-based game. Make careful choices each month, 
                    compare with the Guru, see detailed stats.
                  </p>
                  <ul className="space-y-1 text-sm text-blue-100">
                    <li>✓ Detailed financial stats</li>
                    <li>✓ Compare with Money Guru</li>
                    <li>✓ Perfect for older teens/adults</li>
                    <li>✓ Deep analysis available</li>
                  </ul>
                </div>
                <div className="text-8xl">🧠</div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => startGame('normal', 'strategy')}
                  disabled={isStarting}
                  className="bg-white text-blue-600 text-xl font-bold py-6 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition hover:bg-blue-50"
                >
                  <div className="text-3xl mb-2">🎮</div>
                  Normal Strategy
                  <div className="text-sm font-normal mt-2 text-blue-500">
                    Gentle learning curve, clear lessons
                  </div>
                </button>
                
                <button
                  onClick={() => startGame('hard', 'strategy')}
                  disabled={isStarting}
                  className="bg-red-500 text-white text-xl font-bold py-6 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition hover:bg-red-600"
                >
                  <div className="text-3xl mb-2">🔥</div>
                  Hard Strategy
                  <div className="text-sm font-normal mt-2">
                    Unexpected expenses, tougher decisions
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600">
          <p className="mb-2">This game teaches real financial concepts in a safe environment.</p>
          <p>All money and decisions are simulated - no real financial risk!</p>
        </div>
      </div>
    </div>
  );
}