<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.mainmodule} / {data.submodule}</title>
</svelte:head>

<h1>{data.mainmodule} / {data.submodule}</h1>
<pre>{JSON.stringify(data.data, null, 2)}</pre>
