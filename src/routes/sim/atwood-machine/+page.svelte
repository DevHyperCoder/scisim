<script lang="ts">
	import FreeBodyDiagram from '$lib/FreeBodyDiagram.svelte';
	import NumField from '$lib/NumField.svelte';
	import {
		Chart,
		CategoryScale,
		LinearScale,
		LineElement,
		LineController,
		PointElement,
		Colors,
		Tooltip,
		Legend
	} from 'chart.js';
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

	$: if (ready) draw(sim_m1/(sim_m1+sim_m2), sim_m2 / (sim_m1+sim_m2));

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

	function physics() {
		const stepMS = 1;
		const dt = stepMS / 1000;

		let sim_m1 = input_initial_m1y;
		let sim_m2 = input_initial_m2y;
		let v_m1 = um1;
		let v_m2 = um2;
		let t = 0;

		const phyData = [];
		phyData.push({ t, v: { v_m1, v_m2, sim_m2, sim_m1 } });

		while (true) {
			v_m1 += a * dt;
			v_m2 += -a * dt;

			sim_m1 = valContraint(sim_m1 + v_m1*dt, 0, 100);
			sim_m2 = valContraint(sim_m2 + v_m2*dt, 0, 100);
			t+= dt;

			// Stop animation once at extreme points
			if (sim_m1 === 0 || sim_m2 === 0 || sim_m1 === 100 || sim_m2 === 100) {
				break;
			}

			phyData.push({ t, v: { v_m1, v_m2, sim_m2, sim_m1 } });
		}

		return phyData;
	}

	let count = 0;
	function animate(timestamp: number) {
		const elapsedMS = Math.floor(timestamp - previous);
		previous = timestamp;

		count = Math.min(count+elapsedMS, atwood_chart_data.length-1);
		const {v: {sim_m1: v1, sim_m2: v2}} = atwood_chart_data[count]

		sim_m2 = v2;
		sim_m1 = v1
		t = count / 1000;


		if (count < atwood_chart_data.length - 1) {
			requestAnimationFrame(animate);
		}
	}

	function startAnimation() {
		atwood_chart_data = physics();
		vel_time_chart.data = thing(atwood_chart_data);
		vel_time_chart.update('default');
		pos_time_chart.data = thinga(atwood_chart_data);
		pos_time_chart.update('default');
		count = 0

		requestAnimationFrame((timestamp) => {
			previous = timestamp;
			animate(timestamp);
		});
	}

	function thing(time_data: AtwoodTimeData) {
		return {
			labels: time_data.map((row) => row.t.toPrecision(4)),
			datasets: [
				{
					label: 'v_m1',
					data: time_data.map((row) => row.v.v_m1)
				},
				{
					label: 'v_m2',
					data: time_data.map((row) => row.v.v_m2)
				}
			]
		};
	}
	function thinga(time_data: AtwoodTimeData) {
		return {
			labels: time_data.map((row) => row.t.toPrecision(4)),
			datasets: [
				{
					label: 'y_m1',
					data: time_data.map((row) => row.v.sim_m1)
				},
				{
					label: 'y_m2',
					data: time_data.map((row) => row.v.sim_m2)
				}
			]
		};
	}

	type TimeData<T> = { t: number; v: T }[];
	type AtwoodTimeData = TimeData<{ sim_m1: number; sim_m2: number; v_m1: number; v_m2: number }>;

	let velTimeChartCanvas: HTMLCanvasElement;
	let vel_time_chart: Chart;

	let posTimeChartCanvas: HTMLCanvasElement;
	let pos_time_chart: Chart;

	let atwood_chart_data: AtwoodTimeData = [];

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		ready = true;

		Chart.register(
			Tooltip,
			Legend,
			Colors,
			LineElement,
			LineController,
			LinearScale,
			CategoryScale,
			PointElement
		);

		vel_time_chart = new Chart(velTimeChartCanvas as HTMLCanvasElement, {
			type: 'line',
			data: thing(atwood_chart_data),
			options: {
				elements: {
				point: {
				pointStyle: false,
				},
				},
				scales: {
					x: {
						title: {
							display: true,
							text: 'Time'
						}
					},
					y: {
						title: {
							display: true,
							text: 'Velocity'
						}
					}
				}
			}
		});

		pos_time_chart = new Chart(posTimeChartCanvas as HTMLCanvasElement, {
			type: 'line',
			data: thinga(atwood_chart_data),
			options: {
				elements: {
				point: {
				pointStyle: false,
				},
				},
				scales: {
					x: {
						title: {
							display: true,
							text: 'Time'
						}
					},
					y: {
						title: {
							display: true,
							text: 'Position'
						}
					}
				}
			}
		});
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
		<div class="input-cluster">
			<NumField bind:value={m1} id="m1" min={1} placeholder="Mass of 1st object">Mass 1</NumField>
			<NumField bind:value={m2} id="m2" min={1} placeholder="Mass of 2st object">Mass 2</NumField>
			<NumField bind:value={g} id="g" min={1} placeholder="Gravity of the environment"
				>Gravity</NumField
			>
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
	</section>

	<ul>
		<li>All inputs in SI units.</li>
		<li>Rope and pully are massless.</li>
		<li>+ direction downwards.</li>
	</ul>
	<section id="calculations">
		<p>
			<b class="lbl">Tension:</b>
			{tension.toPrecision(4)} <span class="text-slate-800 font-semibold">N</span>
		</p>
		<p>
			<b class="lbl">Acceleration:</b>
			{a.toPrecision(4)} <span class="text-slate-800 font-semibold">m/s<sup>2</sup></span>
		</p>

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
		<button
			class="mt-2 border border-black px-2 py-1"
			on:click={() => {
				startAnimation();
			}}>Play</button
		>
		<p class="mt-2"><b class="lbl">Time:</b> {t.toPrecision(4)}s</p>
		<hr />
		<h2>Velocity vs Time</h2>
		<canvas bind:this={velTimeChartCanvas}></canvas>
		<hr />
		<h2>Position vs Time</h2>
		<canvas bind:this={posTimeChartCanvas}></canvas>
	</section>
</main>
