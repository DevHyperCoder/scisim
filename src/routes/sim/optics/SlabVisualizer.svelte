<script lang="ts">
	import { math } from 'mathlifier';
	import NumField from '$components/NumField.svelte';
	import { onMount } from 'svelte';
	import { calculateR } from '$lib';
	import slabDraw from '$lib/sims/optics/slab/draw';
	import FullWidthCanvas from '$components/FullWidthCanvas.svelte';

	let slabRefractiveIndex: number;
	let slabThickness: number;
	let incidentAngleDegrees: number;
	$: incidentAngleRad = (incidentAngleDegrees * Math.PI) / 180;

	$: firstR = calculateR(incidentAngleRad, 1, slabRefractiveIndex);
	$: secondR = calculateR(firstR, slabRefractiveIndex, 1);
	$: lateralDisplacement = (slabThickness * Math.sin(incidentAngleRad - firstR)) / Math.cos(firstR);

	onMount(() => {
		slabRefractiveIndex = 1.5;
		slabThickness = 100;
		incidentAngleDegrees = 45;
	});

	$: draw = (context: CanvasRenderingContext2D, width: number, height: number) => {
		slabDraw(context, width, height, incidentAngleRad, slabThickness, firstR, secondR);
	};
</script>

<section>
	<h2>Slab</h2>
	<hr />
	<h2>Inputs</h2>
	<div class="input-cluster">
		<NumField min={1} step={0.1} bind:value={slabRefractiveIndex} id="slab-n"
			>{@html math('\\mu')}</NumField
		>
		<NumField min={1} bind:value={slabThickness} id="slab-t">Thickness:</NumField>
		<NumField
			min={0}
			max={(Math.atan((300 * 0.8) / slabThickness) * 180) / Math.PI}
			bind:value={incidentAngleDegrees}
			id="ia">I wrt N:</NumField
		>
	</div>
	<hr />
	<h2>Visualisation</h2>
	<div class="lg:grid lg:grid-cols-2 gap-3">
		<FullWidthCanvas {draw} />
		{#if lateralDisplacement}
			<p>Lateral shift: {lateralDisplacement.toPrecision(4)}</p>
		{/if}
	</div>
</section>
