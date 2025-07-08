import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import DragableElms from './DragableElms';
import type { CanvasBoardHandle } from './CanvaBoard';

const Container = styled.div`
  grid-gap: 16px;
  height: 100%;
  width: 100%;
  position: relative;

  .imgContinaer {
    display: flex;
    align-items: center;
  }
  .svgImgs {
    object-fit: contain;
    cursor: pointer;
  }
`;

const ShapeGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
`;

interface Props {
  canvaRef: React.RefObject<CanvasBoardHandle | null>;
}

interface DraggableShape {
  id: string;
  imageUrl: string;
  position: { x: number; y: number };
}

const ShapeContainer: React.FC<Props> = ({ canvaRef }) => {
  const [draggableShapes, setDraggableShapes] = useState<DraggableShape[]>([]);
  const [selectedShape, setSelectedShape] = useState<{ name: string; url: string } | null>(null);

  const shapeCount = useRef<Record<string, number>>({
    square: 0,
    rhombus: 0,
    trapezium: 0,
    triangle: 0,
    hexagon: 0,
    parallelogram: 0
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const shapeUrl = [
    { name: 'hexagon', url: '/pb_s5/hexagon_active.svg' },
    { name: 'parallelogram', url: '/pb_s5/paralellogram_active.svg' },
    { name: 'rhombus', url: '/pb_s5/rhombus-_active.svg' },
    { name: 'square', url: '/pb_s5/square_active.svg' },
    { name: 'trapezium', url: '/pb_s5/trapezium-_active.svg' },
    { name: 'triangle', url: '/pb_s5/triangle-_active.svg' },
  ];

  // Event handler: single mousedown on container
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // If clicked on a shape image
      const shapeName = target.getAttribute('data-shapeName');
      if (shapeName) {
        const shapeImg = shapeUrl.find((s) => s.name === shapeName);
        if (shapeImg) {
          setSelectedShape({ name: shapeName, url: shapeImg.url });
        }
        return;
      }

      // If clicked elsewhere in container and a shape is selected
      if (selectedShape && containerRef.current?.contains(target)) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const posX = e.clientX - containerRect.left;
        const posY = e.clientY - containerRect.top;

        const count = shapeCount.current[selectedShape.name]++;
        const newId = `${selectedShape.name}-${count}`;

        setDraggableShapes((prev) => [
          ...prev,
          {
            id: newId,
            imageUrl: selectedShape.url,
            position: { x: posX, y: posY }
          }
        ]);

        setSelectedShape(null);
      }
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (containerEl) {
        containerEl.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, [shapeUrl, selectedShape]);

  return (
    <Container ref={containerRef}>
      <ShapeGrid>
        {shapeUrl.map((shape) => (
          <div className="imgContinaer" key={shape.name}>
            <img
              src={shape.url}
              className="svgImgs"
              data-shapeName={shape.name}
              alt={shape.name}
            />
          </div>
        ))}

        {draggableShapes.map((shape) => (
          <DragableElms
            key={shape.id}
            imageUrl={shape.imageUrl}
            initialPos={shape.position}
            size={120}
          />
        ))}
      </ShapeGrid>
    </Container>
  );
};

export default ShapeContainer;
