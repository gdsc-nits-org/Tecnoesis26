<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	// Stages: 1 = Initial TECNOESIS + Logo + Tap/Hold, 2 = Transition Horizon, 3 = Selection, 4 = Jet Plane Formation & Dissolve
	let stage = $state<1 | 2 | 3 | 4>(1);
	let holdProgress = $state(0);
	let isHolding = $state(false);
	let isAudioOn = $state(true);
	let activeBtn = $state<string | null>(null);

	// Jet Plane Formation State (Stage 4)
	let planeProgress = $state(0);
	let isDissolving = $state(false);

	// Pointer & Halftone Orb Tracking
	let cursorX = $state(0);
	let cursorY = $state(0);
	let orbXPercent = $state(45); // default positioned over text
	let orbXOffsetPx = $state(0);
	let isPointerInside = $state(false);
	let isHoveringText = $state(false);
	let textContainerEl = $state<HTMLElement | null>(null);

	let fillTimer: number | null = null;
	let drainTimer: number | null = null;

	function updateOrbFromPointer(clientX: number, clientY: number) {
		cursorX = clientX;
		cursorY = clientY;
		isPointerInside = true;

		if (textContainerEl && stage === 1) {
			const rect = textContainerEl.getBoundingClientRect();
			if (rect.width > 0) {
				const clampedX = Math.max(0, Math.min(rect.width, clientX - rect.left));
				orbXPercent = (clampedX / rect.width) * 100;
				orbXOffsetPx = clampedX;

				isHoveringText =
					clientX >= rect.left - 20 &&
					clientX <= rect.right + 20 &&
					clientY >= rect.top - 20 &&
					clientY <= rect.bottom + 20;
			}
		}
	}

	function handlePointerMove(e: PointerEvent) {
		updateOrbFromPointer(e.clientX, e.clientY);
	}

	function startHold(e?: PointerEvent) {
		if (stage !== 1) return;
		if (e) {
			updateOrbFromPointer(e.clientX, e.clientY);
		}
		if (drainTimer) {
			cancelAnimationFrame(drainTimer);
			drainTimer = null;
		}
		isHolding = true;

		const fillStep = () => {
			if (!isHolding || stage !== 1) return;
			// Takes ~1.2s to reach 100%
			holdProgress = Math.min(100, holdProgress + 1.3);
			if (holdProgress >= 100) {
				isHolding = false;
				triggerStage2();
			} else {
				fillTimer = requestAnimationFrame(fillStep);
			}
		};
		fillTimer = requestAnimationFrame(fillStep);
	}

	function cancelHold() {
		if (stage !== 1) return;
		isHolding = false;
		if (fillTimer) {
			cancelAnimationFrame(fillTimer);
			fillTimer = null;
		}
		if (holdProgress < 100 && stage === 1) {
			const drainStep = () => {
				if (isHolding || stage !== 1) return;
				// Smoothly drains back to 0%
				holdProgress = Math.max(0, holdProgress - 2.0);
				if (holdProgress > 0) {
					drainTimer = requestAnimationFrame(drainStep);
				} else {
					drainTimer = null;
				}
			};
			drainTimer = requestAnimationFrame(drainStep);
		}
	}

	function triggerStage2() {
		if (fillTimer) {
			cancelAnimationFrame(fillTimer);
			fillTimer = null;
		}
		stage = 2;
		// 800ms delay before transitioning to stage 3 as specified in Figma prototype
		setTimeout(() => {
			stage = 3;
		}, 800);
	}

	function toggleActive(id: string) {
		activeBtn = activeBtn === id ? null : id;
	}

	function triggerWebEntrance(e: Event) {
		e.preventDefault();
		toggleActive('web');
		// 100ms delay per Figma spec, then transition to stage 4
		setTimeout(() => {
			stage = 4;
			planeProgress = 0;
			isDissolving = false;

			// 600ms ease-out formation from center outward per Figma spec
			const duration = 600;
			const startTime = performance.now();

			const formStep = (currentTime: number) => {
				const elapsed = currentTime - startTime;
				const rawProgress = Math.min(1, elapsed / duration);
				// Ease out cubic
				const ease = 1 - Math.pow(1 - rawProgress, 3);
				planeProgress = ease * 100;

				if (rawProgress < 1) {
					requestAnimationFrame(formStep);
				} else {
					planeProgress = 100;
					// Hold briefly then dissolve (300ms ease out) and navigate to /home per Figma spec
					setTimeout(() => {
						isDissolving = true;
						setTimeout(() => {
							goto(resolve('/home'));
						}, 300);
					}, 150);
				}
			};
			requestAnimationFrame(formStep);
		}, 100);
	}

	// Mobile & Desktop Real Bouncy Ball Physics (Natural parabolic arcs & elastic rebounds)
	let mobileOrbX = $state(40);
	let mobileOrbY = $state(40);
	let mobileOrbVx = $state(2.6);
	let mobileOrbVy = $state(1.5);
	let desktopOrbX = $state(120);
	let desktopOrbY = $state(80);
	let desktopOrbVx = $state(3.2);
	let desktopOrbVy = $state(2.0);
	const gravity = 0.16;
	const restitution = 0.98;
	let bounceRaf: number | null = null;
	let mainWrapperEl = $state<HTMLElement | null>(null);

	// Mobile Hero Offsets
	let mobileHeroEl = $state<HTMLElement | null>(null);
	let mobileContainerEl = $state<HTMLElement | null>(null);
	let heroOffsetX = $state(0);
	let heroOffsetY = $state(0);
	let heroWidth = $state(350);
	let heroHeight = $state(280);

	// Desktop Hero Offsets
	let desktopHeroEl = $state<HTMLElement | null>(null);
	let desktopContainerEl = $state<HTMLElement | null>(null);
	let desktopHeroOffsetX = $state(0);
	let desktopHeroOffsetY = $state(0);
	let desktopHeroWidth = $state(1172);
	let desktopHeroHeight = $state(300);

	// Mobile Draggable Slider State
	let mobileDragProgress = $state(0);
	let isMobileDragging = $state(false);
	let mobileSliderTrackEl = $state<HTMLElement | null>(null);
	let dragDrainTimer: number | null = null;

	function startMobileBounce() {
		if (typeof window === 'undefined') return;
		const mobOrbSize = 96; // 96px on mobile
		const deskOrbSize = 180; // 180px on desktop

		const animate = () => {
			if (stage === 1) {
				const width = window.innerWidth;
				const height = window.innerHeight;

				// MOBILE BOUNCE PHYSICS
				const mobMaxX = Math.max(0, width - mobOrbSize);
				const mobMaxY = Math.max(0, height - mobOrbSize);

				if (mobileHeroEl && mobileContainerEl) {
					const heroRect = mobileHeroEl.getBoundingClientRect();
					const contRect = mobileContainerEl.getBoundingClientRect();
					heroOffsetX = heroRect.left - contRect.left;
					heroOffsetY = heroRect.top - contRect.top;
					heroWidth = heroRect.width;
					heroHeight = heroRect.height;
				}

				mobileOrbVy += gravity;
				mobileOrbX += mobileOrbVx;
				mobileOrbY += mobileOrbVy;

				if (mobileOrbX <= 0) {
					mobileOrbX = 0;
					mobileOrbVx = Math.abs(mobileOrbVx) * restitution;
					if (Math.abs(mobileOrbVx) < 2.0) mobileOrbVx = 2.4;
				} else if (mobileOrbX >= mobMaxX) {
					mobileOrbX = mobMaxX;
					mobileOrbVx = -Math.abs(mobileOrbVx) * restitution;
					if (Math.abs(mobileOrbVx) < 2.0) mobileOrbVx = -2.4;
				}

				if (mobileOrbY <= 0) {
					mobileOrbY = 0;
					mobileOrbVy = Math.abs(mobileOrbVy) * restitution;
				} else if (mobileOrbY >= mobMaxY) {
					mobileOrbY = mobMaxY;
					mobileOrbVy = -Math.abs(mobileOrbVy) * restitution;
					if (Math.abs(mobileOrbVy) < 6.5) {
						mobileOrbVy = -(7.5 + Math.random() * 2.5);
					}
				}

				// DESKTOP BOUNCE PHYSICS
				const deskMaxX = Math.max(0, width - deskOrbSize);
				const deskMaxY = Math.max(0, height - deskOrbSize);

				if (desktopHeroEl && desktopContainerEl) {
					const dHeroRect = desktopHeroEl.getBoundingClientRect();
					const dContRect = desktopContainerEl.getBoundingClientRect();
					desktopHeroOffsetX = dHeroRect.left - dContRect.left;
					desktopHeroOffsetY = dHeroRect.top - dContRect.top;
					desktopHeroWidth = dHeroRect.width;
					desktopHeroHeight = dHeroRect.height;
				}

				desktopOrbVy += gravity;
				desktopOrbX += desktopOrbVx;
				desktopOrbY += desktopOrbVy;

				if (desktopOrbX <= 0) {
					desktopOrbX = 0;
					desktopOrbVx = Math.abs(desktopOrbVx) * restitution;
					if (Math.abs(desktopOrbVx) < 2.2) desktopOrbVx = 3.0;
				} else if (desktopOrbX >= deskMaxX) {
					desktopOrbX = deskMaxX;
					desktopOrbVx = -Math.abs(desktopOrbVx) * restitution;
					if (Math.abs(desktopOrbVx) < 2.2) desktopOrbVx = -3.0;
				}

				if (desktopOrbY <= 0) {
					desktopOrbY = 0;
					desktopOrbVy = Math.abs(desktopOrbVy) * restitution;
				} else if (desktopOrbY >= deskMaxY) {
					desktopOrbY = deskMaxY;
					desktopOrbVy = -Math.abs(desktopOrbVy) * restitution;
					if (Math.abs(desktopOrbVy) < 7.5) {
						desktopOrbVy = -(9.0 + Math.random() * 3.0);
					}
				}
			}
			bounceRaf = requestAnimationFrame(animate);
		};
		bounceRaf = requestAnimationFrame(animate);
	}

	function handleMobileDragStart(e: PointerEvent | TouchEvent) {
		if (stage !== 1) return;
		isMobileDragging = true;
		if (dragDrainTimer) {
			cancelAnimationFrame(dragDrainTimer);
			dragDrainTimer = null;
		}
		handleMobileDragMove(e);
	}

	function handleMobileDragMove(e: PointerEvent | TouchEvent) {
		if (!isMobileDragging || !mobileSliderTrackEl || stage !== 1) return;
		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const rect = mobileSliderTrackEl.getBoundingClientRect();
		const thumbSize = 32; // h-8 is 32px
		const availableWidth = rect.width - thumbSize - 8;
		if (availableWidth <= 0) return;

		const currentX = clientX - rect.left - thumbSize / 2 - 4;
		const clampedProgress = Math.max(0, Math.min(100, (currentX / availableWidth) * 100));
		mobileDragProgress = clampedProgress;

		// ONLY trigger when dragged fully to the end (>= 98%)
		if (clampedProgress >= 98) {
			mobileDragProgress = 100;
			isMobileDragging = false;
			triggerStage2();
		}
	}

	function handleMobileDragEnd() {
		if (!isMobileDragging) return;
		isMobileDragging = false;
		// If released before 98%, spring all the way back to 0
		if (mobileDragProgress < 98 && stage === 1) {
			const drain = () => {
				if (isMobileDragging || stage !== 1) return;
				mobileDragProgress = Math.max(0, mobileDragProgress - 4.5);
				if (mobileDragProgress > 0) {
					dragDrainTimer = requestAnimationFrame(drain);
				} else {
					mobileDragProgress = 0;
					dragDrainTimer = null;
				}
			};
			dragDrainTimer = requestAnimationFrame(drain);
		}
	}

	onMount(() => {
		startMobileBounce();
		if (textContainerEl) {
			const rect = textContainerEl.getBoundingClientRect();
			orbXOffsetPx = (rect.width * orbXPercent) / 100;
		}
		return () => {
			if (fillTimer) cancelAnimationFrame(fillTimer);
			if (drainTimer) cancelAnimationFrame(drainTimer);
			if (bounceRaf) cancelAnimationFrame(bounceRaf);
			if (dragDrainTimer) cancelAnimationFrame(dragDrainTimer);
		};
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Bruno+Ace&family=Doto:wght,ROND@100..900,0..100&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Main Container using OUR_BG.png across all pages -->
<!-- Full page tap/mouse hold listeners for Stage 1 (Desktop) -->
<div
	bind:this={mainWrapperEl}
	role="region"
	aria-label="Tecnoesis Landing Page"
	onpointerdown={startHold}
	onpointerup={cancelHold}
	onpointercancel={cancelHold}
	onpointerleave={() => {
		cancelHold();
		isPointerInside = false;
	}}
	onpointermove={handlePointerMove}
	class="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[url('/images/OUR_BG.png')] bg-cover bg-center bg-no-repeat select-none {stage ===
	1
		? 'md:cursor-none'
		: ''}"
>
	<!-- CUSTOM SCI-FI CURSOR (Active in Stage 1 when not directly on text on desktop) -->
	{#if stage === 1 && isPointerInside && !isHoveringText}
		<div
			class="pointer-events-none fixed z-50 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center transition-opacity duration-150 md:flex"
			style="left: {cursorX}px; top: {cursorY}px;"
		>
			<!-- Circular Cybernetic Reticle -->
			<div class="relative flex h-14 w-14 items-center justify-center">
				<!-- Outer Rotating Dashed Ring -->
				<svg
					class="absolute inset-0 h-full w-full animate-[spin_5s_linear_infinite]"
					viewBox="0 0 100 100"
				>
					<circle
						cx="50"
						cy="50"
						r="46"
						fill="none"
						stroke="rgba(255,255,255,0.75)"
						stroke-width="1.8"
						stroke-dasharray="6 4 12 4 18 5"
					/>
					<circle
						cx="50"
						cy="50"
						r="38"
						fill="none"
						stroke="rgba(216,180,254,0.4)"
						stroke-width="1.2"
					/>
				</svg>

				<!-- Progress fill ring on holding -->
				{#if isHolding}
					<svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
						<circle
							cx="50"
							cy="50"
							r="46"
							fill="none"
							stroke="#ec4899"
							stroke-width="2.5"
							stroke-dasharray="289"
							stroke-dashoffset={289 - (289 * holdProgress) / 100}
							stroke-linecap="round"
							class="drop-shadow-[0_0_8px_rgba(236,72,153,1)] transition-all duration-75"
						/>
					</svg>
				{/if}

				<!-- Center Icon / Text -->
				{#if !isHolding}
					<!-- Center Triangle ▲ -->
					<svg
						class="h-5 w-5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<polygon points="12,4 21,20 3,20" stroke-linejoin="round" />
					</svg>
				{:else}
					<!-- HOLD text inside circle -->
					<span
						class="animate-pulse font-['Bruno_Ace'] text-[10px] font-black tracking-wider text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
					>
						HOLD
					</span>
				{/if}
			</div>

			<!-- Text Below Cursor when not holding -->
			{#if !isHolding}
				<span
					class="mt-1 font-['Bruno_Ace'] text-[9px] tracking-[0.15em] whitespace-nowrap text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] sm:text-[10px]"
				>
					CLICK & HOLD
				</span>
			{/if}
		</div>
	{/if}

	<!-- Ambient Background Glows -->
	<div
		class="pointer-events-none absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/15 blur-3xl"
	></div>

	<!-- STAGE 1: Initial Landing Screen -->
	{#if stage === 1}
		<!-- MOBILE STAGE 1 VIEW (< md) -->
		<div
			bind:this={mobileContainerEl}
			class="relative z-10 flex w-full flex-1 flex-col justify-between px-4 py-8 select-none transition-all duration-700 ease-out md:hidden"
		>
			<!-- Bouncing Chromatic Crystal Orb (Identical Lighter Crystal Style, Color & Functionality as Desktop) -->
			<div
				class="pointer-events-none absolute top-0 left-0 z-30 h-24 w-24 overflow-hidden rounded-full border border-white/35 shadow-[0_0_25px_rgba(168,85,247,0.45)] backdrop-blur-md will-change-[left,top]"
				style="left: {mobileOrbX}px; top: {mobileOrbY}px;"
			>
				<!-- Lighter Chromatic Amethyst Glass Base with animated drifting crystal mosaic -->
				<div
					class="animate-crystal-drift absolute inset-0 bg-gradient-to-br from-[#3b156a]/70 via-[#240d42]/60 to-[#0e041c]/75 bg-[url('/images/crystal-bg.png')] bg-[size:95px_95px] bg-repeat opacity-90 mix-blend-color-dodge"
				></div>

				<!-- Floating Micro-Particles Overlay -->
				<div
					class="animate-particle-shimmer pointer-events-none absolute inset-0 bg-[radial-gradient(#00f5ff_1.2px,transparent_1.2px),radial-gradient(#ff007f_1.2px,transparent_1.2px),radial-gradient(#ffd700_1.2px,transparent_1.2px)] bg-[size:14px_14px,18px_18px,22px_22px] opacity-90 mix-blend-screen"
				></div>

				<!-- Unified Crystal Facet Highlights -->
				<svg
					class="pointer-events-none absolute inset-0 h-full w-full opacity-60"
					viewBox="0 0 100 100"
					fill="none"
				>
					<polygon
						points="50,6 88,32 68,74 50,92 18,72 12,30"
						stroke="rgba(255,255,255,0.45)"
						stroke-width="0.8"
						fill="none"
					/>
					<polygon
						points="50,6 68,50 88,32"
						stroke="rgba(168,85,247,0.45)"
						stroke-width="0.6"
						fill="none"
					/>
					<polygon
						points="50,6 32,50 12,30"
						stroke="rgba(255,0,128,0.4)"
						stroke-width="0.6"
						fill="none"
					/>
				</svg>

				<!-- Inverted Dark Halftone Negative-Space / Glowing Neon Text Layer inside Crystal -->
				<div class="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
					<div
						class="pointer-events-none absolute flex flex-col items-center justify-center"
						style="left: {heroOffsetX - mobileOrbX}px; top: {heroOffsetY - mobileOrbY}px; width: {heroWidth}px; height: {heroHeight}px;"
					>
						<!-- Logo Silhouette inside Crystal -->
						<div class="relative z-0 h-56 w-56 opacity-25 sm:h-64 sm:w-64">
							<img
								src="/images/tecnoesis-logo.png"
								alt=""
								class="h-full w-full object-contain brightness-0 invert"
							/>
						</div>

						<!-- Luminous Glowing Neon TECNOESIS Text inside Crystal (NOT plain white) -->
						<span
							class="font-game-paused relative z-20 -mt-28 text-center text-[48px] leading-none tracking-normal uppercase select-none sm:-mt-32 sm:text-[58px] text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] via-[#ff00a0] to-[#c084fc] drop-shadow-[0_0_12px_#00f5ff] drop-shadow-[0_0_24px_#ec4899] drop-shadow-[0_0_40px_#a855f7]"
						>
							TECNOESIS
						</span>
					</div>
				</div>

				<!-- Specular Crystal Shine & Curvature Vignette -->
				<div
					class="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_32%,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.04)_40%,rgba(0,0,0,0.6)_100%)]"
				></div>
			</div>

			<!-- Top space placeholder -->
			<div class="h-4"></div>

			<!-- Center Hero Section: Exact Figma positioning with Logo Emblem + Overlaid TECNOESIS Pixel Text -->
			<div
				bind:this={mobileHeroEl}
				class="relative my-auto flex w-full flex-col items-center justify-center"
			>
				<!-- Metallic Emblem Logo -->
				<div class="relative z-0 h-56 w-56 sm:h-64 sm:w-64">
					<img
						src="/images/tecnoesis-logo.png"
						alt="Tecnoesis Emblem"
						class="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]"
					/>
				</div>

				<!-- Solid Pixel Font TECNOESIS Text overlaid horizontally centered across emblem (shifted higher) -->
				<h1
					class="font-game-paused relative z-20 -mt-28 text-center text-[48px] leading-none tracking-normal text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] select-none sm:-mt-32 sm:text-[58px]"
				>
					TECNOESIS
				</h1>
			</div>

			<!-- Bottom Section: "DRAG TO \n EXPLORE THE FUTURE" + Draggable Slider + Bottom-Right Sound Button -->
			<div class="relative z-30 flex w-full flex-col items-center pb-2">
				<!-- 2-Line Text in Pixel Font -->
				<div
					class="font-game-paused mb-2.5 text-center text-[12px] leading-tight tracking-[0.08em] text-white uppercase drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] select-none sm:text-[14px]"
				>
					<div>DRAG TO</div>
					<div>EXPLORE THE FUTURE</div>
				</div>

				<!-- Draggable Slider Pill Track (Strict 100% end-to-end requirement with automatic springback) -->
				<div
					bind:this={mobileSliderTrackEl}
					role="slider"
					aria-label="Drag to explore the future"
					aria-valuenow={Math.round(mobileDragProgress)}
					aria-valuemin="0"
					aria-valuemax="100"
					tabindex="0"
					onpointerdown={handleMobileDragStart}
					onpointermove={handleMobileDragMove}
					onpointerup={handleMobileDragEnd}
					onpointercancel={handleMobileDragEnd}
					ontouchstart={handleMobileDragStart}
					ontouchmove={handleMobileDragMove}
					ontouchend={handleMobileDragEnd}
					ontouchcancel={handleMobileDragEnd}
					class="relative flex h-11 w-full max-w-[290px] cursor-pointer items-center overflow-hidden rounded-full border-[2.5px] border-white bg-black/20 p-1 backdrop-blur-sm select-none touch-none shadow-[0_0_12px_rgba(255,255,255,0.2)]"
				>
					<!-- Active Drag Progress Fill Glow -->
					{#if mobileDragProgress > 0}
						<div
							class="absolute top-1 bottom-1 left-1 rounded-full bg-gradient-to-r from-purple-500/40 via-fuchsia-400/50 to-white/60"
							style="width: calc({mobileDragProgress}%);"
						></div>
					{/if}

					<!-- Draggable Solid Pure White Circle Thumb (Exact match to Figma) -->
					<div
						class="absolute top-1 bottom-1 flex h-8 w-8 cursor-grab items-center justify-center rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] active:cursor-grabbing select-none touch-none"
						style="left: calc({mobileDragProgress}% * (1 - 36px / 100%) + 2px);"
					></div>
				</div>

				<!-- Sound Toggle Pill Button positioned at Bottom Right -->
				<div class="flex w-full max-w-[310px] justify-end pt-3 pr-1">
					<button
						onclick={(e) => {
							e.stopPropagation();
							isAudioOn = !isAudioOn;
						}}
						onpointerdown={(e) => e.stopPropagation()}
						class="flex cursor-pointer items-center justify-center rounded-full bg-white px-3.5 py-1.5 shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform duration-150 active:scale-95"
						aria-label="Toggle Sound"
					>
						<svg class="h-3.5 w-6" viewBox="0 0 26 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M1 6 C3 1, 5 1, 6.8 6 C8.6 11, 10.4 11, 12.2 6 C14 1, 15.8 1, 17.6 6 C19.4 11, 21.2 11, 23 6 C24 3, 25 3, 25.5 6"
								stroke="black"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- DESKTOP STAGE 1 VIEW (>= md) -->
		<div
			bind:this={desktopContainerEl}
			class="relative z-10 hidden w-full flex-1 flex-col items-center justify-between px-4 py-8 select-none transition-all duration-700 ease-out md:flex"
		>
			<!-- Bouncing Chromatic Crystal Orb on Desktop (Natural Bouncy Ball with Luminous Glowing Neon Text Effect) -->
			<div
				class="pointer-events-none absolute top-0 left-0 z-30 h-36 w-36 overflow-hidden rounded-full border border-white/35 shadow-[0_0_35px_rgba(168,85,247,0.5)] backdrop-blur-md will-change-[left,top] lg:h-44 lg:w-44 xl:h-[180px] xl:w-[180px]"
				style="left: {desktopOrbX}px; top: {desktopOrbY}px;"
			>
				<!-- Lighter Chromatic Amethyst Glass Base with animated drifting crystal mosaic -->
				<div
					class="animate-crystal-drift absolute inset-0 bg-gradient-to-br from-[#3b156a]/70 via-[#240d42]/60 to-[#0e041c]/75 bg-[url('/images/crystal-bg.png')] bg-[size:95px_95px] bg-repeat opacity-90 mix-blend-color-dodge"
				></div>

				<!-- Floating Micro-Particles Overlay -->
				<div
					class="animate-particle-shimmer pointer-events-none absolute inset-0 bg-[radial-gradient(#00f5ff_1.2px,transparent_1.2px),radial-gradient(#ff007f_1.2px,transparent_1.2px),radial-gradient(#ffd700_1.2px,transparent_1.2px)] bg-[size:14px_14px,18px_18px,22px_22px] opacity-90 mix-blend-screen"
				></div>

				<!-- Unified Crystal Facet Highlights -->
				<svg
					class="pointer-events-none absolute inset-0 h-full w-full opacity-60"
					viewBox="0 0 100 100"
					fill="none"
				>
					<polygon
						points="50,6 88,32 68,74 50,92 18,72 12,30"
						stroke="rgba(255,255,255,0.45)"
						stroke-width="0.8"
						fill="none"
					/>
					<polygon
						points="50,6 68,50 88,32"
						stroke="rgba(168,85,247,0.45)"
						stroke-width="0.6"
						fill="none"
					/>
					<polygon
						points="50,6 32,50 12,30"
						stroke="rgba(255,0,128,0.4)"
						stroke-width="0.6"
						fill="none"
					/>
				</svg>

				<!-- Luminous Neon Glow TECNOESIS Text Layer inside the Crystal (Bright chromatic glow strictly inside) -->
				<div class="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
					<div
						class="pointer-events-none absolute flex flex-col items-center justify-center whitespace-nowrap"
						style="left: {desktopHeroOffsetX - desktopOrbX}px; top: {desktopHeroOffsetY - desktopOrbY}px; width: {desktopHeroWidth}px; height: {desktopHeroHeight}px;"
					>
						<span
							class="font-game-paused text-center text-[48px] leading-none tracking-normal uppercase select-none sm:text-[90px] md:text-[140px] lg:text-[195px] xl:text-[247.83px] text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] via-[#ff00a0] to-[#c084fc] drop-shadow-[0_0_15px_#00f5ff] drop-shadow-[0_0_30px_#ec4899] drop-shadow-[0_0_50px_#a855f7]"
						>
							TECNOESIS
						</span>
					</div>
				</div>

				<!-- Specular Crystal Shine & Curvature Vignette -->
				<div
					class="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_32%,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.04)_40%,rgba(0,0,0,0.6)_100%)]"
				></div>
			</div>

			<div></div>

			<!-- Main Hero Center Section with Pixelated Crystal Reveal Lens (Figma spec: 1172px x 273px) -->
			<div
				bind:this={desktopHeroEl}
				class="relative flex w-full max-w-[1172px] items-center justify-center py-6 select-none"
			>
				<!-- Base Layer: Solid Giant Pixel Text TECNOESIS (Exact Figma: Game Paused DEMO, 247.83px, 400 regular, 100% line-height, 0% letter-spacing) -->
				<h1
					class="font-game-paused text-center text-[48px] leading-none tracking-normal text-white uppercase drop-shadow-[0_0_35px_rgba(255,255,255,0.3)] select-none sm:text-[90px] md:text-[140px] lg:text-[195px] xl:text-[247.83px]"
				>
					TECNOESIS
				</h1>

				<!-- Overlaid Clean Metallic Logo Emblem (Scaled to balanced proportion) -->
				<div
					class="pointer-events-none absolute top-1/2 left-1/2 z-10 h-36 w-36 -translate-x-[53%] -translate-y-[52%] sm:h-52 sm:w-52 md:h-72 md:w-72 lg:h-[350px] lg:w-[350px] xl:h-[420px] xl:w-[420px]"
				>
					<img
						src="/images/tecnoesis-logo.png"
						alt="Tecnoesis Emblem"
						class="h-full w-full object-contain"
					/>
				</div>
			</div>

			<!-- Bottom Interactive Bar for Stage 1 -->
			<div class="relative z-20 flex w-full items-center justify-between px-4 sm:px-12">
				<!-- Left: Sound Toggle Pill -->
				<div class="flex w-24 justify-start sm:w-32">
					<button
						onclick={(e) => {
							e.stopPropagation();
							isAudioOn = !isAudioOn;
						}}
						onpointerdown={(e) => e.stopPropagation()}
						class="z-30 flex cursor-pointer items-center gap-2 rounded-full bg-white px-3.5 py-1.5 shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
						aria-label="Toggle Sound"
					>
						<svg class="h-3 w-5" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M1 6 C3 1, 5 1, 6.5 6 C8 11, 10 11, 11.5 6 C13 1, 15 1, 16.5 6 C18 11, 20 11, 21.5 6 C22.5 3, 23.5 3, 24 6"
								stroke="black"
								stroke-width="1.6"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<span class="font-['Doto'] text-xs font-black tracking-wider text-black">
							{isAudioOn ? 'ON' : 'OFF'}
						</span>
					</button>
				</div>

				<!-- Center: Tap and Hold Progress Interactive Indicator -->
				<div
					class="group mx-auto flex w-full max-w-xs flex-col items-center justify-center gap-2 select-none sm:max-w-md"
				>
					<!-- Labels in Game Paused DEMO font -->
					<div
						class="font-game-paused flex w-full items-center justify-between text-[13px] tracking-wider text-white/90 sm:text-[16px]"
					>
						<span>EXPLORE THE FUTURE</span>
						<span
							class="{isHolding
								? 'font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
								: 'text-white/70'} transition-colors">TAP AND HOLD</span
						>
					</div>

					<!-- Progress Track -->
					<div
						class="relative h-1.5 w-full overflow-hidden rounded-full bg-white/20 shadow-inner backdrop-blur-sm sm:h-2"
					>
						<!-- Filling Bar -->
						<div
							class="h-full rounded-full bg-gradient-to-r from-purple-400 via-fuchsia-400 to-white shadow-[0_0_15px_rgba(236,72,153,0.9)]"
							style="width: {holdProgress}%;"
						></div>
					</div>
				</div>

				<!-- Right Spacer for symmetrical centering -->
				<div class="w-24 sm:w-32"></div>
			</div>
		</div>
	{/if}

	<!-- STAGE 2: Intermediate Transition Scene (Grid Horizon + Sound Info Subtitle) -->
	{#if stage === 2}
		<!-- MOBILE STAGE 2 VIEW (< md) -->
		<div
			class="animate-fadeIn relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 py-8 select-none md:hidden"
		>
			<!-- Center Horizon Photon Beam / Light Point -->
			<div class="relative flex flex-col items-center justify-center">
				<div
					class="h-40 w-0.5 animate-pulse bg-gradient-to-t from-white via-purple-300 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.9)]"
				></div>
				<div class="h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,1)]"></div>
			</div>
		</div>

		<!-- DESKTOP STAGE 2 VIEW (>= md) -->
		<div
			class="animate-fadeIn relative z-10 hidden w-full flex-1 flex-col items-center justify-between px-4 py-8 select-none transition-all duration-700 ease-out md:flex"
		>
			<div></div>

			<!-- Center Horizon Photon Beam / Light Point -->
			<div class="relative flex flex-col items-center justify-center">
				<div
					class="h-32 w-0.5 animate-pulse bg-gradient-to-t from-white via-purple-300 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.8)]"
				></div>
				<div class="h-3 w-3 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,1)]"></div>
			</div>

			<!-- Bottom Controls & Sound Text -->
			<div class="flex flex-col items-center gap-4 text-center">
				<!-- Sound Toggle Pill -->
				<button
					onclick={(e) => {
						e.stopPropagation();
						isAudioOn = !isAudioOn;
					}}
					onpointerdown={(e) => e.stopPropagation()}
					class="flex cursor-pointer items-center gap-2 rounded-full bg-white px-3.5 py-1.5 shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
					aria-label="Toggle Sound"
				>
					<svg class="h-3 w-5" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M1 6 C3 1, 5 1, 6.5 6 C8 11, 10 11, 11.5 6 C13 1, 15 1, 16.5 6 C18 11, 20 11, 21.5 6 C22.5 3, 23.5 3, 24 6"
							stroke="black"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span class="font-['Doto'] text-xs font-black tracking-wider text-black">
						{isAudioOn ? 'ON' : 'OFF'}
					</span>
				</button>

				<!-- Sound Immersion Info Text in Bruno Ace -->
				<div
					class="font-['Bruno_Ace'] text-xs leading-relaxed tracking-[0.1em] text-white/70 uppercase sm:text-sm"
				>
					<div>USE SOUND EFFECTS</div>
					<div>TO IMMERSE MORE IMMERSIVELY</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- STAGE 3: Final Selection Screen (3D MAP & TECNOESIS WEBSITE) -->
	{#if stage === 3}
		<div
			class="animate-center-reveal relative z-10 flex w-full flex-1 flex-col items-center justify-between px-4 py-8 select-none"
		>
			<div></div>

			<!-- Main 2-Column Selection Cards -->
			<div
				class="mx-auto my-auto flex w-full max-w-6xl flex-col items-center justify-center gap-14 select-none sm:flex-row sm:gap-16 md:gap-24 lg:gap-36"
			>
				<!-- Left Card: 3D MAP -->
				<div
					class="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:gap-6 md:gap-7"
				>
					<!-- Top text in Bruno Ace -->
					<h2
						class="title-font text-center text-4xl leading-none font-normal tracking-[0.1em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] sm:text-5xl md:text-6xl lg:text-7xl"
					>
						3D
					</h2>

					<!-- Circular Button Wrapper with 4 Corner [ ] Brackets that move closer on hover/click -->
					<a
						href={(resolve as (path: string) => string)('/map')}
						role="button"
						tabindex="0"
						onclick={() => toggleActive('map')}
						class="group relative flex h-[190px] w-[190px] cursor-pointer items-center justify-center outline-none sm:h-[220px] sm:w-[220px] md:h-[250px] md:w-[250px]"
						aria-label="Enter into 3D Map"
					>
						<!-- 4 Corner Brackets [ ] that animate closer on hover and click -->
						<!-- Top-Left [ -->
						<span
							class="pointer-events-none absolute top-0 left-0 text-2xl leading-none font-light transition-all duration-300 ease-out select-none sm:text-3xl md:text-4xl
							{activeBtn === 'map'
								? 'translate-x-3.5 translate-y-3.5 text-white opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
								: 'text-white/40 group-hover:translate-x-3.5 group-hover:translate-y-3.5 group-hover:text-white group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'}"
							>[</span
						>

						<!-- Top-Right ] -->
						<span
							class="pointer-events-none absolute top-0 right-0 text-2xl leading-none font-light transition-all duration-300 ease-out select-none sm:text-3xl md:text-4xl
							{activeBtn === 'map'
								? '-translate-x-3.5 translate-y-3.5 text-white opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
								: 'text-white/40 group-hover:-translate-x-3.5 group-hover:translate-y-3.5 group-hover:text-white group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'}"
							>]</span
						>

						<!-- Bottom-Left [ -->
						<span
							class="pointer-events-none absolute bottom-0 left-0 text-2xl leading-none font-light transition-all duration-300 ease-out select-none sm:text-3xl md:text-4xl
							{activeBtn === 'map'
								? 'translate-x-3.5 -translate-y-3.5 text-white opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
								: 'text-white/40 group-hover:translate-x-3.5 group-hover:-translate-y-3.5 group-hover:text-white group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'}"
							>[</span
						>

						<!-- Bottom-Right ] -->
						<span
							class="pointer-events-none absolute right-0 bottom-0 text-2xl leading-none font-light transition-all duration-300 ease-out select-none sm:text-3xl md:text-4xl
							{activeBtn === 'map'
								? '-translate-x-3.5 -translate-y-3.5 text-white opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
								: 'text-white/40 group-hover:-translate-x-3.5 group-hover:-translate-y-3.5 group-hover:text-white group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'}"
							>]</span
						>

						<!-- Main Circle Button (turns Decopunk Purple on hover/click) -->
						<div
							class="relative flex h-[155px] w-[155px] items-center justify-center rounded-full shadow-2xl transition-all duration-300 sm:h-[180px] sm:w-[180px] md:h-[205px] md:w-[205px]
							{activeBtn === 'map'
								? 'bg-[#7822e6] shadow-[0_0_40px_rgba(120,34,230,0.8)]'
								: 'bg-[#e4e5e8] group-hover:bg-[#7822e6] group-hover:shadow-[0_0_40px_rgba(120,34,230,0.8)]'}"
						>
							<!-- Bold Inner concentric ring (grey in default, white on hover/click) -->
							<div
								class="pointer-events-none absolute inset-[6px] rounded-full border-[2.5px] transition-colors duration-300 sm:inset-[8px] sm:border-[3px] md:inset-[9px]
								{activeBtn === 'map' ? 'border-white/90' : 'border-[#9ca3af] group-hover:border-white/90'}"
							></div>

							<!-- ENTER INTO text with exact Doto specifications (40px, 700, -6% letter-spacing, 100% line-height) -->
							<div
								class="enter-into-text z-10 flex flex-col items-center justify-center text-[26px] transition-colors duration-300 select-none sm:text-[33px] md:text-[40px]
								{activeBtn === 'map'
									? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]'
									: 'text-black group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]'}"
							>
								<span class="uppercase">ENTER</span>
								<span class="mt-0.5 uppercase">INTO</span>
							</div>
						</div>
					</a>

					<!-- Bottom text in Bruno Ace -->
					<h2
						class="title-font text-center text-4xl leading-none font-normal tracking-[0.1em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] sm:text-5xl md:text-6xl lg:text-7xl"
					>
						MAP
					</h2>
				</div>

				<!-- Right Card: TECNOESIS WEBSITE -->
				<div
					class="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:gap-6 md:gap-7"
				>
					<!-- Top text in Bruno Ace -->
					<h2
						class="title-font text-center text-4xl leading-none font-normal tracking-[0.08em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] sm:text-5xl md:text-6xl md:tracking-[0.1em] lg:text-7xl"
					>
						TECNOESIS
					</h2>

					<!-- Circular Button Wrapper with 4 Corner [ ] Brackets that move closer on hover/click -->
					<a
						href={resolve('/home')}
						role="button"
						tabindex="0"
						onclick={triggerWebEntrance}
						class="group relative flex h-[190px] w-[190px] cursor-pointer items-center justify-center outline-none sm:h-[220px] sm:w-[220px] md:h-[250px] md:w-[250px]"
						aria-label="Enter into Tecnoesis Website"
					>
						<!-- 4 Corner Brackets [ ] that animate closer on hover and click -->
						<!-- Top-Left [ -->
						<span
							class="pointer-events-none absolute top-0 left-0 text-2xl leading-none font-light transition-all duration-300 ease-out select-none sm:text-3xl md:text-4xl
							{activeBtn === 'web'
								? 'translate-x-3.5 translate-y-3.5 text-white opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
								: 'text-white/40 group-hover:translate-x-3.5 group-hover:translate-y-3.5 group-hover:text-white group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'}"
							>[</span
						>

						<!-- Top-Right ] -->
						<span
							class="pointer-events-none absolute top-0 right-0 text-2xl leading-none font-light transition-all duration-300 ease-out select-none sm:text-3xl md:text-4xl
							{activeBtn === 'web'
								? '-translate-x-3.5 translate-y-3.5 text-white opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
								: 'text-white/40 group-hover:-translate-x-3.5 group-hover:translate-y-3.5 group-hover:text-white group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'}"
							>]</span
						>

						<!-- Bottom-Left [ -->
						<span
							class="pointer-events-none absolute bottom-0 left-0 text-2xl leading-none font-light transition-all duration-300 ease-out select-none sm:text-3xl md:text-4xl
							{activeBtn === 'web'
								? 'translate-x-3.5 -translate-y-3.5 text-white opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
								: 'text-white/40 group-hover:translate-x-3.5 group-hover:-translate-y-3.5 group-hover:text-white group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'}"
							>[</span
						>

						<!-- Bottom-Right ] -->
						<span
							class="pointer-events-none absolute right-0 bottom-0 text-2xl leading-none font-light transition-all duration-300 ease-out select-none sm:text-3xl md:text-4xl
							{activeBtn === 'web'
								? '-translate-x-3.5 -translate-y-3.5 text-white opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
								: 'text-white/40 group-hover:-translate-x-3.5 group-hover:-translate-y-3.5 group-hover:text-white group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'}"
							>]</span
						>

						<!-- Main Circle Button (turns Decopunk Purple on hover/click) -->
						<div
							class="relative flex h-[155px] w-[155px] items-center justify-center rounded-full shadow-2xl transition-all duration-300 sm:h-[180px] sm:w-[180px] md:h-[205px] md:w-[205px]
							{activeBtn === 'web'
								? 'bg-[#7822e6] shadow-[0_0_40px_rgba(120,34,230,0.8)]'
								: 'bg-[#e4e5e8] group-hover:bg-[#7822e6] group-hover:shadow-[0_0_40px_rgba(120,34,230,0.8)]'}"
						>
							<!-- Bold Inner concentric ring (grey in default, white on hover/click) -->
							<div
								class="pointer-events-none absolute inset-[6px] rounded-full border-[2.5px] transition-colors duration-300 sm:inset-[8px] sm:border-[3px] md:inset-[9px]
								{activeBtn === 'web' ? 'border-white/90' : 'border-[#9ca3af] group-hover:border-white/90'}"
							></div>

							<!-- ENTER INTO text with exact Doto specifications (40px, 700, -6% letter-spacing, 100% line-height) -->
							<div
								class="enter-into-text z-10 flex flex-col items-center justify-center text-[26px] transition-colors duration-300 select-none sm:text-[33px] md:text-[40px]
								{activeBtn === 'web'
									? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]'
									: 'text-black group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]'}"
							>
								<span class="uppercase">ENTER</span>
								<span class="mt-0.5 uppercase">INTO</span>
							</div>
						</div>
					</a>

					<!-- Bottom text in Bruno Ace -->
					<h2
						class="title-font text-center text-4xl leading-none font-normal tracking-[0.08em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] sm:text-5xl md:text-6xl md:tracking-[0.1em] lg:text-7xl"
					>
						WEBSITE
					</h2>
				</div>
			</div>

			<!-- Bottom Sound Info Text for Stage 3 -->
			<div class="flex flex-col items-center gap-3 pb-2 text-center">
				<!-- Sound Toggle Pill -->
				<button
					onclick={(e) => {
						e.stopPropagation();
						isAudioOn = !isAudioOn;
					}}
					onpointerdown={(e) => e.stopPropagation()}
					class="flex cursor-pointer items-center gap-2 rounded-full bg-white px-3.5 py-1.5 shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
					aria-label="Toggle Sound"
				>
					<svg class="h-3 w-5" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M1 6 C3 1, 5 1, 6.5 6 C8 11, 10 11, 11.5 6 C13 1, 15 1, 16.5 6 C18 11, 20 11, 21.5 6 C22.5 3, 23.5 3, 24 6"
							stroke="black"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span class="font-['Doto'] text-xs font-black tracking-wider text-black">
						{isAudioOn ? 'ON' : 'OFF'}
					</span>
				</button>

				<div
					class="font-['Bruno_Ace'] text-[11px] tracking-[0.08em] text-white/60 uppercase sm:text-xs"
				>
					USE SOUND EFFECTS FOR IMMERSIVE EXPERIENCE
				</div>
			</div>
		</div>
	{/if}

	<!-- STAGE 4: Jet Plane Formation & Dissolve Sequence -->
	{#if stage === 4}
		<div
			class="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 py-8 transition-all duration-300 select-none {isDissolving
				? 'scale-105 opacity-0 blur-sm'
				: 'scale-100 opacity-100'}"
		>
			<!-- Jet Fighter Plane Container -->
			<div
				class="relative flex aspect-[1024/405] w-[340px] max-w-full translate-y-6 items-center justify-center sm:w-[540px] sm:translate-y-8 md:w-[720px] md:translate-y-12 lg:w-[880px] xl:w-[1020px]"
			>
				<!-- Base Blueprint Wireframe Layer (plane1.png) - Base Wireframe Structure -->
				<img
					src="/images/plane1.png"
					alt="Jet Fighter Wireframe Blueprint"
					class="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_0_15px_rgba(0,210,255,0.7)]"
				/>

				<!-- Solid Colored Cyberpunk Jet Layer (plane2.png) revealing from Center Outward to Both Ends -->
				<div
					class="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
					style="clip-path: inset(0 calc({50 - planeProgress * 0.5}%) 0 calc({50 -
						planeProgress * 0.5}%));"
				>
					<img
						src="/images/plane2.png"
						alt="Jet Fighter Solid"
						class="h-full w-full object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]"
					/>
				</div>

				<!-- Dynamic Glowing Scanlines / Lasers Tracing Outward from Center -->
				{#if planeProgress > 0 && planeProgress < 99}
					<!-- Left Scanning Laser -->
					<div
						class="pointer-events-none absolute top-0 bottom-0 z-20 w-1 -translate-x-1/2 bg-cyan-300 shadow-[0_0_15px_#00f5ff,0_0_30px_#ec4899] sm:w-1.5"
						style="left: calc({50 - planeProgress * 0.5}%);"
					>
						<div
							class="absolute top-1/4 -left-1 h-3 w-3 rounded-full bg-white shadow-[0_0_10px_#00f5ff] blur-[1px]"
						></div>
						<div
							class="absolute top-3/4 -left-1 h-3 w-3 rounded-full bg-fuchsia-400 shadow-[0_0_10px_#ec4899] blur-[1px]"
						></div>
					</div>

					<!-- Right Scanning Laser -->
					<div
						class="pointer-events-none absolute top-0 bottom-0 z-20 w-1 -translate-x-1/2 bg-cyan-300 shadow-[0_0_15px_#00f5ff,0_0_30px_#ec4899] sm:w-1.5"
						style="left: calc({50 + planeProgress * 0.5}%);"
					>
						<div
							class="absolute top-1/4 -left-1 h-3 w-3 rounded-full bg-white shadow-[0_0_10px_#00f5ff] blur-[1px]"
						></div>
						<div
							class="absolute top-3/4 -left-1 h-3 w-3 rounded-full bg-fuchsia-400 shadow-[0_0_10px_#ec4899] blur-[1px]"
						></div>
					</div>
				{/if}

				<!-- Thruster Pulse Afterburner Glow once formed -->
				{#if planeProgress >= 90}
					<div
						class="pointer-events-none absolute top-[45%] right-[4%] h-8 w-16 -translate-y-1/2 animate-pulse rounded-full bg-cyan-400/80 shadow-[0_0_35px_#00f5ff] blur-md"
					></div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	@font-face {
		font-family: 'Game Paused DEMO';
		src: url('/fonts/Game Paused DEMO.ttf') format('truetype');
		font-weight: 400;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'Delicatus';
		src: url('/fonts/Delicatus.ttf') format('truetype');
		font-weight: 500;
		font-style: normal;
		font-display: swap;
	}

	.font-game-paused {
		font-family: 'Game Paused DEMO', sans-serif;
		font-weight: 400;
		line-height: 100%;
		letter-spacing: 0%;
	}

	.enter-into-text {
		font-family: 'Doto', monospace, sans-serif;
		font-weight: 700;
		font-style: normal;
		line-height: 100%;
		letter-spacing: -0.06em;
		text-align: center;
		font-variation-settings: 'ROND' 0;
	}

	.title-font {
		font-family: 'Bruno Ace', 'Delicatus', sans-serif;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.animate-fadeIn {
		animation: fadeIn 0.6s cubic-bezier(0.58, 0.59, 0.58, 1) forwards;
	}

	@keyframes centerReveal {
		0% {
			clip-path: inset(0 50% 0 50%);
			opacity: 0;
			transform: scale(0.96);
		}
		15% {
			opacity: 1;
		}
		100% {
			clip-path: inset(0 0% 0 0%);
			opacity: 1;
			transform: scale(1);
		}
	}

	.animate-center-reveal {
		animation: centerReveal 1.9s cubic-bezier(0.25, 1, 0.5, 1) forwards;
	}

	@keyframes crystalDrift {
		0% {
			background-position: 0px 0px;
		}
		50% {
			background-position: 25px 18px;
		}
		100% {
			background-position: 0px 0px;
		}
	}

	.animate-crystal-drift {
		animation: crystalDrift 10s ease-in-out infinite;
	}

	@keyframes particleShimmer {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
			opacity: 0.65;
		}
		50% {
			transform: translate(2px, -2px) scale(1.1);
			opacity: 0.95;
		}
	}

	.animate-particle-shimmer {
		animation: particleShimmer 3.5s ease-in-out infinite alternate;
	}
</style>
