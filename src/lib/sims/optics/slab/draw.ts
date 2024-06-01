import { drawTwoArrowsAtAngle, withinContext } from '$lib';
export default function draw(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	incidentAngleRad: number,
	slabSzW: number,
	firstR: number,
	secondR: number
) {
	context.fillStyle = 'black';
	context.fillRect(0, 0, width, height);

	//const slabSzW = 100;
	const slabSzH = (height * 3) / 4;

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

			context.strokeStyle = 'yellow';
			drawTwoArrowsAtAngle(context, -50, 0, Math.PI - Math.PI / 6, 10);
			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(-width, 0);
			context.stroke();
			context.beginPath();
			context.moveTo(0, 0);
			context.setLineDash([5, 3]);
			context.lineTo(width, 0);
			context.stroke();
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
