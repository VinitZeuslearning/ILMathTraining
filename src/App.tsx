import styled from 'styled-components';
import ShapeContainer from './Components/ShapeContainer';
import PuzzlePieceCounter from './Components/PuzzlePieceCounter';
import GameBoard from './Components/GameBoard';
import './Index.css';

// Outer container for full viewport
const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

// Container with background image
const BoardContainer = styled.div`
  flex: 1;
  background: url('/pb_s5/background_new.svg');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto; /* allow scrolling if needed */
`;

// Optional: A wrapper grid for shapes, if you need one
const PlayBoard = styled.div`
   
`;

function App() {
  return (
    <AppContainer>
      <BoardContainer>
          <GameBoard />
      </BoardContainer>
    </AppContainer>
  );
}

export default App;
