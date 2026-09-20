<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	const glitchFrames = [
		'100110100',
		'001010001',
		'101001001',
		'011010111',
		'100101101',
		'110110100',
		'111111111'
	].map((frame) => [...frame].map((character) => character === '1'));

	let label = $state('TECNOESIS');
	let glitchStep = $state(-1);
	let glitchTimer: ReturnType<typeof setInterval> | undefined;
	let glitchTimeout: ReturnType<typeof setTimeout> | undefined;

	const letters = $derived([...label]);

	function stopGlitch() {
		if (glitchTimer) clearInterval(glitchTimer);
		if (glitchTimeout) clearTimeout(glitchTimeout);
		glitchTimer = undefined;
		glitchTimeout = undefined;
		glitchStep = -1;
	}

	function startGlitch(nextLabel: string) {
		if (nextLabel === label) return;
		stopGlitch();

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			label = nextLabel;
			return;
		}

		glitchStep = 0;
		glitchTimer = setInterval(() => {
			glitchStep = Math.floor(Math.random() * glitchFrames.length);
		}, 70);
		glitchTimeout = setTimeout(() => {
			label = nextLabel;
			stopGlitch();
		}, 500);
	}

	function isLetterVisible(index: number) {
		return (
			glitchStep === -1 ||
			index >= glitchFrames[glitchStep].length ||
			glitchFrames[glitchStep][index]
		);
	}

	onMount(() => {
		const sponsors = document.querySelector('[data-sponsors-section]');
		if (!sponsors) return;

		const observer = new IntersectionObserver(
			([entry]) => startGlitch(entry.isIntersecting ? 'SPONSORS' : 'TECNOESIS'),
			{ threshold: 0.35 }
		);
		observer.observe(sponsors);

		return () => observer.disconnect();
	});

	onDestroy(stopGlitch);
</script>

<aside class="section-rail" aria-label={label}>
	<div class="rail-word" aria-hidden="true">
		{#each letters as letter, index (index)}
			<span class:opacity-0={!isLetterVisible(index)}>{letter}</span>
		{/each}
	</div>
</aside>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Bruno+Ace&display=swap');

	.section-rail {
		position: fixed;
		inset: 0 auto 0 0;
		z-index: 40;
		display: flex;
		width: 15vw;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.rail-word {
		display: flex;
		transform: rotate(-90deg);
		font-family: 'Bruno Ace', sans-serif;
		font-size: clamp(2.9rem, 5.8vw, 7rem);
		font-weight: 700;
		line-height: 0.88;
		letter-spacing: 0;
		color: rgba(255, 255, 255, 0.82);
		text-shadow: 0 0 16px rgba(255, 255, 255, 0.1);
	}

	.rail-word span {
		transition: opacity 70ms linear;
	}

	@media (max-width: 767px) {
		.section-rail {
			display: none;
		}
	}
</style>
