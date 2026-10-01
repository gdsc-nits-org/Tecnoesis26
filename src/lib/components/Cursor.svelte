<script lang="ts">
	import { onMount } from 'svelte';

	let x = $state(0);
	let y = $state(0);
	let isVisible = $state(false);
	let isClickable = $state(false);

	function updateCursor(event: PointerEvent) {
		if (event.pointerType === 'touch') return;

		x = event.clientX;
		y = event.clientY;
		isVisible = true;

		let target = document.elementFromPoint(event.clientX, event.clientY);
		isClickable = false;

		while (target) {
			if (
				target.matches(
					'a, button, input, select, textarea, summary, [role="button"], [role="link"], [onclick], [tabindex]:not([tabindex="-1"])'
				) ||
				getComputedStyle(target).cursor === 'pointer'
			) {
				isClickable = true;
				break;
			}
			target = target.parentElement;
		}
	}

	function hideCursor() {
		isVisible = false;
		isClickable = false;
	}

	onMount(() => {
		if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

		window.addEventListener('pointermove', updateCursor);
		window.addEventListener('blur', hideCursor);

		return () => {
			window.removeEventListener('pointermove', updateCursor);
			window.removeEventListener('blur', hideCursor);
		};
	});
</script>

<div
	class="custom-cursor z-9999!"
	class:custom-cursor--visible={isVisible}
	style={`left:${x}px;top:${y}px`}
	aria-hidden="true"
>
	<img src="/cursor.svg" alt="" />
	{#if isClickable}
		<span>CLICK</span>
	{/if}
</div>

<style>
	.custom-cursor {
		position: fixed;
		z-index: 9999;
		display: flex;
		width: 90px;
		transform: translate(-50%, -50%);
		align-items: center;
		flex-direction: column;
		pointer-events: none;
		user-select: none;
		opacity: 0;
		transition: opacity 120ms ease;
	}

	.custom-cursor--visible {
		opacity: 1;
	}

	.custom-cursor img {
		display: block;
		width: 90px;
		height: 90px;
		animation: cursor-rotate 4s linear infinite;
	}

	.custom-cursor span {
		margin-top: -10px;
		color: #f0edda;
		font-family: 'Bruno Ace', sans-serif;
		font-size: 9px;
		letter-spacing: 0.15em;
		text-shadow:
			0 1px 8px rgba(5, 7, 28, 0.95),
			0 0 8px rgba(255, 255, 255, 0.6);
	}

	@keyframes cursor-rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	:global(body),
	:global(*) {
		cursor: none !important;
	}

	@media (prefers-reduced-motion: reduce) {
		.custom-cursor img {
			animation: none;
		}
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
