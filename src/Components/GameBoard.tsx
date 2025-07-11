import React, { useEffect, useRef, useState } from 'react';
import CanvasBoard from './CanvaBoard';
import type { CanvasBoardHandle } from './CanvaBoard';
import styled from 'styled-components';
import ShapeContainer from './ShapeContainer';
import PuzzlePieceCounter from './PuzzlePieceCounter';
import { MdDelete } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";

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

interface DraggableElmObj {
  id: string;
  url: string;
  shapeName: string;
  position: { x: number; y: number };
  size: number;
  rotation: number;
}

interface dumRect { left: number , right: number, top: number, bottom: number, height: number, width: number}


const GameBoard: React.FC = () => {
  const canvasRef = useRef<CanvasBoardHandle>(null);
  const canvaWrapperRef = useRef<{ DomElm: HTMLDivElement, rect: DOMRect | null }>(null);
  const ghostRef = useRef<HTMLImageElement>(null);
  const currentDraggableElm = useRef<HTMLDivElement | null>(null);
  const draggableElmsRef = useRef<DraggableElmObj[]>([]);
  const currentDraggingIndex = useRef<number | null>(null);
  const overLapAreaAllowed = 0.5;
  const [elmCount, setElmCount] = useState(0); // only for rerender

  const [selectedShape, setSelectedShape] = useState<{ name: string; url: string; size: number, rect: DOMRect | null } | null>(null);

  useEffect(() => {
    if (!selectedShape) return;

    const handleMove = (e: MouseEvent) => {
      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate(${e.clientX - (selectedShape.rect?.left || 0) - selectedShape.size / 2}px, ${e.clientY - (selectedShape.rect?.top || 0) - selectedShape.size / 2}px)`;
      }
    };

    const handleUp = () => {
      setSelectedShape(null);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [selectedShape]);

  const handleShapeClick = (shape: { name: string; url: string, size: number, rect: DOMRect | null } | null) => {
    setSelectedShape(shape);
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!selectedShape) return;

    const wrapperRect = canvaWrapperRef.current?.rect;
    const x = e.clientX - (wrapperRect?.left || 0) - (selectedShape.size / 2);
    const y = e.clientY - (wrapperRect?.top || 0) - (selectedShape.size / 2);

    const currRect : dumRect = {
      left: x ,
      top: y,
      right: x + selectedShape.size,
      bottom: y + selectedShape.size,
      height: selectedShape.size,
      width: selectedShape.size
    }

    if ( overLapCheck( overLapAreaAllowed, currRect ) ) {
      return;
    }

    const newElm: DraggableElmObj = {
      id: `${selectedShape.name}_${Date.now()}`,
      url: selectedShape.url,
      shapeName: selectedShape.name,
      position: { x, y },
      size: selectedShape.size,
      rotation: 0
    };

    draggableElmsRef.current.push(newElm);
    setElmCount(count => count + 1);
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
    const size = draggableElmsRef.current[currentDraggingIndex.current].size;
    const x = Math.max(Math.min(parentRect.right - (size / 2), e.clientX), parentRect.left + (size / 2));
    const y = Math.max(Math.min(parentRect.bottom - ((size / 2) + 60), e.clientY), parentRect.top + (size / 2));
    const translateX = x - parentRect.left - currentLeft - (size / 2);
    const translateY = y - parentRect.top - currentTop - (size / 2);

    const rotation = draggableElmsRef.current[currentDraggingIndex.current].rotation;
    currentDraggableElm.current.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;

  };

  const overLapCheck = (  overLapRatio : number , curRect : dumRect | DOMRect ) => {
    const check = draggableElmsRef.current.some( ( otherElm , ind ) => {
      if ( currentDraggingIndex.current != null && currentDraggingIndex.current == ind ) {
        return false;
      }
      const otherRect = {
        left: otherElm.position.x,
        top: otherElm.position.y,
        right : otherElm.position.x + otherElm.size,
        bottom: otherElm.position.y + otherElm.size
      }

      const overLapLeft = Math.max( otherRect.left, curRect.left )
      const overLapRight = Math.min( otherRect.right, curRect.right )
      const overLapTop = Math.max( otherRect.top, curRect.top )
      const overLapBottom = Math.min( otherRect.bottom, curRect.bottom );

      const overLapW = overLapRight - overLapLeft;
      const overLapH = overLapBottom - overLapTop;
      const overLapArea = overLapW * overLapH;
      const currArea = curRect.height * curRect.width;
      return (currArea / overLapArea ) > overLapRatio;
    } )

    return check;
  }

//   const overLapCheck = (overLapRatio: number) => {
//   if (currentDraggingIndex.current == null) return false;

//   const currelmObj = draggableElmsRef.current[currentDraggingIndex.current];
//   const curRect = {
//     left: currelmObj.position.x,
//     top: currelmObj.position.y,
//     bottom: currelmObj.position.y + currelmObj.size,
//     right: currelmObj.position.x + currelmObj.size,
//   };

//   return draggableElmsRef.current.some((otherElm, ind) => {
//     // Skip comparing with itself
//     if (ind === currentDraggingIndex.current) return false;

//     const otherRect = {
//       left: otherElm.position.x,
//       top: otherElm.position.y,
//       right: otherElm.position.x + otherElm.size,
//       bottom: otherElm.position.y + otherElm.size,
//     };

//     const overLapLeft = Math.max(otherRect.left, curRect.left);
//     const overLapRight = Math.min(otherRect.right, curRect.right);
//     const overLapTop = Math.max(otherRect.top, curRect.top);
//     const overLapBottom = Math.min(otherRect.bottom, curRect.bottom);

//     const overLapW = overLapRight - overLapLeft;
//     const overLapH = overLapBottom - overLapTop;

//     if (overLapW > 0 && overLapH > 0) {
//       const overLapArea = overLapW * overLapH;
//       const currArea = currelmObj.size * currelmObj.size;

//       // If overlap area >= allowed threshold — remove and return true
//       if (overLapArea / currArea >= overLapRatio) {
//         draggableElmsRef.current.splice(currentDraggingIndex.current, 1);
//         return true;
//       }
//     }

//     return false;
//   });
// };


  const handleDragableMouseUp = ( ) => {
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

    const newX = elmRect.left - parentRect.left;
    const newY = elmRect.top - parentRect.top;

    // Update position in ref
    draggedElm.position.x = newX;
    draggedElm.position.y = newY;

    // Check overlap with other elements
    const draggedRect = {
      left: newX,
      top: newY,
      right: newX + draggedElm.size,
      bottom: newY + draggedElm.size,
      width: draggedElm.size,
      height: draggedElm.size,
    };
    

    if (  overLapCheck( overLapAreaAllowed, draggedRect ) ) {
      // Remove dragged element if overlap detected
      draggableElmsRef.current.splice(draggedIndex, 1);
      setElmCount(c => c + 1);
    } else {
      // Set final position and reset transform
      const rotation = draggedElm.rotation;
      currentDraggableElm.current.style.top = `${newY}px`;
      currentDraggableElm.current.style.left = `${newX}px`;
      currentDraggableElm.current.style.transform = `translate(0, 0) rotate(${rotation}deg)`;
    }

    // Cleanup
    currentDraggableElm.current = null;
    currentDraggingIndex.current = null;

    window.removeEventListener('mousemove', handleDragableMouseMove);
    window.removeEventListener('mouseup', handleDragableMouseUp);
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
        elm.style.transform = `rotate(${angle}deg)`;
        draggableElmsRef.current[index].rotation = angle;
      }
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
  };



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
      >
        <CanvasBoard ref={canvasRef} />
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

            <img
              src={obj.url}
              style={{
                width: `${obj.size}px`,
                height: `${obj.size}px`,
                objectFit: 'contain',
                border: '2px dashed #a99999'
              }}
              draggable={false}
              alt=""
            />

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
            height: `${selectedShape.size}px`,
            opacity: 0.5,
            pointerEvents: 'none'
          }}
        />
      )}
    </StyleCmp>
  );
};

export default GameBoard;
