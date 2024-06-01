import type { ChartData } from 'chart.js';
import type { AtwoodSimResult } from '.';

type Graphs = 'y-t' | 'v-t';
const graphs: Record<Graphs, (simResults: AtwoodSimResult[]) => ChartData<'line'>> = {
	'y-t': (simResults: AtwoodSimResult[]) => {
		return {
			labels: simResults.map((row) => row.t.toPrecision(4)),
			datasets: [
				{
					label: 'y_m1',
					data: simResults.map((row) => row.value.sim_m1)
				},
				{
					label: 'y_m2',
					data: simResults.map((row) => row.value.sim_m2)
				}
			]
		};
	},
	'v-t': (simResults: AtwoodSimResult[]) => {
		return {
			labels: simResults.map((row) => row.t.toPrecision(4)),
			datasets: [
				{
					label: 'y_m1',
					data: simResults.map((row) => row.value.v_m1)
				},
				{
					label: 'y_m2',
					data: simResults.map((row) => row.value.v_m2)
				}
			]
		};
	}
};

export default graphs;
