import { useState, useEffect } from "react";
import Terminal from "./components/Terminal";
import Tetris from "./components/Tetris";

function App() {
  const [isLowPerf, setIsLowPerf] = useState(false);
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

  const toggleTab = () => {
    if (isTransitioning) return;
    setCurrentView((prev) => (prev === "terminal" ? "tetris" : "terminal"));
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
        <button className="perf-toggle" onClick={togglePerformance}>
          Performance Mode: {isLowPerf ? "Low" : "High"}
        </button>
        <button className="active-tab" onClick={toggleTab}>
          Active Tab:
          {currentView === "terminal"
            ? " Terminal"
            : currentView === "tetris"
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
              {displayedView === "tetris" && (
                <Tetris onNavigate={setCurrentView} isLowPerf={isLowPerf} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
