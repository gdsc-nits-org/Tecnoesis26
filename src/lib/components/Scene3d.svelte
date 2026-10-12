<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { useGltf } from '@threlte/extras';
	import { Mesh, Object3D, MeshStandardMaterial } from 'three';

	let { dragRotationX, dragRotationY }: { dragRotationX: number; dragRotationY: number } = $props();

	const tshirt = useGltf('/models/tshirt21_fixed.glb');

	let y = $state(0);
	let rotation = $state(0);

	function configureShadows(scene: Object3D) {
		scene.traverse((object) => {
			if (object instanceof Mesh) {
				object.castShadow = true;
				object.receiveShadow = true;
			}
		});
	}

	function configureMaterial(scene: Object3D) {
		scene.traverse((object) => {
			if (!(object instanceof Mesh)) return;

			const materials = Array.isArray(object.material) ? object.material : [object.material];

			for (const material of materials) {
				if (material instanceof MeshStandardMaterial) {
					material.roughness = 0.85;
					material.metalness = 0;
					material.color.multiplyScalar(0.75);
					material.emissiveIntensity = Math.min(material.emissiveIntensity, 0.6);
					material.needsUpdate = true;
				}
			}
		});
	}

	useTask((delta) => {
		rotation += delta * 0.4;
		y = Math.sin((Date.now() / 1000) * 1.2) * 0.1;
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={50} />

<T.AmbientLight intensity={0.25} />

<T.DirectionalLight
	position={[-4, 6, 4]}
	intensity={3}
	castShadow
	shadow-bias={-0.0005}
	shadow-mapSize-width={2048}
	shadow-mapSize-height={2048}
/>

<T.DirectionalLight position={[4, 2, -4]} intensity={0.4} />

{#await $tshirt then model}
	{#if model}
		{@const modelScene = model.scene}
		{configureShadows(modelScene)}
		{configureMaterial(modelScene)}

		<T.Group position={[0, y, 0]} rotation={[dragRotationX, rotation + dragRotationY, 0]}>
			<T is={modelScene} scale={0.4} />
		</T.Group>
	{/if}
{/await}
