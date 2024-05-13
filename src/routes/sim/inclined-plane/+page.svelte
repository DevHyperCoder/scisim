<script lang="ts">
	import Graph from '$components/Graph.svelte';
	import MathField from '$components/MathField.svelte';
	import NumField from '$components/NumField.svelte';
	import QuantityDisplay from '$components/QuantityDisplay.svelte';
	import { Vector } from '$lib/Vector';
	import type { EvalFunction } from 'mathjs';
	import { onMount } from 'svelte';

	let planeLength: number = 1;
	let angle: number = 45;
	$: angleRad = (angle * Math.PI) / 180;

	let mass = 1;
	let gravity = 10;

	let sF = '0.0';
	let kF = '0.4';

	let staticFricFn: EvalFunction;
	let kineticFricFn: EvalFunction;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let ready = false;

	onMount(() => {
		context = canvas.getContext('2d')!;
		ready = true;
	});

	function draw(angleRad: number, planeLength: number, wordBodyPos: Vector) {
		const height = 300;
		const width = 300;
		const padding = 50;

		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		// Drawing the inclined plane
		const lenOfPlanePx = height - 2 * padding;
		const startingPoint = new Vector(padding, height - padding);
		const endingPoint = new Vector(
			startingPoint.x + lenOfPlanePx * Math.cos(angleRad),
			startingPoint.y - lenOfPlanePx * Math.sin(angleRad)
		);

		context.lineWidth = 2;
		context.strokeStyle = 'red';

		context.beginPath();
		context.moveTo(startingPoint.x, startingPoint.y);
		context.lineTo(endingPoint.x, endingPoint.y);
		context.stroke();

		const gap = 10;
		const origin = endingPoint.sub(
			new Vector(
				gap * Math.sin(angleRad), // cos(90 - angleRad)
				gap * Math.cos(angleRad) // sin(90 - angleRad)
			)
		);

		// Marking origin
		context.strokeStyle = 'blue';
		context.beginPath();
		context.arc(origin.x, origin.y, 1, 0, 2 * Math.PI);
		context.stroke();

		const planeLengthPx = endingPoint.sub(startingPoint).len();
		const simToWorldRatio = planeLengthPx / planeLength;

		const bodyPos = origin.add(wordBodyPos.multiply(simToWorldRatio));

		context.strokeStyle = 'green';
		context.beginPath();
		context.arc(bodyPos.x, bodyPos.y, 1, 0, 2 * Math.PI);
		context.stroke();
	}

	$: if (ready) draw(angleRad, planeLength, bodyPos);

	let bodyPos = new Vector(0, 0);
	let bodyVel = new Vector(0, 0);

	type IPData = { t: number; bodyPos: { x: number; y: number }; bodyVel: { x: number; y: number } };
	let data: IPData[] = [];

	function physics() {
		const mg = mass * gravity;
		const g = gravity;

		const stepMS = 1;
		const dt = stepMS / 1000;

		let data: IPData[] = [];

		let bodyPos = new Vector(0, 0);
		let bodyVel = new Vector(0, 0);
		let t = 0;

		data.push({ t, bodyPos: { ...bodyPos }, bodyVel: { ...bodyVel } });

		const gravityAccel = new Vector(
			-g * Math.sin(angleRad) * Math.cos(angleRad),
			g * Math.sin(angleRad) * Math.sin(angleRad)
		);

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const sF = staticFricFn.evaluate({ t });
			const kF = kineticFricFn.evaluate({ t });

			const velAlongPlane = bodyVel.len();

			let fricAcclAlongPlane = 0;

			// Friction handling
			const normal = mg * Math.cos(angleRad);
			const aclAlongPlane = gravityAccel.len();

			// Static friction
			if (velAlongPlane === 0 || Math.abs(velAlongPlane) < 0.01) {
				const maxFricAcl = (sF * normal) / mass;
				fricAcclAlongPlane = -Math.min(maxFricAcl, aclAlongPlane);
				if (fricAcclAlongPlane == -aclAlongPlane) {
					alert('Object will be stationary now.');
					break;
				}
			}
			// Kinetic friction
			else {
				fricAcclAlongPlane = -Math.min((kF * normal) / mass, aclAlongPlane);
			}

			const fricAccl = new Vector(
				-fricAcclAlongPlane * Math.cos(angleRad),
				fricAcclAlongPlane * Math.sin(angleRad)
			);

			const accel = gravityAccel.add(fricAccl);
			bodyVel.madd(accel.multiply(dt));
			bodyPos.madd(bodyVel.multiply(dt));
			t += dt;

			if (bodyPos.y >= planeLength * Math.sin(angleRad)) {
				break;
			}

			data.push({ t, bodyPos: { ...bodyPos }, bodyVel: { ...bodyVel } });
		}

		return data;
	}
	let sim = false;
	function simulate() {
		sim = true;
		data = physics();
		sim = false;
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

		count = Math.min(count + elapsedMS, data.length - 1);
		const { bodyPos: vPos, bodyVel: vVel } = data[count];

		bodyPos = new Vector(vPos.x, vPos.y);
		bodyVel = new Vector(vVel.x, vVel.y);
		t = count / 1000;

		if (count < data.length - 1) {
			requestAnimationFrame(animate);
		}
	}

	let t = 0;

	function simResultsToVTGraph(data: IPData[]) {
		return {
			labels: data.map((row) => row.t.toPrecision(4)),
			datasets: [
				{
					label: 'v',
					data: data.map((row) => Math.sqrt(row.bodyVel.x ** 2 + row.bodyVel.y ** 2))
				}
			]
		};
	}
	function simResultsToYTGraph(data: IPData[]) {
		return {
			labels: data.map((row) => row.t.toPrecision(4)),
			datasets: [
				{
					label: 'v',
					data: data.map((row) => row.bodyPos.y)
				}
			]
		};
	}
</script>

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
		<p>{sim}</p>
	</section>
	<section>
		<h2>Visualisation</h2>
		<canvas height={300} width={300} bind:this={canvas}></canvas>
		<QuantityDisplay label="Time" value={t.toPrecision(4)} unit="s" />
		<QuantityDisplay label="Velocity" value={bodyVel.len().toPrecision(4)} unit="m/s" />
		<button class="border border-black px-2 py-1 disabled:border-gray-400" on:click={simulate}
			>Simulate</button
		>
		<button class="border border-black px-2 py-1 disabled:border-gray-400" on:click={startAnimation}
			>Animate</button
		>

		<h2>Velocity vs Time</h2>
		<Graph xlabel="Time (s)" ylabel="Velocity (m/s)" data={simResultsToVTGraph(data)} />
		<h2>Y position vs Time</h2>
		<Graph xlabel="Time (s)" ylabel="y (m)" data={simResultsToYTGraph(data)} />
	</section>
</main>

<style>
	.input-cluster {
		@apply grid-cols-[16ch_1fr];
	}
</style>
