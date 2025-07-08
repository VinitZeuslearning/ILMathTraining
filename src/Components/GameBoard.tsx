import React, { useRef } from 'react';
// import CanvasBoard from './CanvaBoard';
import CanvasBoard from './CanvaBoard';
import type { CanvasBoardHandle } from './CanvaBoard'
import styled from 'styled-components';
import ShapeContainer from './ShapeContainer';
import PuzzlePieceCounter from './PuzzlePieceCounter';

const StyleCmp = styled.div `
   height: 600px;
    width: 1300px;
    height: 480px;
    display: grid;
    grid-template-columns:310px 710px 270.6px;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;

`


const GameBoard: React.FC = () => {
  // Ref with CanvasBoardHandle type
  const canvasRef = useRef<CanvasBoardHandle>(null);

  const handleAddCircle = () => {
    canvasRef.current?.addShape({
      id: 'circle1',
      type: 'circle',
      position: { x: 120, y: 120 },
      size: 30,
      color: 'blue'
    });
  };

  const handleRemoveCircle = () => {
    canvasRef.current?.removeShape('circle1');
  };

  return (
    <StyleCmp>
      {/* <button onClick={handleAddCircle}>Add Circle</button>
      <button onClick={handleRemoveCircle}>Remove Circle</button> */}
       <ShapeContainer canvaRef={canvasRef} />
      <CanvasBoard ref={canvasRef} />
       <PuzzlePieceCounter />
    </StyleCmp>
  );
};

export default GameBoard;
