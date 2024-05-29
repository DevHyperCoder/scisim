<script lang="ts">
	import { type DrawFn } from '$lib/types';
	import { onMount } from 'svelte';

	export let width: number;
	export let height: number;
	export let draw: DrawFn;

	export let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let ready = false;

	onMount(() => {
		context = canvas.getContext('2d')!;
		ready = true;
	});

	$: if (ready) draw(context, width, height);
</script>

<canvas bind:this={canvas} {width} {height}
	><a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API">Canvas API</a> is required.</canvas
>
