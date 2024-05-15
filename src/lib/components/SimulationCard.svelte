<script lang="ts">
	export let id: string;
	export let name: string;
</script>

<div class="sim-card">
	<div class="flex items-center justify-between mb-1">
		<h3>{name}</h3>
		<a href="/sim/{id}">View</a>
	</div>
	<slot />
</div>

<style>
	.sim-card {
		@apply bg-white p-3;
	}

	a {
		@apply text-blue-800 underline;
	}

	h3 {
		@apply font-semibold text-lg;
	}
</style>
