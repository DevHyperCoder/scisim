<script lang="ts">
	import { onMount } from 'svelte';
	import { Vector } from '$lib/Vector';
	import NumField from '$components/NumField.svelte';

	let surfaceAngleDegrees: number = 0;
	$: surfaceAngleRad = (surfaceAngleDegrees * Math.PI) / 180;

	let ia_apply: 'surface' | 'normal' = 'normal';

	let incidentAngleDegrees: number = 0;

	$: incidentWithNormalDegrees =
		ia_apply === 'normal' ? incidentAngleDegrees : 90 - incidentAngleDegrees;
	$: incidentWithSurfaceRad = ((90 - incidentWithNormalDegrees) * Math.PI) / 180;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let ready = false;

	onMount(() => {
		context = canvas.getContext('2d')!;
		ready = true;
	});

	$: {
		if (ready) {
			draw(surfaceAngleRad, incidentWithSurfaceRad);
		}
	}

	function draw(surfaceAngleRad: number, incidentWithSurfaceRad: number) {
		const width = 400;
		const height = 400;
		const padding = 50;
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		// Drawing mirror surface

		context.lineWidth = 2;
		context.strokeStyle = 'red';

		const canvasMidpoint = new Vector(width / 2, height / 2);
		context.beginPath();
		context.moveTo(canvasMidpoint.x, canvasMidpoint.y);
		context.lineTo(
			canvasMidpoint.x + ((width - padding) / 2) * Math.cos(surfaceAngleRad),
			canvasMidpoint.y - ((height - padding) / 2) * Math.sin(surfaceAngleRad)
		);
		context.moveTo(canvasMidpoint.x, canvasMidpoint.y);
		context.lineTo(
			canvasMidpoint.x - ((width - padding) / 2) * Math.cos(surfaceAngleRad),
			canvasMidpoint.y + ((height - padding) / 2) * Math.sin(surfaceAngleRad)
		);
		context.stroke();

		// Drawing incident
		context.lineWidth = 2;
		context.strokeStyle = 'yellow';

		context.beginPath();
		context.moveTo(canvasMidpoint.x, canvasMidpoint.y);
		context.lineTo(
			canvasMidpoint.x -
				((width - padding) / 2) * Math.cos(surfaceAngleRad - incidentWithSurfaceRad),
			canvasMidpoint.y +
				((height - padding) / 2) * Math.sin(surfaceAngleRad - incidentWithSurfaceRad)
		);

		const x =
			canvasMidpoint.x -
			((width - padding) / 2) * Math.cos(surfaceAngleRad - incidentWithSurfaceRad) * 0.75;
		const y =
			canvasMidpoint.y +
			((height - padding) / 2) * Math.sin(surfaceAngleRad - incidentWithSurfaceRad) * 0.75;
		console.log({ x, y });

		context.moveTo(x, y);
		context.lineTo(
			x - 10 * Math.cos(surfaceAngleRad - incidentWithSurfaceRad - Math.PI / 6),
			y + 10 * Math.sin(surfaceAngleRad - incidentWithSurfaceRad - Math.PI / 6)
		);

		context.moveTo(x, y);
		context.lineTo(
			x + 10 * Math.cos(surfaceAngleRad - incidentWithSurfaceRad - (2 * Math.PI) / 6 - Math.PI / 2),
			y - 10 * Math.sin(surfaceAngleRad - incidentWithSurfaceRad - (2 * Math.PI) / 6 - Math.PI / 2)
		);

		context.stroke();

		// Drawing reflected
		context.lineWidth = 2;
		context.strokeStyle = 'blue';

		context.beginPath();
		context.moveTo(canvasMidpoint.x, canvasMidpoint.y);
		context.lineTo(
			canvasMidpoint.x +
				((width - padding) / 2) * Math.cos(surfaceAngleRad + incidentWithSurfaceRad),
			canvasMidpoint.y -
				((height - padding) / 2) * Math.sin(surfaceAngleRad + incidentWithSurfaceRad)
		);

		const rx =
			canvasMidpoint.x +
			((width - padding) / 2) * Math.cos(surfaceAngleRad + incidentWithSurfaceRad) * 0.55;
		const ry =
			canvasMidpoint.y -
			((height - padding) / 2) * Math.sin(surfaceAngleRad + incidentWithSurfaceRad) * 0.55;
		console.log({ rx, ry });

		context.moveTo(rx, ry);
		context.lineTo(
			rx - 10 * Math.cos(surfaceAngleRad + incidentWithSurfaceRad + Math.PI / 6),
			ry + 10 * Math.sin(surfaceAngleRad + incidentWithSurfaceRad + Math.PI / 6)
		);

		context.moveTo(rx, ry);
		context.lineTo(
			rx +
				10 * Math.cos(surfaceAngleRad + incidentWithSurfaceRad + (2 * Math.PI) / 6 + Math.PI / 2),
			ry - 10 * Math.sin(surfaceAngleRad + incidentWithSurfaceRad + (2 * Math.PI) / 6 + Math.PI / 2)
		);

		context.stroke();

		// Drawing normal
		context.lineWidth = 2;
		context.strokeStyle = 'green';

		context.beginPath();
		context.moveTo(canvasMidpoint.x, canvasMidpoint.y);
		context.lineTo(
			canvasMidpoint.x - ((width - padding) / 2) * Math.cos(surfaceAngleRad - Math.PI / 2),
			canvasMidpoint.y + ((height - padding) / 2) * Math.sin(surfaceAngleRad - Math.PI / 2)
		);
		context.stroke();
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
