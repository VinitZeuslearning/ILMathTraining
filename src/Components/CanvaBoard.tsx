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
      name : "drawHexagon"
    }
  ]
  
  useEffect(() => {
    const rect = canvasRef.current?.getBoundingClientRect();
    canvasRef.current?.getContext('2d')?.clearRect( 0, 0, rect?.height || 10, rect?.width || 0 )
    const draw = new Drawing(canvasRef);
    draw.drawHexagon(200, 120, 40, 30);
    draw.drawSquare(200 , 180, 50, 0);
    draw.drawSquare(200 , 60, 50, 0);
  })

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
