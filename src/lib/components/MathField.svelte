<script lang="ts">
	import { parse, type EvalFunction } from 'mathjs';

	export let initial: string;
	export let step = 1;
	export let id: string;
	export let placeholder: string | undefined = undefined;

	export let fn: EvalFunction;
	//export let value: number;

	let inp: string = initial;
	let err: string;

	$: {
		try {
			if (inp) {
				const tree = parse(inp);
				fn = tree.compile();

				//const res = tree.evaluate(scope);

				//// Assume it is in meters
				//if (typeof res === 'number') {
				//	value = res;
				//} else if (typeof res === 'object') {
				//	const u = unit(res.value, res.units[0].unit.name);
				//	value = u.toNumber('m');
				//} else {
				//	throw new Error(`${typeof res} was unexpected!`);
				//}
			}
			err = '';
		} catch (e) {
			err = e.message;
		}
	}

	// Emulate stepping of values using arrow keys if
	function arrowIncrDecr(key: string) {
		// If the input is not a number, we don't want to incrememnt /
		// decrement anything because it doesn't make any sense
		try {
			const fl = Number(inp);
			if (isNaN(fl)) return;

			switch (key) {
				case 'ArrowUp':
					inp = (fl + step).toString();
					break;
				case 'ArrowDown':
					inp = (fl - step).toString();
					break;
				default:
					break;
			}
		} catch (e) {
			// eslint-disable-next-line no-empty
		}
	}
</script>

<label for={id}><slot /></label>
<div>
	<input
		{id}
		{placeholder}
		on:keyup|preventDefault={(ev) => arrowIncrDecr(ev.key)}
		bind:value={inp}
	/>
	{#if err}
		<p class="text-red-500">{err}</p>
	{/if}
</div>

<style>
	input {
		@apply w-full;
	}
	label {
		@apply font-semibold text-slate-600;
	}
</style>
