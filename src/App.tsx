import { useState } from 'react';
import { RefreshCw, Trophy, Sparkles } from 'lucide-react';
import { ScratchCard } from './components/ScratchCard';
import { GameState } from './types';
import { generateCoupon } from './utils/gameLogic';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    currentCoupon: generateCoupon(),
    isRevealed: false,
    totalPoints: 0,
    gamesPlayed: 0,
  }));

  const handleReveal = () => {
    if (gameState.currentCoupon) {
      setGameState({
        ...gameState,
        isRevealed: true,
        totalPoints: gameState.totalPoints + gameState.currentCoupon.pointsValue,
        gamesPlayed: gameState.gamesPlayed + 1,
      });
    }
  };

  const handleRetry = () => {
    setGameState({
      currentCoupon: generateCoupon(),
      isRevealed: false,
      totalPoints: gameState.totalPoints,
      gamesPlayed: gameState.gamesPlayed,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-8 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-amber-400" />
            <h1 className="text-6xl font-bold text-white tracking-tight">
              Scratch & Win
            </h1>
            <Sparkles className="w-10 h-10 text-amber-400" />
          </div>
          <p className="text-slate-300 text-xl">
            Drag to scratch and reveal your prize!
          </p>
        </div>

        <div className="mb-12">
          {gameState.currentCoupon && (
            <ScratchCard
              coupon={gameState.currentCoupon}
              onReveal={handleReveal}
            />
          )}
        </div>

        <div className="flex flex-col items-center gap-6">
          {gameState.isRevealed && (
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-105 text-xl"
            >
              <RefreshCw className="w-6 h-6" />
              Try Another Card
            </button>
          )}

          <div className="flex items-center justify-center gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-5 border border-white/20 shadow-xl">
              <div className="flex items-center gap-3">
                <Trophy className="w-7 h-7 text-amber-400" />
                <div className="text-left">
                  <p className="text-slate-400 text-sm font-medium">Total Points</p>
                  <p className="text-white text-4xl font-bold">{gameState.totalPoints}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-5 border border-white/20 shadow-xl">
              <div className="text-left">
                <p className="text-slate-400 text-sm font-medium">Cards Scratched</p>
                <p className="text-white text-4xl font-bold">{gameState.gamesPlayed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/10 shadow-xl">
            <h2 className="text-white text-2xl font-bold mb-4">How to Play</h2>
            <div className="text-slate-300 text-left space-y-3 text-lg">
              <p>• Click and drag across the card to scratch off the surface</p>
              <p>• Reveal at least 50% to see your prize</p>
              <p>• Win 10, 50, or 100 points instantly!</p>
              <p>• Click "Try Another Card" to play again</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
