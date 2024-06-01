import { Vector } from '$lib/Vector';
import { withinContext } from '$lib';

export default function draw(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	bodyPos: Vector
) {
	const padding = width * 0.1;
	const scale = width / 100;

	context.fillStyle = 'black';
	context.fillRect(0, 0, width, height);
	console.log('fil black');

	withinContext(context, (context) => {
		context.translate(padding, height / 2);
		context.beginPath();
		context.strokeStyle = 'gray';
		context.moveTo(0, 0);
		context.lineTo(width - 2 * padding, 0);
		context.stroke();

		context.scale(scale, scale);
		const radius = 10 / scale;
		context.fillStyle = 'lightpink';
		context.beginPath();
		context.arc(bodyPos.x, -(bodyPos.y + radius), radius, 0, Math.PI * 2);
		context.fill();
	});
}
