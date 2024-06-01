import { drawTwoArrowsAtAngle, withinContext } from '$lib';

export default function draw(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	surfaceAngleRad: number = 0,
	incidentWithNormalRad: number = 0
) {
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
