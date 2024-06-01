<script lang="ts">
	import CopyButton from '$components/CopyButton.svelte';
	import FreeBodyDiagram from '$components/FreeBodyDiagram.svelte';
	import Graph from '$components/Graph.svelte';
	import NumField from '$components/NumField.svelte';
	import QuantityDisplay from '$components/QuantityDisplay.svelte';
	import Theory from './Theory.svelte';
	import type { AtwoodSimResult } from '$lib/sims/atwood-machine';
	import graphs from '$lib/sims/atwood-machine/graph';
	import atwoodDraw from '$lib/sims/atwood-machine/draw';
	import atwoodPhysics from '$lib/sims/atwood-machine/physics';
	import FullWidthCanvas from '$components/FullWidthCanvas.svelte';

	// User input
	let m1 = 1;
	let m2 = 2;
	let g = 9.8;

	let input_initial_m1y = 60;
	let input_initial_m2y = 30;

	let u = 0;
	let u_apply: 'm1' | 'm2' = 'm1';

	// Reactive calculations
	$: tension = parseFloat(((2 * m1 * m2 * g) / (m1 + m2)).toFixed(5));
	$: a = parseFloat(((m1 * g - tension) / m1).toFixed(5));

	$: um1 = u_apply === 'm1' ? u : -u;
	$: um2 = u_apply === 'm2' ? u : -u;

	// Draw function for the canvas that fallbacks to a normal state if
	// there is no proper data
	$: draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
		if (currentSceneSimResult) {
			const {
				value: { sim_m1, sim_m2 }
			} = currentSceneSimResult;
			atwoodDraw(ctx, width, height, sim_m1, sim_m2);
		} else {
			atwoodDraw(ctx, width, height, 1, 1);
			return;
		}
	};

	// Animation
	let currentSceneSimResult: AtwoodSimResult = {
		t: 0,
		value: {
			sim_m1: input_initial_m1y,
			sim_m2: input_initial_m2y,
			v_m1: 0,
			v_m2: 0
		}
	};
	$: {
		const _a = sim_results[count];
		if (_a) {
			currentSceneSimResult = _a;
		} else {
			currentSceneSimResult = {
				t: 0,
				value: {
					sim_m1: input_initial_m1y,
					sim_m2: input_initial_m2y,
					v_m1: 0,
					v_m2: 0
				}
			};
		}
	}

	let previous: number;

	let count = 0;
	function animate(timestamp: number) {
		const elapsedMS = Math.floor(timestamp - previous);
		previous = timestamp;

		count = Math.min(count + elapsedMS, sim_results.length - 1);

		if (count < sim_results.length - 1) {
			requestAnimationFrame(animate);
		}
	}

	function startAnimation() {
		count = 0;
		requestAnimationFrame((timestamp) => {
			previous = timestamp;
			animate(timestamp);
		});
	}

	let sim = false;
	let sim_results: AtwoodSimResult[] = [];

	$: {
		input_initial_m2y;
		input_initial_m1y;
		um2;
		um1;
		a;
		sim_results = [];
	}

	// Whenever physics props change, re run the physics
	function simulate() {
		sim = true;
		sim_results = atwoodPhysics({ input_initial_m2y, input_initial_m1y, um2, um1, a });
		sim = false;
		count = 0;
	}

	let isTheoryExpanded = true;
</script>

