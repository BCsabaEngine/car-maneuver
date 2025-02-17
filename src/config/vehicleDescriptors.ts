import type { VehicleDescriptor, VehicleType } from '$types/VehicleTypes';

export const vehicleDescriptors: Record<VehicleType, VehicleDescriptor> = {
	car: {
		engine: {
			breakAcceleration: 1
		},
		shape: {
			width: 4,
			length: 6
		}
	},
	truck: {
		engine: {
			breakAcceleration: 1
		},
		shape: {
			width: 5,
			length: 9
		}
	}
};
