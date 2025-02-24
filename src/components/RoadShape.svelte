<script lang="ts">
	import { Shape } from 'svelte-konva';

	import { DegToRad } from '$lib/Math';
	import type { Route } from '$lib/Route';

	import {
		ROAD_DIVIDING_LINE_LENGTH_PX,
		ROAD_DIVIDING_LINE_WIDTH_PX,
		ROAD_LANE_WIDTH_METER,
		ROAD_MARGIN_WIDTH_PX,
		WORLD_PIXEL_PER_METER
	} from '../config/world';

	interface Properties {
		route: Route;
		showPath?: boolean;
	}

	const { route, showPath = false }: Properties = $props();
</script>

<Shape
	scaleX={WORLD_PIXEL_PER_METER}
	scaleY={WORLD_PIXEL_PER_METER}
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
			switch (part) {
				case 'border': {
					context.lineWidth = ROAD_LANE_WIDTH_METER * 2 + ROAD_MARGIN_WIDTH_PX * 2;
					break;
				}

				case 'road': {
					context.lineWidth = ROAD_LANE_WIDTH_METER * 2;
					break;
				}

				default: {
					context.lineWidth = ROAD_DIVIDING_LINE_WIDTH_PX;
					break;
				}
			}
			context.strokeStyle = part === 'border' ? '#ccc' : (part === 'road' ? '#888' : '#fff');
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
		context.setLineDash([ROAD_DIVIDING_LINE_LENGTH_PX]);
		context.lineWidth = ROAD_DIVIDING_LINE_WIDTH_PX;
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
