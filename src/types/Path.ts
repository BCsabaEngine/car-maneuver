export interface Point {
	x: number;
	y: number;
	angle: number; // Absolute direction in degrees
}

export interface PathSegment {
	type: 'line' | 'arc';
}

export interface LineSegment extends PathSegment {
	type: 'line';
	length: number;
}

export interface ArcSegment extends PathSegment {
	type: 'arc';
	radius: number;
	angle: number; // Angle in degrees (positive = counterclockwise, negative = clockwise)
}

export type Path = (LineSegment | ArcSegment)[];
