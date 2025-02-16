export const MathMax = (values: number[]): number => {
	if (values.length === 0) return 0;
	let result = values[0];
	for (const value of values) if (result < value) result = value;
	return result;
};

export const MathMinMax = (value: number, min: number, max: number) =>
	Math.max(Math.min(value, max), min);

export const DegToRad = (deg: number) => (deg * Math.PI) / 180;
export const RadToDeg = (rad: number) => (rad * 180) / Math.PI;
