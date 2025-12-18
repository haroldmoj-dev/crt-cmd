import { useState, useRef, useEffect } from "react";
import "../styles/components/TetrisPlay.css";

const TetrisPlay = ({ onNavigate, isLowPerf, hasI = true, hasL = true }) => {
  // Board dimensions
  const ROWS = 18;
  const COLS = 15;

  // Create empty board (2D array filled with 0s)
  const createEmptyBoard = () => {
    return Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(0));
  };

  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState({
    x: 6,
    y: 0,
    shape: [[1, 1, 1]],
  });

  // Check if piece can move to a position
  const canMove = (piece, newX, newY) => {
    for (let rowIndex = 0; rowIndex < piece.shape.length; rowIndex++) {
      for (
        let colIndex = 0;
        colIndex < piece.shape[rowIndex].length;
        colIndex++
      ) {
        if (piece.shape[rowIndex][colIndex]) {
          const boardRow = newY + rowIndex;
          const boardCol = newX + colIndex;

          // Check boundaries
          if (boardRow >= ROWS || boardCol < 0 || boardCol >= COLS) {
            return false;
          }

          // Check collision
          if (boardRow >= 0 && board[boardRow][boardCol]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // Lock piece
  const lockPiece = (piece) => {
    const newBoard = board.map((row) => [...row]);

    piece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          const boardRow = piece.y + rowIndex;
          const boardCol = piece.x + colIndex;
          if (
            boardRow >= 0 &&
            boardRow < ROWS &&
            boardCol >= 0 &&
            boardCol < COLS
          ) {
            newBoard[boardRow][boardCol] = 1;
            console.log(`lock piece at [${boardRow}] [${boardCol}]`);
          }
        }
      });
    });

    setBoard(newBoard);
  };

  // Gravity
  useEffect(() => {
    const dropInterval = setInterval(() => {
      setCurrentPiece((prev) => {
        // A) Move piece down
        if (canMove(prev, prev.x, prev.y + 1)) {
          return { ...prev, y: prev.y + 1 };
          // B) Lock piece then generate a new one
        } else {
          lockPiece(prev);
          return { x: 6, y: 0, shape: [[1, 1, 1]] };
        }
      });
    }, 500);

    return () => clearInterval(dropInterval);
  }, [board]);

  // Display piece on board
  const getBoardWithPiece = () => {
    const displayBoard = board.map((row) => [...row]);

    currentPiece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          const boardRow = currentPiece.y + rowIndex;
          const boardCol = currentPiece.x + colIndex;
          if (
            boardRow >= 0 &&
            boardRow < ROWS &&
            boardCol >= 0 &&
            boardCol < COLS
          ) {
            displayBoard[boardRow][boardCol] = 1;
          }
        }
      });
    });

    return displayBoard;
  };

  const displayBoard = getBoardWithPiece();

  return (
    <div className="tplay content">
      <div className="tetris-game">
        <div className="game-board">
          {displayBoard.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`board-cell ${cell ? "filled" : "empty"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TetrisPlay;
