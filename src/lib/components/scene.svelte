<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { OrbitControls, useGltf } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { Mesh, Object3D, MeshStandardMaterial } from 'three';

	const tshirt = useGltf('/models/tshirt21_fixed.glb');

	let y = $state(0);
	let rotation = $state(0);
	let swayX = 0;
	let swayZ = 0;
	let velocityX = 0;
	let velocityZ = 0;

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

			const materials = Array.isArray(object.material)
				? object.material
				: [object.material];

			for (const material of materials) {
				if (material instanceof MeshStandardMaterial) {
					material.roughness = 0.85;
					material.metalness = 0;
					material.color.multiplyScalar(0.75);
					material.emissiveIntensity = Math.min(
						material.emissiveIntensity,
						0.6
					);
					material.needsUpdate = true;
				}
			}
		});
	}

	onMount(() => {
		let lastX = 0;
		let lastY = 0;
		let initialized = false;

		function handleMouseMove(event: MouseEvent) {
			if (!initialized) {
				lastX = event.clientX;
				lastY = event.clientY;
				initialized = true;
				return;
			}

			const dx = event.clientX - lastX;
			const dy = event.clientY - lastY;

			lastX = event.clientX;
			lastY = event.clientY;

			velocityX = Math.max(-0.08, Math.min(0.08, velocityX + dx * 0.0008));
			velocityZ = Math.max(-0.05, Math.min(0.05, velocityZ + dy * 0.0005));
		}

		window.addEventListener('mousemove', handleMouseMove);

		return () => window.removeEventListener('mousemove', handleMouseMove);
	});

	useTask((delta) => {
		rotation += delta * 0.4;
		y = Math.sin(Date.now() / 1000 * 1.2) * 0.3;

		const stiffness = 12;
		const damping = 4;

		velocityX += (-swayX * stiffness - velocityX * damping) * delta;
		velocityZ += (-swayZ * stiffness - velocityZ * damping) * delta;

		swayX += velocityX * delta;
		swayZ += velocityZ * delta;
	});
</script>

<T.PerspectiveCamera
	makeDefault
	position={[0, 0, 7]}
	fov={50}
/>

<OrbitControls enableDamping target={[0, 0, 0]} />

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

{#await tshirt then model}
	{@const _shadows = configureShadows(model.scene)}
	{@const _material = configureMaterial(model.scene)}

	<T.Group
		position={[0, y, 0]}
		rotation={[swayZ, rotation + swayX, 0]}
	>
		<T is={model.scene} scale={0.4} />
	</T.Group>
{/await}