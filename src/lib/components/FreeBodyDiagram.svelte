<script lang="ts">
	export let top: number = 0.0;
	export let left: number = 0.0;
	export let bottom: number = 0.0;
	export let right: number = 0.0;
	export let name: string;
</script>

<div class="fbd-container">
	<p class="fbd-top">{top.toPrecision(4)} ↑</p>
	<p class="fbd-left">←{left.toPrecision(4)}</p>
	<p class="fbd-right">{right.toPrecision(4)} →</p>
	<p class="fbd-bottom">{bottom.toPrecision(4)} ↓</p>
	<p class="fbd-text">{name}</p>
</div>

<style>
	.fbd-container {
		display: grid;
		width: 100%;
		gap: 1rem;
		grid-template-columns: 1fr auto 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		border: 2px solid red;
	}
	.fbd-container > p {
		display: flex;
		align-items: center;
		height: 100%;
	}
	.fbd-top {
		text-align: right;
		grid-column: 2;
	}
	.fbd-bottom {
		text-align: right;
		grid-row: 3;
		grid-column: 2;
	}
	.fbd-left {
		margin-left: auto;
		text-align: right;
		grid-row: 2;
		grid-column: 1;
	}
	.fbd-right {
		text-align: left;
		grid-row: 2;
		grid-column: 3;
	}
	.fbd-text {
		width: fit-content;
		text-align: center;
		grid-row: 2;
		grid-column: 2;
		border: 3px dotted green;
		padding: 0.5ch;
		margin: auto;
	}
</style>