<svelte:head><title>SciSim - Atwood Machine</title></svelte:head>
<main>
	<header>
		<h1>Atwood machine</h1>
		<p>
			An Atwood machine is a simple mechanical system used in physics to study the principles of
			classical mechanics. It consists of a pulley with two masses hanging on either side of the
			pulley, connected by a string that runs over the pulley. By analyzing the Atwood machine, one
			can understand concepts such as <b>tension</b>,
			<b>acceleration</b>, and the <b>relationship between mass and force</b>. This setup allows for
			the application of <em>Newton's laws of motion</em> to describe the motion of the masses and the
			pulley.
		</p>
	</header>

	<section id="inputs">
		<div class="w-full flex justify-between mb-2 items-center">
			<h2>Masses</h2>

			<CopyButton data={{ m1, m2, g, input_initial_m1y, input_initial_m2y, u, u_apply }}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-clipboard2-data"
					viewBox="0 0 16 16"
				>
					<path
						d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"
					/>
					<path
						d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"
					/>
					<path
						d="M10 7a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zm-6 4a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm4-3a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1"
					/>
				</svg></CopyButton
			>
		</div>

		<div class="input-cluster">
			<NumField bind:value={m1} id="m1" min={1} placeholder="Mass of 1st object">Mass 1</NumField>
			<NumField bind:value={m2} id="m2" min={1} placeholder="Mass of 2st object">Mass 2</NumField>
		</div>

		<hr />
		<h2>Position of masses</h2>
		<div class="input-cluster">
			<NumField bind:value={input_initial_m1y} id="m1y" min={0} placeholder="Position of m1"
				>Mass 1
			</NumField>
			<NumField bind:value={input_initial_m2y} id="m2y" min={0} placeholder="Position of m2">
				Mass 2
			</NumField>
		</div>
		<hr />
		<h2>Initial velocity of the masses</h2>
		<div class="input-cluster">
			<NumField bind:value={u} id="u" min={0} placeholder="Initial velocity of masses">u</NumField>
			<label for="u_apply">For</label>
			<div id="u_apply" role="radiogroup">
				<label for="ua_m1">m1</label>
				<input id="ua_m1" type="radio" bind:group={u_apply} value="m1" />
				<label class="ml-3" for="ua_m2">m2</label>
				<input id="ua_m2" type="radio" bind:group={u_apply} value="m2" />
			</div>
		</div>
		<hr />
		<h2>World</h2>
		<div class="input-cluster">
			<NumField bind:value={g} id="g" min={1} placeholder="Gravity of the environment"
				>Gravity</NumField
			>
		</div>
	</section>

	<ul>
		<li>All inputs in SI units.</li>
		<li>Rope and pully are massless.</li>
		<li>+ direction downwards.</li>
	</ul>

	<section>
		<div class="flex justify-between">
			<h2>Theory</h2>
			<button
				class="text-sm"
				on:click={() => {
					isTheoryExpanded = !isTheoryExpanded;
				}}>{isTheoryExpanded ? 'Collapse' : 'Expand'}</button
			>
		</div>

		{#if isTheoryExpanded}
			<Theory {m1} {m2} {g} {tension} {a} />
		{/if}
	</section>

	<section>
		<QuantityDisplay value={tension.toPrecision(4)} label="Tension" unit="N" />

		<QuantityDisplay value={a.toPrecision(4)} label="Acceleration for m1"
			>m/s<sup>2</sup></QuantityDisplay
		>

		<hr />

		<h2>Free Body Diagram (FBD)</h2>

		<div class="flex flex-col lg:flex-row gap-1">
			<FreeBodyDiagram name="m1" top={tension} bottom={m1 * g} />
			<FreeBodyDiagram name="m2" top={tension} bottom={m2 * g} />
		</div>
	</section>

	<section>
		<h2>Visualisation</h2>
		<FullWidthCanvas {draw} />
		<div class="my-2">
			<button
				class="border border-black px-2 py-1 disabled:border-gray-400"
				on:click={() => {
					simulate();
				}}>Simulate</button
			>
			<button
				class="border border-black px-2 py-1 disabled:border-gray-400"
				class:hidden={sim || sim_results.length < 0}
				disabled={sim || sim_results.length < 0}
				on:click={() => {
					startAnimation();
				}}>Play</button
			>
		</div>
		{#if currentSceneSimResult}
			<QuantityDisplay value={currentSceneSimResult.t.toPrecision(4)} label="Time" unit="s" />
			<QuantityDisplay
				value={currentSceneSimResult.value.v_m1.toPrecision(4)}
				label="Velocity of m_1"
				unit="m/s"
			/>
		{/if}
	</section>
	<section>
		<h2>Velocity vs Time</h2>
		<Graph xlabel="Time (s)" ylabel="Velocity (m/s)" data={graphs['v-t'](sim_results)} />
		<hr />
		<h2>Position vs Time</h2>
		<Graph xlabel="Time (s)" ylabel="Position (m)" data={graphs['y-t'](sim_results)} />
	</section>
</main>
