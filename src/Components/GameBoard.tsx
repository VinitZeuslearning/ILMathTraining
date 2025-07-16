import React, { useEffect, useRef, useState } from 'react';
import CanvasBoard from './CanvaBoard';
import styled from 'styled-components';
import ShapeContainer from './ShapeContainer';
import PuzzlePieceCounter from './PuzzlePieceCounter';
import { MdDelete } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import type { CanvasBoardHandle } from './CanvaBoard';
import type { ShapeName } from '../shapesData';
import type { ShapeMeta } from '../shapesData';
import { Drawing } from './CanvaDrawing';

const ControlBar = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 4px;
  justify-content: center;
  align-items: center;
  cursor: default;
`;
const StyleCmp = styled.div`
  height: 600px;
  width: 1300px;
  display: grid;
  grid-template-columns: 310px 710px 270.6px;
  align-items: center;

  .CanvaWrapper {
    position: relative;
    overflow: hidden;
  }

  .DragableElmContainer {
    position: absolute;
    z-index: 99999;
  }
`;

const IconButton = styled.button`
  border: none;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;
type Point = { x: number; y: number };
export interface DraggableElmObj {
  id: string;
  url: string;
  shapeName: ShapeName;
  position: { x: number; y: number };
  shapeH: number,
  shapeW: number,
  size: number;
  rotation: number;
  H: number;
  W: number;
  point: Point[] | undefined
}

interface dumRect { left: number, right: number, top: number, bottom: number, height: number, width: number }

type SelectedShape = ({ name: ShapeName; rect: DOMRect | null } & ShapeMeta) | null;


