import { useState, useRef, useEffect } from "react";
import Typewriter from "./Typewriter";
import "../styles/components/Terminal.css";

const Terminal = ({ onNavigate }) => {
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
      animated: false,
    },
  ];

  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState(initialHistory);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef(null);
  const contentRef = useRef(null);

  const processCommand = (cmd) => {
    const lower = cmd.toLowerCase();

    if (lower === "help") {
      return "Available commands: help, clear, echo [text], date, tetris";
    } else if (lower === "clear") {
      return null;
    } else if (lower.startsWith("echo ")) {
      return cmd.substring(5);
    } else if (lower === "date") {
      return new Date().toString();
    } else if (lower === "tetris") {
      onNavigate("tetris");
      return "Loading Tetris...";
    } else {
      return `Command not found: ${cmd}`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isTyping) {
      const command = inputValue.trim();
      if (command) {
        if (command.toLowerCase() === "clear") {
          setHistory(initialHistory);
        } else {
          const response = processCommand(command);
          if (response) {
            setIsTyping(true);
          }
          setHistory((prev) => [
            ...prev,
            { type: "command", content: command, animated: false },
            { type: "response", content: response, animated: true },
          ]);
        }
        setInputValue("");
      }
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping]);

  return (
    <div
      className="terminal-content"
      ref={contentRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-output">
        {history.map((item, index) => {
          const isLast = index === history.length - 1;
          return (
            <div key={index}>
              {item.type === "command" ? (
                <div className="terminal-output-line">
                  <span className="prompt">&gt;&nbsp;</span>
                  <div className="command">{item.content}</div>
                </div>
              ) : item.type === "response" ? (
                <div style={{ marginBottom: "1rem" }}>
                  {item.animated ? (
                    <Typewriter
                      text={item.content}
                      speed={30}
                      onComplete={isLast ? () => setIsTyping(false) : undefined}
                    />
                  ) : (
                    item.content
                  )}
                </div>
              ) : (
                <div>{item.content}</div>
              )}
            </div>
          );
        })}
      </div>
      {!isTyping ? (
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
      ) : (
        <div className="terminal-input-line">
          <span className="prompt">&gt;&nbsp;</span>
          <span className="typing-cursor">█</span>
        </div>
      )}
    </div>
  );
};

export default Terminal;
