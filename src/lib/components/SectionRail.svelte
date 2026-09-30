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
	let sectionObserver: IntersectionObserver | undefined;

	const letters = $derived([...label]);

	function stopGlitch() {
		if (glitchTimer) clearInterval(glitchTimer);
		if (glitchTimeout) clearTimeout(glitchTimeout);
		glitchTimer = undefined;
		glitchTimeout = undefined;
		glitchStep = -1;
	}

	function startGlitch(nextLabel: string, force = false) {
		if (!force && nextLabel === label) return;
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

	function triggerHoverGlitch() {
		startGlitch(label, true);
	}

	function isLetterVisible(index: number) {
		return (
			glitchStep === -1 ||
			index >= glitchFrames[glitchStep].length ||
			glitchFrames[glitchStep][index]
		);
	}

	onMount(() => {
		const sections = [...document.querySelectorAll<HTMLElement>('[data-section-name]')];
		if (!sections.length) return;

		const visibleSections = new Map<Element, IntersectionObserverEntry>();
		const updateLabel = () => {
			const currentSection = [...visibleSections.values()]
				.filter((entry) => entry.isIntersecting)
				.sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

			if (currentSection) {
				startGlitch(currentSection.target.getAttribute('data-section-name') ?? 'TECNOESIS');
			}
		};

		sectionObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) visibleSections.set(entry.target, entry);
				updateLabel();
			},
			{ threshold: [0, 0.25, 0.5, 0.75, 1] }
		);
		sections.forEach((section) => sectionObserver?.observe(section));

		return () => sectionObserver?.disconnect();
	});

	onDestroy(stopGlitch);
</script>

<aside class="section-rail absolute !top-16" aria-label={label}>
	<div class="rail-word" aria-hidden="true" onmouseenter={triggerHoverGlitch}>
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
		pointer-events: auto; /* Enables mouse hover detection on the text */
		cursor: pointer;
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
