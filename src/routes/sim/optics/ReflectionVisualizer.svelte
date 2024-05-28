<script lang="ts">
	import { onMount } from 'svelte';
	import NumField from '$components/NumField.svelte';
	import { withinContext, drawTwoArrowsAtAngle } from '$lib';

	let surfaceAngleDegrees: number = 0;
	$: surfaceAngleRad = (surfaceAngleDegrees * Math.PI) / 180;

	let ia_apply: 'surface' | 'normal' = 'normal';

	let incidentAngleDegrees: number = 0;

	$: incidentWithNormalDegrees =
		ia_apply === 'normal' ? incidentAngleDegrees : 90 - incidentAngleDegrees;
	$: incidentWithNormalRad = (incidentWithNormalDegrees * Math.PI) / 180;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let ready = false;

	onMount(() => {
		context = canvas.getContext('2d')!;
		ready = true;
	});

	$: {
		if (ready) {
			draw(surfaceAngleRad, incidentWithNormalRad);
		}
	}
	function draw(surfaceAngleRad: number, incidentWithNormalRad: number) {
		const width = 400;
		const height = 400;

		withinContext(context, (context) => {
			context.fillStyle = 'lightblue';
			context.fillRect(0, 0, width, height);

			context.translate(width / 2, height / 2);
			context.rotate(-surfaceAngleRad);

			context.lineWidth = 2;
			context.strokeStyle = 'red';
			context.beginPath();
			context.moveTo(-width, 0);
			context.lineTo(width, 0);

			const step = 10;
			const mirrorSz = 10;
			for (let i = -width; i < width; i += step) {
				context.moveTo(i, 0);
				context.lineTo(i, mirrorSz);
			}

			context.stroke();

			// Drawing incident ray
			withinContext(context, (context) => {
				context.strokeStyle = 'yellow';
				context.rotate(-Math.PI / 2 - incidentWithNormalRad);
				context.beginPath();
				context.moveTo(0, 0);
				context.lineTo(width, 0);
				context.stroke();

				const perc = 0.6;

				const x = (width / 2) * perc;
				const y = 0;
				const angle = Math.PI / 6;
				const ll = 15;
				drawTwoArrowsAtAngle(context, x, y, angle, ll);
			});
			withinContext(context, (context) => {
				context.strokeStyle = 'blue';
				context.rotate(-Math.PI / 2 + incidentWithNormalRad);
				context.beginPath();
				context.moveTo(0, 0);
				context.lineTo(width, 0);
				context.stroke();

				const perc = 0.4;

				const x = (width / 2) * perc;
				const y = 0;
				const angle = Math.PI - Math.PI / 6;
				const ll = 15;

				drawTwoArrowsAtAngle(context, x, y, angle, ll);
			});

			withinContext(context, (context) => {
				context.strokeStyle = 'green';
				context.rotate(-Math.PI / 2);
				context.beginPath();
				context.moveTo(0, 0);
				context.lineTo(width, 0);
				context.stroke();
			});
		});
	}
</script>

<section>
	<h2>Reflection</h2>

	<hr />
	<h2>Inputs</h2>

	<div class="input-cluster">
		<NumField id="surface-angle" placeholder="angle of the surface" bind:value={surfaceAngleDegrees}
			>Surface angle</NumField
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
			<p>Legend:</p>
			<ul>
				<li><span class="bg-[red]"></span> Reflecting Surface</li>
				<li><span class="bg-[green]"></span> Normal</li>
				<li><span class="bg-[yellow]"></span> Incident Ray</li>
				<li><span class="bg-[blue]"></span> Reflecting Ray</li>
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
