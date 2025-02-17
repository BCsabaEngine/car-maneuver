<script lang="ts">
	import { Shape } from 'svelte-konva';

	import { DegToRad } from '$lib/Math';
	import type { Route } from '$lib/Route';

	const LANEWIDTH_METER = 7;
	const BORDERWIDTH_PX = 2;
	const LINEWIDTH_PX = 1;
	const LINELENGTH_PX = 4;

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
		for (const part of ['border', 'road', 'line']) {
			context.beginPath();
			for (const element of elementsToDraw) {
				switch (element.type) {
					case 'move': {
						context.moveTo(element.x, element.y);
						break;
					}
					case 'line': {
						context.lineTo(element.x, element.y);
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
			context.lineWidth =
				part === 'border'
					? LANEWIDTH_METER * 2 + BORDERWIDTH_PX * 2
					: part === 'road'
						? LANEWIDTH_METER * 2
						: LINEWIDTH_PX;
			context.strokeStyle = part === 'border' ? '#ccc' : part === 'road' ? '#888' : '#fff';
			context.stroke();
		}

		context.beginPath();
		for (const element of elementsToDraw) {
			switch (element.type) {
				case 'move': {
					context.moveTo(element.x, element.y);
					break;
				}
				case 'line': {
					context.lineTo(element.x, element.y);
					break;
				}
			}
		}
		context.setLineDash([LINELENGTH_PX]);
		context.lineWidth = LINEWIDTH_PX;
		context.strokeStyle = '#888';
		context.stroke();

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
