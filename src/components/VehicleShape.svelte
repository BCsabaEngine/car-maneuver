<script lang="ts">
	import { Shape } from 'svelte-konva';

	import type { DrawingData, Vehicle } from '$lib/Vehicle';
	import type { Point } from '$types/Path';

	interface Properties {
		offset: { x: number; y: number };
		drawingData: DrawingData;
		point: Point;
		pixelPerMeter: number;
	}

	const { offset, drawingData, point, pixelPerMeter }: Properties = $props();
</script>

<Shape
	scaleX={pixelPerMeter}
	scaleY={pixelPerMeter}
	x={point.x}
	y={point.y}
	rotation={point.angle}
	sceneFunc={(context) => {
		context.beginPath();
		context.moveTo(-7, 0);
		context.lineTo(3, 0);
		context.lineWidth = 2.5;
		context.strokeStyle = drawingData.color;
		context.stroke();
	}}
/>
