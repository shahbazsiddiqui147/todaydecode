declare module 'react-simple-maps' {
    import * as React from 'react';

    export interface ComposableMapProps {
        width?: number;
        height?: number;
        projection?: string | Function;
        projectionConfig?: any;
        className?: string;
        children?: React.ReactNode;
    }

    export interface GeographiesProps {
        geography?: string | object | string[];
        children?: (data: { geographies: any[] }) => React.ReactNode;
    }

    export interface GeographyProps {
        geography?: any;
        onMouseEnter?: (event: React.MouseEvent) => void;
        onMouseLeave?: (event: React.MouseEvent) => void;
        onMouseDown?: (event: React.MouseEvent) => void;
        onMouseUp?: (event: React.MouseEvent) => void;
        onFocus?: (event: React.FocusEvent) => void;
        onBlur?: (event: React.FocusEvent) => void;
        style?: {
            default?: React.CSSProperties;
            hover?: React.CSSProperties;
            pressed?: React.CSSProperties;
        };
        className?: string;
    }

    export interface ZoomableGroupProps {
        center?: [number, number];
        zoom?: number;
        minZoom?: number;
        maxZoom?: number;
        onMoveStart?: (event: any, position: any) => void;
        onMoveEnd?: (event: any, position: any) => void;
        children?: React.ReactNode;
        className?: string;
    }

    export const ComposableMap: React.FC<ComposableMapProps>;
    export const Geographies: React.FC<GeographiesProps>;
    export const Geography: React.FC<GeographyProps>;
    export const ZoomableGroup: React.FC<ZoomableGroupProps>;
    export const Sphere: React.FC<any>;
    export const Graticule: React.FC<any>;
    export const Marker: React.FC<any>;
    export const Annotation: React.FC<any>;
}
