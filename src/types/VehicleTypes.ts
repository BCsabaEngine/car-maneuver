import type { RoutePoint } from './RouteTypes';

export type CarType = 'car' | 'truck';

export type CarDescriptor = {
	engineBreakAcceleration: number;
};

export type VehicleStatus = {
	position: number;
	speed: number;
	carType: CarType;
	carDescriptor: CarDescriptor;
	color: string;
	isBreaking: boolean;
};

export type DrawingData = Omit<VehicleStatus, 'position'> & {
	point: RoutePoint;
};
