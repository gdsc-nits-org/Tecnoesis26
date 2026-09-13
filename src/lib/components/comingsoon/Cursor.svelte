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
		transform-origin: center;
		pointer-events: none;
		user-select: none;
		z-index: 9999;
		transition:
			left 0.08s ease-out,
			top 0.08s ease-out;
		animation: cursor-rotate 4s linear infinite;
	}

	@keyframes cursor-rotate {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}

		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.custom-cursor {
			animation: none;
		}
	}

	:global(body) {
		cursor: none;
	}

	:global(*) {
		cursor: none !important;
	}

	@media (hover: none), (pointer: coarse) {
		.custom-cursor {
			display: none;
		}

		:global(*) {
			cursor: auto !important;
		}
	}
</style>
