<script lang="ts">
	import { onDestroy } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	let logoX = $state(0);
	let logoY = $state(0);

	function handlePointerMove(event: PointerEvent) {
		if (event.pointerType === 'touch') return;

		const target = event.currentTarget as HTMLElement;
		const bounds = target.getBoundingClientRect();
		logoX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
		logoY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
	}

	function resetLogoPosition() {
		logoX = 0;
		logoY = 0;
	}

	const letters = ['T', 'E', 'C', 'N', 'O', 'E', 'S', 'I', 'S'];

	const glitchFrames = [
		'100110100',
		'001010001',
		'101001001',
		'011010111',
		'100101101',
		'110110100',
		'111111111'
	].map((frame) => [...frame].map((c) => c === '1'));

	const GLITCH_INTERVAL_MS = 70;
	const GLITCH_DURATION_MS = 500;

	let glitchStep = $state(-1);
	let glitchTimer: ReturnType<typeof setInterval> | undefined;
	let glitchTimeout: ReturnType<typeof setTimeout> | undefined;

	function startGlitch(event: PointerEvent) {
		if (event.pointerType === 'touch') return;
		if (glitchTimer || glitchTimeout) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		// Start glitch
		glitchStep = 0;

		// Change frames while the effect is active
		glitchTimer = setInterval(() => {
			glitchStep = Math.floor(Math.random() * glitchFrames.length);
		}, GLITCH_INTERVAL_MS);

		// ALWAYS stop after fixed duration
		glitchTimeout = setTimeout(() => {
			stopGlitch();
		}, GLITCH_DURATION_MS);
	}

	function stopGlitch() {
		if (glitchTimer) {
			clearInterval(glitchTimer);
			glitchTimer = undefined;
		}

		if (glitchTimeout) {
			clearTimeout(glitchTimeout);
			glitchTimeout = undefined;
		}

		// Restore all letters
		glitchStep = -1;
	}

	function isLetterVisible(index: number) {
		return glitchStep === -1 || glitchFrames[glitchStep][index];
	}

	onDestroy(stopGlitch);

	// ---- Retro-futurism background text --------------------------------------
	// Scroll progress: 0 = hero, 1 = one full screen down (About section).
	// If your sections scroll inside a container (or a custom scroller such as
	// Lenis/GSAP), set `retroProgress` from that scroller instead.
	let scrollY = $state(0);
	let innerHeight = $state(0);

	const retroProgress = $derived(
		innerHeight > 0 ? Math.min(Math.max(scrollY / innerHeight, 0), 1) : 0
	);

	// Total travel over the hero -> About scroll (tuned from the reference video).
	const RETRO_TRAVEL_X_VW = 143; // slides left, revealing "-FUTURISM"
	const RETRO_TRAVEL_Y_VH = 90; // rises with the page, a touch slower than the scroll
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div
	class="relative min-h-screen overflow-hidden bg-[#3a1471] bg-[url('/background.jpg')] bg-cover bg-center text-white"
	role="presentation"
	onpointermove={handlePointerMove}
	onpointerleave={resetLogoPosition}
