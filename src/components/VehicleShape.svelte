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
		context.moveTo(-drawingData.carDescriptor.shape.length / 2, 0);
		context.lineTo(drawingData.carDescriptor.shape.length / 2, 0);
		context.lineWidth = drawingData.carDescriptor.shape.width;
		context.strokeStyle = drawingData.color;
		context.stroke();
	}}
/>
