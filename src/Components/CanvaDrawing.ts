type Point = { x: number; y: number };

import type { RefObject } from "react";
import type { ShapeName } from "../shapesData";

export type ShapeOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  borders: boolean[];
  fill: boolean;
  fillColor: string;
};

type DrawFn = (options: Partial<ShapeOptions>) => void;
type PointFn = (options: Partial<ShapeOptions>) => Point[];

export class Drawing {
  private ctx: CanvasRenderingContext2D | null;
  public shapesMethod: Record<ShapeName, DrawFn>;
  public getVertices: Record<ShapeName, PointFn>;

  constructor(canvasElm: RefObject<HTMLCanvasElement | null>) {
    if (canvasElm.current == null) {
      this.ctx = null;
      this.shapesMethod = {} as Record<ShapeName, DrawFn>;
      this.getVertices = {} as Record<ShapeName, PointFn >
      return;
    }

    const context = canvasElm.current.getContext("2d");
    if (!context) throw new Error("Canvas context not available");

    this.ctx = context;
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#aa5522";

    this.shapesMethod = {
      hexagon: this.drawHexagon.bind(this),
      parallelogram: this.drawParallelogram.bind(this),
      rhombus: this.drawRhombus.bind(this),
      square: this.drawSquare.bind(this),
      triangle: this.drawTriangle.bind(this),
      trapezium: this.drawTrapezium.bind(this),
    };

    this.getVertices = {
      hexagon: this.getHexagonPoints.bind(this),
      square: this.getHexagonPoints.bind(this),
      triangle: this.getTrianglePoints.bind(this),
      trapezium: this.getTrapeziumPoints.bind(this),
      parallelogram: this.getParallelogramPoints.bind(this),
      rhombus: this.getRhombusPoints.bind(this)
    }
  }

  private degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  private rotatePoint(p: Point, cx: number, cy: number, angle: number): Point {
    const rad = this.degToRad(angle);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const dx = p.x - cx;
    const dy = p.y - cy;
    return {
      x: cx + dx * cos - dy * sin,
      y: cy + dx * sin + dy * cos,
    };
  }

  private drawShape(
    points: Point[],
    borders: boolean[],
    rotation: number,
    fill: boolean,
    fillColor: string
  ) {
    if (this.ctx == null) return;

    const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length;

    const rotatedPoints = points.map((p) =>
      this.rotatePoint(p, cx, cy, rotation)
    );

    this.ctx.beginPath();
    rotatedPoints.forEach((p, i) => {
      if (i === 0) {
        this.ctx!.moveTo(p.x, p.y);
      } else {
        this.ctx!.lineTo(p.x, p.y);
      }
    });
    this.ctx.closePath();

    if (fill) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }

