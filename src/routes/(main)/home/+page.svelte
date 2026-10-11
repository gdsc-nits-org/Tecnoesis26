<script lang="ts">
	import { onMount } from 'svelte';
	import { Hero } from '$lib';
	import { About, SectionRail, Sponsors, Merch, Modules, Gallery } from '$lib/components';

	let { data } = $props();

	let visibleSections = $state<Record<string, boolean>>({
		TECNOESIS: true,
		ABOUT: true,
		MERCH: false,
		MODULES: false,
		GALLERY: false,
		SPONSORS: false
	});

	onMount(() => {
		const sectionEls = document.querySelectorAll<HTMLElement>('[data-section-name]');
		if (!sectionEls.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const name = entry.target.getAttribute('data-section-name');
					if (!name) continue;

					// Hero remains visible when scrolled near the very top
					if (name === 'TECNOESIS' && window.scrollY < window.innerHeight * 0.5) {
						visibleSections[name] = true;
						continue;
					}

					if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
						visibleSections[name] = true;
					} else if (!entry.isIntersecting || entry.intersectionRatio < 0.05) {
						visibleSections[name] = false;
					}
				}
			},
			{
				threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75]
			}
		);

		sectionEls.forEach((el) => observer.observe(el));

		const handleScroll = () => {
			if (window.scrollY < window.innerHeight * 0.4) {
				visibleSections['TECNOESIS'] = true;
			}
		};
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<SectionRail />

<div
	class="home-section"
	class:is-active={visibleSections['TECNOESIS']}
	data-section-name="TECNOESIS"
>
	<Hero />
</div>

<div
	class="home-section home-section--about"
	class:is-active={visibleSections['ABOUT']}
	data-section-name="ABOUT"
>
	<About />
</div>

<div
	class="home-section home-section--screen"
	class:is-active={visibleSections['MERCH']}
	data-section-name="MERCH"
>
	<Merch />
</div>

<div
	class="home-section home-section--screen"
	class:is-active={visibleSections['MODULES']}
	data-section-name="MODULES"
>
	<Modules />
</div>

<div
	class="home-section home-section--screen"
	class:is-active={visibleSections['GALLERY']}
	data-section-name="GALLERY"
>
	<Gallery />
</div>

<div
	class="home-section home-section--screen home-section--sponsors"
	class:is-active={visibleSections['SPONSORS']}
	data-section-name="SPONSORS"
>
	<Sponsors sponsors={data.sponsors} />
</div>

<style>
	.home-section {
		position: relative;
		width: 100%;
		max-width: 100vw;
		overflow-x: clip;
		isolation: isolate;
	}

	/* Hero Section */
	.home-section[data-section-name='TECNOESIS'] {
		min-height: 100vh;
		min-height: 100svh;
		opacity: 1;
		transition: opacity 600ms ease;
	}

	/* About Section: Must not use transform/filter so that sticky scroll viewport behaves correctly */
	.home-section--about {
		min-height: 200vh;
		opacity: 1;
		transform: none !important;
		filter: none !important;
		transition: opacity 600ms ease;
	}

	/* Individual Screen-height Sections (Merch, Modules, Gallery, Sponsors) */
	.home-section--screen {
		min-height: 100vh;
		min-height: 100svh;
		width: 100%;
		max-width: 100vw;
		overflow-x: clip;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		opacity: 0.08;
		transform: translateY(28px) scale(0.98);
		filter: blur(6px);
		pointer-events: none;
		transition:
			opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
			filter 700ms cubic-bezier(0.16, 1, 0.3, 1);
		will-change: opacity, transform, filter;
	}

	.home-section--screen.is-active {
		opacity: 1;
		transform: translateY(0) scale(1);
		filter: blur(0px);
		pointer-events: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.home-section--screen {
			opacity: 1 !important;
			transform: none !important;
			filter: none !important;
			transition: none !important;
			pointer-events: auto !important;
		}
	}

	@media (scripting: none) {
		.home-section--screen {
			opacity: 1 !important;
			transform: none !important;
			filter: none !important;
			pointer-events: auto !important;
		}
	}
</style>
