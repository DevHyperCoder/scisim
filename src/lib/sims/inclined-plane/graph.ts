import type { ChartData } from 'chart.js';
import type { InclinedPlaneSimResult } from '.';

type Graphs = 'y-t' | 'v-t';
const graphs: Record<Graphs, (simResults: InclinedPlaneSimResult[]) => ChartData<'line'>> = {
	'y-t': (simResults: InclinedPlaneSimResult[]) => {
		return {
			labels: simResults.map((row) => row.t.toPrecision(4)),
			datasets: [
				{
					label: 'y',
					data: simResults.map((row) => row.value.bodyPos.y)
				}
			]
		};
	},
	'v-t': (simResults: InclinedPlaneSimResult[]) => {
		return {
			labels: simResults.map((row) => row.t.toPrecision(4)),
			datasets: [
				{
					label: 'v',
					data: simResults.map((row) => row.value.bodyVel.len())
				}
			]
		};
	}
};

export default graphs;