    rotatedPoints.forEach((p, i) => {
      const next = rotatedPoints[(i + 1) % rotatedPoints.length];
      if (borders[i]) {
        this.ctx!.beginPath();
        this.ctx!.moveTo(p.x, p.y);
        this.ctx!.lineTo(next.x, next.y);
        this.ctx!.stroke();
      }
    });
  }

  private mergeOptions(
    options: Partial<ShapeOptions>,
    defaults: ShapeOptions
  ): ShapeOptions {
    return { ...defaults, ...options };
  }

  drawSquare(options: Partial<ShapeOptions>) {
    const opts = this.mergeOptions(options, {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      borders: [true, true, true, true],
      fill: false,
      fillColor: "transparent",
    });

    const w = opts.width / 2;
    const h = opts.height / 2;
    const points = [
      { x: opts.x - w, y: opts.y - h },
      { x: opts.x + w, y: opts.y - h },
      { x: opts.x + w, y: opts.y + h },
      { x: opts.x - w, y: opts.y + h },
    ];
    this.drawShape(points, opts.borders, opts.rotation, opts.fill, opts.fillColor);
  }

  drawHexagon(options: Partial<ShapeOptions>) {
    const opts = this.mergeOptions(options, {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      borders: [true, true, true, true, true, true],
      fill: false,
      fillColor: "transparent",
    });

    const r = opts.width / 2;
    const points: Point[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = this.degToRad(60 * i);
      points.push({
        x: opts.x + r * Math.cos(angle),
        y: opts.y + r * Math.sin(angle),
      });
    }
    this.drawShape(points, opts.borders, opts.rotation, opts.fill, opts.fillColor);
  }

  drawRhombus(options: Partial<ShapeOptions>) {
    const opts = this.mergeOptions(options, {
      x: 0,
      y: 0,
      width: 60,
      height: 120,
      rotation: 0,
      borders: [true, true, true, true],
      fill: false,
      fillColor: "transparent",
    });

    const points = [
      { x: opts.x, y: opts.y - opts.height / 2 },
      { x: opts.x + opts.width / 2, y: opts.y },
      { x: opts.x, y: opts.y + opts.height / 2 },
      { x: opts.x - opts.width / 2, y: opts.y },
    ];
    this.drawShape(points, opts.borders, opts.rotation, opts.fill, opts.fillColor);
  }

  drawTriangle(options: Partial<ShapeOptions>) {
    const opts = this.mergeOptions(options, {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      borders: [true, true, true],
      fill: false,
      fillColor: "transparent",
    });

    const points = [
      { x: opts.x, y: opts.y - opts.height / 2 },
      { x: opts.x + opts.width / 2, y: opts.y + opts.height / 2 },
      { x: opts.x - opts.width / 2, y: opts.y + opts.height / 2 },
    ];
    this.drawShape(points, opts.borders, opts.rotation, opts.fill, opts.fillColor);
  }

  drawParallelogram(options: Partial<ShapeOptions>) {
    const opts = this.mergeOptions(options, {
      x: 0,
      y: 0,
      width: 100,
      height: 60,
      rotation: 0,
      borders: [true, true, true, true],
      fill: false,
      fillColor: "transparent",
    });

    const offset = opts.width * 0.3;
    const points = [
      { x: opts.x - opts.width / 2 + offset, y: opts.y - opts.height / 2 },
      { x: opts.x + opts.width / 2 + offset, y: opts.y - opts.height / 2 },
      { x: opts.x + opts.width / 2 - offset, y: opts.y + opts.height / 2 },
      { x: opts.x - opts.width / 2 - offset, y: opts.y + opts.height / 2 },
    ];
    this.drawShape(points, opts.borders, opts.rotation, opts.fill, opts.fillColor);
  }

  drawTrapezium(options: Partial<ShapeOptions>) {
    const opts = this.mergeOptions(options, {
      x: 0,
      y: 0,
      width: 100,
      height: 60,
      rotation: 0,
      borders: [true, true, true, true],
      fill: false,
      fillColor: "transparent",
    });

    const top = opts.width * 0.6;
    const bottom = opts.width;
    const h = opts.height;
    const points = [
      { x: opts.x - top / 2, y: opts.y - h / 2 },
      { x: opts.x + top / 2, y: opts.y - h / 2 },
      { x: opts.x + bottom / 2, y: opts.y + h / 2 },
      { x: opts.x - bottom / 2, y: opts.y + h / 2 },
    ];
    this.drawShape(points, opts.borders, opts.rotation, opts.fill, opts.fillColor);
  }

  drawDotGrid(spacing = 40, color = "black") {
    if (this.ctx == null) return;

    const canvas = this.ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    this.ctx.fillStyle = color;

    for (let x = 0; x <= width; x += spacing) {
      for (let y = 0; y <= height; y += spacing) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  public getSquarePoints(options: Partial<ShapeOptions>): Point[] {
    const { x = 0, y = 0, width = 100, height = 100, rotation = 0 } = options;
    const hw = width / 2, hh = height / 2;
    const raw = [
      { x: x - hw, y: y - hh },
      { x: x + hw, y: y - hh },
      { x: x + hw, y: y + hh },
      { x: x - hw, y: y + hh }
    ];
    return raw.map(p => this.rotatePoint(p, x, y, rotation));
  }

  public getHexagonPoints(options: Partial<ShapeOptions>): Point[] {
    const { x = 0, y = 0, width = 100, rotation = 0 } = options;
    const r = width / 2;
    const raw: Point[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = this.degToRad(60 * i);
      raw.push({
        x: x + r * Math.cos(angle),
        y: y + r * Math.sin(angle)
      });
    }
    return raw.map(p => this.rotatePoint(p, x, y, rotation));
  }

  public getRhombusPoints(options: Partial<ShapeOptions>): Point[] {
    const { x = 0, y = 0, width = 60, height = 120, rotation = 0 } = options;
    const raw = [
      { x, y: y - height / 2 },
      { x: x + width / 2, y },
      { x, y: y + height / 2 },
      { x: x - width / 2, y }
    ];
    return raw.map(p => this.rotatePoint(p, x, y, rotation));
  }

  public getTrianglePoints(options: Partial<ShapeOptions>): Point[] {
    const { x = 0, y = 0, width = 100, height = 100, rotation = 0 } = options;
    const raw = [
      { x, y: y - height / 2 },
      { x: x + width / 2, y: y + height / 2 },
      { x: x - width / 2, y: y + height / 2 }
    ];
    return raw.map(p => this.rotatePoint(p, x, y, rotation));
  }

  public getParallelogramPoints(options: Partial<ShapeOptions>): Point[] {
    const { x = 0, y = 0, width = 100, height = 60, rotation = 0 } = options;
    const offset = width * 0.3;
    const raw = [
      { x: x - width / 2 + offset, y: y - height / 2 },
      { x: x + width / 2 + offset, y: y - height / 2 },
      { x: x + width / 2 - offset, y: y + height / 2 },
      { x: x - width / 2 - offset, y: y + height / 2 }
    ];
    return raw.map(p => this.rotatePoint(p, x, y, rotation));
  }

  public getTrapeziumPoints(options: Partial<ShapeOptions>): Point[] {
    const { x = 0, y = 0, width = 100, height = 60, rotation = 0 } = options;
    const top = width * 0.6, bottom = width;
    const raw = [
      { x: x - top / 2, y: y - height / 2 },
      { x: x + top / 2, y: y - height / 2 },
      { x: x + bottom / 2, y: y + height / 2 },
      { x: x - bottom / 2, y: y + height / 2 }
    ];
    return raw.map(p => this.rotatePoint(p, x, y, rotation));
  }


}
