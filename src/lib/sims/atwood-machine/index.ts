import type { SimResult } from '$lib/types';

export type AtwoodSimResult = SimResult<{
	sim_m1: number;
	sim_m2: number;
	v_m1: number;
	v_m2: number;
}>;
