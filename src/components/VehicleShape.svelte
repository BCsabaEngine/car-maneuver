<script lang="ts">
	import { Shape } from 'svelte-konva';

	import { DegToRad } from '$lib/Math';
	import type { DrawingData } from '$types/VehicleTypes';

	import { ROAD_LANE_WIDTH_METER, WORLD_PIXEL_PER_METER } from '../config/world';

	interface Properties {
		drawingData: DrawingData;
	}

	const { drawingData }: Properties = $props();
</script>

<Shape
	scaleX={WORLD_PIXEL_PER_METER}
	scaleY={WORLD_PIXEL_PER_METER}
	x={(drawingData.point.x +
		(ROAD_LANE_WIDTH_METER / 2) *
			Math.cos(DegToRad(drawingData.point.angle + (drawingData.lane === 'cw' ? 90 : -90)))) *
		WORLD_PIXEL_PER_METER}
	y={(drawingData.point.y +
		(ROAD_LANE_WIDTH_METER / 2) *
			Math.sin(DegToRad(drawingData.point.angle + (drawingData.lane === 'cw' ? 90 : -90)))) *
		WORLD_PIXEL_PER_METER}
	rotation={drawingData.point.angle}
	sceneFunc={(context) => {
		context.beginPath();
		context.moveTo(-drawingData.carDescriptor.shape.length / 2, 0);
		context.lineTo(drawingData.carDescriptor.shape.length / 2, 0);
		context.lineWidth = drawingData.carDescriptor.shape.width;
		context.strokeStyle = drawingData.color;
		context.stroke();
		if (drawingData.isBreaking) {
			context.beginPath();
			context.moveTo(
				((drawingData.lane === 'cw' ? -1 : 1) * drawingData.carDescriptor.shape.length) / 2,
				0
			);
			context.lineTo(
				((drawingData.lane === 'cw' ? -1 : 1) * drawingData.carDescriptor.shape.length) / 2 + 2,
				0
			);
			context.lineWidth = drawingData.carDescriptor.shape.width;
			context.strokeStyle = 'red';
			context.stroke();
		}
	}}
/>
