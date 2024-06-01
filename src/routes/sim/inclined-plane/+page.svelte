<script lang="ts">
	import Graph from '$components/Graph.svelte';
	import MathField from '$components/MathField.svelte';
	import NumField from '$components/NumField.svelte';
	import QuantityDisplay from '$components/QuantityDisplay.svelte';
	import { Vector } from '$lib/Vector';
	import type { EvalFunction } from 'mathjs';
	import { onMount } from 'svelte';
	import inclinedPlaneDraw from '$lib/sims/inclined-plane/draw';
	import inclinedPlanePhysics from '$lib/sims/inclined-plane/physics';
	import graphs from '$lib/sims/inclined-plane/graph';

	import type { InclinedPlaneSimResult } from '$lib/sims/inclined-plane';
	import FullWidthCanvas from '$components/FullWidthCanvas.svelte';

	let planeLength: number;
	let angle: number;
	$: angleRad = (angle * Math.PI) / 180;

	let mass: number;
	let gravity: number;

	let sF = '0.0';
	let kF = '0.4';

	let staticFricFn: EvalFunction;
	let kineticFricFn: EvalFunction;

	onMount(() => {
		planeLength = 1;
		angle = 45;
		mass = 1;
		gravity = 10;
		setTimeout(() => simulate(), 0);
	});

	$: draw = (context: CanvasRenderingContext2D, width: number, height: number) => {
		const bodyPos = currentSimResult ? currentSimResult.value.bodyPos : Vector.ZERO();
		inclinedPlaneDraw(context, width, height, angleRad, planeLength, bodyPos);
	};

	let sim_results: InclinedPlaneSimResult[] = [];

	let currentSimResult: InclinedPlaneSimResult;
	$: currentSimResult = sim_results[count];

	function simulate() {
		sim_results = inclinedPlanePhysics({
			planeLength,
			mass,
			gravity,
			angleRad,
			staticFricFn,
			kineticFricFn
		});
		count = 0;
	}

	let previous: number;
	function startAnimation() {
		count = 0;
		requestAnimationFrame((timestamp) => {
			previous = timestamp;
			animate(timestamp);
		});
	}

	let count = 0;
	function animate(timestamp: number) {
		const elapsedMS = Math.floor(timestamp - previous);
		previous = timestamp;

		count = Math.min(count + elapsedMS, sim_results.length - 1);

		if (count < sim_results.length - 1) {
			requestAnimationFrame(animate);
		}
	}
</script>

<svelte:head><title>SciSim - Inclined Plane</title></svelte:head>

<main>
	<header>
		<h1>Inclined Plane</h1>
	</header>

	<section>
		<h2>Inclined Plane</h2>

		<div class="input-cluster">
			<NumField min={0} bind:value={mass} id="mass">Mass</NumField>
			<NumField min={0} max={90} bind:value={angle} id="angle">Angle</NumField>
			<NumField min={0} bind:value={planeLength} id="len">Plane Length</NumField>
		</div>
		<hr />
		<!--
		<h2>Friction [OLD]</h2>
		<div class="input-cluster">
			<NumField min={0} step={0.1} bind:value={sF} id="sF">Static Friction</NumField>
			<NumField min={0} step={0.1} bind:value={kF} id="kF">Kinetic Friction</NumField>
		</div>
		-->
		<h2>Friction [NEW]</h2>
		<div class="input-cluster">
			<MathField bind:fn={staticFricFn} step={0.1} initial={sF} id="sF">Static Friction</MathField>
			<MathField bind:fn={kineticFricFn} step={0.1} initial={kF} id="kF">Kinetic Friction</MathField
			>
		</div>
		<hr />
		<h2>World</h2>
		<div class="input-cluster">
			<NumField min={0} bind:value={gravity} id="gravity">Gravity</NumField>
		</div>
	</section>
	<section>
		<h2>Visualisation</h2>
		<FullWidthCanvas {draw} />
		<div class="my-2">
			<button class="border border-black px-2 py-1 disabled:border-gray-400" on:click={simulate}
				>Simulate</button
			>
			<button
				class="border border-black px-2 py-1 disabled:border-gray-400"
				on:click={startAnimation}>Animate</button
			>
		</div>

		{#if currentSimResult}
			<QuantityDisplay label="Time" value={currentSimResult.t.toPrecision(4)} unit="s" />
			<QuantityDisplay
				label="Velocity"
				value={currentSimResult.value.bodyVel.len().toPrecision(4)}
				unit="m/s"
			/>
		{/if}
	</section>
	<section>
		<h2>Velocity vs Time</h2>
		<Graph xlabel="Time (s)" ylabel="Velocity (m/s)" data={graphs['v-t'](sim_results)} />
		<hr />
		<h2>Y position vs Time</h2>
		<Graph xlabel="Time (s)" ylabel="y (m)" data={graphs['y-t'](sim_results)} />
	</section>
</main>

<style>
	.input-cluster {
		@apply grid-cols-[16ch_1fr];
	}
</style>
