import type { VehicleStatus, VehicleType } from '$types/VehicleTypes';

import { MathMinMax } from './Math';
import { vehicleDescriptors } from './vehicleDescriptors';

type DriveParameters = {
	maxSpeed: number;
	maxAcceleration: number;
	maxBreak: number;
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
		isAccelerating: this.acceleration > 0,
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

		let targetSpeed = this.driveParameters.maxSpeed;
		if (ahead.distance < this.speed) targetSpeed = ahead.speed;
		if (curve.radius) {
			targetSpeed = Math.min(targetSpeed, curve.radius);
			targetSpeed = Math.min(targetSpeed, this.speed);
		}

		if (this.speed === targetSpeed) this.hold();
		else if (this.speed < targetSpeed) this.accelerate(this.speed < targetSpeed / 2 ? 1 : 0.75);
		else {
			if (this.speed > targetSpeed * 1.05) this.break();
			else this.release();
		}
	}

	private accelerate = (ratio = 1) =>
		(this.acceleration = this.driveParameters.maxAcceleration * MathMinMax(ratio, 0, 1));

	private hold = () => (this.acceleration = 0);

	private release = () =>
		(this.acceleration = -vehicleDescriptors[this.carType].engine.breakAcceleration);

	private break = (ratio = 1) =>
		(this.acceleration = -this.driveParameters.maxBreak * MathMinMax(ratio, 0, 1));
}
