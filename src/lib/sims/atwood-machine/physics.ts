import { valConstraint } from '$lib';
import type { AtwoodSimResult } from '.';

interface AtwoodPhysicsProps {
	input_initial_m1y: number;
	input_initial_m2y: number;
	um1: number;
	um2: number;
	a: number;
}

export default function physics(
	props: AtwoodPhysicsProps,
	dt: number = 1 / 1000
): AtwoodSimResult[] {
	const { input_initial_m1y, input_initial_m2y, um1, um2, a } = props;

	let sim_m1 = input_initial_m1y;
	let sim_m2 = input_initial_m2y;
	let v_m1 = um1;
	let v_m2 = um2;
	let t = 0;

	const phyData = [{ t, value: { v_m1, v_m2, sim_m2, sim_m1 } }];

	console.time('Atwood physics');

	// eslint-disable-next-line no-constant-condition
	while (true) {
		v_m1 += a * dt;
		v_m2 += -a * dt;

		sim_m1 = valConstraint(sim_m1 + v_m1 * dt, 0, 100);
		sim_m2 = valConstraint(sim_m2 + v_m2 * dt, 0, 100);
		t += dt;

		// Stop physics once at extreme points
		if (sim_m1 === 0 || sim_m2 === 0 || sim_m1 === 100 || sim_m2 === 100) {
			break;
		}

		phyData.push({ t, value: { v_m1, v_m2, sim_m2, sim_m1 } });
	}
	console.timeEnd('Atwood physics');

	return phyData;
}
