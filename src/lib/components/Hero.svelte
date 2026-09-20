<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	import About from '$lib/components/About.svelte';

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
		// When the gyroscope is driving the logo, a touch ending must not snap it back to centre.
		if (gyroActive) return;
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

	// ---- Gyroscope parallax for the logo (touch devices) ------------------------
	// Same effect as the mouse parallax, but driven by tilting the phone.
	// Android: starts automatically. iOS: needs a permission prompt, which can only be
	// shown from a tap, so it is requested on the first tap anywhere on the page.
	// (Requires HTTPS or localhost.)
	const GYRO_RANGE_X = 9; // px each way (mouse parallax is +-9 too)
	const GYRO_RANGE_Y = 6; // px each way (mouse parallax is +-6 too)
	const GYRO_TILT_DEG = 25; // tilt from the resting pose that gives the full movement
	const GYRO_SMOOTHING = 0.15; // 0-1, lower = smoother/laggier
	const GYRO_RECENTER = 0.002; // how slowly the "rest" pose follows how you hold the phone
	const GYRO_DIRECTION = 1; // 1 = logo moves with the tilt, -1 = opposite

	type OrientationPermissionApi = { requestPermission?: () => Promise<'granted' | 'denied'> };

	let gyroActive = false;
	let gyroRequested = false;
	let gyroBaseX: number | null = null;
	let gyroBaseY: number | null = null;
	let gyroX = 0;
	let gyroY = 0;

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	function recenterGyro() {
		// Forget the resting pose (used after a screen rotation).
		gyroBaseX = null;
		gyroBaseY = null;
	}

	function handleOrientation(event: DeviceOrientationEvent) {
		// Desktops without a sensor fire one event with null values.
		if (event.beta === null || event.gamma === null) return;

		// gamma = left/right tilt, beta = front/back tilt. Swap them when the screen is rotated.
		const angle = screen.orientation?.angle ?? 0;
		let x = event.gamma;
		let y = event.beta;
		if (angle === 90) {
			x = event.beta;
			y = -event.gamma;
		} else if (angle === 270) {
			x = -event.beta;
			y = event.gamma;
		} else if (angle === 180) {
			x = -event.gamma;
			y = -event.beta;
		}

		// The first reading is the resting pose; it then drifts slowly toward how you hold the phone.
		gyroBaseX ??= x;
		gyroBaseY ??= y;
		gyroBaseX += (x - gyroBaseX) * GYRO_RECENTER;
		gyroBaseY += (y - gyroBaseY) * GYRO_RECENTER;

		const targetX = clamp((x - gyroBaseX) / GYRO_TILT_DEG, -1, 1) * GYRO_RANGE_X * GYRO_DIRECTION;
		const targetY = clamp((y - gyroBaseY) / GYRO_TILT_DEG, -1, 1) * GYRO_RANGE_Y * GYRO_DIRECTION;

		gyroX += (targetX - gyroX) * GYRO_SMOOTHING;
		gyroY += (targetY - gyroY) * GYRO_SMOOTHING;

		logoX = gyroX;
		logoY = gyroY;
	}

	async function enableGyro() {
		if (gyroRequested) return;
		gyroRequested = true;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const api = window.DeviceOrientationEvent as unknown as OrientationPermissionApi | undefined;
		if (!api) return;

		if (typeof api.requestPermission === 'function') {
			try {
				const state = await api.requestPermission();
				if (state !== 'granted') return;
			} catch {
				return;
			}
		}

		window.addEventListener('deviceorientation', handleOrientation);
		screen.orientation?.addEventListener('change', recenterGyro);
		gyroActive = true;
	}

	onMount(() => {
		// Only touch-first devices (phones/tablets) get the gyro effect; desktops keep the mouse parallax.
		if (!window.matchMedia('(pointer: coarse)').matches) return;

		const api = window.DeviceOrientationEvent as unknown as OrientationPermissionApi | undefined;
		const needsPermission = typeof api?.requestPermission === 'function';

		if (needsPermission) {
			// iOS: the permission prompt must come from a user gesture.
			window.addEventListener('click', enableGyro, { once: true });
			window.addEventListener('touchend', enableGyro, { once: true });
		} else {
			enableGyro();
		}

		return () => {
			window.removeEventListener('click', enableGyro);
			window.removeEventListener('touchend', enableGyro);
			window.removeEventListener('deviceorientation', handleOrientation);
			screen.orientation?.removeEventListener('change', recenterGyro);
			gyroActive = false;
		};
	});

	// ---- Retro-futurism background text --------------------------------------
	// The page uses a custom wheel transition, so window.scrollY stays at zero.
	// Drive the background text from the same state as the hero/About transition.
	// The travel distances live in CSS variables on the element (--retro-x / --retro-y)
	// so each breakpoint can use its own values.
	const retroProgress = $derived(currentPage >= 1 ? 1 : 0);

	function goNext() {
		if (isTransitioning || currentPage >= 2) return;
		isTransitioning = true;
		currentPage++;
		setTimeout(() => (isTransitioning = false), 1200);
	}

	function goPrev() {
		if (isTransitioning || currentPage <= 0) return;
		isTransitioning = true;
		currentPage--;
		setTimeout(() => (isTransitioning = false), 1200);
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

<!--
	Breakpoints
	- max-md  (< 768px)   : mobile layout, matched to the 350 x 762 reference
	- md      (768-1023)  : desktop layout, text/button sizes clamp so they stay readable
	- lg+     (1024px +)  : desktop layout, sizes grow smoothly on large screens
-->
<div
	class="relative min-h-screen overflow-hidden bg-[#3a1471] bg-[url('/background.jpg')] bg-cover bg-center text-white max-md:min-h-[100dvh] max-md:bg-[length:auto_108%] max-md:bg-[position:43%_center]"
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

	<!--
		Retro-futurism text: sits behind the logo and page content, moves with the page transition.
		Desktop: one row, anchored to the bottom.
		Mobile: wraps at the hyphen into two big rows (RETRO- / FUTURISM), anchored from the top.
	-->
	<div
		class="retro-text pointer-events-none fixed bottom-[-4vh] left-[1vw] z-[1] origin-bottom-left [--retro-x:-143vw] [--retro-y:-90vh] font-paused text-[35vw] leading-[0.72] tracking-normal whitespace-nowrap text-white/[0.17] uppercase transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform select-none max-md:top-[39dvh] max-md:bottom-auto max-md:left-[1vw] max-md:w-screen max-md:origin-top-left max-md:text-[63vw] max-md:leading-[1.24] max-md:whitespace-normal max-md:[--retro-x:-258vw] max-md:[--retro-y:-83dvh]"
		style={`transform: translate3d(calc(var(--retro-x) * ${retroProgress}), calc(var(--retro-y) * ${retroProgress}), 0) scaleY(0.82)`}
		aria-hidden="true"
	>
		Retro-Futurism
	</div>

	<header
		class="relative z-20 ml-[15vw] box-border flex w-[85vw] items-center gap-8 px-8 pt-7 max-md:ml-0 max-md:w-full max-md:px-4"
	>
		<div
			class="absolute top-[-3.8rem] left-[46%] z-[5] flex w-[min(52vw,760px)] max-w-[calc(100vw-2rem)] items-center justify-center transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none max-[900px]:top-[4dvh] max-[900px]:left-[46%] max-[900px]:w-[min(46vw,36dvh)] max-[900px]:max-w-none max-md:top-[10.5dvh] max-md:left-[54.3%] max-md:w-[min(97vw,calc(50dvh_-_18px))] max-md:max-w-none"
			class:opacity-0={currentPage >= 1}
			class:pointer-events-none={currentPage >= 1}
			aria-label="Tecnoesis home"
			style={`transform: translate3d(calc(-50% + ${logoX}px), ${logoY}px, 0)`}
		>
			<div
				class="pointer-events-none absolute inset-[-22%_-12%] z-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(142,48,210,0.44)_0%,rgba(82,24,160,0.25)_38%,rgba(44,14,104,0.08)_62%,transparent_78%)] blur-[26px] max-md:inset-[-30%_-20%] max-md:bg-[radial-gradient(ellipse_at_center,rgba(169,61,239,0.62)_0%,rgba(92,27,180,0.38)_40%,rgba(44,14,104,0.12)_68%,transparent_82%)] max-md:blur-[34px]"
				aria-hidden="true"
			></div>
			<img
				class="relative z-[1] block w-full drop-shadow-[0_0_10px_rgba(241,191,255,0.42)] drop-shadow-[0_0_28px_rgba(164,83,255,0.28)]"
				src="/logo.png"
				alt="Tecnoesis logo"
			/>
		</div>
	</header>

	<!-- On mobile the header is 1.75rem tall, so this makes <main> end exactly at the screen bottom -->
	<div
		class="relative z-[2] flex min-h-[calc(100vh-110px)] max-md:min-h-[calc(100dvh_-_1.75rem)]"
	>
		<aside class="relative box-border w-[15vw] max-w-[15vw] shrink-0 px-4 pb-4 max-md:hidden">
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

		<main class="relative box-border w-[85vw] min-w-0 shrink-0 pr-8 max-md:w-full max-md:pr-0">
			<Navbar />

			<!-- Intro text: 16.8px, 3 lines, left edge at ~20% on mobile -->
			<div
				class="absolute top-[calc(38%-6vh)] left-[7%] z-10 m-0 transition-opacity duration-500 max-[900px]:top-[34%] max-[900px]:left-[7%] max-[900px]:text-[clamp(0.85rem,1.5vw,1.2rem)] max-md:top-auto max-md:bottom-[27.3dvh] max-md:left-1/2 max-md:w-[90vw] max-md:max-w-none max-md:-translate-x-1/2"
				class:opacity-0={currentPage >= 1}
				class:pointer-events-none={currentPage >= 1}
			>
				<p
					class="m-0 text-left font-delicatus text-[clamp(1.1rem,1.5vw,1.3rem)] leading-[1.4] font-normal tracking-[0.05em] whitespace-nowrap text-white/85 capitalize max-md:w-full max-md:text-center max-md:text-[clamp(1rem,4.8vw,1.15rem)] max-md:leading-[1.45]"
				>
					Tecnoesis is the annual<br />
					Techno-Managerial<br />
					Event of NIT Silchar
				</p>
			</div>

			<!-- 3D MAP button: centred, 58.6vw x 40px, sits 17dvh above the bottom on mobile -->
			<div
				class="absolute top-[38%] right-[4.5%] z-10 flex h-[clamp(44px,4.1vw,64px)] w-[clamp(180px,19.7vw,320px)] cursor-pointer items-center justify-center overflow-hidden bg-[#3522b8] px-4 pb-[0.15rem] font-display text-[clamp(1.3rem,2vw,2.4rem)] leading-none font-medium tracking-[0.05em] text-white/95 uppercase transition-opacity duration-500 [clip-path:polygon(0_0,100%_0,100%_58%,89%_100%,0_100%)] before:absolute before:top-1/2 before:left-1/2 before:h-[240%] before:w-[130%] before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0.3] before:bg-[radial-gradient(ellipse_closest-side,#b41ecb_0%,#8a26d6_30%,#5527e0_62%,rgba(53,34,184,0)_100%)] before:opacity-0 before:transition-[transform,opacity] before:duration-500 before:ease-out hover:before:scale-100 hover:before:opacity-100 active:before:scale-100 active:before:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300 max-[900px]:top-[38%] max-[900px]:right-[4.5%] max-[900px]:h-[clamp(38px,5.4vw,52px)] max-[900px]:w-[clamp(170px,25vw,220px)] max-[900px]:text-[clamp(1rem,2.5vw,1.5rem)] max-md:top-auto max-md:right-auto max-md:bottom-[17dvh] max-md:left-1/2 max-md:h-[40px] max-md:w-[58.6vw] max-md:max-w-[300px] max-md:-translate-x-1/2 max-md:text-[clamp(1.1rem,5.9vw,1.5rem)]"
				class:opacity-0={currentPage >= 1}
				class:pointer-events-none={currentPage >= 1}
			>
				<span
					class="relative z-[1] w-full -translate-y-0.5 text-center font-display [text-shadow:0_0_18px_rgba(255,255,255,0.18)]"
					>3D MAP</span
				>
			</div>

			<div
				class="absolute bottom-4 left-[35vw] z-20 flex w-fit -translate-x-1/2 flex-col items-center justify-center font-display text-[0.88rem] leading-none tracking-[0.08em] text-white/90 lowercase transition-opacity duration-500 max-[900px]:bottom-2 max-[900px]:left-[35vw] max-[900px]:text-[0.72rem] max-md:bottom-2 max-md:left-1/2 max-md:text-[0.68rem]"
				class:opacity-0={currentPage >= 1}
				class:pointer-events-none={currentPage >= 1}
			>
				<span class="mb-2.5 block text-[1.7rem] leading-[0.7] max-md:mb-1.5 max-md:text-[1.15rem]"
					>⌄</span
				>
				<span class="block text-center">scroll</span>
			</div>

			<About visible={currentPage >= 1} />
		</main>
	</div>
</div>

