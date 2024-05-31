<script lang="ts">
	import { math } from 'mathlifier';
	import Protractor from './Protractor.svelte';
	import NumField from '$components/NumField.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	export let angleRad: number;

	const angle = writable((angleRad * 180) / Math.PI);

	$: {
		angleRad;
		angle.set(Math.round((angleRad * 180) / Math.PI));
	}

	onMount(() => {
		return angle.subscribe((a) => (angleRad = (a * Math.PI) / 180));
	});

	export let isShowProtractor = false;

	const a = (n: number) => math(`${n} \\degree`);
</script>

<button
	on:click={() => {
		isShowProtractor = !isShowProtractor;
	}}>Protrator</button
>

{#if isShowProtractor}
	<Protractor bind:angleRad />
{/if}
<div class="flex gap-1">
	{#each [0, 30, 45, 60, 90] as angle}
		<button
			class:active={angle == Math.round((angleRad * 180) / Math.PI)}
			on:click={() => (angleRad = (angle * Math.PI) / 180)}>{@html a(angle)}</button
		>
	{/each}
</div>
<NumField id="angle" min={0} max={90} bind:value={$angle}></NumField>

<style>
	div > button {
		@apply bg-white px-2 py-1 border border-slate-800 rounded-full;
	}

	.active {
		@apply bg-blue-400;
	}
</style>
