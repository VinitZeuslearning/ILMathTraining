import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { MdDelete } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";

interface ScrollableElmsProps {
  imageUrl: string;
  initialPos: { x: number; y: number };
  size: number;
  startDrag?: boolean;
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
  z-index: 999;
`;

const ControlBar = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 4px;
  justify-content: center;
  align-items: center;
  cursor: default;
`;

const IconButton = styled.button`
  border: none;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

const DragableElms: React.FC<ScrollableElmsProps> = ({ imageUrl, initialPos, size, startDrag = false }) => {
  const positionRef = useRef<{ x: number; y: number }>({ ...initialPos });
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const isRotatingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<number>(0);

  useEffect(() => {
    const width = size;
    const height = size;
    const translateX = initialPos.x - width / 2;
    const translateY = initialPos.y - height / 2;

    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${translateX}px, ${translateY}px) rotate(0deg)`;
      positionRef.current = { x: translateX, y: translateY };
    }

    // If startDrag is requested on mount, trigger a synthetic mousedown
    if (startDrag) {
      const fakeEvent = new MouseEvent('mousedown', {
        clientX: initialPos.x,
        clientY: initialPos.y,
        bubbles: true,
        cancelable: true
      });
      handleMouseDown(fakeEvent);
    }
  }, [initialPos, size, startDrag]);

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingRef.current && containerRef.current) {
      positionRef.current = {
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      };
      containerRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px) rotate(${rotationRef.current}deg)`;
    }

    if (isRotatingRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;

      if (Math.abs(angle - rotationRef.current) > 10) {
        rotationRef.current = angle;
        containerRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px) rotate(${rotationRef.current}deg)`;
      }
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isRotatingRef.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: MouseEvent | React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    offsetRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const startRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isRotatingRef.current = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleDelete = () => {
    if (containerRef.current) {
      containerRef.current.remove();
    }
  };

  return (
    <DraggableContainer ref={containerRef} onMouseDown={(e) => e.stopPropagation()}>
      <ControlBar>
        <IconButton onMouseDown={startRotate}>
          <FaArrowsRotate size={22} />
        </IconButton>
      </ControlBar>

      <img
        src={imageUrl}
        alt="shape"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          border: "2px dashed #a99999"
        }}
        onMouseDown={(e) => handleMouseDown(e)}
        draggable={false}
      />

      <ControlBar>
        <IconButton onClick={handleDelete}>
          <MdDelete size={22} />
        </IconButton>
      </ControlBar>
    </DraggableContainer>
  );
};

export default DragableElms;
