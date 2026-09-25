<script lang="ts">
	import { T } from '@threlte/core';
	import { useGltf } from '@threlte/extras';

	const model = useGltf('/models/tshirt.glb');
</script>

{#await model}
	<!-- Loading -->
{:then gltf}
	<T is={gltf.scene} />
{/await}