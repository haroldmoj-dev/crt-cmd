import { useState, useRef, useEffect } from "react";
import Typewriter from "./Typewriter";
import "../styles/components/Terminal.css";

const Terminal = ({ onNavigate, isLowPerf }) => {
  const initialHistory = [
    {
      type: "output",
      content: (
        <>
          ===============================
          <br />
          ║ SPRING TERMINAL SYSTEM v1.0 ║
          <br />
          ===============================
          <br />© 2025 Harold Mojica. All Rights Reserved.
          <br />
          <br />
          &gt; Loading functionality... DONE
          <br />
          &gt; Loading visual effects... DONE
          <br />
          &gt; System ready.
          <br />
          <br />
          Welcome to Spring Terminal.
          <br />
          Type 'help' to see available commands.
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

  // Return response based on the user command inputted
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
      return "Loading Tetris...";
    } else {
      return `Command not found.`;
    }
  };

  // Clear command animation
  const processClear = () => {
    if (isLowPerf) {
      setHistory(initialHistory);
      return;
    }

    setIsTyping(true);
    const interval = setInterval(() => {
      setHistory((prev) => {
        if (prev.length <= 1) {
          clearInterval(interval);
          setIsTyping(false);
          return prev;
        }
        return prev.slice(0, -1);
      });
    }, 50);
  };

  // Pause then switch to tetris tab (high perf)
  const processTetris = () => {
    setTimeout(() => {
      onNavigate("thome");
    }, 1000);
  };

  // Handle all events that happen after clicking "Enter"
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isTyping) {
      const command = inputValue.trim();
      if (command) {
        if (command.toLowerCase() === "clear") {
          processClear();
        } else if (command.toLowerCase() === "tetris" && isLowPerf) {
          onNavigate("thome");
        } else {
          const response = processCommand(command);
          if (response && !isLowPerf) {
            setIsTyping(true);
          }
          setHistory((prev) => [
            ...prev,
            { type: "command", content: command, animated: false },
            {
              type: "response",
              content: response,
              animated: !isLowPerf,
              skipComplete: command.toLowerCase() === "tetris",
            },
          ]);
          if (command.toLowerCase() === "tetris") {
            processTetris();
          }
        }
        setInputValue("");
      }
    }
  };

  // Turn off Typewriter animation for a specific message
  const markAnimatedComplete = (index) => {
    setHistory((prev) =>
      prev.map((item, i) => (i === index ? { ...item, animated: false } : item))
    );
    setIsTyping(false);
  };

  // Focus once component loads
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom whenever history is updated
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [history]);

  // Refocus after Typewriter animation is done
  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping]);

  // Turn off Typewriter animations for all after clicking Low Perf
  useEffect(() => {
    if (!isLowPerf) return;

    setHistory((prev) =>
      prev.map((item) =>
        "animated" in item ? { ...item, animated: false } : item
      )
    );

    setIsTyping(false);
  }, [isLowPerf]);

  return (
    <div
      className="terminal content"
      ref={contentRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-output">
        {history.map((item, index) => {
          return (
            <div key={index}>
              {/* Command (user input) */}
              {item.type === "command" ? (
                <div>&gt; {item.content}</div>
              ) : // Response
              item.type === "response" ? (
                <div style={{ marginBottom: "1rem" }}>
                  {item.animated ? (
                    <Typewriter
                      text={item.content}
                      onComplete={() => {
                        if (!item.skipComplete) {
                          markAnimatedComplete(index);
                        }
                      }}
                    />
                  ) : (
                    item.content
                  )}
                </div>
              ) : (
                // Output (initial history)
                <div>{item.content}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="terminal-input-line">
        <span className="prompt">&gt;&nbsp;</span>
        {/* When typing is blocked (Typewriter animation running) */}
        {isTyping && <span className="typing-cursor">█</span>}
        <input
          ref={inputRef}
          type="text"
          className={`terminal-input ${isTyping ? "no-cursor" : ""}`}
          value={inputValue}
          onChange={(e) => {
            if (!isTyping) setInputValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (isTyping) e.preventDefault();
            handleKeyDown(e);
          }}
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default Terminal;
