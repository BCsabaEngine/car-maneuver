import type { CarDescriptor, CarType, VehicleStatus } from '$types/VehicleTypes';

import { MathMinMax } from './Math';

type DriveParameters = {
	maxSpeed: number;
	maxAcceleration: number;
};

const carDescriptors: Record<CarType, CarDescriptor> = {
	car: {
		engineBreakAcceleration: 1
	},
	truck: {
		engineBreakAcceleration: 1
	}
};

export class Vehicle {
	private position = 0;
	private speed = 0;
	private acceleration = 0;

	constructor(
		private carType: CarType,
		private color: string,
		private driveParameters: DriveParameters
	) {}

	public getStatus = (): VehicleStatus => ({
		position: this.position,
		speed: this.speed,
		carType: this.carType,
		carDescriptor: carDescriptors[this.carType],
		color: this.color,
		isBreaking: this.acceleration < -carDescriptors[this.carType].engineBreakAcceleration
	});

	private lastMove = Date.now();
	public move(ahead: { distance: number; speed: number }) {
		const elapsedSec = (Date.now() - this.lastMove) / 1000;
		this.lastMove = Date.now();

		this.position += this.speed * elapsedSec;
		this.speed += this.acceleration * elapsedSec;

		if (ahead.distance < this.speed / 1.5) this.break();
		else if (ahead.distance < this.speed) this.release();
		else if (ahead.distance > this.speed * 1.5) this.accelerate();
	}

	private accelerate = (ratio = 1) =>
		(this.acceleration = this.driveParameters.maxAcceleration * MathMinMax(ratio, 0, 1));

	private release = () =>
		(this.acceleration = -carDescriptors[this.carType].engineBreakAcceleration);

	private break = (ratio = 1) =>
		(this.acceleration = -this.driveParameters.maxAcceleration * MathMinMax(ratio, 0, 1));
}
