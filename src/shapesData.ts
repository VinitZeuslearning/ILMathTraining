export type ShapeName = 'hexagon' | 'parallelogram' | 'rhombus' | 'square' | 'triangle';

type ShapesUrl = {
    [key in ShapeName]: {url: string, size: number};
};


const shapesUrl: ShapesUrl = {
    hexagon: {
        url: "/hexagon_active.png",
        size: 150
    },
    parallelogram: {
        url: "/paralellogram_active.png",
        size: 120
    },
    rhombus: { 
        url : "/rhombus-_active.png",
        size : 120,
    },
    square: { 
        url : "/square_active.png",
        size : 100,
    },
    triangle: {
        url: "/triangle-_active.png",
        size : 120
    }
};

export default shapesUrl;
