<script lang="ts">
	import { onDestroy } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	
	import About from "$lib/components/About.svelte";

	let logoX = $state(0);
	let logoY = $state(0);
	let currentPage = $state(0); // 0=hero, 1=about panel1, 2=about panel2
	let isTransitioning = $state(false);

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

	function goNext() {
		if (isTransitioning || currentPage >= 2) return;
		isTransitioning = true;
		currentPage++;
		setTimeout(() => isTransitioning = false, 1200);
	}

	function goPrev() {
		if (isTransitioning || currentPage <= 0) return;
		isTransitioning = true;
		currentPage--;
		setTimeout(() => isTransitioning = false, 1200);
	}

	function handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.closest('a, button, .login-btn, .main-nav, nav, .social-links')) return;
		goNext();
	}

	function handleWheel(event: WheelEvent) {
		if (isTransitioning) return;
		// Require a minimum delta to avoid micro-scrolls triggering transitions
		if (Math.abs(event.deltaY) < 30) return;
		event.preventDefault();
		if (event.deltaY > 0 && currentPage < 2) {
			goNext();
		} else if (event.deltaY < 0 && currentPage > 0) {
			goPrev();
		}
	}
</script>

<svelte:window bind:scrollY bind:innerHeight />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="relative min-h-screen overflow-hidden bg-[#3a1471] bg-[url('/background.jpg')] bg-cover bg-center text-white"
	class="landing-page"
	class:about-active={currentPage >= 1}
	role="presentation"
	onpointermove={handlePointerMove}
	onpointerleave={resetLogoPosition}
	onclick={handleClick}
	onwheel={handleWheel}
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
	<header class="topbar">
		<div
			class="brand"
			class:hidden={currentPage >= 1}
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
		<main class="hero-stage">
		<Navbar />
			<div class="copy-card" class:hidden={currentPage >= 1}>
				<p>
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
			<div class="map-button" class:hidden={currentPage >= 1}><span>3D MAP</span></div>
			<div class="scroll-indicator" class:hidden={currentPage >= 1}>
				<span class="arrow">⌄</span>
				<span>scroll</span>
			</div>

			<!-- About Tecnoesis Section -->
			<About {currentPage} />
		</main>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Bruno+Ace&family=Sulphur+Point:wght@300;400;700&display=swap');

	:global(body) {
		margin: 0;
		background: #090413;
		font-family: 'Segoe UI', sans-serif;
		color: white;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.landing-page {
		position: relative;
		min-height: 100vh;
		overflow: hidden;
		background:
			linear-gradient(180deg, rgba(22, 9, 36, 0.12), rgba(76, 26, 115, 0.2)),
			url('/background.jpg') center/cover no-repeat,
			#3a1471;
		cursor: pointer;
	}

	.landing-page::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 33%, rgba(223, 164, 255, 0.18), transparent 25%);
		pointer-events: none;
	}

	.topbar {
		position: relative;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 85vw;
		margin-left: 15vw;
		padding: 1.8rem 3rem 0 2rem;
		gap: 2rem;
	}

	.brand {
		display: flex;
		align-items: center;
		justify-content: center;
		width: min(clamp(420px, 52vw, 760px), calc(100vw - 2rem));
		height: auto;
		position: absolute;
		left: 46%;
		top: -3.8rem;
		transform: translate3d(calc(-50% + var(--logo-x, 0px)), var(--logo-y, 0px), 0);
		transition: transform 180ms ease-out, opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 5;
		opacity: 1;
	}

	.brand.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.brand::before {
		content: '';
		position: absolute;
		inset: -22% -12%;
		border-radius: 50%;
		background: radial-gradient(
			ellipse at center,
			rgba(142, 48, 210, 0.44) 0%,
			rgba(82, 24, 160, 0.25) 38%,
			rgba(44, 14, 104, 0.08) 62%,
			transparent 78%
		);
		filter: blur(26px);
		pointer-events: none;
		z-index: 0;
	}

	.brand img {
		display: block;
		width: 100%;
		height: auto;
		position: relative;
		z-index: 1;
		filter:
			drop-shadow(0 0 10px rgba(241, 191, 255, 0.42))
			drop-shadow(0 0 28px rgba(164, 83, 255, 0.28));
	}

	@media (prefers-reduced-motion: reduce) {
		.brand {
			transform: translateX(-50%);
			transition: none;
		}
	}

	

	.page-shell {
		position: relative;
		z-index: 2;
		display: flex;
		min-height: calc(100vh - 110px);
	}

	.left-column {
		position: relative;
		flex: 0 0 15vw;
		width: 15vw;
		max-width: 15vw;
		padding: 0 1rem 1rem 1rem;
	}

	.big-letters {
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	padding-top: 0;
	font-family: 'Bruno Ace', sans-serif;
	font-size: clamp(3rem, 6.1vw, 7.4rem);
	line-height: 0.92;
	letter-spacing: 0;
	font-weight: 700;
	color: rgba(255, 255, 255, 0.82);
	text-shadow: 0 0 16px rgba(255, 255, 255, 0.1);
}

