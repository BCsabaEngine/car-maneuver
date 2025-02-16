import type { RoutePoint } from './RouteTypes';

export type VehicleType = 'car' | 'truck';

export type VehicleDescriptor = {
	engine: {
		breakAcceleration: number;
	};
	shape: {
		width: number;
		length: number;
	};
};

export type VehicleStatus = {
	position: number;
	speed: number;
	carType: VehicleType;
	carDescriptor: VehicleDescriptor;
	color: string;
	isAccelerating: boolean;
	isBreaking: boolean;
};

export type DrawingData = Omit<VehicleStatus, 'position'> & {
	point: RoutePoint;
};
