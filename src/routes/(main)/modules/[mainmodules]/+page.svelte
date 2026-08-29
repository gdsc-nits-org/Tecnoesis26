<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.mainmodule}</title>
</svelte:head>

<h1>{data.mainmodule}</h1>
<pre>{JSON.stringify(data.data, null, 2)}</pre>
