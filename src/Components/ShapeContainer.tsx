import React, { useEffect, useRef, useState, type RefObject } from 'react';
import styled from 'styled-components';
import shapesUrl from '../shapesData';
import type { ShapeName } from '../shapesData';
import DragableElms from './DragableElms';

const Container = styled.div`
  grid-gap: 16px;
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 20px;
  position: relative;

  .imgContainer {
    display: flex;
    align-items: center;
  }

  .svgImgs {
    object-fit: contain;
    cursor: pointer;
  }
`;

const ShapeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-auto-rows: 100px;
  align-items: center;
  padding-top: 170px;
`;

interface Props {
  onShapeClick: (shape: { name: string; url: string; size: number }) => void;
}

type RefObj = {
  [key in ShapeName]: {
    ref: RefObject<HTMLDivElement>;
    rect: DOMRect | null;
  };
};

const ShapeContainer: React.FC<Props> = ({ onShapeClick }) => {
  const refObject = useRef<RefObj>(
    Object.fromEntries(
      Object.keys(shapesUrl).map(name => [
        name,
        { ref: React.createRef<HTMLDivElement>(), rect: null }
      ])
    ) as RefObj
  );

  // count state to trigger rerender
  const [elmsCnt, setElmsCnt] = useState<number>(0);

  // stable persistent array ref to hold draggable elements data
  const dragableElms = useRef<
    { name: string; url: string; size: number; x: number; y: number; startDrag: boolean }[]
  >([]);

  useEffect(() => {
    Object.entries(refObject.current).forEach(([name, obj]) => {
      if (obj.ref.current) {
        obj.rect = obj.ref.current.getBoundingClientRect();
      }
    });
  }, []);

  function mouseDownHandle(name: ShapeName, url: string, size: number) {
    function handleMouseMove(e: MouseEvent) {
      const rect = refObject.current[name].rect;
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const maxDist = Math.max(rect.width, rect.height) / 2;

      if (distance > maxDist) {
        dragableElms.current.push({
          name,
          url,
          size,
          x: e.clientX,
          y: e.clientY,
          startDrag: true
        });

        setElmsCnt(prev => prev + 1); // trigger rerender for 1 new item
        window.removeEventListener('mousemove', handleMouseMove);
      }
    }

    function handleMouseUp() {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  return (
    <Container>
      <ShapeGrid>
        {Object.entries(shapesUrl).map(([name, { url, size }]) => (
          <div className="imgContainer" key={name} ref={refObject.current[name as ShapeName].ref}>
            <img
              src={url}
              className="svgImgs"
              alt={name}
              draggable={false}
              onMouseDown={() => mouseDownHandle(name as ShapeName, url, size)}
              onClick={() => onShapeClick({ name, url, size })}
            />
          </div>
        ))}
      </ShapeGrid>

      {/* Render draggable elements */}
      {dragableElms.current.slice(0, elmsCnt).map((elm, idx) => (
        <DragableElms
          key={idx}
          imageUrl={elm.url}
          initialPos={{ x: elm.x, y: elm.y }}
          size={elm.size}
          startDrag={elm.startDrag}
        />
      ))}
    </Container>
  );
};

export default ShapeContainer;
