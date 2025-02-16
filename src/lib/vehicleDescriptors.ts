import type { VehicleDescriptor, VehicleType } from '$types/VehicleTypes';

export const vehicleDescriptors: Record<VehicleType, VehicleDescriptor> = {
	car: {
		engine: {
			breakAcceleration: 1
		},
		shape: {
			width: 2.5,
			length: 5
		}
	},
	truck: {
		engine: {
			breakAcceleration: 1
		},
		shape: {
			width: 3.5,
			length: 9
		}
	}
};
