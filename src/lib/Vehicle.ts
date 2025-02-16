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
	private targetSpeed = 0;
	private acceleration = 0;

	constructor(
		private carType: VehicleType,
		private color: string,
		private driveParameters: DriveParameters
	) {}

	public getStatus = (): VehicleStatus => ({
		position: Math.trunc(this.position),
		speed: Math.trunc(this.speed),
		targetSpeed: Math.trunc(this.targetSpeed),
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
	public move(
		ahead: { distance: number; speed: number },
		currentCurve: { radius?: number },
		nextCurve: { distance: number; radius: number } | undefined,
		timeScalePercent: number
	) {
		const elapsedSec = ((Date.now() - this.lastMove) / 1000) * (timeScalePercent / 100);
		this.lastMove = Date.now();

		this.position += this.speed * elapsedSec;
		this.speed += this.acceleration * elapsedSec;

		const targetSpeeds = [this.driveParameters.maxSpeed];
		if (ahead.distance < this.speed) targetSpeeds.push(ahead.speed);
		if (currentCurve.radius) targetSpeeds.push(currentCurve.radius, this.speed);
		if (
			nextCurve &&
			nextCurve.distance <
				(this.speed ** 2 - nextCurve.radius ** 2) / (2 * this.driveParameters.maxBreak)
		)
			targetSpeeds.push(nextCurve.radius);

		this.targetSpeed = Math.min(...targetSpeeds);

		if (this.speed === this.targetSpeed) this.hold();
		else if (this.speed < this.targetSpeed)
			this.accelerate(this.speed < this.targetSpeed / 2 ? 1 : 0.75);
		else {
			if (this.speed > this.targetSpeed * 1.05) this.break();
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
