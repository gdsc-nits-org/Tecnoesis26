<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import Model from './Model.svelte';
</script>

<div class="viewer">
	<Canvas>
		<T.PerspectiveCamera
			makeDefault
			position={[0, 1, 4]}
			fov={45}
		/>

		<T.AmbientLight intensity={2} />

		<T.DirectionalLight
			position={[3, 3, 3]}
			intensity={2}
		/>

		<Model />
	</Canvas>
</div>

<style>
	.viewer {
		width: 100vw;
		height: 100vh;
		background: #292020;
	}
</style>