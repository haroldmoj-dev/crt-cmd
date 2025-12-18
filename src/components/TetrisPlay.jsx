import { useState, useRef, useEffect } from "react";
import "../styles/components/TetrisPlay.css";

const TetrisPlay = ({ onNavigate, isLowPerf, hasI = true, hasL = true }) => {
  // Board dimensions and tetris pieces
  const ROWS = 18;
  const COLS = 15;
  const I_PIECE = [[1, 1, 1]];
  const L_PIECE = [
    [1, 0],
    [1, 1],
  ];

  // Create empty board (2D array filled with 0s)
  const createEmptyBoard = () => {
    return Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(0));
  };

  const [isFastDrop, setIsFastDrop] = useState(false);
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(() => {
    const initialShape =
      hasI && hasL
        ? Math.random() < 0.5
          ? I_PIECE
          : L_PIECE
        : hasI
        ? I_PIECE
        : L_PIECE;

    return { x: 6, y: 0, shape: initialShape };
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
          }
        }
      });
    });

    setBoard(newBoard);
  };

  // Gravity
  useEffect(() => {
    const intervalTime = isFastDrop ? 50 : 500;

    const dropInterval = setInterval(() => {
      setCurrentPiece((prev) => {
        if (canMove(prev, prev.x, prev.y + 1)) {
          // Move piece down
          return { ...prev, y: prev.y + 1 };
        } else {
          // Lock piece
          lockPiece(prev);

          // Generate new piece
          let newPiece;
          if (hasI && hasL) {
            newPiece =
              Math.random() < 0.5
                ? { x: 6, y: 0, shape: I_PIECE }
                : { x: 6, y: 0, shape: L_PIECE };
          } else if (hasI) {
            newPiece = { x: 6, y: 0, shape: I_PIECE };
          } else if (hasL) {
            newPiece = { x: 6, y: 0, shape: L_PIECE };
          }

          return newPiece;
        }
      });
    }, intervalTime);

    return () => clearInterval(dropInterval);
  }, [board, isFastDrop]);

  // Keyboard controls for moving the piece
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setCurrentPiece((prev) =>
          canMove(prev, prev.x - 1, prev.y) ? { ...prev, x: prev.x - 1 } : prev
        );
      } else if (e.key === "ArrowRight") {
        setCurrentPiece((prev) =>
          canMove(prev, prev.x + 1, prev.y) ? { ...prev, x: prev.x + 1 } : prev
        );
      } else if (e.key === "ArrowDown") {
        setIsFastDrop(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowDown") {
        setIsFastDrop(false); // stop fast drop
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
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
