<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
</svelte:head>

<main>
	<h1>Dashboard</h1>
	<p>{data.user}</p>
</main>
