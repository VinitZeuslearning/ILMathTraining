import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  type RefObject
} from 'react';

import styled from 'styled-components';
import { Drawing } from './CanvaDrawing';
import type { DraggableElmObj } from './GameBoard';

type Point = { x: number; y: number };

type ShapeType =
  | 'circle'
  | 'rect'
  | 'hexagon'
  | 'triangle'
  | 'parallelogram'
  | 'rhombus';

type Shape = {
  id: string;
  type: ShapeType;
  position: Point;
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  strokeColor?: string;
};

type CanvasBoardProps = {
  draggableRef: RefObject<DraggableElmObj[]>;
};

const StyleDiv = styled.div`
  .canva {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const CanvasBoard = forwardRef<HTMLDivElement, CanvasBoardProps>(
  ({ draggableRef }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const drawEverything = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      const draw = new Drawing(canvasRef);
      draw.drawHexagon({ x: 360, y: 200, radius: 80, rotation: 30 });
      draw.drawSquare({ x: 360, y: 310, radius: 40, rotation: 0 });
      draw.drawSquare({ x: 360, y: 90, radius: 40, rotation: 0 });
      draw.drawDotGrid();
      draw.drawHexagon({ x: 500, y: 200, radius: 80, rotation: 30, fill: true, fillColor: "yellow" });
    };

    useEffect(() => {
      drawEverything();
    }, []);

    useImperativeHandle(ref, () => ({
      redrawCanvas() {
        drawEverything();
      }
    }));

    return (
      <StyleDiv>
        <canvas
          ref={canvasRef}
          className="canva"
          style={{ border: '1px solid #ffffff' }}
          height={270}
          width={400}
        />
      </StyleDiv>
    );
  }
);


export default CanvasBoard;
