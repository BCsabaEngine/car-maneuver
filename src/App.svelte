<script lang="ts">
	import './app.postcss';

	import Icon from '@iconify/svelte';
	import { Button, Card } from 'flowbite-svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { Layer, Rect, Stage } from 'svelte-konva';

	import RoadShape from '$components/RoadShape.svelte';
	import VehicleShape from '$components/VehicleShape.svelte';
	import ZoomRange from '$components/ZoomRange.svelte';
	import type { Vehicle } from '$lib/Vehicle';
	import type { DrawingData } from '$types/VehicleTypes';

	import { traffic } from './config/traffic';
	import { WORLD_PIXEL_PER_METER } from './config/world';

	const box = traffic.route.box;
	const pathLength = traffic.route.pathLength;

	let zoom = $state(100);
	let timeScale = $state(100);

	const positions: Map<Vehicle, DrawingData> = new SvelteMap();

	setInterval(() => {
		for (let v = 0; v < traffic.vehicles.length; v++) {
			const vehicle = traffic.vehicles[v];
			const aheadVehicle =
				traffic.vehicles.length < 2
					? undefined
					: v > 0
						? traffic.vehicles[v - 1]
						: traffic.vehicles.at(-1);

			const currentStatus = vehicle.getStatus();
			const currentPoint = traffic.route.getPathPoint(currentStatus.position);

			vehicle.move(
				aheadVehicle
					? {
							distance:
								(aheadVehicle.getStatus().position +
									aheadVehicle.getStatus().carDescriptor.shape.length -
									currentStatus.position -
									currentStatus.carDescriptor.shape.length +
									pathLength) %
								pathLength,
							speed: aheadVehicle.getStatus().speed
						}
					: { distance: 1000, speed: 1000 },
				{ radius: currentPoint.radius },
				currentPoint.nextCurve,
				timeScale
			);

			const updatedStatus = vehicle.getStatus();
			positions.set(vehicle, {
				...updatedStatus,
				point: traffic.route.getPathPoint(updatedStatus.position)
			});
		}
	}, 10);

	const resetVehicles = () => {
		positions.clear();
		for (const vehicle of traffic.vehicles) vehicle.reset();
	};
</script>

<div class="grid grid-cols-3">
	<div class="flex justify-center my-4">
		<ZoomRange class="w-3/5" bind:value={zoom} min={10} max={300} step={10} />
	</div>
	<div class="flex justify-center my-4">
		{pathLength} m in {box.width} x {box.height} m
	</div>
	<div class="flex justify-center my-4">
		<ZoomRange class="w-3/5" bind:value={timeScale} title="Speed" min={10} max={300} step={10} />
	</div>
</div>

<div class="flex justify-center">
	<Stage
		width={WORLD_PIXEL_PER_METER * box.width * (zoom / 100)}
		height={WORLD_PIXEL_PER_METER * box.height * (zoom / 100)}
		scaleX={zoom / 100}
		scaleY={zoom / 100}
		offsetX={WORLD_PIXEL_PER_METER * box.offsetX}
		offsetY={WORLD_PIXEL_PER_METER * box.offsetY}
	>
		<Layer>
			<Rect
				id="background"
				x={WORLD_PIXEL_PER_METER * box.offsetX}
				y={WORLD_PIXEL_PER_METER * box.offsetY}
				width={WORLD_PIXEL_PER_METER * box.width}
				height={WORLD_PIXEL_PER_METER * box.height}
				fill="#7a7"
				stroke="#888"
			/>
			<RoadShape route={traffic.route} />
			{#each positions.values() as drawingData}
				<VehicleShape {drawingData} lane="cw" />
			{/each}
		</Layer>
	</Stage>
</div>

<div class="absolute top-10 left-0 p-4">
	<Card class="w-48 " shadow={false}>
		{#each positions.values() as vehicle}
			<span style={`color: ${vehicle.color}`} class="flex flex-row gap-1 items-center">
				{vehicle.speed}
				<span class="text-xs">m/sec</span>
				{#if vehicle.isAccelerating}
					<Icon icon="mdi:arrow-up" width="16" />
				{:else if vehicle.isBreaking}
					<Icon icon="mdi:arrow-down" width="16" />
				{/if}
			</span>
		{/each}
	</Card>
	<Button
		class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
		on:click={resetVehicles}
	>
		Reset
	</Button>
</div>

<style>
	:global(body) {
		background-color: #f3f3f3;
	}

	:global(button) {
		cursor: pointer;
	}
</style>
