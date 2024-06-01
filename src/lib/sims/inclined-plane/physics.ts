import { Vector } from '$lib/Vector';
import type { EvalFunction } from 'mathjs';
import type { InclinedPlaneSimResult } from '.';

interface InclinedPlanePhysicsProps {
	mass: number;
	gravity: number;
	angleRad: number;
	planeLength: number;
	staticFricFn: EvalFunction;
	kineticFricFn: EvalFunction;
}
export default function physics(
	props: InclinedPlanePhysicsProps,
	dt: number = 1 / 1000
): InclinedPlaneSimResult[] {
	const { planeLength, angleRad, mass, gravity, staticFricFn, kineticFricFn } = props;
	const mg = mass * gravity;
	const g = gravity;

	const data = [];

	const bodyPos = new Vector(0, 0);
	const bodyVel = new Vector(0, 0);
	let t = 0;

	data.push({ t, value: { bodyPos: bodyPos.clone(), bodyVel: bodyVel.clone() } });

	const gravityAccel = new Vector(
		-g * Math.sin(angleRad) * Math.cos(angleRad),
		g * Math.sin(angleRad) * Math.sin(angleRad)
	);

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const sF = staticFricFn.evaluate({ t });
		const kF = kineticFricFn.evaluate({ t });

		const velAlongPlane = bodyVel.len();

		let fricAcclAlongPlane = 0;

		// Friction handling
		const normal = mg * Math.cos(angleRad);
		const aclAlongPlane = gravityAccel.len();

		// Static friction
		if (velAlongPlane === 0 || Math.abs(velAlongPlane) < 0.01) {
			const maxFricAcl = (sF * normal) / mass;
			fricAcclAlongPlane = -Math.min(maxFricAcl, aclAlongPlane);
			if (fricAcclAlongPlane == -aclAlongPlane) {
				alert('Object will be stationary now.');
				break;
			}
		}
		// Kinetic friction
		else {
			fricAcclAlongPlane = -Math.min((kF * normal) / mass, aclAlongPlane);
		}

		const fricAccl = new Vector(
			-fricAcclAlongPlane * Math.cos(angleRad),
			fricAcclAlongPlane * Math.sin(angleRad)
		);

		const accel = gravityAccel.add(fricAccl);
		bodyVel.madd(accel.multiply(dt));
		bodyPos.madd(bodyVel.multiply(dt));
		t += dt;

		if (bodyPos.y >= planeLength * Math.sin(angleRad)) {
			break;
		}

		data.push({ t, value: { bodyPos: bodyPos.clone(), bodyVel: bodyVel.clone() } });
	}

	return data;
}
