import React, { useEffect, useRef, useState } from 'react';
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

  const [selectedShape, setSelectedShape] = useState<{ name: string; url: string; size: number, rect: DOMRect | null } | null>(null);
  const [draggableElms, setDraggableElms] = useState<DraggableElmObj[]>([]);
  const ghostRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!selectedShape) return;

    const handleMove = (e: MouseEvent) => {
      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate(${e.clientX - (selectedShape.rect?.left || 0) - (selectedShape.size / 2)}px, ${e.clientY - (selectedShape.rect?.top || 0) - (selectedShape.size / 2)}px)`;
      }
    };

    const handleUp = () => {
      setSelectedShape(null);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

  }, [selectedShape]);


  const handleMouseMove = (e: MouseEvent) => {
    if (selectedShape && ghostRef.current) {
      ghostRef.current.style.transform = `translate(${e.clientX - (selectedShape.rect?.left || 0) - (selectedShape.size / 2)}px, ${e.clientY - (selectedShape.rect?.top || 0) - (selectedShape.size / 2)}px)`;
    }
  };
  window.addEventListener('mousemove', handleMouseMove);
  const handleShapeClick = (shape: { name: string; url: string, size: number, rect: DOMRect | null } | null) => {

    setSelectedShape(shape);
  };

  function getIntersectionArea(a: DOMRect, b: DOMRect) {
    const xOverlap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const yOverlap = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return xOverlap * yOverlap;
  }

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!selectedShape || !canvaWrapperRef.current) return;

    const wrapperRect = canvaWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - wrapperRect.left;
    const y = e.clientY - wrapperRect.top;

    const newElm: DraggableElmObj = {
      id: `${selectedShape.name}_${Date.now()}`,
      url: selectedShape.url,
      shapeName: selectedShape.name,
      position: { x, y },
      size: selectedShape.size
    };

    // Create a DOMRect for the new element
    const newRect = new DOMRect(
      x,
      y,
      selectedShape.size,
      selectedShape.size
    );

    // Check for collisions and filter out overlapping elements
    setDraggableElms(prev => {
      const remainingElms = prev.filter(elm => {
        const elmRect = new DOMRect(
          elm.position.x,
          elm.position.y,
          elm.size,
          elm.size
        );

        const intersectionArea = getIntersectionArea(newRect, elmRect);
        const elmArea = elm.size * elm.size;
        const newArea = selectedShape.size * selectedShape.size;

        // If overlap is more than 50% of either element’s area, remove it
        const overlapPercentElm = intersectionArea / elmArea;
        const overlapPercentNew = intersectionArea / newArea;

        return overlapPercentElm <= 0.5 && overlapPercentNew <= 0.5;
      });

      return [...remainingElms, newElm];
    });

    setSelectedShape(null);
  };




  return (
    <StyleCmp>
      <ShapeContainer onShapeMouseDown={handleShapeClick} />
      <div className="CanvaWrapper" ref={canvaWrapperRef} onMouseUp={handleCanvasMouseUp} >
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


      {selectedShape && (
        <img
          ref={ghostRef}
          src={selectedShape.url}
          alt="ghost"
          className="ghost-image"
          draggable={false}
          style={{
            position: "absolute",
            top: selectedShape.rect?.top + "px",
            left: selectedShape.rect?.left + "px",
            width: `${selectedShape.size}px`,
            height: `${selectedShape.size}px`,
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />
      )}

    </StyleCmp>
  );
};

export default GameBoard;
