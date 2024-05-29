<script lang="ts">
	import Canvas from '$components/Canvas.svelte';
	import Graph from '$components/Graph.svelte';
	import NumField from '$components/NumField.svelte';
	import QuantityDisplay from '$components/QuantityDisplay.svelte';
	import { withinContext } from '$lib';
	import { Vector } from '$lib/Vector';
	import type { ChartData } from 'chart.js';

	let g = 9.8;
	let u = 10;
	let angle = 45;
	$: angleRad = (angle * Math.PI) / 180;

	type PhysicsData = {
		t: number;
		bodyPos: { x: number; y: number };
		bodyVel: { x: number; y: number };
	};

	let data: PhysicsData[] = [];
	let bodyPos = Vector.ZERO();
	let bodyVel = Vector.ZERO();
	let t = 0;

	function physics(): PhysicsData[] {
		let t = 0;

		const dt = 1 / 1000;

		const pos = Vector.ZERO();
		const v = new Vector(u * Math.cos(angleRad), u * Math.sin(angleRad));
		const a = new Vector(0, -g);

		const data: PhysicsData[] = [];
		data.push({ t, bodyPos: { ...pos }, bodyVel: { ...v } });

		// eslint-disable-next-line no-constant-condition
		while (true) {
			v.madd(a.multiply(dt));
			pos.madd(v.multiply(dt));
			t += dt;

			if (pos.y <= 0) {
				break;
			}

			data.push({ t, bodyPos: { ...pos }, bodyVel: { ...v } });
		}

		return data;
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

	$: draw = (context: CanvasRenderingContext2D, width: number, height: number) => {
		const renderData = data[count];
		if (!renderData) return;

		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);
		const padding = 30;
		const scale = 3;

		withinContext(context, (context) => {
			context.translate(padding, height / 2);
			context.beginPath();
			context.strokeStyle = 'gray';
			context.moveTo(0, 0);
			context.lineTo(width - 2 * padding, 0);
			context.stroke();

			context.scale(scale, scale);
			context.fillStyle = 'lightpink';
			context.beginPath();
			context.arc(renderData.bodyPos.x, -renderData.bodyPos.y, 10 / scale, 0, Math.PI * 2);
			context.fill();
		});
	};

	function convertToVTime(data: PhysicsData[]): ChartData<'line'> {
		return {
			labels: data.map((r) => r.t.toPrecision(4)),
			datasets: [
				{ label: 'v', data: data.map((r) => Math.sqrt(r.bodyVel.x ** 2 + r.bodyVel.y ** 2)) },
				{ label: 'v_y', data: data.map((r) => r.bodyVel.y) },
				{ label: 'v_x', data: data.map((r) => r.bodyVel.x) }
			]
		};
	}

	function convertToxy(data: PhysicsData[]): ChartData<'line'> {
		return {
			labels: data.map((r) => r.bodyPos.x.toPrecision(4)),
			datasets: [{ label: 'pos', data: data.map((r) => r.bodyPos.y) }]
		};
	}

	$: vTimeChartData = convertToVTime(data);
	$: xyChartData = convertToxy(data);
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
		<Canvas {draw} width={300} height={300} />

		<button
			on:click={() => {
				data = physics();
				console.log({ data });
			}}>SImulate</button
		>
		<button on:click={startAnimation}>Animate</button>

		<hr />
		<QuantityDisplay label="Time" value={t.toPrecision(4)} unit="s" />
		<QuantityDisplay label="Velocity" value={bodyVel.len().toPrecision(4)} unit="m/s" />
		<QuantityDisplay label="X" value={bodyPos.x.toPrecision(4)} unit="m" />
		<QuantityDisplay label="Y" value={bodyPos.y.toPrecision(4)} unit="m" />
		<hr />

		<Graph xlabel="Time" ylabel="v" data={vTimeChartData} />
		<Graph xlabel="x" ylabel="y" data={xyChartData} />
	</section>
</main>
