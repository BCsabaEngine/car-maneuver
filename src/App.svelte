<script lang="ts">
	import './app.postcss';

	import { Layer, Rect, Stage } from 'svelte-konva';

	import Road from '$components/Road.svelte';
	import ZoomRange from '$components/ZoomRange.svelte';
	import { traffic } from '$lib/traffic';

	const PIXEL_PER_METER = 2;

	const box = traffic.route.box;
	const pathLength = traffic.route.pathLength;

	let zoom = $state(100);
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
			<Road route={traffic.route} pixelPerMeter={PIXEL_PER_METER} showPath />
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
