<script lang="ts">
	import { onMount } from 'svelte';
	import { Vector } from '$lib/Vector';

	export let surfaceAngleRad: number;
	export let incidentWithSurfaceRad: number;

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

<canvas bind:this={canvas} width="400" height="400" />
