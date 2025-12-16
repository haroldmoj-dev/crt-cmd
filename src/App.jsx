import { useState } from "react";
import Terminal from "./components/Terminal";
import Tetris from "./components/Tetris";

function App() {
  const [isLowPerf, setIsLowPerf] = useState(false);
  const [currentView, setCurrentView] = useState("terminal");

  const togglePerformance = () => {
    setIsLowPerf(!isLowPerf);
    document.body.classList.toggle("low-perf", !isLowPerf);
  };

  return (
    <div className="outer-container">
      <div className="top-container">
        <button className="perf-toggle" onClick={togglePerformance}>
          Performance Mode: {isLowPerf ? "Low" : "High"}
        </button>
      </div>
      <div className="middle-container">
        <div className="crt-container">
          <div className="crt-screen">
            <div className="crt-glow"></div>
            <div className="crt-scanline"></div>
            {currentView === "terminal" && (
              <Terminal onNavigate={setCurrentView} />
            )}
            {currentView === "tetris" && <Tetris onNavigate={setCurrentView} />}
          </div>
        </div>
      </div>
      <div className="bottom-container"></div>
    </div>
  );
}

export default App;
