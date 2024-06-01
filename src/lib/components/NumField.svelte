<script lang="ts">
	export let value: number;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let step: number | undefined = undefined;
	export let id: string;
	export let placeholder: string | undefined = undefined;

	$: _value = value;

	const input = (e: Event) => {
		const v = parseFloat((e.target as HTMLInputElement).value);
		value = v;
	};
</script>

<label for={id}><slot /></label>
<input
	type="number"
	{id}
	{max}
	{min}
	{step}
	{placeholder}
	value={_value}
	on:input|preventDefault={(e) => input(e)}
/>

<style>
	input {
		@apply w-full;
	}
	label {
		@apply font-semibold text-slate-600;
	}
</style>
