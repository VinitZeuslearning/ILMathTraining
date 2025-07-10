export type ShapeName = 'hexagon' | 'parallelogram' | 'rhombus' | 'square' | 'triangle';

type ShapesUrl = {
    [key in ShapeName]: {url: string, size: number};
};


const shapesUrl: ShapesUrl = {
    hexagon: {
        url: "/pb_s5/hexagon_active.svg",
        size: 150
    },
    parallelogram: {
        url: "/pb_s5/paralellogram_active.svg",
        size: 120
    },
    rhombus: { 
        url : "/pb_s5/rhombus-_active.svg",
        size : 120,
    },
    square: { 
        url : "/pb_s5/square_active.svg",
        size : 100,
    },
    triangle: {
        url: "/pb_s5/triangle-_active.svg",
        size : 120
    }
};

export default shapesUrl;
