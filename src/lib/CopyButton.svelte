<script lang="ts">
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let data: any;
</script>

<button
	on:click={() => {
		navigator.clipboard.writeText(JSON.stringify(data));
		alert('copied!');
	}}><slot /></button
>
