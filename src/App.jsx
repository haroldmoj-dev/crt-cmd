import { useState, useEffect } from "react";
import Terminal from "./components/Terminal";
import Tetris from "./components/Tetris";

function App() {
  const [isLowPerf, setIsLowPerf] = useState(false);
  const [currentView, setCurrentView] = useState("terminal");
  const [displayedView, setDisplayedView] = useState("terminal");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const togglePerformance = () => {
    setIsLowPerf(!isLowPerf);
    document.body.classList.toggle("low-perf", !isLowPerf);
  };

  const toggleTab = () => {
    if (isTransitioning) return;
    setCurrentView((prev) => (prev === "terminal" ? "tetris" : "terminal"));
  };

  useEffect(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setDisplayedView(currentView);
      setIsTransitioning(false);
    }, 2000);
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
              className={`content ${isTransitioning ? "fade-out" : "fade-in"}`}
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
