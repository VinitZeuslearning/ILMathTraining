import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

interface ScrollableElmsProps {
  imageUrl: string;
  initialPos: { x: number; y: number };
  size: number;
}

const DraggableContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  cursor: grab;
  user-select: none;
  will-change: transform;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ControlBar = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 4px;
  justify-content: center;
  align-items: center;
  cursor: default;
`;

const IconButton = styled.button`
  background: #f1f1f1;
  border: none;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: #ddd;
  }
`;

const DragableElms: React.FC<ScrollableElmsProps> = ({ imageUrl, initialPos, size }) => {
  const positionRef = useRef<{ x: number; y: number }>({ ...initialPos });
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set initial position on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${initialPos.x}px, ${initialPos.y}px)`;
      positionRef.current = { ...initialPos };
    }
  }, [initialPos]);

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
      containerRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
    }
  };

  const handleMouseUp = () => {
    if (!containerRef.current) return;
    isDraggingRef.current = false;
    // Reset to initial position on mouse up
    positionRef.current = { ...initialPos };
    containerRef.current.style.transform = `translate(${initialPos.x}px, ${initialPos.y}px)`;
  };

  const handleDelete = () => {
    if (containerRef.current) {
      containerRef.current.remove();
    }
  };

  const handleRotate = () => {
    if (containerRef.current) {
      const currentTransform = containerRef.current.style.transform;
      const rotationMatch = currentTransform.match(/rotate\((\d+)deg\)/);
      const currentRotation = rotationMatch ? parseInt(rotationMatch[1]) : 0;
      const newRotation = currentRotation + 45;
      containerRef.current.style.transform = `${currentTransform} rotate(${newRotation}deg)`;
    }
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
        style={{  objectFit: 'contain' }}
      />
      <ControlBar onMouseDown={(e) => e.stopPropagation()}>
        <IconButton onClick={handleDelete}>🗑️</IconButton>
        <IconButton onClick={handleRotate}>🔄</IconButton>
      </ControlBar>
    </DraggableContainer>
  );
};

export default DragableElms;
