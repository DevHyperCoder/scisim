<script lang="ts">
	import type { DrawFn } from '$lib/types';
	import Canvas from './Canvas.svelte';

	let clientWidth: number = 100;

	$: width = clientWidth;
	$: height = clientWidth;

	export let draw: DrawFn;

	let _canvas: HTMLCanvasElement;
	export let canvas: HTMLCanvasElement | null = null;

	$: canvas = _canvas;
</script>

<div bind:clientWidth class="w-100">
	<Canvas bind:canvas={_canvas} {width} {height} {draw} />
</div>
