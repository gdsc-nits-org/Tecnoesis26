<script>
	import D01 from '$lib/components/comingsoon/D01.svelte';
	import D02 from '$lib/components/comingsoon/D02.svelte';
	import D03 from '$lib/components/comingsoon/D03.svelte';
	import Cursor from '$lib/components/comingsoon/Cursor.svelte';
	let currentDesign = 'D01';
</script>

{#if currentDesign === 'D01'}
	<D01 />
{:else if currentDesign === 'D02'}
	<D02 />
{:else if currentDesign === 'D03'}
	<D03 />
{/if}
<Cursor />
