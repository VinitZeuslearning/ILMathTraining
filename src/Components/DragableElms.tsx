import React, { useRef } from 'react';
import styled from 'styled-components';

interface ScrollableElmsProps {
  imageUrl: string;
  isDraggable : boolean;
}

const DraggableContainer = styled.div`
  position: absolute;
  cursor: grab;
  user-select: none;
  will-change: transform; /* hint to browser for GPU optimization */
`;

const DragableElms: React.FC<ScrollableElmsProps> = ({ imageUrl, isDraggable }) => {
  const positionRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(isDraggable);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    offsetRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current && containerRef.current) {
      positionRef.current = {
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      };

      // Set translate directly
      containerRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <DraggableContainer
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={imageUrl}
        alt="shape"
        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
      />
    </DraggableContainer>
  );
};

export default DragableElms;
