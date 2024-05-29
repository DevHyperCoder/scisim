<script lang="ts">
	import Canvas from '$components/Canvas.svelte';
	import { withinContext, valConstraint } from '$lib';
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	export let width = 200,
		height = 200,
		angleRad: number;

	let _angleRad = angleRad;

	$: angleRad = valConstraint(_angleRad, 0, 90);

	const origin: [number, number] = [0, height];

	$: draw = (context: CanvasRenderingContext2D, width: number, height: number) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		withinContext(context, (context) => {
			context.translate(...origin);

			context.beginPath();
			context.moveTo(0, 0);
			context.arc(0, 0, 70, 0, -Math.PI / 2, true);
			context.strokeStyle = 'red';
			context.stroke();

			const drawLine = (angle: number) => {
				context.moveTo(0, 0);
				context.lineTo(2 * width * Math.cos(-angle), 2 * height * Math.sin(-angle));
			};

			drawLine(Math.PI / 6);
			drawLine(Math.PI / 4);
			drawLine(Math.PI / 3);

			context.stroke();
			context.beginPath();
			context.lineWidth = 3;
			drawLine(0);
			drawLine(Math.PI / 2);
			context.stroke();

			context.lineWidth = 3;
			context.strokeStyle = 'lightblue';
			context.beginPath();
			drawLine(angleRad);
			context.stroke();
		});
	};

	let mousedown = false;

	function act(clientX: number, clientY: number) {
		if (!mousedown) return;
		const rect = canvas.getBoundingClientRect();
		const x = clientX - rect.left;
		const y = clientY - rect.top;

		_angleRad = -Math.atan((y - origin[1]) / (x - origin[0]));
	}

	onMount(() => {
		console.log('as');

		canvas.style.touchAction = 'none';

		canvas.addEventListener('pointerdown', (_) => {
			mousedown = true;
		});
		canvas.addEventListener('pointerup', (_) => {
			mousedown = false;
		});
		canvas.addEventListener('pointermove', (ev: MouseEvent) => {
			act(ev.clientX, ev.clientY);
		});

		canvas.addEventListener('click', (ev: MouseEvent) => {
			mousedown = true;
			act(ev.clientX, ev.clientY);
			mousedown = false;
		});
	});
</script>

<Canvas bind:canvas {width} {height} {draw} />
