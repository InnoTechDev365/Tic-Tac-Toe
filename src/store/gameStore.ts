import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { checkWinner, getAIMove } from '../lib/gameLogic';

type GameState = {
  board: (null | 'X' | 'O')[][];
  difficulty: 'easy' | 'medium' | 'hard';
  isPlayerTurn: boolean;
  winner: null | 'X' | 'O' | 'draw';
  gameHistory: {
    date: string;
    difficulty: string;
    winner: string | null;
  }[];
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  makeMove: (row: number, col: number) => void;
  resetGame: () => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      board: Array(3).fill(null).map(() => Array(3).fill(null)),
      difficulty: 'easy',
      isPlayerTurn: true,
      winner: null,
      gameHistory: [],

      setDifficulty: (difficulty) => set({ difficulty }),

      makeMove: (row: number, col: number) => {
        const { board, isPlayerTurn, difficulty, gameHistory } = get();
        
        if (!isPlayerTurn || board[row][col] !== null || checkWinner(board)) return;

        // Player move
        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = 'X';
        set({ board: newBoard, isPlayerTurn: false });

        // Check winner after player move
        const winner = checkWinner(newBoard);
        if (winner) {
          const newHistory = [...gameHistory, {
            date: new Date().toISOString(),
            difficulty,
            winner
          }];
          set({ winner, gameHistory: newHistory });
          return;
        }

        // AI move
        setTimeout(() => {
          const [aiRow, aiCol] = getAIMove(newBoard, difficulty);
          newBoard[aiRow][aiCol] = 'O';
          
          const finalWinner = checkWinner(newBoard);
          if (finalWinner) {
            const newHistory = [...gameHistory, {
              date: new Date().toISOString(),
              difficulty,
              winner: finalWinner
            }];
            set({ 
              board: newBoard, 
              isPlayerTurn: true,
              winner: finalWinner,
              gameHistory: newHistory
            });
          } else {
            set({ 
              board: newBoard, 
              isPlayerTurn: true
            });
          }
        }, 500);
      },

      resetGame: () => {
        set({
          board: Array(3).fill(null).map(() => Array(3).fill(null)),
          isPlayerTurn: true,
          winner: null
        });
      }
    }),
    {
      name: 'tic-tac-toe-storage'
    }
  )
);