<script lang="ts">
	import NumField from '$lib/NumField.svelte';
	import { Vector } from '$lib/Vector';
	import { onMount } from 'svelte';
	import Layout from '../../+layout.svelte';

	let angle = 70;
	$: angleRad = (angle * Math.PI) / 180;

	let objectLengthInput = 0;
	let objectLengthFrom: 'bottom' | 'top' = 'bottom';

	let planeLength = 5;
	$: objectLengthFromTop =
		objectLengthFrom === 'bottom' ? objectLengthInput : planeLength - objectLengthInput;
	$: bodyPerc = objectLengthFromTop / planeLength;

	let staticFrictionCoeff = 0;
	let kineticFrictionCoeff = 0;

	let mass = 1;
	let gravity = 10;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let ready = false;

	$: if (ready) draw(angle, bodyPerc);

	onMount(() => {
		context = canvas.getContext('2d')!;
		ready = true;
	});

	function draw(angle: number, bodyPerc: number) {
		const width = 300;
		const height = 300;
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

		context.lineWidth = 8;
		context.strokeStyle = 'red';

		context.beginPath();
		context.moveTo(startingPoint.x, startingPoint.y);
		context.lineTo(endingPoint.x, endingPoint.y);
		context.stroke();

		context.lineWidth = 2;
		// Angle marker to right angle
		if (angle == 90) {
			context.beginPath();
			context.moveTo(startingPoint.x + 50, startingPoint.y);
			context.lineTo(startingPoint.x + 50, startingPoint.y - 50);
			context.lineTo(startingPoint.x, startingPoint.y - 50);
			context.stroke();
		} else if (angle > 0) {
			context.beginPath();
			context.arc(startingPoint.x, startingPoint.y, 50, 0, 2 * Math.PI - angleRad, true);
			context.stroke();
		}

		// Text showing the degree of inclination
		context.font = '20px Montserrat';
		context.fillStyle = 'green';
		let textY = startingPoint.y - 10;
		if (angle < 30) {
			textY = startingPoint.y + 20;
		}
		context.fillText(angle.toString() + '°', startingPoint.x + 50 + 10, textY);

		// Body
		const bodySz = 20;
		const bodyPoint = new Vector(
			startingPoint.x + lenOfPlanePx * bodyPerc * Math.cos(angleRad),
			startingPoint.y - lenOfPlanePx * bodyPerc * Math.sin(angleRad)
		);

		context.beginPath();
		context.translate(bodyPoint.x, bodyPoint.y);
		context.rotate(Math.PI - angleRad);
		context.rect(-bodySz/2, bodySz/4, bodySz, bodySz );
		context.fillStyle = 'orange';
		context.fill();
		context.setTransform(1, 0, 0, 1, 0, 0);
	}

</script>

<main>
	<header>
		<h1>Inclined plane</h1>
		<p>This inclined plane simulation lets users explore
		how objects move on slopes. They can adjust friction and
		applied force to see how these affect the object's motion,
		providing a straightforward way to understand inclined plane
		mechanics.</p>
	</header>
	<section>
		<h2>Inclined plane</h2>
		<div class="input-cluster">
			<NumField
				min={0}
				max={90}
				bind:value={angle}
				placeholder="Enter the angle of inclination of the plane (in degrees)"
				id="ip-angle">Angle</NumField
			>

			<NumField
				min={0}
				bind:value={planeLength}
				placeholder="Length of the inclined plane"
				id="ip-len-plane">Plane Length</NumField
			>
			<NumField
				min={0}
				max={planeLength}
				bind:value={objectLengthInput}
				placeholder="Length of the inclined plane"
				id="ip-len-plane">Object Position</NumField
			>
			<label for="ip-len-apply">From</label>
			<div id="ip-len-apply" role="radiogroup">
				<label for="ip-la-btm">Bottom</label>
				<input id="ip-la-btm" type="radio" bind:group={objectLengthFrom} value="bottom" />
				<label class="ml-3" for="ip-la-top">Top</label>
				<input id="ip-la-top" type="radio" bind:group={objectLengthFrom} value="top" />
			</div>
		</div>
		<hr />
		<h2>Object</h2>
		<div class="input-cluster">
			<NumField min={0} bind:value={mass} placeholder="Mass of the object" id="ip-sf">Mass</NumField
			>
			<NumField min={0} bind:value={gravity} placeholder="Gravity of the environment" id="ip-sf"
				>Gravity</NumField
			>
		</div>
		<hr />
		<h2>Friction</h2>
		<div class="input-cluster">
			<NumField
				min={0}
				step={0.1}
				bind:value={staticFrictionCoeff}
				placeholder="Static friction coeff"
				id="ip-sf">Static</NumField
			>
			<NumField
				min={0}
				step={0.1}
				bind:value={kineticFrictionCoeff}
				placeholder="Kinetic friction coeff"
				id="ip-sf">Kinetic</NumField
			>
		</div>
	</section>

	<section>
		<canvas width={300} height={300} bind:this={canvas} />
	</section>
</main>

<style>
	.input-cluster {
		@apply grid-cols-[16ch_1fr];
	}
</style>
