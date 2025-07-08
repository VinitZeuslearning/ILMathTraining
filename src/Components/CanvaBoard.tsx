import React, {
  useImperativeHandle,
  useRef,
  forwardRef,
  useEffect
} from 'react';
import styled from 'styled-components';

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

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapesRef.current.forEach((shape) => {
      ctx.beginPath();
      ctx.fillStyle = shape.color || 'yellow';
      ctx.strokeStyle = shape.strokeColor || 'black';
      const { x, y } = shape.position;

      switch (shape.type) {
        case 'circle':
          ctx.arc(x, y, shape.size ?? 20, 0, Math.PI * 2);
          break;
        case 'rect':
          ctx.rect(x, y, shape.width ?? 40, shape.height ?? 40);
          break;
        case 'hexagon':
          drawPolygon(ctx, x, y, shape.size ?? 30, 6);
          break;
        case 'triangle':
          drawPolygon(ctx, x, y, shape.size ?? 30, 3);
          break;
        case 'rhombus':
          drawRhombus(ctx, x, y, shape.size ?? 30);
          break;
        case 'parallelogram':
          drawParallelogram(ctx, x, y, shape.size ?? 40, shape.size ?? 30);
          break;
      }

      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    });
  };

  const drawPolygon = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    sides: number
  ) => {
    const angleStep = (2 * Math.PI) / sides;
    ctx.moveTo(cx + radius * Math.cos(0), cy + radius * Math.sin(0));
    for (let i = 1; i <= sides; i++) {
      ctx.lineTo(
        cx + radius * Math.cos(i * angleStep),
        cy + radius * Math.sin(i * angleStep)
      );
    }
  };

  const drawRhombus = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number
  ) => {
    const halfSize = size / 2;
    ctx.moveTo(cx, cy - halfSize);
    ctx.lineTo(cx + halfSize, cy);
    ctx.lineTo(cx, cy + halfSize);
    ctx.lineTo(cx - halfSize, cy);
  };

  const drawParallelogram = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    width: number,
    height: number
  ) => {
    const offset = 20;
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + width, cy);
    ctx.lineTo(cx + width - offset, cy + height);
    ctx.lineTo(cx - offset, cy + height);
  };

  const getCanvasRelativeCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
      x: (clientX - rect.left) * dpr,
      y: (clientY - rect.top) * dpr
    };
  };

  useImperativeHandle(ref, () => ({
    addShape: (shape: Shape) => {
      console.log("drawing shape " + JSON.stringify(shape));
      const canvas = canvasRef.current;
      if (!canvas) return;
      const relPos = getCanvasRelativeCoords(shape.position.x, shape.position.y);
      shapesRef.current.push({
        ...shape,
        position: shape.position
      });
      draw();
    },

    removeShape: (id: string) => {
      shapesRef.current = shapesRef.current.filter((s) => s.id !== id);
      draw();
    },

    moveShape: (id: string, newPos: Point) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const relPos = getCanvasRelativeCoords(newPos.x, newPos.y);
      const shape = shapesRef.current.find((s) => s.id === id);
      if (shape) {
        shape.position = relPos;
        draw();
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.fillStyle = '#cccccc00';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  return (
    <StyleDiv>
      <canvas
        ref={canvasRef}
        className="canva"
        style={{ border: '1px solid #ffffff' }}
      />
    </StyleDiv>
  );
});

export default CanvasBoard;
