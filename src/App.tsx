import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Brain, History } from 'lucide-react';
import { useGameStore } from './store/gameStore';

function App() {
  const { 
    board, 
    difficulty, 
    winner, 
    isPlayerTurn,
    gameHistory,
    setDifficulty, 
    makeMove, 
    resetGame 
  } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Tic Tac Toe
          </h1>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="bg-gray-100 rounded-lg px-3 py-2 text-gray-700"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {board.map((row, i) => (
            row.map((cell, j) => (
              <motion.button
                key={`${i}-${j}`}
                whileHover={{ scale: cell ? 1 : 1.05 }}
                whileTap={{ scale: cell ? 1 : 0.95 }}
                className={`aspect-square rounded-lg text-4xl font-bold flex items-center justify-center
                  ${cell ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}
                  ${!cell && isPlayerTurn && !winner ? 'cursor-pointer' : 'cursor-default'}
                  ${cell === 'X' ? 'text-blue-500' : 'text-red-500'}`}
                onClick={() => makeMove(i, j)}
                disabled={!!cell || !isPlayerTurn || !!winner}
              >
                {cell}
              </motion.button>
            ))
          ))}
        </div>

        <div className="text-center">
          {winner && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-4"
            >
              <p className="text-xl font-semibold text-gray-800">
                {winner === 'draw' ? "It's a draw!" : `${winner} wins!`}
              </p>
            </motion.div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={resetGame}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              New Game
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-600">
          {!winner && (
            <div className="flex items-center justify-center gap-2">
              <Brain className="w-5 h-5" />
              <p>{isPlayerTurn ? "Your turn" : "AI is thinking..."}</p>
            </div>
          )}
        </div>

        {gameHistory.length > 0 && (
          <div className="mt-8 border-t pt-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <History className="w-5 h-5" />
              Game History
            </h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {gameHistory.slice().reverse().map((game, i) => (
                <div key={i} className="text-sm text-gray-600 flex justify-between">
                  <span>{new Date(game.date).toLocaleDateString()}</span>
                  <span className="font-medium">{game.difficulty}</span>
                  <span className={game.winner === 'X' ? 'text-blue-500' : 'text-red-500'}>
                    {game.winner === 'draw' ? 'Draw' : `${game.winner} won`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;