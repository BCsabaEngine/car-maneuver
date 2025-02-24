import { Route } from '../lib/Route';
import { Vehicle } from '../lib/Vehicle';

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
		{ type: 'line', length: 20 },
		{ type: 'arc', radius: 30, angle: 90 },
		{ type: 'line', length: 130 },
		{ type: 'arc', radius: 30, angle: 90 },
		{ type: 'arc', radius: 20, angle: -180 },
		{ type: 'line', length: 80 },
		{ type: 'arc', radius: 20, angle: -180 },
		{ type: 'arc', radius: 30, angle: 180 },
		{ type: 'arc', radius: 50, angle: 55 },
		{ type: 'line', length: 28.3 },
		{ type: 'arc', radius: 50, angle: 45 },
		{ type: 'arc', radius: 70, angle: 45 },
		{ type: 'line', length: 10.2 }
	]),
	vehicles: [
		new Vehicle('cw', 'car', 'green', { maxSpeed: 100, maxAcceleration: 15, maxBreak: 25 }, 20),
		new Vehicle('cw', 'car', 'blue', { maxSpeed: 60, maxAcceleration: 20, maxBreak: 20 }, 10),
		new Vehicle('cw', 'truck', 'orange', { maxSpeed: 80, maxAcceleration: 15, maxBreak: 20 }, 0),

		new Vehicle('ccw', 'car', 'pink', { maxSpeed: 110, maxAcceleration: 20, maxBreak: 20 }, -40),
		new Vehicle(
			'ccw',
			'truck',
			'purple',
			{ maxSpeed: 100, maxAcceleration: 10, maxBreak: 20 },
			-20
		),
		new Vehicle('ccw', 'bus', 'teal', { maxSpeed: 100, maxAcceleration: 10, maxBreak: 20 }, 0)
	]
};
