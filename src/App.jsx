import { useState, useEffect } from "react";
import Terminal from "./components/Terminal";
import TetrisHome from "./components/TetrisHome";
import TetrisPlay from "./components/TetrisPlay";

function App() {
  const [isLowPerf, setIsLowPerf] = useState(false);
  const [hasControls, setHasControls] = useState(false);
  const [currentView, setCurrentView] = useState("terminal");
  const [displayedView, setDisplayedView] = useState("terminal");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);
  const [isTransitioningIn, setIsTransitioningIn] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const togglePerformance = () => {
    setIsLowPerf(!isLowPerf);
    document.body.classList.toggle("low-perf", !isLowPerf);
  };

  const toggleControls = () => {
    setHasControls(!hasControls);
  };

  const toggleTab = () => {
    if (isTransitioning) return;
    setCurrentView((prev) => (prev === "terminal" ? "thome" : "terminal"));
  };

  // Buttons simulating keyboard keys
  const simulateKeyDown = (keyOrCode) => {
    const event = new KeyboardEvent("keydown", {
      code: keyOrCode,
      key: keyOrCode === "Space" ? " " : keyOrCode,
    });
    window.dispatchEvent(event);
  };

  const simulateKeyUp = (keyOrCode) => {
    const event = new KeyboardEvent("keyup", {
      code: keyOrCode,
      key: keyOrCode === "Space" ? " " : keyOrCode,
    });
    window.dispatchEvent(event);
  };

  // Apply transition effect when switching tabs
  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }
    if (isLowPerf) {
      setDisplayedView(currentView);
    } else {
      setIsTransitioning(true);
      setIsTransitioningOut(true);
      // Transition out
      setTimeout(() => {
        setIsTransitioningOut(false);
        setIsTransitioningIn(true);
        setDisplayedView(currentView);
      }, 1000);
      // Transition in
      setTimeout(() => {
        setIsTransitioning(false);
        setIsTransitioningIn(false);
      }, 2000);
    }
  }, [currentView]);

  return (
    <div className="outer-container">
      <div className="top-container">
        <button className="toggle perf" onClick={togglePerformance}>
          Effects: {isLowPerf ? "Disabled" : "Enabled"}
        </button>
        <button className="controls toggle" onClick={toggleControls}>
          Controls: {hasControls ? "Enabled" : "Disabled"}
        </button>
        <button className="toggle tab" onClick={toggleTab}>
          Active Tab:
          {currentView === "terminal"
            ? " Terminal"
            : currentView === "thome" || currentView === "tplay"
            ? " Tetris"
            : ""}
        </button>
      </div>
      <div className="middle-container">
        <div className="crt-container">
          <div className="crt-screen">
            <div className="crt-glow"></div>
            <div className="crt-scanline"></div>
            <div
              className={`content ${
                isLowPerf
                  ? ""
                  : !hasMounted || isTransitioningIn
                  ? "fade-in"
                  : isTransitioningOut
                  ? "fade-out"
                  : ""
              }`}
            >
              {displayedView === "terminal" && (
                <Terminal onNavigate={setCurrentView} isLowPerf={isLowPerf} />
              )}
              {displayedView === "thome" && (
                <TetrisHome onNavigate={setCurrentView} isLowPerf={isLowPerf} />
              )}
              {displayedView === "tplay" && (
                <TetrisPlay onNavigate={setCurrentView} isLowPerf={isLowPerf} />
              )}
            </div>
          </div>
        </div>
        {hasControls ? (
          <div className="controls-container gameboy">
            {/* D-Pad */}
            <div className="dpad">
              <button
                className="dpad-btn up"
                onPointerDown={(e) => {
                  e.preventDefault();
                  simulateKeyDown("ArrowUp");
                }}
              >
                ▲
              </button>

              <button
                className="dpad-btn left"
                onPointerDown={(e) => {
                  e.preventDefault();
                  simulateKeyDown("ArrowLeft");
                }}
              >
                ◀
              </button>

              <button className="dpad-btn center" aria-hidden />

              <button
                className="dpad-btn right"
                onPointerDown={(e) => {
                  e.preventDefault();
                  simulateKeyDown("ArrowRight");
                }}
              >
                ▶
              </button>

              <button
                className="dpad-btn down"
                onPointerDown={(e) => {
                  e.preventDefault();
                  simulateKeyDown("ArrowDown");
                }}
                onPointerUp={() => simulateKeyUp("ArrowDown")}
                onPointerLeave={() => simulateKeyUp("ArrowDown")}
                onPointerCancel={() => simulateKeyUp("ArrowDown")}
              >
                ▼
              </button>
            </div>

            {/* A / B Buttons */}
            <div className="action-buttons">
              <button
                className="action-btn b"
                onPointerDown={(e) => {
                  e.preventDefault();
                  simulateKeyDown("ArrowUp");
                }}
              >
                B
              </button>

              <button
                className="action-btn a"
                onPointerDown={(e) => {
                  e.preventDefault();
                  simulateKeyDown("Space");
                }}
                onPointerUp={() => simulateKeyUp("Space")}
              >
                A
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
