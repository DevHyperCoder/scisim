<script lang="ts">
	import { math } from 'mathlifier';
	import NumField from '$components/NumField.svelte';
	import { onMount } from 'svelte';
	import { calculateR, drawTwoArrowsAtAngle, withinContext } from '$lib';

	let slabRefractiveIndex: number = 1.5;
	let slabThickness: number = 100;
	let incidentAngleDegrees: number = 45;
	$: incidentAngleRad = (incidentAngleDegrees * Math.PI) / 180;

	$: firstR = calculateR(incidentAngleRad, 1, slabRefractiveIndex);
	$: secondR = calculateR(firstR, slabRefractiveIndex, 1);
	$: lateralDisplacement = (slabThickness * Math.sin(incidentAngleRad - firstR)) / Math.cos(firstR);

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let ready = false;

	onMount(() => {
		context = canvas.getContext('2d')!;
		ready = true;
	});

	$: if (ready) draw(incidentAngleRad, slabThickness, firstR, secondR);

	function draw(incidentAngleRad: number, slabSzW: number, firstR: number, secondR: number) {
		const height = 400;
		const width = 400;
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		//const slabSzW = 100;
		const slabSzH = 300;

		withinContext(context, (context) => {
			context.translate(width / 2, height / 2);
			context.fillStyle = 'lightblue';
			context.fillRect(-slabSzW / 2, -slabSzH / 2, slabSzW, slabSzH);

			context.translate(0, -slabSzH * 0.4);

			// Drawing normal
			context.lineWidth = 2;
			context.strokeStyle = 'green';
			context.beginPath();
			context.moveTo(-width, 0);
			context.lineTo(width, 0);
			context.stroke();

			// Drawing incident
			withinContext(context, (context) => {
				context.translate(-slabSzW / 2, 0);
				context.rotate(incidentAngleRad);

				context.beginPath();
				context.strokeStyle = 'yellow';
				context.moveTo(0, 0);
				context.lineTo(-width, 0);
				context.lineTo(width, 0);
				context.stroke();
				drawTwoArrowsAtAngle(context, -50, 0, Math.PI - Math.PI / 6, 10);
			});

			withinContext(context, (context) => {
				context.translate(-slabSzW / 2, 0);
				context.rotate(firstR);

				const w = slabSzW / Math.cos(firstR);

				context.beginPath();
				context.strokeStyle = 'blue';
				context.moveTo(0, 0);
				context.lineTo(w, 0);
				context.stroke();
				drawTwoArrowsAtAngle(context, w * 0.5, 0, Math.PI - Math.PI / 6, 10);
			});

			withinContext(context, (context) => {
				const w = slabSzW / Math.cos(firstR);

				context.translate(slabSzW / 2, w * Math.sin(firstR));
				context.rotate(secondR);

				context.beginPath();
				context.strokeStyle = 'blue';
				context.moveTo(0, 0);
				context.lineTo(width, 0);
				context.stroke();
				drawTwoArrowsAtAngle(context, width * 0.1, 0, Math.PI - Math.PI / 6, 10);
			});
		});
	}
</script>

<section>
	<h2>Slab</h2>
	<hr />
	<h2>Inputs</h2>
	<div class="input-cluster">
		<NumField min={1} step={0.1} bind:value={slabRefractiveIndex} id="slab-n"
			>{@html math('\\mu')}</NumField
		>
		<NumField min={1} bind:value={slabThickness} id="slab-t">Thickness:</NumField>
		<NumField
			min={0}
			max={(Math.atan((300 * 0.8) / slabThickness) * 180) / Math.PI}
			bind:value={incidentAngleDegrees}
			id="ia">I wrt N:</NumField
		>
	</div>
	<hr />
	<h2>Visualisation</h2>
	<canvas width="400" height="400" bind:this={canvas}></canvas>
	<p>Lateral shift: {lateralDisplacement}</p>
</section>
