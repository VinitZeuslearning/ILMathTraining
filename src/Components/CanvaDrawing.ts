type Point = { x: number; y: number };

import type { RefObject } from "react";

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

    drawLine(from: Point, to: Point) {
        if (this.ctx == null) {
            return
        }
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
    }

    private drawShape(points: Point[], borders: boolean[], rotation: number) {
        if (this.ctx == null) {
            return
        }
        const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length;

        const rotatedPoints = points.map(p => this.rotatePoint(p, cx, cy, rotation));

        this.ctx.beginPath();
        rotatedPoints.forEach((p, i) => {
            if (this.ctx == null) {
                return
            }
            const next = rotatedPoints[(i + 1) % rotatedPoints.length];
            if (borders[i]) {
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(next.x, next.y);
            }
        });
        this.ctx.stroke();
    }

    drawRhombus(x: number, y: number, size: number, rotation = 0, borders = [true, true, true, true]) {
        const h = size;
        const w = size * 0.6;
        const points = [
            { x: x, y: y - h / 2 },
            { x: x + w / 2, y: y },
            { x: x, y: y + h / 2 },
            { x: x - w / 2, y: y }
        ];
        this.drawShape(points, borders, rotation);
    }

    drawHexagon(x: number, y: number, size: number, rotation = 0, borders = [true, true, true, true, true, true]) {
        const points: Point[] = [];
        for (let i = 0; i < 6; i++) {
            const angle = this.degToRad(60 * i - 30);
            points.push({
                x: x + size * Math.cos(angle),
                y: y + size * Math.sin(angle)
            });
        }
        this.drawShape(points, borders, rotation);
    }

    drawTriangle(x: number, y: number, size: number, rotation = 0, borders = [true, true, true]) {
        const h = (size * Math.sqrt(3)) / 2;
        const points = [
            { x: x, y: y - h / 2 },
            { x: x + size / 2, y: y + h / 2 },
            { x: x - size / 2, y: y + h / 2 }
        ];
        this.drawShape(points, borders, rotation);
    }

    drawSquare(x: number, y: number, size: number, rotation = 0, borders = [true, true, true, true]) {
        const s = size / 2;
        const points = [
            { x: x - s, y: y - s },
            { x: x + s, y: y - s },
            { x: x + s, y: y + s },
            { x: x - s, y: y + s }
        ];
        this.drawShape(points, borders, rotation);
    }

    drawParallelogram(x: number, y: number, size: number, rotation = 0, borders = [true, true, true, true]) {
        const w = size;
        const h = size * 0.6;
        const offset = size * 0.3;
        const points = [
            { x: x - w / 2 + offset, y: y - h / 2 },
            { x: x + w / 2 + offset, y: y - h / 2 },
            { x: x + w / 2 - offset, y: y + h / 2 },
            { x: x - w / 2 - offset, y: y + h / 2 }
        ];
        this.drawShape(points, borders, rotation);
    }
}
