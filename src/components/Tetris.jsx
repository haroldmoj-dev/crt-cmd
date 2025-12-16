import "../styles/components/Tetris.css";

const Tetris = ({ onNavigate, isLowPerf }) => {
  return (
    <div className="tetris content">
      <div className="title">"TETRIS"</div>
      <div className="menu">
        <div>Welcome to Tetris. </div>
        <div>Would you like to start the game (Y/N)? </div>
      </div>
      <br />
      {/* Tetris game logic */}
    </div>
  );
};

export default Tetris;
