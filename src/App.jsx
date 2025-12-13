import { useState } from "react";
import Terminal from "./components/Terminal";
import "./App.css";

function App() {
  const [isLowPerf, setIsLowPerf] = useState(false);

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
        <Terminal />
      </div>
      <div className="bottom-container"></div>
    </div>
  );
}

export default App;
