<script lang="ts">
	import { Label, Range } from 'flowbite-svelte';

	const DEFAULT_VALUE = 100;

	let aClass = '';
	export { aClass as class };

	export let title: string = 'Zoom';
	export let value: number = DEFAULT_VALUE;
	export let min: number = 0;
	export let max: number = 100;
	export let step: number = 1;
</script>

<div class={aClass + ' flex items-center space-x-2'}>
	<Label
		defaultClass="text-sm whitespace-nowrap cursor-pointer"
		title="Reset zoom"
		onclick={() => {
			value = 100;
		}}>{title}: <span class="font-semibold">{value}</span>%</Label
	>
	<Range {min} {max} {step} bind:value id="imageZoom" />
</div>
