import type { VehicleStatus, VehicleType } from '$types/VehicleTypes';

import { MathMinMax } from './Math';
import { vehicleDescriptors } from './vehicleDescriptors';

type DriveParameters = {
	maxSpeed: number;
	maxAcceleration: number;
};

export class Vehicle {
	private position = 0;
	private speed = 0;
	private acceleration = 0;

	constructor(
		private carType: VehicleType,
		private color: string,
		private driveParameters: DriveParameters
	) {}

	public getStatus = (): VehicleStatus => ({
		position: Math.trunc(this.position),
		speed: Math.trunc(this.speed),
		carType: this.carType,
		carDescriptor: vehicleDescriptors[this.carType],
		color: this.color,
		isBreaking: this.acceleration < -vehicleDescriptors[this.carType].engine.breakAcceleration
	});

	public reset() {
		this.position = 0;
		this.speed = 0;
		this.acceleration = 0;
	}

	private lastMove = Date.now();
	public move(ahead: { distance: number; speed: number }, curve: { radius?: number }) {
		const elapsedSec = (Date.now() - this.lastMove) / 1000;
		this.lastMove = Date.now();

		this.position += this.speed * elapsedSec;
		this.speed += this.acceleration * elapsedSec;

		//let targetSpeed = this.driveParameters.maxSpeed;

		if (ahead.distance < this.speed / 1.5) this.break();
		else if (ahead.distance < this.speed) this.release();
		else if (ahead.distance > this.speed * 1.5) this.accelerate();
	}

	private accelerate = (ratio = 1) =>
		(this.acceleration = this.driveParameters.maxAcceleration * MathMinMax(ratio, 0, 1));

	private release = () =>
		(this.acceleration = -vehicleDescriptors[this.carType].engine.breakAcceleration);

	private break = (ratio = 1) =>
		(this.acceleration = -this.driveParameters.maxAcceleration * MathMinMax(ratio, 0, 1));
}
