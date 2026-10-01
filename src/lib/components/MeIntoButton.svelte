<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	type Phase = 1 | 2 | 3;
	type OrientationPermissionApi = typeof DeviceOrientationEvent & {
		requestPermission?: () => Promise<'granted' | 'denied'>;
	};

	const HOLD_DURATION = 1300;
	const RING_LENGTH = 289;
	const PARALLAX_RANGE_X = 9;
	const PARALLAX_RANGE_Y = 6;
	const MAX_DEVICE_TILT = 25;

	let phase = $state<Phase>(1);
	let holdProgress = $state(0);
	let isHolding = $state(false);
	let isPointerInside = $state(false);
	let pointerX = $state(0);
	let pointerY = $state(0);
	let pointerType = $state('mouse');
	let isHoveringText = $state(false);
	let isTouchDevice = $state(false);
	let logoElement = $state<HTMLImageElement | null>(null);
	let logoX = $state(0);
	let logoY = $state(0);
	let holdFrame = 0;
	let drainFrame = 0;
	let holdStartedAt = 0;
	let touchStart: { x: number; y: number } | null = null;
	let gyroRequested = false;
	let gyroEnabled = false;
	let launchTimer: ReturnType<typeof setTimeout>;

	function startHold(event?: PointerEvent) {
		if (phase !== 1 || isHolding) return;
		if (drainFrame) cancelAnimationFrame(drainFrame);
		if (event) updatePointer(event);

		isHolding = true;
		holdStartedAt = performance.now() - (holdProgress / 100) * HOLD_DURATION;

		const updateProgress = (now: number) => {
			if (!isHolding || phase !== 1) return;
			holdProgress = Math.min(100, ((now - holdStartedAt) / HOLD_DURATION) * 100);
			if (holdProgress >= 100) {
				isHolding = false;
				phase = 2;
				return;
			}
			holdFrame = requestAnimationFrame(updateProgress);
		};

		holdFrame = requestAnimationFrame(updateProgress);
	}

	function cancelHold() {
		if (phase !== 1 || !isHolding) return;
		isHolding = false;
		if (holdFrame) cancelAnimationFrame(holdFrame);

		const drainProgress = () => {
			holdProgress = Math.max(0, holdProgress - 2.6);
			if (holdProgress > 0) drainFrame = requestAnimationFrame(drainProgress);
			else drainFrame = 0;
		};
		drainFrame = requestAnimationFrame(drainProgress);
	}

	function handlePointerDown(event: PointerEvent) {
		if (phase !== 1) return;
		if (event.pointerType === 'touch') {
			isTouchDevice = true;
			touchStart = { x: event.clientX, y: event.clientY };
			void enableGyroscope();
			return;
		}
		startHold(event);
	}

	function handlePointerUp(event: PointerEvent) {
		if (event.pointerType === 'touch') {
			const start = touchStart;
			touchStart = null;
			if (
				phase === 1 &&
				start &&
				Math.hypot(event.clientX - start.x, event.clientY - start.y) < 18
			) {
				phase = 2;
			}
			return;
		}
		cancelHold();
	}

	function handlePointerCancel(event: PointerEvent) {
		if (event.pointerType === 'touch') touchStart = null;
		cancelHold();
	}

	async function enableGyroscope() {
		if (gyroRequested || typeof window === 'undefined') return;
		gyroRequested = true;

		const orientationApi = window.DeviceOrientationEvent as OrientationPermissionApi | undefined;
		if (!orientationApi) return;

		if (typeof orientationApi.requestPermission === 'function') {
			try {
				if ((await orientationApi.requestPermission()) !== 'granted') return;
			} catch {
				return;
			}
		}

		window.addEventListener('deviceorientation', handleDeviceOrientation);
		gyroEnabled = true;
	}

	function handleDeviceOrientation(event: DeviceOrientationEvent) {
		if (event.beta === null || event.gamma === null || phase !== 1) return;

		const angle = screen.orientation?.angle ?? 0;
		let horizontal = event.gamma;
		let vertical = event.beta;

		if (angle === 90) {
			horizontal = event.beta;
			vertical = -event.gamma;
		} else if (angle === 180) {
			horizontal = -event.gamma;
			vertical = -event.beta;
		} else if (angle === 270) {
			horizontal = -event.beta;
			vertical = event.gamma;
		}

		logoX = Math.max(-1, Math.min(1, horizontal / MAX_DEVICE_TILT)) * PARALLAX_RANGE_X;
		logoY = Math.max(-1, Math.min(1, vertical / MAX_DEVICE_TILT)) * PARALLAX_RANGE_Y;
	}

	function updatePointer(event: PointerEvent) {
		pointerX = event.clientX;
		pointerY = event.clientY;
		pointerType = event.pointerType;
		isPointerInside = true;

		if (event.pointerType !== 'mouse' || phase !== 1) return;

		logoX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * PARALLAX_RANGE_X * 2;
		logoY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * PARALLAX_RANGE_Y * 2;

		if (logoElement) {
			const bounds = logoElement.getBoundingClientRect();
			isHoveringText =
				event.clientX >= bounds.left - 20 &&
				event.clientX <= bounds.right + 20 &&
				event.clientY >= bounds.top - 20 &&
				event.clientY <= bounds.bottom + 20;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
		event.preventDefault();
		startHold();
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') cancelHold();
	}

	function launchWebsite() {
		if (phase !== 2) return;
		phase = 3;
		launchTimer = setTimeout(() => goto(resolve('/home')), 1500);
	}

	onMount(() => {
		isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

		return () => {
			if (holdFrame) cancelAnimationFrame(holdFrame);
			if (drainFrame) cancelAnimationFrame(drainFrame);
			if (gyroEnabled) window.removeEventListener('deviceorientation', handleDeviceOrientation);
			clearTimeout(launchTimer);
		};
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#080d2b" />
</svelte:head>

<svelte:window
	onpointerdown={phase === 1 ? handlePointerDown : undefined}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerCancel}
	onkeydown={handleKeyDown}
	onkeyup={handleKeyUp}
/>

<div
	class="landing"
	class:landing--custom-cursor={phase === 1}
	role="region"
	aria-label="Tecnoesis 2026 landing experience"
	onpointerleave={() => {
		cancelHold();
		isPointerInside = false;
	}}
	onpointermove={updatePointer}
>
	<div class="landing__shade" aria-hidden="true"></div>
	<div class="landing__grain" aria-hidden="true"></div>

	{#if phase === 1}
		<section
			class="phase phase--welcome"
			role="group"
			aria-label={isTouchDevice ? 'Tap to enter Tecnoesis' : 'Hold to enter Tecnoesis'}
			aria-describedby="hold-instruction"
		>
			<header class="masthead">
				<span class="masthead__rule"></span>
				<p>NIT SILCHAR <span>·</span> 2026</p>
				<span class="masthead__rule"></span>
			</header>

			<div class="welcome-lockup">
				<p class="eyebrow">THE TECHNO-MANAGERIAL FEST</p>
				<img
					bind:this={logoElement}
					class="welcome-lockup__logo"
					src="/TecnoLogoFull.png"
					alt="Tecnoesis 2026"
					style={`transform: translate3d(${logoX}px, ${logoY}px, 0)`}
				/>
				<p class="welcome-lockup__caption">A new horizon in technology and ideas</p>
			</div>

			<div class="hold-prompt">
				<div class="hold-prompt__label">
					<span class="hold-prompt__index">01</span>
					<span
						>{isTouchDevice
							? 'TAP TO ENTER'
							: isHolding
								? 'HOLD TO OPEN'
								: 'PRESS AND HOLD TO ENTER'}</span
					>
					<span class="hold-prompt__index">02</span>
				</div>
				<div class="hold-prompt__track">
					<span style={`transform: scaleX(${holdProgress / 100})`}></span>
				</div>
				<p id="hold-instruction">
					{isTouchDevice
						? 'Tap anywhere to begin your journey'
						: 'Hold anywhere to begin your journey'}
				</p>
			</div>

			<footer class="welcome-footer">
				<span>EST. NIT SILCHAR</span>
				<span class="welcome-footer__star" aria-hidden="true">✳</span>
				<span>EXPLORE WHAT'S NEXT</span>
			</footer>
		</section>
	{:else if phase === 2}
		<section class="phase phase--choose" aria-label="Choose your destination">
			<header class="masthead masthead--compact">
				<a class="wordmark" href="/" aria-label="Back to landing">
					<img src="/TecnoLogoFull.png" alt="Tecnoesis 2026" />
				</a>
				<span class="masthead__rule"></span>
				<p>SELECT DESTINATION <span>·</span> 02</p>
			</header>

			<div class="destination-heading">
				<p class="eyebrow">THE FESTIVAL IS YOURS TO EXPLORE</p>
				<h1>Where to?</h1>
				<p>Choose a path into the world of Tecnoesis.</p>
			</div>

			<div class="destinations">
				<a class="destination destination--map" href="/map">
					<span class="destination__art destination__art--map" aria-hidden="true">
						<svg viewBox="0 0 180 120" fill="none">
							<path d="M22 31 67 17l45 14 46-14v72l-46 14-45-14-45 14V31Z" />
							<path d="m67 17 1 72m44-58v72M22 54l45-14 45 14 46-14" />
							<path d="m90 40 9 16-9 16-9-16 9-16Z" />
							<circle cx="90" cy="56" r="3" />
						</svg>
					</span>
					<span class="destination__title">3D MAP</span>
					<span class="destination__description"
						>Find your place across the NIT Silchar campus.</span
					>
					<span class="destination__action">OPEN THE MAP <span aria-hidden="true">↗</span></span>
				</a>

				<button class="destination destination--site" type="button" onclick={launchWebsite}>
					<span class="destination__art destination__art--site" aria-hidden="true">
						<svg viewBox="0 0 180 120" fill="none">
							<path d="M90 16 151 51v18l-61 35-61-35V51l61-35Z" />
							<path d="m29 51 61 36 61-36M90 87v17M60 34l60 35M120 34 60 69" />
							<circle cx="90" cy="60" r="13" />
							<path d="M90 47c7 8 7 18 0 26-7-8-7-18 0-26Z" />
						</svg>
					</span>
					<span class="destination__title">TECNOESIS</span>
					<span class="destination__description">Step into the festival, its people and ideas.</span
					>
					<span class="destination__action"
						>ENTER THE WEBSITE <span aria-hidden="true">↗</span></span
					>
				</button>
			</div>

			<footer class="choose-footer">
				<span>TECNOESIS 2026</span>
				<span>AN INITIATIVE OF NIT SILCHAR</span>
			</footer>
		</section>
	{:else}
		<section class="phase phase--launch" aria-label="Entering the Tecnoesis website">
			<div class="launch-mark" aria-hidden="true">
				<span></span>
				<img src="/TecnoLogoFull.png" alt="" />
			</div>
			<p class="eyebrow">WELCOME TO</p>
			<h1>TECNOESIS</h1>
			<p class="launch-caption">ENTERING THE FESTIVAL</p>
		</section>
	{/if}

	{#if phase === 1 && isPointerInside && !isHoveringText && pointerType !== 'touch'}
		<div class="legacy-cursor" style={`left:${pointerX}px;top:${pointerY}px`} aria-hidden="true">
			<div class="legacy-cursor__reticle">
				<svg class="legacy-cursor__orbit" viewBox="0 0 100 100">
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
				{#if isHolding}
					<svg class="legacy-cursor__progress" viewBox="0 0 100 100">
						<circle
							cx="50"
							cy="50"
							r="46"
							fill="none"
							stroke="#ec4899"
							stroke-width="2.5"
							stroke-dasharray={RING_LENGTH}
							stroke-dashoffset={RING_LENGTH - (RING_LENGTH * holdProgress) / 100}
							stroke-linecap="round"
						/>
					</svg>
				{/if}
				{#if isHolding}
					<span class="legacy-cursor__hold">HOLD</span>
				{:else}
					<svg class="legacy-cursor__triangle" viewBox="0 0 24 24" fill="none">
						<polygon
							points="12,4 21,20 3,20"
							stroke="currentColor"
							stroke-width="2"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
			</div>
			{#if !isHolding}
				<span class="legacy-cursor__hint">CLICK &amp; HOLD</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.landing {
		--ink: #080d2b;
		--paper: #f5f0ff;
		--lilac: #d8b7ff;
		--pink: #ee9bd5;
		position: relative;
		isolation: isolate;
		display: flex;
		min-height: 100vh;
		min-height: 100svh;
		width: 100%;
		overflow: hidden;
		flex-direction: column;
		color: var(--paper);
		background: var(--ink) url('/landingbg.png') center 52% / cover no-repeat;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		-webkit-tap-highlight-color: transparent;
		touch-action: none;
	}

	.landing--custom-cursor {
		cursor: none;
	}

	.landing__shade,
	.landing__grain {
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
	}

	.landing__shade {
		background:
			linear-gradient(
				180deg,
				rgba(5, 9, 34, 0.66),
				transparent 32%,
				rgba(7, 9, 31, 0.12) 58%,
				rgba(4, 8, 29, 0.74)
			),
			linear-gradient(90deg, rgba(5, 8, 31, 0.42), transparent 48%, rgba(5, 8, 31, 0.28));
	}

	.landing__grain {
		inset: 12px;
		border: 1px solid rgba(240, 223, 255, 0.16);
	}

	.phase {
		position: relative;
		z-index: 1;
		display: flex;
		width: min(100%, 1600px);
		min-height: 100vh;
		min-height: 100svh;
		margin-inline: auto;
		flex-direction: column;
		padding: clamp(28px, 5vw, 68px) clamp(28px, 6vw, 88px) clamp(24px, 3.5vw, 50px);
		animation: phase-enter 700ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
	}

	.masthead,
	.welcome-footer,
	.choose-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		color: rgba(245, 240, 255, 0.76);
		font-size: 10px;
		letter-spacing: 0.14em;
	}

	.masthead {
		justify-content: center;
	}

	.masthead p,
	.welcome-footer span,
	.choose-footer span {
		margin: 0;
		white-space: nowrap;
	}

	.masthead p span {
		padding-inline: 8px;
		color: var(--pink);
	}

	.masthead__rule {
		width: clamp(32px, 8vw, 112px);
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(234, 213, 255, 0.65));
	}

	.masthead__rule:last-child {
		transform: rotate(180deg);
	}

	.phase--welcome {
		align-items: center;
		justify-content: space-between;
	}

	.welcome-lockup {
		display: flex;
		width: 100%;
		margin-block: auto;
		align-items: center;
		flex-direction: column;
		text-align: center;
		animation: logo-arrive 1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	.eyebrow {
		margin: 0;
		color: var(--lilac);
		font-size: 10px;
		letter-spacing: 0.24em;
	}

	.welcome-lockup__logo {
		display: block;
		width: min(86vw, 1000px);
		max-height: 38vh;
		margin-block: clamp(26px, 5vh, 62px) clamp(15px, 3vh, 32px);
		object-fit: contain;
		filter: drop-shadow(0 16px 42px rgba(5, 7, 27, 0.38));
		transition: transform 90ms ease-out;
	}

	.welcome-lockup__caption {
		margin: 0;
		color: rgba(249, 241, 255, 0.78);
		font-family: 'Sulphur Point', sans-serif;
		font-size: clamp(16px, 2vw, 22px);
		letter-spacing: 0.025em;
	}

	.hold-prompt {
		width: min(100%, 360px);
		margin-bottom: clamp(30px, 5vh, 64px);
		text-align: center;
	}

	.hold-prompt__label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		font-size: 10px;
		letter-spacing: 0.16em;
	}

	.hold-prompt__index {
		color: rgba(238, 155, 213, 0.85);
		font-size: 9px;
	}

	.hold-prompt__track {
		height: 2px;
		margin-top: 14px;
		overflow: hidden;
		background: rgba(250, 240, 255, 0.28);
	}

	.hold-prompt__track span {
		display: block;
		width: 100%;
		height: 100%;
		transform-origin: left;
		background: linear-gradient(90deg, #f2b1da, #f4eaff);
		box-shadow: 0 0 15px rgba(241, 177, 222, 0.75);
	}

	.hold-prompt > p {
		margin: 12px 0 0;
		color: rgba(244, 235, 255, 0.7);
		font-family: 'Sulphur Point', sans-serif;
		font-size: 14px;
	}

	.welcome-footer {
		width: 100%;
		font-size: 9px;
	}

	.welcome-footer__star {
		color: var(--pink);
		font-size: 17px;
	}

	.phase--choose {
		justify-content: space-between;
	}

	.masthead--compact {
		justify-content: flex-end;
	}

	.wordmark {
		display: block;
		width: clamp(130px, 17vw, 220px);
		margin-right: auto;
	}

	.wordmark img {
		display: block;
		width: 100%;
		height: auto;
	}

	.destination-heading {
		margin: clamp(36px, 6vh, 64px) 0 clamp(24px, 4vh, 42px);
		text-align: center;
	}

	.destination-heading h1,
	.phase--launch h1 {
		margin: 12px 0 10px;
		font-family: 'Bruno Ace', 'BankGothic', sans-serif;
		font-size: clamp(36px, 6vw, 72px);
		font-weight: 400;
		line-height: 1.1;
	}

	.destination-heading > p:last-child {
		margin: 0;
		color: rgba(245, 240, 255, 0.77);
		font-family: 'Sulphur Point', sans-serif;
		font-size: clamp(15px, 1.8vw, 19px);
	}

	.destinations {
		display: grid;
		width: min(100%, 960px);
		margin: 0 auto auto;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		border-block: 1px solid rgba(242, 227, 255, 0.32);
	}

	.destination {
		position: relative;
		display: flex;
		min-height: 340px;
		align-items: flex-start;
		flex-direction: column;
		padding: clamp(22px, 4vw, 42px);
		border: 0;
		border-right: 1px solid rgba(242, 227, 255, 0.32);
		color: var(--paper);
		background: rgba(9, 12, 39, 0.18);
		text-align: left;
		text-decoration: none;
		cursor: pointer;
		transition:
			background-color 250ms ease,
			color 250ms ease;
	}

	.destination:last-child {
		border-right: 0;
	}

	.destination:hover,
	.destination:focus-visible {
		background: rgba(20, 18, 58, 0.52);
	}

	.destination:focus-visible,
	.wordmark:focus-visible {
		outline: 2px solid var(--pink);
		outline-offset: 5px;
	}

	.destination__number {
		color: rgba(238, 212, 255, 0.75);
		font-size: 9px;
		letter-spacing: 0.17em;
	}

	.destination__art {
		display: grid;
		width: 100%;
		height: 120px;
		margin-block: 12px 8px;
		place-items: center;
		color: var(--lilac);
	}

	.destination__art svg {
		width: min(48%, 180px);
		height: 100%;
		overflow: visible;
		stroke: currentColor;
		stroke-width: 1.15;
		stroke-linecap: round;
		stroke-linejoin: round;
		filter: drop-shadow(0 0 12px rgba(214, 176, 255, 0.3));
		transition:
			transform 350ms ease,
			color 350ms ease;
	}

	.destination:hover .destination__art svg,
	.destination:focus-visible .destination__art svg {
		transform: translateY(-5px) scale(1.04);
		color: #f3c0e1;
	}

	.destination__title {
		font-family: 'Bruno Ace', 'BankGothic', sans-serif;
		font-size: clamp(20px, 3vw, 30px);
		line-height: 1.2;
	}

	.destination__description {
		max-width: 30ch;
		margin-top: 9px;
		color: rgba(245, 240, 255, 0.72);
		font-family: 'Sulphur Point', sans-serif;
		font-size: 15px;
		line-height: 1.45;
	}

	.destination__action {
		display: flex;
		width: 100%;
		margin-top: auto;
		padding-top: 28px;
		align-items: center;
		justify-content: space-between;
		color: #f4b7df;
		font-size: 9px;
		letter-spacing: 0.16em;
	}

	.destination__action span {
		font-family: sans-serif;
		font-size: 17px;
		transition: transform 250ms ease;
	}

	.destination:hover .destination__action span,
	.destination:focus-visible .destination__action span {
		transform: translate(3px, -3px);
	}

	.choose-footer {
		margin-top: clamp(28px, 5vh, 54px);
		font-size: 9px;
	}

	.phase--launch {
		align-items: center;
		justify-content: center;
		text-align: center;
		animation: launch-fade 1500ms ease both;
	}

	.launch-mark {
		position: relative;
		display: grid;
		width: min(78vw, 660px);
		margin-bottom: 44px;
		place-items: center;
	}

	.launch-mark img {
		position: relative;
		z-index: 1;
		width: 100%;
		animation: logo-zoom 1500ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	.launch-mark span {
		position: absolute;
		width: min(32vw, 240px);
		aspect-ratio: 1;
		border: 1px solid rgba(241, 203, 246, 0.62);
		border-radius: 50%;
		box-shadow:
			0 0 60px rgba(213, 154, 226, 0.3),
			inset 0 0 55px rgba(213, 154, 226, 0.2);
		animation: portal-open 1300ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	.phase--launch h1 {
		font-size: clamp(30px, 6vw, 64px);
	}

	.launch-caption {
		margin: 6px 0 0;
		color: var(--lilac);
		font-size: 9px;
		letter-spacing: 0.24em;
	}

	.legacy-cursor {
		position: fixed;
		z-index: 50;
		display: flex;
		transform: translate(-50%, -50%);
		align-items: center;
		flex-direction: column;
		pointer-events: none;
	}

	.legacy-cursor__reticle {
		position: relative;
		display: grid;
		width: 56px;
		height: 56px;
		place-items: center;
	}

	.legacy-cursor__orbit,
	.legacy-cursor__progress {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.legacy-cursor__orbit {
		animation: cursor-spin 5s linear infinite;
	}

	.legacy-cursor__progress {
		transform: rotate(-90deg);
	}

	.legacy-cursor__triangle {
		width: 20px;
		height: 20px;
		color: white;
		filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8));
	}

	.legacy-cursor__hold {
		animation: cursor-pulse 1s ease-in-out infinite alternate;
		color: white;
		font-family: 'Bruno Ace', sans-serif;
		font-size: 10px;
		font-weight: 900;
		letter-spacing: 0.08em;
		text-shadow: 0 0 8px rgba(255, 255, 255, 1);
	}

	.legacy-cursor__hint {
		margin-top: 4px;
		color: white;
		font-family: 'Bruno Ace', sans-serif;
		font-size: 9px;
		letter-spacing: 0.15em;
		white-space: nowrap;
		text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
	}

	@keyframes cursor-spin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes cursor-pulse {
		to {
			opacity: 0.65;
		}
	}

	@keyframes phase-enter {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes logo-arrive {
		from {
			opacity: 0;
			transform: translateY(16px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes launch-fade {
		0% {
			opacity: 0;
		}
		18%,
		68% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes logo-zoom {
		0% {
			opacity: 0;
			transform: scale(0.82);
		}
		25%,
		72% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(1.16);
		}
	}

	@keyframes portal-open {
		0% {
			opacity: 0;
			transform: scale(0.2);
		}
		25% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(2.8);
		}
	}

	@media (pointer: fine) {
		.landing--custom-cursor {
			cursor: none;
		}
	}

	@media (max-width: 640px) {
		.landing {
			background-position: 48% center;
		}

		.landing__grain {
			inset: 7px;
		}

		.phase {
			min-height: 100svh;
			padding: max(24px, env(safe-area-inset-top)) 24px max(22px, env(safe-area-inset-bottom));
		}

		.masthead,
		.welcome-footer,
		.choose-footer {
			font-size: 8px;
			letter-spacing: 0.1em;
		}

		.welcome-lockup__logo {
			width: min(92vw, 650px);
			max-height: 30vh;
			margin-block: 28px 18px;
		}

		.welcome-lockup__caption {
			max-width: 25ch;
		}

		.hold-prompt {
			width: min(100%, 330px);
			margin-bottom: 46px;
		}

		.hold-prompt__label {
			font-size: 9px;
		}

		.phase--choose {
			padding-top: 24px;
		}

		.masthead--compact {
			flex-wrap: wrap;
			justify-content: flex-end;
		}

		.wordmark {
			width: 138px;
		}

		.destination-heading {
			margin: clamp(28px, 5vh, 46px) 0 20px;
		}

		.destinations {
			grid-template-columns: minmax(0, 1fr);
			border-block: 0;
		}

		.destination {
			min-height: 220px;
			padding: 16px 18px;
			border: 1px solid rgba(242, 227, 255, 0.32);
		}

		.destination + .destination {
			border-top: 0;
		}

		.destination__art {
			height: 64px;
			margin-block: 5px 7px;
		}

		.destination__art svg {
			width: 115px;
		}

		.destination__description {
			margin-top: 6px;
		}

		.destination__action {
			padding-top: 16px;
		}

		.choose-footer {
			margin-top: 16px;
		}
	}

	@media (max-height: 620px) and (min-width: 641px) {
		.phase {
			padding-block: 22px;
		}
		.destination-heading {
			margin-block: 26px 18px;
		}
		.destination {
			min-height: 270px;
		}
		.destination__art {
			height: 90px;
		}
		.hold-prompt {
			margin-bottom: 24px;
		}
		.welcome-lockup__logo {
			max-height: 31vh;
			margin-block: 18px;
		}
	}

	@media (min-width: 641px) and (max-height: 820px) {
		.phase {
			padding-block: 32px;
		}

		.destination-heading {
			margin-block: clamp(24px, 4vh, 40px) clamp(20px, 3vh, 32px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation-duration: 1ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 1ms !important;
			scroll-behavior: auto !important;
		}
	}
</style>
