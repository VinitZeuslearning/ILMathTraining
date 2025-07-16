export type ShapeName = 'hexagon' | 'parallelogram' | 'rhombus' | 'square' | 'triangle' | 'trapezium';

export type ShapeMeta = {
    url: string, size: number, H: number, W: number
}

type ShapesUrl = {
    [key in ShapeName]: ShapeMeta;
};


type style = {
    color: string,
    fill: boolean,
    border_siz: number,
    border_color: string
}


const shapesUrl: ShapesUrl = {
    hexagon: {
        url: "/Croped/hexagon_active.png",
        size: 160,
        H: 140,
        W: 160
    },
    parallelogram: {
        url: "/Croped/paralellogram_active.png",
        size: 40,
        H: 40,
        W: 145
    },
    rhombus: {
        url: "/Croped/rhombus-_active.png",
        size: 50,
        H: 50,
        W: 85
    },
    square: {
        url: "/Croped/square_active.png",
        size: 51,
        H: 80,
        W: 80,
    },
    triangle: {
        url: "/Croped/triangle-_active.png",
        size: 64,
        W: 80,
        H: 70
    },
    trapezium: {
        url: "/Croped/trapezium-_active.png",
        size: 55,
        H: 55,
        W: 128
    }
};



export const defaultStyle = {
    hexagon: {
        color: 'yellow',
        fill: true,
        border_color: 'orange',
        border_siz: 2
    },
    parallelogram: {
        color: 'yellow',
        fill: true,
        border_color: 'orange',
        border_siz: 2
    },
    rhombus: {
        color: 'yellow',
        fill: true,
        border_color: 'orange',
        border_siz: 2
    },
    triangle: {
        color: 'yellow',
        fill: true,
        border_color: 'orange',
        border_siz: 2
    },
    trapezium: {
        color: 'yellow',
        fill: true,
        border_color: 'orange',
        border_siz: 2
    },
    square: {
        color: 'yellow',
        fill: true,
        border_color: 'orange',
        border_siz: 2
    }
} as Record<ShapeName, style>

export default shapesUrl;
