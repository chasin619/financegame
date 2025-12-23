'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GameState } from '@/types/game';

export default function PlatformerPage() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const runId = searchParams.get('runId');
  const supabase = createClient();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setIsAuthenticated(true);
    };
    checkAuth();
  }, [router, supabase.auth]);

  useEffect(() => {
    if (!runId || !isAuthenticated) return;
    
    const loadGameState = async () => {
      try {
        const response = await fetch(`/api/game/state/${runId}`);
        if (!response.ok) throw new Error('Failed to load state');
        
        const data = await response.json();
        setGameState(data.currentState.player);
        setIsLoading(false);
      } catch (error) {
        console.error('Load state error:', error);
        alert('Failed to load game. Please refresh.');
      }
    };
    
    loadGameState();
  }, [runId, isAuthenticated]);

  useEffect(() => {
    if (!gameContainerRef.current || !gameState || gameInstanceRef.current) return;

    let isInitializing = false;

    const initGame = async () => {
      if (isInitializing) return;
      isInitializing = true;

      try {
        const Phaser = await import('phaser');
        const { Level1Scene } = await import('@/lib/game/scenes/Level1');
        const { PreloadScene } = await import('@/lib/game/scenes/PreloadScene');

        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          width: 1600,  // MUCH BIGGER!
          height: 900,  // MUCH BIGGER!
          parent: gameContainerRef.current!,
          backgroundColor: '#87CEEB',
          physics: {
            default: 'arcade',
            arcade: {
              gravity: { x: 0, y: 1200 },  // Stronger gravity for better feel
              debug: false
            }
          },
          scene: [PreloadScene, Level1Scene],
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
          }
        };

        const game = new Phaser.Game(config);
        gameInstanceRef.current = game;

        game.registry.set('initialGameState', gameState);
        game.registry.set('runId', runId);
      } catch (error) {
        console.error('Failed to initialize game:', error);
        isInitializing = false;
      }
    };

    initGame();

    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [gameState, runId]);

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">🎮</div>
          <div className="text-white text-4xl font-black animate-pulse">LOADING GAME...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="mb-4">
        <button
          onClick={() => router.push('/')}
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-lg text-xl"
        >
          ← EXIT GAME
        </button>
      </div>
      
      <div 
        ref={gameContainerRef} 
        className="border-8 border-yellow-400 rounded-lg shadow-2xl"
        style={{ width: '100%', maxWidth: '1600px', aspectRatio: '16/9' }}
      />
      
      <div className="mt-4 text-white text-center max-w-2xl">
        <div className="bg-black/60 backdrop-blur rounded-xl p-6">
          <div className="text-2xl font-bold mb-3">🎮 CONTROLS</div>
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div>⬅️ ➡️ MOVE</div>
            <div>⬆️ JUMP</div>
            <div>HIT BLOCKS from below</div>
            <div>REACH FLAG to finish</div>
          </div>
        </div>
      </div>
    </div>
  );
}