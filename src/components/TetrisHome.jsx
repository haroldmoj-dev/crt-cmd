import { useState, useEffect, useRef } from "react";
import "../styles/components/TetrisHome.css";

const TetrisHome = ({ onNavigate, isLowPerf }) => {
  const [inputValue, setInputValue] = useState("");
  const [isBuffering, setIsBuffering] = useState(false);

  const inputRef = useRef(null);

  // Handle all events that happen after clicking "Enter"
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const command = inputValue.trim();
      if (command) {
        if (command.toLowerCase() === "y" || command.toLowerCase() === "yes") {
          setIsBuffering(true);
          // TODO: Go to TetrisPlay
        } else if (
          command.toLowerCase() === "n" ||
          command.toLowerCase() === "no"
        ) {
          setIsBuffering(true);
          onNavigate("terminal");
        } else {
          setInputValue("");
        }
      }
    }
  };

  // Focus once component loads
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="tetris content" onClick={() => inputRef.current?.focus()}>
      <div className="title">"TETRIS"</div>
      <div className="menu">
        <div>Welcome to Tetris. </div>
        <div>Would you like to start the game (Y/N)? </div>
      </div>
      <div className="tetris-input-line">
        <input
          ref={inputRef}
          type="text"
          className={`tetris-input ${isBuffering ? "no-cursor" : ""}`}
          value={inputValue}
          onChange={(e) => {
            if (!isBuffering) setInputValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (isBuffering) e.preventDefault();
            handleKeyDown(e);
          }}
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default TetrisHome;
