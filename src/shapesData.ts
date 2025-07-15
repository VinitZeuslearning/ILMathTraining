export type ShapeName = 'hexagon' | 'parallelogram' | 'rhombus' | 'square' | 'triangle' ;

type ShapesUrl = {
    [key in ShapeName]: {url: string, size: number};
};


const shapesUrl: ShapesUrl = {
    hexagon: {
        url: "/Croped/hexagon_active.png",
        size: 160
    },
    parallelogram: {
        url: "/Croped/paralellogram_active.png",
        size: 80
    },
    rhombus: { 
        url : "/Croped/rhombus-_active.png",
        size : 80,
    },
    square: { 
        url : "/Croped/square_active.png",
        size : 80,
    },
    triangle: {
        url: "/Croped/triangle-_active.png",
        size : 160
    },
    // trapezium: {
    //     url: "/trapezium-_active.png",
    //     size : 120
    // }
};

export default shapesUrl;
