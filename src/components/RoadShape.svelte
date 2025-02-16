<script lang="ts">
	import { Shape } from 'svelte-konva';

	import { DegToRad } from '$lib/Math';
	import type { Route } from '$lib/Route';

	const ROADWIDTH_METER = 10;
	const ROADBORDER_PX = 2;

	interface Properties {
		route: Route;
		pixelPerMeter: number;
		showPath?: boolean;
	}

	const { route, pixelPerMeter, showPath = false }: Properties = $props();
</script>

<Shape
	scaleX={pixelPerMeter}
	scaleY={pixelPerMeter}
	width={route.box.width}
	height={route.box.height}
	sceneFunc={(context) => {
		const elementsToDraw = route.elementToDraw;
		for (const part of ['border', 'road']) {
			context.beginPath();
			for (const element of elementsToDraw) {
				switch (element.type) {
					case 'line': {
						context.lineTo(element.x, element.y);
						break;
					}
					case 'move': {
						context.moveTo(element.x, element.y);
						break;
					}
					case 'arc': {
						context.arc(
							element.cx,
							element.cy,
							element.radius,
							element.startAngleRad,
							element.endAngleRad,
							element.anticlockwise
						);
						break;
					}
				}
			}
			context.lineWidth = part === 'border' ? ROADWIDTH_METER + ROADBORDER_PX * 2 : ROADWIDTH_METER;
			context.strokeStyle = part === 'border' ? '#ccc' : '#888';
			context.stroke();
		}
		if (showPath)
			for (let d = 0; d < route.pathLength; d++) {
				const p = route.getPathPoint(d);
				context.beginPath();
				context.arc(p.x, p.y, 1, 0, DegToRad(360), false);
				context.fillStyle = '#f00';
				context.fill();
			}
	}}
/>
