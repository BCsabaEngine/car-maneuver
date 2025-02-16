<script lang="ts">
	import { Shape } from 'svelte-konva';

	import type { DrawingData } from '$types/VehicleTypes';

	interface Properties {
		drawingData: DrawingData;
		pixelPerMeter: number;
	}

	const { drawingData, pixelPerMeter }: Properties = $props();
</script>

<Shape
	scaleX={pixelPerMeter}
	scaleY={pixelPerMeter}
	x={drawingData.point.x * pixelPerMeter}
	y={drawingData.point.y * pixelPerMeter}
	rotation={drawingData.point.angle}
	sceneFunc={(context) => {
		context.beginPath();
		context.moveTo(-7, 0);
		context.lineTo(3, 0);
		context.lineWidth = 2.5;
		context.strokeStyle = drawingData.color;
		context.stroke();
	}}
/>
