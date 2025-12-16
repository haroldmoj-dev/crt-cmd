import "../styles/components/Tetris.css";

const Tetris = ({ onNavigate }) => {
  return (
    <div className="tetris-content">
      <div>Tetris Game</div>
      <br />
      <button class="back-button" onClick={() => onNavigate("terminal")}>
        Back to Terminal
      </button>
      {/* Tetris game logic */}
    </div>
  );
};

export default Tetris;
