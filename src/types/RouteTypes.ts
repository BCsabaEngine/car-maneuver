export interface RoutePoint {
	x: number;
	y: number;
	angle: number;
}

export type RoutePath =
	| {
			type: 'line';
			length: number;
	  }
	| {
			type: 'arc';
			radius: number;
			angle: number;
	  };
