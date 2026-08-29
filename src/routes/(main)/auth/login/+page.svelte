<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<main>
	<h1>Login</h1>
	<p>{data.message}</p>
</main>
