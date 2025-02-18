export type RouteStartPoint = {
	x: number;
	y: number;
	angle: number;
};

export type RoutePoint = RouteStartPoint & {
	radius: number;
	nextCurveCw:
		| {
				distance: number;
				radius: number;
		  }
		| undefined;
	nextCurveCcw:
		| {
				distance: number;
				radius: number;
		  }
		| undefined;
};

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
