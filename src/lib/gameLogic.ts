type Board = (null | 'X' | 'O')[][];
type Difficulty = 'easy' | 'medium' | 'hard';

export const checkWinner = (board: Board): 'X' | 'O' | 'draw' | null => {
  // Check rows, columns and diagonals
  const lines = [
    // Rows
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],
    // Columns
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
    // Diagonals
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]]
  ];

  for (const line of lines) {
    if (line[0] && line[0] === line[1] && line[1] === line[2]) {
      return line[0];
    }
  }

  // Check for draw
  if (board.every(row => row.every(cell => cell !== null))) {
    return 'draw';
  }

  return null;
};

export const getAIMove = (board: Board, difficulty: Difficulty): [number, number] => {
  switch (difficulty) {
    case 'easy':
      return getRandomMove(board);
    case 'medium':
      return Math.random() > 0.5 ? getBestMove(board) : getRandomMove(board);
    case 'hard':
      return getBestMove(board);
    default:
      return getRandomMove(board);
  }
};

const getRandomMove = (board: Board): [number, number] => {
  const availableMoves: [number, number][] = [];
  
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === null) {
        availableMoves.push([i, j]);
      }
    });
  });

  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const getBestMove = (board: Board): [number, number] => {
  let bestScore = -Infinity;
  let bestMove: [number, number] = [0, 0];

  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === null) {
        board[i][j] = 'O';
        const score = minimax(board, 0, false);
        board[i][j] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = [i, j];
        }
      }
    });
  });

  return bestMove;
};

const minimax = (board: Board, depth: number, isMaximizing: boolean): number => {
  const winner = checkWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (winner === 'draw') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === null) {
          board[i][j] = 'O';
          bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
          board[i][j] = null;
        }
      });
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === null) {
          board[i][j] = 'X';
          bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
          board[i][j] = null;
        }
      });
    });
    return bestScore;
  }
};