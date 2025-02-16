import { Route } from './Route';
import { Vehicle } from './Vehicle';

export const traffic = {
	route: new Route({ x: 0, y: 0, angle: 0 }, [
		{ type: 'line', length: 100 },
		{ type: 'arc', radius: 50, angle: 100 },
		{ type: 'line', length: 100 },
		{ type: 'arc', radius: 40, angle: -110 },
		{ type: 'line', length: 100 },
		{ type: 'arc', radius: 30, angle: 180 },
		{ type: 'line', length: 300 },
		{ type: 'arc', radius: 50, angle: 45 },
		{ type: 'line', length: 10 },
		{ type: 'arc', radius: 30, angle: 180 },
		{ type: 'arc', radius: 20, angle: -180 },
		{ type: 'line', length: 80 },
		{ type: 'arc', radius: 20, angle: -180 },
		{ type: 'arc', radius: 30, angle: 180 },
		{ type: 'arc', radius: 50, angle: 75 },
		{ type: 'line', length: 50 },
		{ type: 'arc', radius: 50, angle: -20 },
		{ type: 'line', length: 59.5 },

		{ type: 'arc', radius: 50, angle: 45 },
		{ type: 'arc', radius: 70, angle: 45 },

		{ type: 'line', length: 54 }
	]),
	vehicles: [
		new Vehicle('car', '#4c4', { maxSpeed: 100, maxAcceleration: 15, maxBreak: 25 }, 20),
		new Vehicle('car', '#44c', { maxSpeed: 60, maxAcceleration: 20, maxBreak: 20 }, 10),
		new Vehicle('car', '#c4c', { maxSpeed: 80, maxAcceleration: 15, maxBreak: 20 }, 0)
	]
};
