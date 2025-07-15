type Point = { x: number; y: number };

import type { RefObject } from "react";

export type ShapeOptions = {
    x: number;
    y: number;
    radius: number;
    rotation: number;
    borders: boolean[];
    fill: boolean;
    fillColor: string;
};

export class Drawing {
    private ctx: CanvasRenderingContext2D | null;

    constructor(canvasElm: RefObject<HTMLCanvasElement | null>) {
        if (canvasElm.current == null) {
            this.ctx = null;
            return;
        }
        const context = canvasElm.current.getContext("2d");
        if (!context) throw new Error("Canvas context not available");
        this.ctx = context;
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#aa5522";
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
            y: cy + dx * sin + dy * cos
        };
    }

    private drawShape(points: Point[], borders: boolean[], rotation: number, fill: boolean, fillColor: string) {
        if (this.ctx == null) {
            return;
        }
        const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length;

        const rotatedPoints = points.map(p => this.rotatePoint(p, cx, cy, rotation));

        this.ctx.beginPath();
        rotatedPoints.forEach((p, i) => {
            if (!this.ctx) {
                return;
            }
            if (i === 0) {
                this.ctx.moveTo(p.x, p.y);
            } else {
                this.ctx.lineTo(p.x, p.y);
            }
        });
        this.ctx.closePath();

        if (fill) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }

        rotatedPoints.forEach((p, i) => {
            if (!this.ctx) {
                return;
            }
            const next = rotatedPoints[(i + 1) % rotatedPoints.length];
            if (borders[i]) {
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(next.x, next.y);
                this.ctx.stroke();
            }
        });
    }

    private mergeOptions(options: Partial<ShapeOptions>, defaults: ShapeOptions): ShapeOptions {
        return { ...defaults, ...options };
    }

    drawRhombus(options: Partial<ShapeOptions>) {
        const opts = this.mergeOptions(options, {
            x: 0, y: 0, radius: 50, rotation: 0,
            borders: [true, true, true, true],
            fill: false, fillColor: 'transparent'
        });

        const h = opts.radius * 2;
        const w = h * 0.6;
        const points = [
            { x: opts.x, y: opts.y - h / 2 },
            { x: opts.x + w / 2, y: opts.y },
            { x: opts.x, y: opts.y + h / 2 },
            { x: opts.x - w / 2, y: opts.y }
        ];
        this.drawShape(points, opts.borders, opts.rotation, opts.fill, opts.fillColor);
    }

    drawHexagon(options: Partial<ShapeOptions>) {
        const opts = this.mergeOptions(options, {
            x: 0, y: 0, radius: 50, rotation: 0,
            borders: [true, true, true, true, true, true],
            fill: false, fillColor: 'transparent'
        });

        const points: Point[] = [];
        for (let i = 0; i < 6; i++) {
            const angle = this.degToRad(60 * i - 30);
            points.push({
                x: opts.x + opts.radius * Math.cos(angle),
                y: opts.y + opts.radius * Math.sin(angle)
            });
        }
        this.drawShape(points, opts.borders, opts.rotation, opts.fill, opts.fillColor);
    }

    drawTriangle(options: Partial<ShapeOptions>) {
        const opts = this.mergeOptions(options, {
            x: 0, y: 0, radius: 50, rotation: 0,
            borders: [true, true, true],
            fill: false, fillColor: 'transparent'
        });

        const s = opts.radius * 2;
        const h = (s * Math.sqrt(3)) / 2;
        const points = [
            { x: opts.x, y: opts.y - h / 2 },
            { x: opts.x + s / 2, y: opts.y + h / 2 },
            { x: opts.x - s / 2, y: opts.y + h / 2 }
        ];
        this.drawShape(points, opts.borders, opts.rotation, opts.fill, opts.fillColor);
    }

    drawSquare(options: Partial<ShapeOptions>) {
        const opts = this.mergeOptions(options, {
            x: 0, y: 0, radius: 50, rotation: 0,
            borders: [true, true, true, true],
            fill: false, fillColor: 'transparent'
        });

        const s = opts.radius;
        const points = [
            { x: opts.x - s, y: opts.y - s },
            { x: opts.x + s, y: opts.y - s },
            { x: opts.x + s, y: opts.y + s },
            { x: opts.x - s, y: opts.y + s }
        ];
        this.drawShape(points, opts.borders, opts.rotation, opts.fill, opts.fillColor);
    }

    drawParallelogram(options: Partial<ShapeOptions>) {
        const opts = this.mergeOptions(options, {
            x: 0, y: 0, radius: 50, rotation: 0,
            borders: [true, true, true, true],
            fill: false, fillColor: 'transparent'
        });

        const w = opts.radius * 2;
        const h = w * 0.6;
        const offset = w * 0.3;
        const points = [
            { x: opts.x - w / 2 + offset, y: opts.y - h / 2 },
            { x: opts.x + w / 2 + offset, y: opts.y - h / 2 },
            { x: opts.x + w / 2 - offset, y: opts.y + h / 2 },
            { x: opts.x - w / 2 - offset, y: opts.y + h / 2 }
        ];
        this.drawShape(points, opts.borders, opts.rotation, opts.fill, opts.fillColor);
    }

    drawDotGrid(spacing = 40, color = 'black') {
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
}