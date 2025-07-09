import React, { useRef, useState } from 'react';
import CanvasBoard from './CanvaBoard';
import type { CanvasBoardHandle } from './CanvaBoard';
import styled from 'styled-components';
import ShapeContainer from './ShapeContainer';
import PuzzlePieceCounter from './PuzzlePieceCounter';
import DragableElms from './DragableElms';

const StyleCmp = styled.div`
  height: 600px;
  width: 1300px;
  display: grid;
  grid-template-columns: 310px 710px 270.6px;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  align-items: center;

  .CanvaWrapper {
    position: relative;
  }
`;

interface DraggableElmObj {
  id: string;
  url: string;
  shapeName: string;
  position: { x: number; y: number };
  size: number;
}


const GameBoard: React.FC = () => {
  const canvasRef = useRef<CanvasBoardHandle>(null);
  const canvaWrapperRef = useRef<HTMLDivElement>(null);

  const [selectedShape, setSelectedShape] = useState<{ name: string; url: string; size: number } | null>(null);
  const [draggableElms, setDraggableElms] = useState<DraggableElmObj[]>([]);

  const handleShapeClick = (shape: { name: string; url: string, size: number }) => {
    setSelectedShape(shape);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!selectedShape || !canvaWrapperRef.current) return;

    const rect = canvaWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - selectedShape.size / 2;
    const y = e.clientY - rect.top - selectedShape.size / 2;

    const newElm: DraggableElmObj = {
      id: `${selectedShape.name}_${Date.now()}`,
      url: selectedShape.url,
      shapeName: selectedShape.name,
      position: { x, y },
      size: selectedShape.size
    };

    setDraggableElms(prev => [...prev, newElm]);
    setSelectedShape( null );
  };



  return (
    <StyleCmp>
      <ShapeContainer onShapeClick={handleShapeClick} />
      <div className="CanvaWrapper" ref={canvaWrapperRef} onClick={handleCanvasClick}>
        <CanvasBoard ref={canvasRef} />
        {draggableElms.map(obj => (
          <DragableElms
            key={obj.id}
            initialPos={obj.position}
            imageUrl={obj.url}
            size={obj.size}
          />  
        ))}
      </div>
      <PuzzlePieceCounter />
    </StyleCmp>
  );
};

export default GameBoard;
