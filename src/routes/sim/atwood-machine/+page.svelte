<script lang="ts">
	import CopyButton from '$components/CopyButton.svelte';
	import FreeBodyDiagram from '$components/FreeBodyDiagram.svelte';
	import Graph from '$components/Graph.svelte';
	import NumField from '$components/NumField.svelte';
	import QuantityDisplay from '$components/QuantityDisplay.svelte';
	import { onMount } from 'svelte';
	let m1 = 1;
	let m2 = 2;
	let g = 9.8;

	let input_initial_m1y = 60;
	let input_initial_m2y = 30;

	let u = 0;
	let u_apply: 'm1' | 'm2' = 'm1';

	$: tension = parseFloat(((2 * m1 * m2 * g) / (m1 + m2)).toFixed(5));
	$: a = parseFloat(((m1 * g - tension) / m1).toFixed(5));

	$: um1 = u_apply === 'm1' ? u : -u;
	$: um2 = u_apply === 'm2' ? u : -u;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let ready = false;

	$: if (ready) draw(sim_m1 / (sim_m1 + sim_m2), sim_m2 / (sim_m1 + sim_m2));

	function draw(m1YP: number, m2YP: number) {
		const height = 200;
		const width = 200;
		const padding = 20;
		const massRectW = 30;
		const massRectH = 25;

		// Clearing BG
		ctx.fillRect(0, 0, 200, 200);

		const pullyRad = 30;
		ctx.beginPath();
		ctx.arc(width / 2, padding + pullyRad, pullyRad, 0, 2 * Math.PI);
		ctx.strokeStyle = 'red';
		ctx.stroke();

		const top0 = padding + 2 * pullyRad;
		const top100 = height - padding - massRectH;

		const mass1YPerc = m1YP;
		const mass2YPerc = m2YP;

		const m1Y = top0 + (top100 - top0) * mass1YPerc;
		const m2Y = top0 + (top100 - top0) * mass2YPerc;

		const m1X = width / 2 - pullyRad - massRectW / 2;
		//const m1Y = mass1Y + padding;
		ctx.strokeStyle = 'red';
		ctx.strokeRect(m1X, m1Y, massRectW, massRectH);

		const m2X = width / 2 + pullyRad - massRectW / 2;
		//const m2Y = mass2Y + padding;
		ctx.strokeStyle = 'red';
		ctx.strokeRect(m2X, m2Y, massRectW, massRectH);

		ctx.beginPath();
		ctx.moveTo(m1X + massRectW / 2, m1Y);
		ctx.lineTo(m1X + massRectW / 2, padding + pullyRad);
		ctx.strokeStyle = 'green';
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(m2X + massRectW / 2, m2Y);
		ctx.lineTo(m2X + massRectW / 2, padding + pullyRad);
		ctx.strokeStyle = 'green';
		ctx.stroke();
	}

	let sim_m1 = input_initial_m1y;
	let sim_m2 = input_initial_m2y;
	let t = 0;

	// Animation
	let previous: number;

	function valContraint(v: number, min: number, max: number) {
		return Math.min(max, Math.max(v, min));
	}

	function physics(): AtwoodTimeData {
		const stepMS = 1;
		const dt = stepMS / 1000;

		let sim_m1 = input_initial_m1y;
		let sim_m2 = input_initial_m2y;
		let v_m1 = um1;
		let v_m2 = um2;
		let t = 0;

		const phyData = [];
		phyData.push({ t, v_m1, v_m2, sim_m2, sim_m1 });

		// eslint-disable-next-line no-constant-condition
		while (true) {
			v_m1 += a * dt;
			v_m2 += -a * dt;

			sim_m1 = valContraint(sim_m1 + v_m1 * dt, 0, 100);
			sim_m2 = valContraint(sim_m2 + v_m2 * dt, 0, 100);
			t += dt;

			// Stop animation once at extreme points
			if (sim_m1 === 0 || sim_m2 === 0 || sim_m1 === 100 || sim_m2 === 100) {
				break;
			}

			phyData.push({ t, v_m1, v_m2, sim_m2, sim_m1 });
		}

		return phyData;
	}

	let count = 0;
	function animate(timestamp: number) {
		const elapsedMS = Math.floor(timestamp - previous);
		previous = timestamp;

		count = Math.min(count + elapsedMS, sim_results.length - 1);
		const { sim_m1: v1, sim_m2: v2 } = sim_results[count];

		sim_m2 = v2;
		sim_m1 = v1;
		t = count / 1000;

		if (count < sim_results.length - 1) {
			requestAnimationFrame(animate);
		}
	}

	$: {
		m1;
		m2;
		g;
		u;
		u_apply;
		input_initial_m1y;
		input_initial_m2y;
		sim_results = [];
	}

	let sim = false;
	function simulate() {
		sim = true;
		sim_results = physics();
		sim = false;
	}

	function startAnimation() {
		count = 0;
		requestAnimationFrame((timestamp) => {
			previous = timestamp;
			animate(timestamp);
		});
	}

	function timeDataToVTGraph(time_data: AtwoodTimeData) {
		return {
			labels: time_data.map((row) => row.t.toPrecision(4)),
			datasets: [
				{
					label: 'v_m1',
					data: time_data.map((row) => row.v_m1)
				},
				{
					label: 'v_m2',
					data: time_data.map((row) => row.v_m2)
				}
			]
		};
	}
	function timeDataToYTGraph(time_data: AtwoodTimeData) {
		return {
			labels: time_data.map((row) => row.t.toPrecision(4)),
			datasets: [
				{
					label: 'y_m1',
					data: time_data.map((row) => row.sim_m1)
				},
				{
					label: 'y_m2',
					data: time_data.map((row) => row.sim_m2)
				}
			]
		};
	}

	type AtwoodTimeData = { t: number; sim_m1: number; sim_m2: number; v_m1: number; v_m2: number }[];

	let sim_results: AtwoodTimeData = [];

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		ready = true;
	});
</script>

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
	<section id="calculations">
		<QuantityDisplay value={tension.toPrecision(4)} label="Tension" unit="N" />

		<QuantityDisplay value={a.toPrecision(4)} label="Acceleration">m/s<sup>2</sup></QuantityDisplay>

		<hr />

		<h2>Free Body Diagram (FBD)</h2>

		<div class="flex flex-col lg:flex-row gap-1">
			<FreeBodyDiagram name="m1" top={tension} bottom={m1 * g} />
			<FreeBodyDiagram name="m2" top={tension} bottom={m2 * g} />
		</div>
	</section>

	<section id="viz">
		<h2>Visualisation</h2>
		<canvas class="mx-auto" bind:this={canvas} width="200" height="200" />
		<div class="mb-2">
			<button
				class="border border-black px-2 py-1"
				on:click={() => {
					simulate();
				}}>Simulate</button
			>
			<button
				class="border border-black px-2 py-1 disabled:border-gray-400"
				disabled={sim || sim_results.length < 0}
				on:click={() => {
					startAnimation();
				}}>Play</button
			>
		</div>
		<QuantityDisplay value={t.toPrecision(4)} label="Time" unit="s" />
		<hr />
		<h2>Velocity vs Time</h2>
		<Graph xlabel="Time (s)" ylabel="Velocity (m/s)" data={timeDataToVTGraph(sim_results)} />
		<hr />
		<h2>Position vs Time</h2>
		<Graph xlabel="Time (s)" ylabel="Position (m)" data={timeDataToYTGraph(sim_results)} />
	</section>
</main>
