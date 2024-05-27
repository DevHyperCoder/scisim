<script lang="ts">
import{ math} from "mathlifier";
	import { onMount } from 'svelte';
	import { Vector } from '$lib/Vector';
	import NumField from '$components/NumField.svelte';

	let ia_apply: 'surface' | 'normal' = 'normal';

	let incidentAngleDegrees: number = 60;

	$: incidentWithNormalDegrees =
		ia_apply === 'normal' ? incidentAngleDegrees : 90 - incidentAngleDegrees;
	$: incidentWithNormalRad = ((incidentWithNormalDegrees) * Math.PI) / 180;

	$: r = Math.asin(Math.sin(incidentWithNormalRad) /  (n2 / n1));
	$: rDegrees = r * 180 / Math.PI

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
			draw(incidentWithNormalRad, r, n1, n2);
		}
	}

	function draw(incidentWithNormalRad: number,r: number, n1: number, n2: number) {


		const width = 400;
		const height = 400;
		const padding = 50;
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		context.fillStyle = n1 > n2 ? "pink" : "lightblue"
		context.fillRect(padding, padding,width-2*padding, (height-2*padding)/2);
		context.fillStyle = n2 > n1 ? "pink" : "lightblue"
		context.fillRect(padding, height/2,width-2*padding, (height-2*padding)/2);

		// Drawing refraction surface

		const surfaceAngleRad = 0;

//		context.lineWidth = 2;
//		context.strokeStyle = 'red';
//
		const canvasMidpoint = new Vector(width / 2, height / 2);
//		context.beginPath();
//		context.moveTo(canvasMidpoint.x, canvasMidpoint.y);
//		context.lineTo(
//			canvasMidpoint.x + ((width - padding) / 2) * Math.cos(surfaceAngleRad),
//			canvasMidpoint.y - ((height - padding) / 2) * Math.sin(surfaceAngleRad)
//		);
//		context.moveTo(canvasMidpoint.x, canvasMidpoint.y);
//		context.lineTo(
//			canvasMidpoint.x - ((width - padding) / 2) * Math.cos(surfaceAngleRad),
//			canvasMidpoint.y + ((height - padding) / 2) * Math.sin(surfaceAngleRad)
//		);
//		context.stroke();

		// Drawing incident
		context.lineWidth = 2;
		context.strokeStyle = 'yellow';

		const iangle = surfaceAngleRad - incidentWithNormalRad - Math.PI/2
		context.beginPath();
		context.moveTo(canvasMidpoint.x, canvasMidpoint.y);
		context.lineTo(
			canvasMidpoint.x + ((width-padding)/2) * Math.cos(iangle),
			canvasMidpoint.y + ((width-padding)/2) * Math.sin(iangle),
		)
		context.stroke()


		// Drawing refracted
		context.lineWidth = 2;
		context.strokeStyle = 'blue';

		const rangle = surfaceAngleRad - r - 3*Math.PI/2
		context.beginPath();
		context.moveTo(canvasMidpoint.x, canvasMidpoint.y);
		context.lineTo(
			canvasMidpoint.x + ((width-padding)/2) * Math.cos(rangle),
			canvasMidpoint.y + ((width-padding)/2) * Math.sin(rangle),
		)
		context.stroke()

		context.lineWidth = r === 0 ? 3: 2;
		context.strokeStyle = 'green';

		context.beginPath();
		context.moveTo(canvasMidpoint.x, canvasMidpoint.y);
		context.lineTo(
			canvasMidpoint.x + ((width-padding)/2) * Math.cos(-Math.PI/2),
			canvasMidpoint.y + ((width-padding)/2) * Math.sin(-Math.PI/2),
		)
		context.moveTo(canvasMidpoint.x, canvasMidpoint.y);
		context.lineTo(
			canvasMidpoint.x + ((width-padding)/2) * Math.cos(-3*Math.PI/2),
			canvasMidpoint.y + ((width-padding)/2) * Math.sin(-3*Math.PI/2),
		)
		context.stroke()
	}
</script>

<section>
	<h2>Refraction</h2>

	<hr />
	<h2>Inputs</h2>

	<div class="input-cluster">
		<NumField min={1} step={0.1} id="n1" placeholder="Refractive index of top medium " bind:value={n1}
			>{@html math("\\mu_1")}</NumField
		>
		<NumField min={1} step={0.1} id="n2" placeholder="Refractive index of bottom medium " bind:value={n2}
			>{@html math("\\mu_2")}</NumField
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
	<div class="grid grid-cols-2">
		<canvas bind:this={canvas} width="400" height="400" />
		<div>
			<p>Values:</p>
			{@html math(`\\angle i = ${incidentAngleDegrees.toPrecision(4)} \\degree`)}
			<br/>
			{@html math(`\\angle r = ${rDegrees.toPrecision(4)} \\degree`)}
			<hr/>
			<p>Legend:</p>
			<ul>
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
