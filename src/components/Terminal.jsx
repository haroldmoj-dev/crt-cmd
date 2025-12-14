import { useState, useRef, useEffect } from "react";
import "../styles/components/Terminal.css";

const Terminal = () => {
  const initialHistory = [
    {
      type: "output",
      content: (
        <>
          ╔═════════════════════════════╗
          <br />
          ║ SPRING TERMINAL SYSTEM v1.0 ║
          <br />
          ╚═════════════════════════════╝
          <br />© 2025 Spring. All Rights Reserved.
          <br />
          &gt; Initializing CRT display...
          <br />
          &gt; Loading visual effects... DONE
          <br />
          &gt; System ready.
          <br />
          <br />
          Welcome to the CRT screen simulator.
          <br />
          Available commands: help, clear, echo [text], date, tetris
          <br />
          <br />
        </>
      ),
    },
  ];

  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState(initialHistory);

  const inputRef = useRef(null);
  const contentRef = useRef(null);

  const processCommand = (cmd) => {
    const lower = cmd.toLowerCase();

    if (lower === "help") {
      return "Available commands: help, clear, echo [text], date, tetris";
    } else if (lower === "clear") {
      return null; // Special case for clear
    } else if (lower.startsWith("echo ")) {
      return cmd.substring(5);
    } else if (lower === "date") {
      return new Date().toString();
    } else if (lower === "tetris") {
      // TODO: add the component <Terminal /> to middle container in App.jsx
    } else {
      return `Command not found: ${cmd}`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const command = inputValue.trim();
      if (command) {
        if (command.toLowerCase() === "clear") {
          setHistory(initialHistory);
        } else {
          const response = processCommand(command);
          setHistory((prev) => [
            ...prev,
            { type: "command", content: command },
            { type: "response", content: response },
          ]);
        }
        setInputValue("");
      }
    }
  };

  const handleContentClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="crt-container">
      <div className="crt-screen">
        <div className="crt-glow"></div>
        <div
          className="terminal-content"
          ref={contentRef}
          onClick={handleContentClick}
        >
          <div className="terminal-output">
            {history.map((item, index) => (
              <div key={index}>
                {item.type === "command" ? (
                  <div className="terminal-output-line">
                    <span className="prompt">&gt;&nbsp;</span>
                    <div className="command">{item.content}</div>
                  </div>
                ) : item.type === "response" ? (
                  <div style={{ marginBottom: "1rem" }}>{item.content}</div>
                ) : (
                  <div>{item.content}</div>
                )}
              </div>
            ))}
          </div>
          <div className="terminal-input-line">
            <span className="prompt">&gt;&nbsp;</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>
        <div className="crt-scanline"></div>
      </div>
    </div>
  );
};

export default Terminal;
