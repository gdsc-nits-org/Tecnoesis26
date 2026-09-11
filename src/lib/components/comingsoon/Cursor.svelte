<script>
	import { onMount } from 'svelte';

	let x = $state(0);
	let y = $state(0);

	/** @param {MouseEvent} event */
	function handleMouseMove(event) {
		x = event.clientX;
		y = event.clientY;
	}

	onMount(() => {
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<img
	src="/coming-soon/cursor.svg"
	alt=""
	class="custom-cursor"
	style={`left: ${x}px; top: ${y}px;`}
/>

<style>
	.custom-cursor {
		position: fixed;
		width: 90px;
		height: 90px;
		transform: translate(-50%, -50%);
		pointer-events: none;
		user-select: none;
		z-index: 9999;
		transition:
			left 0.08s ease-out,
			top 0.08s ease-out;
	}

	:global(body) {
		cursor: none;
	}

	@media (hover: none), (pointer: coarse) {
		.custom-cursor {
			display: none;
		}

		:global(body) {
			cursor: auto;
		}
	}
</style>