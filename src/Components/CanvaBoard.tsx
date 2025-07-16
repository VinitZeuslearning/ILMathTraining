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
import type { ShapeName } from '../shapesData';
import { defaultStyle } from '../shapesData';

type Point = { x: number; y: number };

type Shape = {
  id: string;
  type: ShapeName;
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

export type CanvasBoardHandle = {
  redrawCanvas: () => void;
  getDrawing: () => Drawing | null;
};

const StyleDiv = styled.div`
  .canva {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const CanvasBoard = forwardRef<CanvasBoardHandle, CanvasBoardProps>(
  ({ draggableRef }, ref) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // const draw = new Drawing(canvasRef);
    const draw = useRef<Drawing>(null)

    const drawEverything = () => {
      console.log("render trigger")
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      for (const elm of draggableRef.current) {
        const pos = { x : elm.position.x + ( elm.W / 2 ) , y : elm.position.y + ( elm.H / 2) } ;
        const style = defaultStyle[ elm.shapeName ]
        // draw.current?.shapesMethod[elm.shapeName]({ x: pos.x, y: pos.y, radius: elm.size / 2, rotation: elm.rotation })
        draw.current?.shapesMethod[elm.shapeName]({ x: pos.x, y: pos.y, height: elm.shapeH, width: elm.shapeW, rotation: elm.rotation, fill: style.fill, fillColor : style.color })
      }

      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      draw.current?.drawHexagon({ x: 360, y: 200, width: 160, rotation: 0 });
      draw.current?.drawSquare({ x: 360, y: 310, width: 80, height: 80, rotation: 0 });
      draw.current?.drawSquare({ x: 360, y: 90, width: 80, height: 80, rotation: 0 });
      draw.current?.drawDotGrid();
      // draw.current?.drawHexagon({ x: 500, y: 200, radius: 80, rotation: 0, fill: true, fillColor: "yellow" });
    };

    useEffect(() => {
      draw.current = new Drawing(canvasRef);
      drawEverything();
    }, []);

    useImperativeHandle(ref, () => ({
      redrawCanvas() {
        drawEverything();
      },
      getDrawing( ) {
        return draw.current
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