>
	<div
		class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(22,9,36,0.12),rgba(76,26,115,0.2))]"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_33%,rgba(223,164,255,0.18),transparent_25%)]"
		aria-hidden="true"
	></div>

	<!-- Retro-futurism text: sits behind the logo and page content, moves with scroll -->
	<div
		class="pointer-events-none fixed bottom-0 left-[-5vw] z-[1] leading-[0.72] font-paused text-[33vw] tracking-normal whitespace-nowrap text-white/[0.17] uppercase select-none will-change-transform"
		style={`transform: translate3d(${-RETRO_TRAVEL_X_VW * retroProgress}vw, ${-RETRO_TRAVEL_Y_VH * retroProgress}vh, 0)`}
		aria-hidden="true"
	>
		Retro-Futurism
	</div>

	<header class="relative z-20 ml-[15vw] flex w-[85vw] items-center gap-8 px-8 pt-7">
		<div
			class="absolute top-[-3.8rem] left-[46%] z-[5] flex w-[min(52vw,760px)] max-w-[calc(100vw-2rem)] items-center justify-center transition-transform duration-200 ease-out motion-reduce:transition-none"
			aria-label="Tecnoesis home"
			style={`transform: translate3d(calc(-50% + ${logoX}px), ${logoY}px, 0)`}
		>
			<div
				class="pointer-events-none absolute inset-[-22%_-12%] z-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(142,48,210,0.44)_0%,rgba(82,24,160,0.25)_38%,rgba(44,14,104,0.08)_62%,transparent_78%)] blur-[26px]"
				aria-hidden="true"
			></div>
			<img
				class="relative z-[1] block w-full drop-shadow-[0_0_10px_rgba(241,191,255,0.42)] drop-shadow-[0_0_28px_rgba(164,83,255,0.28)]"
				src="/logo.png"
				alt="Tecnoesis logo"
			/>
		</div>
	</header>

	<div class="relative z-[2] flex min-h-[calc(100vh-110px)]">
		<aside class="relative box-border w-[15vw] max-w-[15vw] shrink-0 px-4 pb-4">
			<div
				class="flex transform flex-col-reverse items-center pt-0 font-['Bruno_Ace'] text-[clamp(2.9rem,5.8vw,7rem)] leading-[0.88] font-bold tracking-[0] text-[rgba(255,255,255,0.82)] [text-shadow:0_0_16px_rgba(255,255,255,0.1)]"
				role="presentation"
				aria-label="Tecnoesis"
				onpointerenter={startGlitch}
				onpointerleave={stopGlitch}
			>
				{#each letters as letter, i (i)}
					<span
						class="-rotate-90 {letter === 'I' ? '-m-5' : ''}"
						class:opacity-0={!isLetterVisible(i)}
					>
						{letter}
					</span>
				{/each}
			</div>

			<div
				class="absolute top-1/2 left-[0.9rem] flex -translate-y-1/2 rotate-180 flex-row items-center gap-[1.6rem] text-[0.72rem] tracking-[0.14em] text-white/80 uppercase [text-orientation:mixed] [writing-mode:vertical-rl]"
				aria-label="Page sections"
			>
				<span>Hero</span>
				<span>About</span>
				<span>Events</span>
				<span>Sponsors</span>
			</div>
		</aside>

		<main class="relative w-[85vw] min-w-0 shrink-0 pr-8">
			<Navbar />
			<div class="absolute top-[calc(38%-6vh)] left-[7%] z-10 m-0">
				<p
					class="m-0 text-left font-display text-[0.8rem] leading-[1.4] font-normal tracking-[0.05em] whitespace-nowrap text-white/85 capitalize"
				>
					Tecnoesis is the annual<br />
					Techno-Managerial<br />
					Event of NIT Silchar
				</p>
			</div>

			<div
				class="absolute top-[38%] right-[4.5%] z-10 flex h-[50px] w-[min(240px,22vw)] cursor-pointer items-center justify-center overflow-hidden bg-[#3522b8] px-4 pb-[0.15rem] font-display text-[clamp(1.3rem,2vw,2rem)] leading-none font-medium tracking-[0.05em] text-white/95 uppercase [clip-path:polygon(0_0,100%_0,100%_58%,89%_100%,0_100%)] before:absolute before:top-1/2 before:left-1/2 before:h-[240%] before:w-[130%] before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0.3] before:bg-[radial-gradient(ellipse_closest-side,#b41ecb_0%,#8a26d6_30%,#5527e0_62%,rgba(53,34,184,0)_100%)] before:opacity-0 before:transition-[transform,opacity] before:duration-500 before:ease-out hover:before:scale-100 hover:before:opacity-100"
			>
				<span
					class="relative z-[1] w-full -translate-y-0.5 text-center font-display [text-shadow:0_0_18px_rgba(255,255,255,0.18)]"
					>3D MAP</span
				>
			</div>

			<div
				class="absolute bottom-4 left-[35vw] z-20 flex w-fit -translate-x-1/2 flex-col items-center justify-center font-display text-[0.88rem] leading-none tracking-[0.08em] text-white/90 lowercase"
			>
				<span class="mb-2.5 block text-[1.7rem] leading-[0.7]">⌄</span>
				<span class="block text-center">scroll</span>
			</div>
		</main>
	</div>
</div>