const GameBoard: React.FC = () => {
  const canvaWrapperRef = useRef<{ DomElm: HTMLDivElement, rect: DOMRect | null }>(null);
  const ghostRef = useRef<HTMLImageElement>(null);
  const currentDraggableElm = useRef<HTMLDivElement | null>(null);
  const draggableElmsRef = useRef<DraggableElmObj[]>([]);
  const currentDraggingIndex = useRef<number | null>(null);
  const canvaRef = useRef<CanvasBoardHandle>(null)
  const overLapAreaAllowed = 0.5;
  const [elmCount, setElmCount] = useState(0); // only for rerender

  const [selectedShape, setSelectedShape] = useState<SelectedShape>(null);

  useEffect(() => {
    if (!selectedShape) return;

    const handleMove = (e: MouseEvent) => {
      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate(${e.clientX - (selectedShape.rect?.left || 0) - selectedShape.W / 2}px, ${e.clientY - (selectedShape.rect?.top || 0) - selectedShape.H / 2}px)`;
      }
    };

    const handleUp = () => {
      // setSelectedShape(null);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    window.addEventListener('mousemove', (e) => {
      const parentRect = canvaWrapperRef.current?.rect;
      console.log( 'x : ' + ( e.clientX -  ( parentRect?.left || 0 ) ) + " y: " + ( e.clientY - ( parentRect?.top || 0 ) ) );
    })

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [selectedShape]);

  const handleShapeClick = (shape: SelectedShape) => {
    setSelectedShape(shape);

    window.addEventListener('mouseup', (e) => {
      setSelectedShape(null);
    })
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (selectedShape == null) {
      return;
    }
    addShape(e.clientX, e.clientY);
    updateShapeVertices();
    canvaRef.current?.redrawCanvas();
    setSelectedShape(null);
  };

  const handleDragableMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    currentDraggableElm.current = e.currentTarget;
    currentDraggingIndex.current = index;
    window.addEventListener('mousemove', handleDragableMouseMove);
    window.addEventListener('mouseup', handleDragableMouseUp);
  };

  const handleDragableMouseMove = (e: MouseEvent) => {
    if (
      !currentDraggableElm.current ||
      !canvaWrapperRef.current?.rect ||
      currentDraggingIndex.current === null
    ) {
      return;
    }

    const parentRect = canvaWrapperRef.current.rect;
    const { x: currentLeft, y: currentTop } = draggableElmsRef.current[currentDraggingIndex.current].position;
    const H = draggableElmsRef.current[currentDraggingIndex.current].H;
    const W = draggableElmsRef.current[currentDraggingIndex.current].W;
    const x = Math.max(Math.min(parentRect.right - ((W / 2)), e.clientX), parentRect.left + (W / 2));
    const y = Math.max(Math.min(parentRect.bottom - ((H / 2)), e.clientY), parentRect.top + (H / 2));
    const translateX = x - parentRect.left - currentLeft - (W / 2);
    const translateY = y - parentRect.top - currentTop - (H / 2);

    const actX = draggableElmsRef.current[currentDraggingIndex.current].position.x += translateX;
    const actY = draggableElmsRef.current[currentDraggingIndex.current].position.y += translateY;

    const rotation = draggableElmsRef.current[currentDraggingIndex.current].rotation;
    currentDraggableElm.current.style.transform = `rotate(${rotation}deg)`;
    currentDraggableElm.current.style.left = actX + "px";
    currentDraggableElm.current.style.top = actY + "px";
    canvaRef.current?.redrawCanvas();
  };

  const overLapCheck = (overLapRatio: number, curRect: dumRect | DOMRect) => {
    const check = draggableElmsRef.current.some((otherElm, ind) => {
      if (currentDraggingIndex.current != null && currentDraggingIndex.current === ind) {
        return false;
      }

      const otherRect = {
        left: otherElm.position.x,
        top: otherElm.position.y,
        right: otherElm.position.x + otherElm.W,
        bottom: otherElm.position.y + otherElm.H
      };

      // Calculate overlap bounds
      const overLapLeft = Math.max(otherRect.left, curRect.left);
      const overLapRight = Math.min(otherRect.right, curRect.right);
      const overLapTop = Math.max(otherRect.top, curRect.top);
      const overLapBottom = Math.min(otherRect.bottom, curRect.bottom);

      const overLapW = Math.max(overLapRight - overLapLeft, 0);
      const overLapH = Math.max(overLapBottom - overLapTop, 0);
      const overLapArea = overLapW * overLapH;

      const currArea = curRect.width * curRect.height;

      if (overLapArea === 0) {
        return false; // no overlap
      }

      const overlapRatioValue = overLapArea / currArea;

      // If overlap ratio exceeds threshold, return true
      return overlapRatioValue > overLapRatio;
    });

    return check;
  };

  const snapToClosestVertex = (threshold = 50, spacing = 40) => {
    const index = currentDraggingIndex.current;
    if (index == null) return;

    const current = draggableElmsRef.current[index];
    const currentPoints = current.point ?? [];

    let closestDelta: { dx: number; dy: number; dist: number } | null = null;

    for (const p1 of currentPoints) {
      for (let i = 0; i < draggableElmsRef.current.length; i++) {
        if (i === index) continue;

        const otherPoints = draggableElmsRef.current[i].point ?? [];
        for (const p2 of otherPoints) {
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;

          if (Math.abs(dx) <= threshold && Math.abs(dy) <= threshold) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (!closestDelta || dist < closestDelta.dist) {
              closestDelta = { dx, dy, dist };
            }
          }
        }
      }
    }

    if (closestDelta) {
      // Snap to closest vertex
      const { dx, dy } = closestDelta;
      current.position.x += dx;
      current.position.y += dy;
      current.point = currentPoints.map(p => ({
        x: p.x + dx,
        y: p.y + dy
      }));
    } else {
      // No vertex match — snap center to nearest multiple of spacing
      const centerX = current.position.x + current.W / 2;
      const centerY = current.position.y + current.H / 2;

      const snappedX = Math.round(centerX / spacing) * spacing;
      const snappedY = Math.round(centerY / spacing) * spacing;

      const dx = snappedX - centerX;
      const dy = snappedY - centerY;

      current.position.x += dx;
      current.position.y += dy;
      current.point = currentPoints.map(p => ({
        x: p.x + dx,
        y: p.y + dy
      }));
    }
  };





  const handleDragableMouseUp = () => {
    if (
      !currentDraggableElm.current ||
      !canvaWrapperRef.current?.rect ||
      currentDraggingIndex.current === null
    ) {
      return;
    }

    const draggedIndex = currentDraggingIndex.current;
    const draggedElm = draggableElmsRef.current[draggedIndex];
    const elmRect = currentDraggableElm.current.getBoundingClientRect();
    const parentRect = canvaWrapperRef.current.rect;

    const X = elmRect.left - parentRect.left;
    const Y = elmRect.top - parentRect.top;

    // let tmp = getClosestPoint(X + (elmRect.width / 2), Y + (elmRect.height / 2));
    const newX = X;
    const newY = Y;

    // console.log( "dotted pos x : "  + newX + " y : " + newY + " elmRct x : " + X + " elmrct  y : " + Y  );

    // Update position in ref

    draggedElm.position.x = newX;
    draggedElm.position.y = newY;

    // Check overlap with other elements
    const draggedRect = {
      left: newX,
      top: newY,
      right: newX + draggedElm.W,
      bottom: newY + draggedElm.H,
      width: draggedElm.W,
      height: draggedElm.H,
    };


    if (overLapCheck(overLapAreaAllowed, draggedRect)) {
      // Remove dragged element if overlap detected
      draggableElmsRef.current.splice(draggedIndex, 1);
      setElmCount(c => c + 1);
    }
    snapToClosestVertex();
    currentDraggableElm.current = null;
    currentDraggingIndex.current = null;

    window.removeEventListener('mousemove', handleDragableMouseMove);
    window.removeEventListener('mouseup', handleDragableMouseUp);
    canvaRef.current?.redrawCanvas()
  };

  //   const handleCanvasMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   if (!selectedShape) return;

  //   const wrapperRect = canvaWrapperRef.current?.rect;
  //   const x = e.clientX - (wrapperRect?.left || 0) - ( selectedShape.size / 2 );
  //   const y = e.clientY - (wrapperRect?.top || 0) - ( selectedShape.size / 2 );

  //   const newElm: DraggableElmObj = {
  //     id: ${selectedShape.name}_${Date.now()},
  //     url: selectedShape.url,
  //     shapeName: selectedShape.name,
  //     position: { x, y },
  //     size: selectedShape.size,
  //     rotation: 0
  //   };

  //   draggableElmsRef.current.push(newElm);
  //   setElmCount(count => count + 1);
  //   setSelectedShape(null);
  // };


  const startRotate = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();

    const elm = document.querySelector(`[data-id="${draggableElmsRef.current[index].id}"]`) as HTMLDivElement;
    if (!elm || !canvaWrapperRef.current?.rect) return;

    const parentRect = canvaWrapperRef.current.rect;

    const handleRotate = (ev: MouseEvent) => {
      const rect = elm.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * (180 / Math.PI) + 90;

      if (Math.abs(draggableElmsRef.current[index].rotation - angle) >= 10) {
        const roundedAngle = (Math.round(angle / 10) * 10) % 360;
        elm.style.transform = `rotate(${roundedAngle}deg)`;
        draggableElmsRef.current[index].rotation = roundedAngle;
      }

      canvaRef.current?.redrawCanvas();
    };

    const stopRotate = () => {
      window.removeEventListener('mousemove', handleRotate);
      window.removeEventListener('mouseup', stopRotate);
    };

    window.addEventListener('mousemove', handleRotate);
    window.addEventListener('mouseup', stopRotate);
  };

  const handleDelete = (index: number) => {
    draggableElmsRef.current.splice(index, 1);
    setElmCount(c => c + 1); // trigger rerender
    canvaRef.current?.redrawCanvas();
  };

  const updateShapeVertices = () => {
    if (!currentDraggingIndex.current) {
      return;
    }
    const currShape = draggableElmsRef.current[currentDraggingIndex.current];
    const centerPoint = { x: currShape.position.x + (currShape.W / 2), y: currShape.position.y + (currShape.H / 2) };
    currShape.point = canvaRef.current?.getDrawing()?.getVertices[currShape.shapeName]({ x: centerPoint.x, y: centerPoint.y, height: currShape.shapeH, width: currShape.shapeW, rotation: currShape.rotation });

    return;
  }

  const addShape = function (posX: number, posY: number) {
    if (!selectedShape) return;

    const wrapperRect = canvaWrapperRef.current?.rect;
    const x = posX - (wrapperRect?.left || 0) - (selectedShape.size / 2);
    const y = posY - (wrapperRect?.top || 0) - ((selectedShape.size + 60) / 2);

    const currRect: dumRect = {
      left: x,
      top: y,
      right: x + selectedShape.W,
      bottom: y + selectedShape.H,
      height: selectedShape.H,
      width: selectedShape.W
    }

    if (overLapCheck(overLapAreaAllowed, currRect)) {
      return;
    }

    const newElm: DraggableElmObj = {
      id: `${selectedShape.name}_${Date.now()}`,
      url: selectedShape.url,
      shapeName: selectedShape.name,
      position: { x, y },
      size: selectedShape.size,
      rotation: 0,
      H: (selectedShape.H + 60),
      W: selectedShape.W,
      shapeH: selectedShape.H,
      shapeW: selectedShape.W,
      point: (canvaRef.current?.getDrawing()?.getVertices[selectedShape.name]({ x: x, y: y, rotation: 0, height: selectedShape.H, width: selectedShape.W }))
    };

    draggableElmsRef.current.push(newElm);
    setElmCount(count => count + 1);
  }

  const handleDropShape = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (selectedShape != null) {
      // console.log()
    }
    addShape(e.clientX, e.clientY);
    canvaRef.current?.redrawCanvas()
    setSelectedShape(null);
  }

  return (
    <StyleCmp>
      <ShapeContainer onShapeMouseDown={handleShapeClick} />
      <div
        className="CanvaWrapper"
        ref={(el) => {
          if (el) {
            canvaWrapperRef.current = {
              DomElm: el,
              rect: el.getBoundingClientRect(),
            };
          }
        }}
        onMouseUp={handleCanvasMouseUp}
      // onClick={handleDropShape}
      >
        <CanvasBoard draggableRef={draggableElmsRef} ref={canvaRef} />
        {draggableElmsRef.current.map((obj, index) => (
          <div
            key={obj.id}
            data-id={obj.id}
            className="DragableElmContainer"
            onMouseDown={(e) => handleDragableMouseDown(e, index)}
            style={{
              top: obj.position.y,
              left: obj.position.x,
              position: 'absolute',
              transform: `rotate(${obj.rotation}deg)` // initial render
            }}
          >
            <ControlBar>
              <IconButton onMouseDown={(e) => startRotate(e, index)}>
                <FaArrowsRotate size={22} />
              </IconButton>
            </ControlBar>

            {/* <img
              src={obj.url}
              style={{
                width: `${obj.size}px`,
                height: `${obj.size}px`,
                objectFit: 'contain',
                border: '2px dashed #a99999'
              }}
              draggable={false}
              alt=""
            /> */}

            <div style={{
              width: `${obj.shapeW}px`,
              height: `${obj.shapeH}px`,
              objectFit: 'contain',
              border: '2px dashed #a99999'
            }}
              draggable={false}>
            </div>

            <ControlBar>
              <IconButton onClick={() => handleDelete(index)}>
                <MdDelete size={22} />
              </IconButton>
            </ControlBar>
          </div>
        ))}


      </div>
      <PuzzlePieceCounter />

      {selectedShape && (
        <img
          ref={ghostRef}
          src={selectedShape.url}
          alt="ghost"
          className="ghost-image"
          draggable={false}
          style={{
            position: 'absolute',
            top: selectedShape.rect?.top + 'px',
            left: selectedShape.rect?.left + 'px',
            width: `${selectedShape.size}px`,
            opacity: 0.5,
            pointerEvents: 'none'
          }}
        />
      )}
    </StyleCmp>
  );
};

export default GameBoard;
