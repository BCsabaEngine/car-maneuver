import { Route } from './Route';
import { Vehicle } from './Vehicle';

export const traffic = {
	route: new Route({ x: 0, y: 0, angle: 0 }, [
		{ type: 'line', length: 100 },
		{ type: 'arc', radius: 50, angle: 90 },
		{ type: 'line', length: 100 },
		{ type: 'arc', radius: 50, angle: -90 },
		{ type: 'line', length: 100 },
		{ type: 'arc', radius: 50, angle: 180 },
		{ type: 'line', length: 300 },
		{ type: 'arc', radius: 50, angle: 45 },
		{ type: 'line', length: 100 },
		{ type: 'arc', radius: 50, angle: 45 },
		{ type: 'line', length: 129 },
		{ type: 'arc', radius: 50, angle: 90 },
		{ type: 'line', length: 71 }
	]),
	vehicles: [new Vehicle('car', '#4c4', { maxSpeed: 100, maxAcceleration: 5, maxBreak: 20 })]
};
