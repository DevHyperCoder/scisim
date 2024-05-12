<script lang="ts">
	export let value: string;
	export let label: string;
	export let unit: string = '';
</script>

<p>
	<b class="lbl">{label}:</b>
	{value}
	<span class="text-slate-800 font-semibold">
		{#if unit}
			{unit}
		{:else}
			<slot />{/if}</span
	>
</p>
