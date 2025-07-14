import React, {
  useImperativeHandle,
  useRef,
  forwardRef,
  useEffect
} from 'react';
import styled from 'styled-components';
import { Drawing } from './CanvaDrawing';
import { TbArrowUp } from 'react-icons/tb';

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

export interface CanvasBoardHandle {
  addShape: (shape: Shape) => void;
  removeShape: (id: string) => void;
  moveShape: (id: string, newPos: Point) => void;
}

const StyleDiv = styled.div`
  .canva {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const CanvasBoard = forwardRef<CanvasBoardHandle>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shapesRef = useRef<Shape[]>([]);
  const drawing = [
    {
      name: "drawHexagon"
    }
  ]

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set canvas width & height based on DPR
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale context to handle higher DPI
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Clear and draw
    ctx?.clearRect(0, 0, rect.width, rect.height);

    const draw = new Drawing(canvasRef);
    draw.drawHexagon(360, 200, 80, 30);
    draw.drawSquare(360, 310, 40, 0);
    draw.drawSquare(360, 90, 40, 0);
    draw.drawDotGrid();
  }, []);


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
});

export default CanvasBoard;