.big-letters span {
	display: block;
	transform: rotate(-90deg);
}
	

	.side-links {
		position: absolute;
		left: 0.9rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1.6rem;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		writing-mode: vertical-rl;
		transform-origin: center;
		text-orientation: mixed;
	}

	/* Hero elements fade out transitions */
	.copy-card {
		position: absolute;
		top: 11.5rem;
		left: calc(100% + 0.25rem);
		margin: 0;
		padding: 0;
		max-width: 11rem;
		opacity: 1;
		transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.copy-card.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.copy-card p {
		margin: 0;
		font-family: 'Sulphur Point', sans-serif;
		color: rgba(255, 255, 255, 0.82);
		font-size: 0.72rem;
		line-height: 1.4;
		font-weight: 500;
	}

	.hero-stage {
		position: relative;
		flex: 0 0 85vw;
		width: 85vw;
		min-width: 0;
		padding: 0 2rem 0 0;
	}

	.map-button {
		position: absolute;
		right: 4.5%;
		top: 38%;
		width: min(240px, 22vw);
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255,255,255,0.96);
		font-family: 'Bruno Ace', sans-serif;
		font-size: clamp(1.3rem, 2vw, 2rem);
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		line-height: 1;
		background: #3522b8;
		border: 0;
		clip-path: polygon(0 0, 100% 0, 100% 58%, 89% 100%, 0 100%);
		box-shadow: none;
		z-index: 10;
		padding: 0 1rem 0.15rem;
		cursor: pointer;
		opacity: 1;
		transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.map-button.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.map-button::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 180%;
		aspect-ratio: 1;
		z-index: 0;
		background: radial-gradient(
			circle,
			#b41ecb 0%,
			#5527e0 48%,
			rgba(85, 39, 224, 0) 72%
		);
		opacity: 0;
		border-radius: 50%;
		transform: translate(-50%, -50%) scale(1);
		transform-origin: center;
		transition: transform 420ms ease-out, opacity 180ms ease;
		pointer-events: none;
	}

	.map-button:hover::before {
		opacity: 1;
		transform: translate(-50%, -50%) scale(0.15);
	}

	.map-button::after {
		content: none;
	}

	.map-button span {
		position: relative;
		z-index: 1;
		width: 100%;
		text-align: center;
		transform: translateY(-2px);
		text-shadow: 0 0 18px rgba(255,255,255,0.18);
	}

	.scroll-indicator {
		position: absolute;
		left: 50%;
		bottom: 1.5rem;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		color: rgba(255,255,255,0.86);
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		text-transform: lowercase;
		opacity: 1;
		transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.scroll-indicator.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.arrow {
		font-size: 2.2rem;
		line-height: 1;
	}



	@media (max-width: 980px) {
		.topbar {
			width: 85vw;
			margin-left: 15vw;
			padding-left: 1.2rem;
			padding-right: 1.2rem;
		}

		.main-nav {
			gap: 1rem;
		}

		.left-column {
			flex-basis: 15vw;
			width: 15vw;
			max-width: 15vw;
		}
	
		.copy-card {
			left: calc(100% + 0.25rem);
		}


	}

	@media (max-width: 720px) {
		.topbar {
			width: 100%;
			margin-left: 0;
			justify-content: space-between;
			padding-top: 1rem;
		}

		.main-nav {
			display: none;
		}

		.page-shell {
			display: block;
		}

		.left-column {
			max-width: none;
			width: 100%;
			flex: auto;
			padding-bottom: 0.5rem;
		}

		.big-letters {
			font-size: clamp(3rem, 13vw, 4rem);
		}

		.side-links {
			display: none;
		}

		.copy-card {
			position: static;
			max-width: 100%;
			margin-top: 1rem;
			padding: 0;
		}

		.hero-stage {
			min-height: 68vh;
		}


	}
</style>
