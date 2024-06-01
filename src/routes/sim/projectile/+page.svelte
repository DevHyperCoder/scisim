<script lang="ts">
	import FullWidthCanvas from '$components/FullWidthCanvas.svelte';
	import Graph from '$components/Graph.svelte';
	import NumField from '$components/NumField.svelte';
	import QuantityDisplay from '$components/QuantityDisplay.svelte';
	import type { ProjectileSimResult } from '$lib/sims/projectile';

	import projectileDraw from '$lib/sims/projectile/draw';
	import projectilePhysics from '$lib/sims/projectile/physics';
	import graphs from '$lib/sims/projectile/graph';
	import { Vector } from '$lib/Vector';
	import { onMount } from 'svelte';

	let g = 9.8;
	let u = 10;
	let angle = 45;
	$: angleRad = (angle * Math.PI) / 180;

	let previous: number;
	function startAnimation() {
		count = 0;
		requestAnimationFrame((timestamp) => {
			previous = timestamp;
			animate(timestamp);
		});
	}

	let sim_results: ProjectileSimResult[] = [];
	let count = 0;
	$: currentSimResult = sim_results[count];

	function animate(timestamp: number) {
		const elapsedMS = Math.floor(timestamp - previous);
		previous = timestamp;

		count = Math.min(count + elapsedMS, sim_results.length - 1);

		if (count < sim_results.length - 1) {
			requestAnimationFrame(animate);
		}
	}

	$: draw = (context: CanvasRenderingContext2D, width: number, height: number) => {
		projectileDraw(
			context,
			width,
			height,
			currentSimResult ? currentSimResult.value.bodyPos : Vector.ZERO()
		);
	};
	onMount(() => simulate());

	function simulate() {
		sim_results = projectilePhysics({ u, g, angleRad });
	}
</script>

<main>
	<header><h1>Projectile motion</h1></header>
	<section>
		<h2>Inputs</h2>
		<div class="input-cluster">
			<NumField id="gravity" bind:value={g} min={1} step={0.1}>Gravity:</NumField>
			<NumField id="u" min={0} bind:value={u}>u:</NumField>
			<NumField id="angle" bind:value={angle}>Angle:</NumField>
		</div>
	</section>
	<section>
		<h2>Visualisation</h2>
		<FullWidthCanvas {draw} />

		<button on:click={simulate}>SImulate</button>
		<button on:click={startAnimation}>Animate</button>

		<hr />
		{#if currentSimResult}
			<QuantityDisplay label="Time" value={currentSimResult.t.toPrecision(4)} unit="s" />
			<QuantityDisplay
				label="Velocity"
				value={currentSimResult.value.bodyVel.len().toPrecision(4)}
				unit="m/s"
			/>
			<QuantityDisplay label="X" value={currentSimResult.value.bodyPos.x.toPrecision(4)} unit="m" />
			<QuantityDisplay label="Y" value={currentSimResult.value.bodyPos.y.toPrecision(4)} unit="m" />
		{/if}
		<hr />

		<Graph xlabel="s" ylabel="m/s" data={graphs['v-t'](sim_results)} />
	</section>
</main>
