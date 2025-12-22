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

  const spawnRandomPiece = () => {
    if (hasI && hasL) {
      return Math.random() < 0.5
        ? { x: 6, y: 0, shape: I_PIECE }
        : { x: 6, y: 0, shape: L_PIECE };
    }
    if (hasI) {
      return { x: 6, y: 0, shape: I_PIECE };
    } else if (hasL) {
      return { x: 6, y: 0, shape: L_PIECE };
    }
  };

  const [countdown, setCountdown] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [isFastDrop, setIsFastDrop] = useState(false);
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(spawnRandomPiece());
  const [isGameOver, setIsGameOver] = useState(false);
  const boardRef = useRef(board);
  const dropIntervalRef = useRef(null);

  const resetGame = () => {
    setCountdown(3);
    setIsPaused(false);
    setIsGameOver(false);
    setBoard(createEmptyBoard());
    setCurrentPiece(spawnRandomPiece());
    setScore(0);
  };

  // Check if piece can move to a position
  const canMove = (shape, newX, newY) => {
    const b = boardRef.current;
    for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) {
      for (let colIndex = 0; colIndex < shape[rowIndex].length; colIndex++) {
        if (shape[rowIndex][colIndex]) {
          const boardRow = newY + rowIndex;
          const boardCol = newX + colIndex;

          // Check boundaries
          if (boardRow >= ROWS || boardCol < 0 || boardCol >= COLS) {
            return false;
          }

          // Check collision
          if (boardRow >= 0 && b[boardRow][boardCol]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // Clear lines
  const clearLines = (board) => {
    const newBoard = board.filter((row) => row.some((cell) => cell === 0)); // keep incomplete rows
    const linesCleared = board.length - newBoard.length; // number of full lines removed

    // Add empty rows at the top
    const emptyRows = Array.from({ length: linesCleared }, () =>
      Array(COLS).fill(0)
    );
    return { board: [...emptyRows, ...newBoard], linesCleared };
  };

  // Lock piece and clean lines
  const lockPiece = (piece) => {
    const newBoard = boardRef.current.map((row) => [...row]);

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

    // Clear lines
    const { board: clearedBoard, linesCleared } = clearLines(newBoard);
    if (linesCleared) setScore((s) => s + linesCleared);

    // Update board
    setBoard(clearedBoard);
    boardRef.current = clearedBoard;
  };

  // Countdown
  useEffect(() => {
    if (countdown === null || isPaused) return;

    const timer = setTimeout(() => {
      setCountdown((c) => (c > 1 ? c - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isPaused]);

  // Update ref whenever board changes
  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  // Reset fast drop when pausing
  useEffect(() => {
    if (isPaused) {
      setIsFastDrop(false);
    }
  }, [isPaused]);

  // Start gravity
  const startGravity = () => {
    if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);

    const intervalTime = isFastDrop ? 50 : 500;
    dropIntervalRef.current = setInterval(() => {
      setCurrentPiece((prev) => {
        if (canMove(prev.shape, prev.x, prev.y + 1)) {
          // Move piece down
          return { ...prev, y: prev.y + 1 };
        } else {
          // Lock piece and clear lines
          lockPiece(prev);
          // Generate new piece
          const newPiece = spawnRandomPiece();
          if (canMove(newPiece.shape, newPiece.x, newPiece.y)) {
            return newPiece;
          } else {
            setIsGameOver(true);
            return prev;
          }
        }
      });
    }, intervalTime);
  };

  // Gravity
  useEffect(() => {
    if (!isPaused && countdown === null && !isGameOver) {
      startGravity();
    }

    return () => {
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
    };
  }, [isFastDrop, isPaused, countdown, isGameOver]);

  // Rotate piece using UP key
  const rotatePiece = (piece) => {
    const shape = piece.shape;
    const rows = shape.length;
    const cols = shape[0].length;

    const rotated = Array.from({ length: cols }, (_, i) =>
      Array.from({ length: rows }, (_, j) => shape[rows - 1 - j][i])
    );

    // I-piece (crosswise)
    if (shape.length === 1) {
      return { x: piece.x + 1, y: piece.y - 1, shape: rotated };
    }
    // I-piece (lengthwise)
    else if (shape.length === 3) {
      return { x: piece.x - 1, y: piece.y + 1, shape: rotated };
    }
    // L-piece
    else if (shape.length === 2) {
      if (!shape[0][1]) {
        return { ...piece, y: piece.y + 1, shape: rotated };
      } else if (!shape[1][1]) {
        return { ...piece, x: piece.x - 1, shape: rotated };
      } else if (!shape[1][0]) {
        return { ...piece, y: piece.y - 1, shape: rotated };
      } else if (!shape[0][0]) {
        return { ...piece, x: piece.x + 1, shape: rotated };
      }
    }
  };

  // Hard drop using space key
  const hardDrop = (piece) => {
    let dropY = piece.y;

    while (canMove(piece.shape, piece.x, dropY + 1)) {
      dropY++;
    }

    return { ...piece, y: dropY };
  };

  // Keyboard controls for moving the piece
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }

      if (e.key === "Escape") {
        if (isGameOver) return;
        setIsPaused((prev) => !prev);
        return;
      }

      if (isPaused || countdown !== null || isGameOver) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFastDrop(false);

        const dropped = hardDrop(currentPiece);
        lockPiece(dropped);

        const newPiece = spawnRandomPiece();
        if (canMove(newPiece.shape, newPiece.x, newPiece.y)) {
          setCurrentPiece(newPiece);
          startGravity();
        } else {
          setIsGameOver(true);
        }

        return;
      }

      if (e.key === "ArrowLeft") {
        setCurrentPiece((prev) =>
          canMove(prev.shape, prev.x - 1, prev.y)
            ? { ...prev, x: prev.x - 1 }
            : prev
        );
      } else if (e.key === "ArrowRight") {
        setCurrentPiece((prev) =>
          canMove(prev.shape, prev.x + 1, prev.y)
            ? { ...prev, x: prev.x + 1 }
            : prev
        );
      } else if (e.key === "ArrowDown") {
        setIsFastDrop(true);
      } else if (e.key === "ArrowUp") {
        setCurrentPiece((prev) => {
          const rotated = rotatePiece(prev);
          return canMove(rotated.shape, rotated.x, rotated.y) ? rotated : prev;
        });
      }
    };

    const handleKeyUp = (e) => {
      if (isPaused) return;
      if (e.key === "ArrowDown") {
        setIsFastDrop(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [board, isPaused, countdown, isGameOver, currentPiece]);

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
        <div className={`score ${countdown !== null ? "hidden" : ""}`}>
          {score}
        </div>
        <div className="game-board">
          {countdown !== null && (
            <div className="countdown-overlay">
              <div className="countdown-number">{countdown}</div>
            </div>
          )}
          <div
            className={`board-content ${countdown !== null ? "hidden" : ""}`}
          >
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
      {isPaused && (
        <div className="pause-menu">
          <div className="pause-content">
            <div>PAUSED</div>
            <button onClick={() => setIsPaused(false)}>Resume</button>
            <button onClick={resetGame}>Restart</button>
            <button onClick={() => onNavigate("thome")}>Quit</button>
          </div>
        </div>
      )}
      {isGameOver && (
        <div className="pause-menu">
          <div className="pause-content">
            <div>GAME OVER</div>
            <div className="final-score">Score: {score}</div>
            <button onClick={resetGame}>Restart</button>
            <button onClick={() => onNavigate("thome")}>Quit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TetrisPlay;
