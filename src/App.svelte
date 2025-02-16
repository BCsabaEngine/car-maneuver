<script lang="ts">
	import './app.postcss';

	import { SvelteMap } from 'svelte/reactivity';
	import { Layer, Rect, Stage } from 'svelte-konva';

	import RoadShape from '$components/RoadShape.svelte';
	import VehicleShape from '$components/VehicleShape.svelte';
	import ZoomRange from '$components/ZoomRange.svelte';
	import { traffic } from '$lib/traffic';
	import type { Vehicle } from '$lib/Vehicle';
	import type { DrawingData } from '$types/VehicleTypes';

	const PIXEL_PER_METER = 2;

	const box = traffic.route.box;
	const pathLength = traffic.route.pathLength;

	let zoom = $state(100);

	const positions: Map<Vehicle, DrawingData> = new SvelteMap();

	setInterval(() => {
		for (const vehicle of traffic.vehicles) {
			vehicle.move({ distance: 100, speed: 100 });
			const status = vehicle.getStatus();
			positions.set(vehicle, {
				...status,
				point: traffic.route.getPathPoint(status.position)
			});
		}
	}, 10);
</script>

<div class="flex justify-center my-4">
	<ZoomRange class="w-2/5" bind:value={zoom} min={10} max={300} step={10} />
</div>
<div class="flex justify-center my-4">
	{pathLength} m in {box.width} x {box.height} m
</div>
<div class="flex justify-center">
	<Stage
		width={PIXEL_PER_METER * box.width * (zoom / 100)}
		height={PIXEL_PER_METER * box.height * (zoom / 100)}
		scaleX={zoom / 100}
		scaleY={zoom / 100}
		offsetX={PIXEL_PER_METER * box.offsetX}
		offsetY={PIXEL_PER_METER * box.offsetY}
	>
		<Layer>
			<Rect
				id="background"
				x={PIXEL_PER_METER * box.offsetX}
				y={PIXEL_PER_METER * box.offsetY}
				width={PIXEL_PER_METER * box.width}
				height={PIXEL_PER_METER * box.height}
				fill="#7a7"
				stroke="#888"
			/>
			<RoadShape route={traffic.route} pixelPerMeter={PIXEL_PER_METER} />
			{#each positions.values() as drawingData}
				<VehicleShape {drawingData} pixelPerMeter={PIXEL_PER_METER} />
			{/each}
		</Layer>
	</Stage>
</div>

<style>
	:global(body) {
		background-color: #f3f4f6;
	}

	:global(button) {
		cursor: pointer;
	}
</style>
