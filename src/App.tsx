import styled from 'styled-components';
import ShapeContainer from './Components/ShapeContainer';
import PuzzleDropZone from './Components/PuzzleDropZone';
import PuzzlePieceCounter from './Components/PuzzlePieceCounter';
import './Index.css';

// Outer container for full viewport
const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .PlayBord {
     height: 600px;
    width: 1300px;
    height: 480px;
    display: grid;
    grid-template-columns: 317px 673px 270.6px;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }
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
        <div className='PlayBord'>
          <ShapeContainer />
          <PuzzleDropZone />
          <PuzzlePieceCounter />
        </div>
      </BoardContainer>
    </AppContainer>
  );
}

export default App;
