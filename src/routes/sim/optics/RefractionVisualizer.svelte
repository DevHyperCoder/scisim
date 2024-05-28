<script lang="ts">
	import { math } from 'mathlifier';
	import { onMount } from 'svelte';
	import { Vector } from '$lib/Vector';
	import NumField from '$components/NumField.svelte';
	import { drawTwoArrowsAtAngle, withinContext, calculateR } from '$lib';

	let ia_apply: 'surface' | 'normal' = 'normal';

	let surfaceAngleDegrees = 0;
	$: surfaceAngleRad = (surfaceAngleDegrees * Math.PI) / 180;
	let incidentAngleDegrees: number = 60;

	$: incidentWithNormalDegrees =
		ia_apply === 'normal' ? incidentAngleDegrees : 90 - incidentAngleDegrees;
	$: incidentWithNormalRad = (incidentWithNormalDegrees * Math.PI) / 180;

	$: r = calculateR(incidentWithNormalRad, n1, n2);
	$: rDegrees = (r * 180) / Math.PI;

	let n1: number = 1.0;
	let n2: number = 1.5;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let ready = false;

	onMount(() => {
		context = canvas.getContext('2d')!;
		ready = true;
	});

	$: {
		if (ready) {
			draw(surfaceAngleRad, incidentWithNormalRad, r, n1, n2);
		}
	}

	function draw(
		surfaceAngleRad: number,
		incidentWithNormalRad: number,
		r: number,
		n1: number,
		n2: number
	) {
		const width = 400;
		const height = 400;

		const canvasMidpoint = new Vector(width / 2, height / 2);

		context.translate(canvasMidpoint.x, canvasMidpoint.y);
		context.rotate(-surfaceAngleRad);

		// Coloured mediums
		context.fillStyle = n1 > n2 ? 'pink' : 'lightblue';
		context.fillRect(-width, -height, width * 2, height);
		context.fillStyle = n2 > n1 ? 'pink' : 'lightblue';
		context.fillRect(-width, 0, width * 2, height);

		// Drawing refraction surface
		context.lineWidth = 3;
		context.strokeStyle = 'red';

		context.beginPath();
		context.moveTo(-width, 0);
		context.lineTo(width, 0);
		context.stroke();

		// Drawing incident
		withinContext(context, (context) => {
			context.rotate(-incidentWithNormalRad - Math.PI / 2);

			context.lineWidth = 2;
			context.strokeStyle = 'yellow';

			const perc = 0.5;
			const x = (width / 2) * perc;
			const y = 0;
			const angle = Math.PI / 6;
			const ll = 15;

			drawTwoArrowsAtAngle(context, x, y, angle, ll);

			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(width, 0);
			context.stroke();

			context.setLineDash([5, 3]);
			context.moveTo(0, 0);
			context.lineTo(-width, 0);
			context.stroke();
		});

		// Drawing refracted
		withinContext(context, (context) => {
			context.rotate(Math.PI / 2 - r);

			context.lineWidth = 2;
			context.strokeStyle = 'blue';

			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(width, 0);
			context.stroke();

			const perc = 0.5;

			const x = (width / 2) * perc;
			const y = 0;
			const angle = Math.PI - Math.PI / 6;
			const ll = 15;

			drawTwoArrowsAtAngle(context, x, y, angle, ll);
		});

		// Drawing Normal
		withinContext(context, (context) => {
			context.rotate(-Math.PI / 2);

			context.lineWidth = r === 0 ? 3 : 2;
			context.strokeStyle = 'green';

			context.beginPath();
			context.beginPath();
			context.moveTo(-width, 0);
			context.lineTo(width, 0);
			context.stroke();
		});

		context.setTransform(1, 0, 0, 1, 0, 0);
	}
</script>

<section>
	<h2>Refraction</h2>

	<hr />
	<h2>Inputs</h2>

	<div class="input-cluster">
		<NumField
			id="surface-angle"
			min={-90}
			max={90}
			placeholder="surface angle"
			bind:value={surfaceAngleDegrees}>Surface angle</NumField
		>

		<NumField
			min={1}
			step={0.1}
			id="n1"
			placeholder="Refractive index of top medium "
			bind:value={n1}>{@html math('\\mu_1')}</NumField
		>
		<NumField
			min={1}
			step={0.1}
			id="n2"
			placeholder="Refractive index of bottom medium "
			bind:value={n2}>{@html math('\\mu_2')}</NumField
		>
		<NumField
			id="incident-angle"
			min={-90}
			max={90}
			placeholder="angle of the incident ray to the normal"
			bind:value={incidentAngleDegrees}>Incident angle</NumField
		>

		<label for="u_apply">For</label>
		<div id="ia_apply" role="radiogroup">
			<label for="ia_surface">Surface</label>
			<input id="ia_surface" type="radio" bind:group={ia_apply} value="surface" />
			<label class="ml-3" for="ia_normal">Normal</label>
			<input id="ia_normal" type="radio" bind:group={ia_apply} value="normal" />
		</div>
	</div>

	<hr />

	<h2>Visualisation</h2>
	<div class="lg:grid lg:grid-cols-2">
		<canvas bind:this={canvas} width="400" height="400" />
		<div>
			<p>Values:</p>
			{@html math(`\\angle i = ${incidentAngleDegrees.toPrecision(4)} \\degree`)}
			<br />
			{@html math(`\\angle r = ${rDegrees.toPrecision(4)} \\degree`)}
			<br />

			<!-- TIR -->
			{#if n1 > n2}
				{@html math(
					`\\theta_c = ${((Math.asin(n2 / n1) * 180) / Math.PI).toPrecision(4)} \\degree`
				)}
			{/if}
			<hr />

			<p>Legend:</p>
			<ul>
				<li><span class="bg-[red]"></span>Medium interface</li>
				<li><span class="bg-[pink]"></span> Denser Medium</li>
				<li><span class="bg-[lightblue]"></span> Lighter Medium</li>
				<li><span class="bg-[green]"></span> Normal</li>
				<li><span class="bg-[yellow]"></span> Incident Ray</li>
				<li><span class="bg-[blue]"></span> Refracted Ray</li>
			</ul>
		</div>
	</div>
</section>

<style>
	li {
		@apply flex gap-2 mt-1 mb-1;
	}
	span {
		@apply h-4 w-4 block;
	}
</style>
