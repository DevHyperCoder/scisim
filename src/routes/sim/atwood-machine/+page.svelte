<script lang="ts">
	import FreeBodyDiagram from '$lib/FreeBodyDiagram.svelte';
	import NumField from '$lib/NumField.svelte';
	import { onMount } from 'svelte';
	let m1 = 1;
	let m2 = 2;
	let g = 9.8;

	let input_initial_m1y = 60;
	let input_initial_m2y = 30;

	$: initial_m1y = (input_initial_m1y * 100) / (input_initial_m1y + input_initial_m2y);
	$: initial_m2y = (input_initial_m2y * 100) / (input_initial_m1y + input_initial_m2y);

	let u = 0;
	let u_apply: 'm1' | 'm2' = 'm1';

	$: tension = parseFloat(((2 * m1 * m2 * g) / (m1 + m2)).toFixed(5));
	$: a = parseFloat(((m1 * g - tension) / m1).toFixed(5));
	//	$: totalTime =

	$: um1 = u_apply === 'm1' ? u : -u;
	$: um2 = u_apply === 'm2' ? u : -u;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let ready = false;

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		ready = true;
	});

	let totalTime: number = Infinity;

	function quadraticRoot(a: number, b: number, c: number) {
		const alpha = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
		const beta = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
		return [alpha, beta];
	}

	$: {
		// Total time it will take for the whole thing
		// It will be the time it takes any one of the mass to hit to pully (y perc = 0)
		// lets code it!

		// a < 0 => mass 1 will hit the pully
		if (a < 0) {
			//f(t) = (abs(a)*t^2)/2 + um1*t - m1y
			//find_zero(f, 0.0)
			const roots = quadraticRoot(Math.abs(a) / 2, um1, -initial_m1y);
			totalTime = Math.max(...roots.map(Math.abs));
		}
		// a > 0 => mass 2 will hit the pully
		else if (a > 0) {
			//f(t) = (abs(a)*t^2)/2 + um2*t + m2y
			const roots = quadraticRoot(Math.abs(a) / 2, um2, +initial_m2y);
			totalTime = Math.max(...roots.map(Math.abs));
		}
		// a = 0 : Either mass1 or mass2 could hit the pulley, depending on the initial velocities
		// if both are 0, the system will be at rest => time to hit pully = Inf
		else {
			const tm1 = initial_m1y / um1;
			const tm2 = initial_m2y / um2;
			totalTime = Math.min(Math.abs(tm1), Math.abs(tm2));
		}
	}

	// 0 - 100
	let timePerc = 0;
	$: t = (totalTime * timePerc) / 100;
	$: sim_m1 = initial_m1y + um1 * t + (a * t * t) / 2;
	$: sim_m2 = initial_m2y + um2 * t + (-a * t * t) / 2;
	$: if (ready) draw(sim_m1, sim_m2);

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

		const mass1YPerc = m1YP / 100;
		const mass2YPerc = m2YP / 100;

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

	// Animation
	let previous: number;

	function animate(timestamp: number) {
		let anim_t = Math.min(t + (timestamp - previous) / 1000, totalTime);
		timePerc = (100 * anim_t) / totalTime;
		previous = timestamp;

		if (t < totalTime) {
			requestAnimationFrame(animate);
		}
	}

	function startAnimation() {
		t = 0;
		requestAnimationFrame((timestamp) => {
			previous = timestamp;
			animate(timestamp);
		});
	}
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
		<p><b class="lbl">Tension:</b> {tension.toPrecision(4)}</p>
		<p><b class="lbl">Acceleration:</b> {a.toPrecision(4)}</p>

		<div id="accel-text">
			{#if a === 0}
				<p>No acceleration</p>
			{:else}
				<p>Heavier mass is moving down with a acceleration of {Math.abs(a).toPrecision(4)}</p>
				<div class="flex gap-2 pb-0">
					<p class="border-r-black border-r-2 pr-2">
						<b class="lbl">Mass 1:</b>
						{a < 0 ? 'Up' : 'Down'}
					</p>
					<p><b class="lbl">Mass 2:</b> {a > 0 ? 'Up' : 'Down'}</p>
				</div>
			{/if}
		</div>

		<p class="mt-2"><b class="lbl">Total time taken:</b> {totalTime.toPrecision(4)}s</p>

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
		<div class="flex flex-col mt-2">
			<label for="time-perc">Time t ({t.toPrecision(4)}s)</label><input
				id="time-perc"
				type="range"
				min="0"
				max="100"
				bind:value={timePerc}
			/>
		</div>

		<button
			class="mt-2 border border-black px-2 py-1"
			on:click={() => {
				startAnimation();
			}}>Play</button
		>
	</section>
</main>

<style>
	#accel-text {
		@apply text-sm mt-2;
	}
</style>
