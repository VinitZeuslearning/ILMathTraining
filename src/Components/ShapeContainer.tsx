import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import DragableElms from './DragableElms';
// Outer container (if needed)
const Container = styled.div`
  grid-gap: 16px;
  height: 100%;
  width: 100%;

  .imgContinaer {
    display: flex;
    align-items: center;
  }
  .svgImgs {
     object-fit: contain;
  }
`;

// Grid for shapes
const ShapeGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end; /* or center / space-around / space-between */
  gap: 24px;
`;

const svgUrls = {
  hexagon : '/pb_s5/hexagon_active.svg',
  parallelogram : '/pb_s5/paralellogram_active.svg',
  rhombus :  '/pb_s5/rhombus-_active.svg',
  square : '/pb_s5/square_active.svg',
  trapezium : '/pb_s5/trapezium-_active.svg',
  triangle : '/pb_s5/triangle-_active.svg'
}

const ShapeContainer: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const shapes = [
    { name: 'hexagon-1', url: '/pb_s5/hexagon_active.svg' },
    { name: 'parallelogram-1', url: '/pb_s5/paralellogram_active.svg' },
    { name: 'rhombus', url: '/pb_s5/rhombus-_active.svg' },
    { name: 'square', url: '/pb_s5/square_active.svg' },
    { name: 'trapezium', url: '/pb_s5/trapezium-_active.svg' },
    { name: 'triangle', url: '/pb_s5/triangle-_active.svg' },
  ];

  const elms = document.getElementsByClassName('svgImgs');
  
  Array.from(elms).forEach((el) => {
    el.addEventListener('mouseDown', () => {
      
    });
  });

  return (
    <Container>
      <ShapeGrid>
        <div className='imgContinaer'>
          <img src='/pb_s5/hexagon_active.svg' className='svgImgs'  data-shapeName="hexagon" />
        </div>
        <div className='imgContinaer' >
          <img src='/pb_s5/paralellogram_active.svg' className='svgImgs' data-shapeName="paralellogram" />
          <img src='/pb_s5/rhombus-_active.svg' className='svgImgs' data-shapeName="rhombus" />
        </div>
        <div className='imgContinaer' >
          <img src='/pb_s5/square_active.svg' className='svgImgs' data-shapeName="square" />
          <img src='/pb_s5/trapezium-_active.svg' className='svgImgs' data-shapeName="trapezium" />
        </div>
        <div className='imgContinaer' >
          <img src='/pb_s5/triangle-_active.svg' className='svgImgs' data-shapeName="triangle" />
        </div>

        <DragableElms imageUrl='/pb_s5/hexagon_active.svg'>

        </DragableElms>
      </ShapeGrid>
    </Container>
  );
};

export default ShapeContainer;
