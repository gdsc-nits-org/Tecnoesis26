<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

	let container: HTMLDivElement;
	let status = $state('Initializing...');

	onMount(() => {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x202025);

		const camera = new THREE.PerspectiveCamera(
			45,
			container.clientWidth / container.clientHeight,
			0.01,
			1000
		);

		camera.position.set(0, 0, 5);

		const renderer = new THREE.WebGLRenderer({
			antialias: true
		});

		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.outputColorSpace = THREE.SRGBColorSpace;

		container.appendChild(renderer.domElement);

		// Lights
		scene.add(new THREE.AmbientLight(0xffffff, 2));

		const keyLight = new THREE.DirectionalLight(0xffffff, 4);
		keyLight.position.set(3, 5, 5);
		scene.add(keyLight);

		const fillLight = new THREE.DirectionalLight(0xffffff, 2);
		fillLight.position.set(-3, 2, 3);
		scene.add(fillLight);

		let model: THREE.Object3D | null = null;

		const loader = new GLTFLoader();

		status = 'Loading model...';

		loader.load(
			// Change this to .glb if your file is a GLB
			'/models/tshirt.glb',

            (gltf) => {
                model = gltf.scene;

                // Get the original bounding box
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                const maxDimension = Math.max(size.x, size.y, size.z);

                // Scale model to a reasonable size
                const scale = 2 / maxDimension;
                model.scale.setScalar(scale);

                // Center AFTER scaling
                model.position.set(
                    -center.x * scale,
                    -center.y * scale,
                    -center.z * scale
                );

                scene.add(model);
                const helper = new THREE.BoxHelper(model, 0xff0000);
                scene.add(helper);

                // Ensure camera points toward the model
                camera.position.set(0, 0, 5);
                camera.lookAt(0, 0, 0);

                status = 'Model loaded successfully';

                console.log('Model loaded:', gltf);
                console.log('Scale:', scale);
                console.log('Original dimensions:', size);
            },

			(progress) => {
				if (progress.total > 0) {
					const percentage = Math.round(
						(progress.loaded / progress.total) * 100
					);

					status = `Loading: ${percentage}%`;
				}
			},

			(error) => {
				status = 'Failed to load model';
				console.error('GLTF loading error:', error);
			}
		);

		let animationFrame: number;

		function animate() {
			animationFrame = requestAnimationFrame(animate);

			if (model) {
				model.rotation.y += 0.01;
			}

			renderer.render(scene, camera);
		}

		animate();

		const resizeObserver = new ResizeObserver(() => {
			const width = container.clientWidth;
			const height = container.clientHeight;

			if (width === 0 || height === 0) return;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize(width, height);
		});

		resizeObserver.observe(container);

		return () => {
			cancelAnimationFrame(animationFrame);
			resizeObserver.disconnect();

			scene.traverse((object) => {
				if (object instanceof THREE.Mesh) {
					object.geometry.dispose();

					if (Array.isArray(object.material)) {
						object.material.forEach((material) => material.dispose());
					} else {
						object.material.dispose();
					}
				}
			});

			renderer.dispose();
			renderer.domElement.remove();
		};
	});
</script>

<div class="model-container" bind:this={container}>
	<div class="status">{status}</div>
</div>

<style>
	.model-container {
		width: 100%;
		height: 600px;
		position: relative;
		overflow: hidden;
		background: #202025;
	}

	.status {
		position: absolute;
		top: 12px;
		left: 12px;
		z-index: 10;
		padding: 8px 12px;
		border-radius: 6px;
		background: rgba(0, 0, 0, 0.65);
		color: white;
		font-family: monospace;
		font-size: 12px;
		pointer-events: none;
	}
</style>