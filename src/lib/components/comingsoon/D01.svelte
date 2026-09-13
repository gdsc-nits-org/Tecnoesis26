<script>
	import { onMount } from 'svelte';

	/** @type {HTMLDivElement | undefined} */
	let scene;
	let parallaxX = $state(0);
	let parallaxY = $state(0);
	let isZoomed = $state(false);
	let isFocused = $state(false);
	let isUnfocusing = $state(false);
	let isReversing = $state(false);
	let spacecrafts = $state([]);
	const spacecraftImages = {
		1: 'https://res.cloudinary.com/rfteglss/image/upload/v1789302626/Spacecraft_1.png',
		2: 'https://res.cloudinary.com/rfteglss/image/upload/v1789302577/Spacecraft_2.png',
		3: 'https://res.cloudinary.com/rfteglss/image/upload/v1789302577/Spacecraft_3.png'
	};

	/** @param {PointerEvent} event */
	function handlePointerMove(event) {
		if (!scene) return;

		const bounds = scene.getBoundingClientRect();
		const x = (event.clientX - bounds.left) / bounds.width - 0.5;
		const y = (event.clientY - bounds.top) / bounds.height - 0.5;

		scene.style.setProperty('--parallax-x', `${x * 16}px`);
		scene.style.setProperty('--parallax-y', `${y * 12}px`);
	}

	function resetParallax() {
		if (!scene) return;

		scene.style.setProperty('--parallax-x', '0px');
		scene.style.setProperty('--parallax-y', '0px');
	}

	/** @param {MouseEvent} event */
	function handleMouseMove(event) {
		parallaxX = ((event.clientX / window.innerWidth) * 2 - 1) * 10;
		parallaxY = ((event.clientY / window.innerHeight) * 2 - 1) * 7;
	}

	function showComingSoon() {
		if (!isReversing) {
			if (!isZoomed) {
				isZoomed = true;
				isUnfocusing = false;
			} else if (!isFocused) {
				isFocused = true;
				isUnfocusing = false;
				isReversing = true;
			}
		} else {
			if (isFocused) {
				isFocused = false;
				isUnfocusing = true;
			} else if (isZoomed) {
				isZoomed = false;
				isUnfocusing = false;
				isReversing = false;
			}
		}
	}
	let lastScrollTime = 0;
	let touchStartY = 0;

	/** @param {WheelEvent} event */
	function handleWheel(event) {
		const now = Date.now();
		if (now - lastScrollTime < 1200) return;

		if (event.deltaY > 10) {
			if (!isZoomed) {
				isZoomed = true;
				isUnfocusing = false;
				lastScrollTime = now;
			} else if (!isFocused) {
				isFocused = true;
				isUnfocusing = false;
				isReversing = true;
				lastScrollTime = now;
			}
		} else if (event.deltaY < -10) {
			if (isFocused) {
				isFocused = false;
				isUnfocusing = true;
				lastScrollTime = now;
			} else if (isZoomed) {
				isZoomed = false;
				isUnfocusing = false;
				isReversing = false;
				lastScrollTime = now;
			}
		}
	}

	/** @param {TouchEvent} event */
	function handleTouchStart(event) {
		touchStartY = event.touches[0].clientY;
	}

	/** @param {TouchEvent} event */
	function handleTouchMove(event) {
		const now = Date.now();
		if (now - lastScrollTime < 1200) return;

		const touchEndY = event.touches[0].clientY;
		const deltaY = touchStartY - touchEndY;

		if (deltaY > 30) {
			if (!isZoomed) {
				isZoomed = true;
				isUnfocusing = false;
				lastScrollTime = now;
				touchStartY = touchEndY;
			} else if (!isFocused) {
				isFocused = true;
				isUnfocusing = false;
				isReversing = true;
				lastScrollTime = now;
				touchStartY = touchEndY;
			}
		} else if (deltaY < -30) {
			if (isFocused) {
				isFocused = false;
				isUnfocusing = true;
				lastScrollTime = now;
				touchStartY = touchEndY;
			} else if (isZoomed) {
				isZoomed = false;
				isUnfocusing = false;
				isReversing = false;
				lastScrollTime = now;
				touchStartY = touchEndY;
			}
		}
	}

	onMount(() => {
		const numSpacecrafts = 15;
		spacecrafts = Array.from({ length: numSpacecrafts }).map((_, i) => ({
			id: i,
			type: Math.floor(Math.random() * 3) + 1,
			top: Math.random() * 65, // 0% to 45%
			left: Math.random() * 100,
			size: Math.random() * 3 + 2,
			duration: Math.random() * 30 + 20,
			delay: Math.random() * -40,
			direction: Math.random() > 0.5 ? 'normal' : 'reverse',
			zIndex: Math.floor(Math.random() * 5) + 2
		}));

		window.addEventListener('mousemove', handleMouseMove);

		return () => window.removeEventListener('mousemove', handleMouseMove);
	});
</script>

<svelte:head>
	<title>Tecnoesis 2026</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Bruno+Ace&display=swap" rel="stylesheet" />
</svelte:head>

<svelte:window
	onwheel={handleWheel}
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	onclick={showComingSoon}
/>

<header class="site-header" style={`--parallax-x: ${parallaxX}px; --parallax-y: ${parallaxY}px;`}>
	<img
		src="/coming-soon/D01/layer-1.svg"
		alt="Tecnoesis Logo"
		class="header-logo glow-logo"
		class:zoomed={isZoomed}
		class:focused={isFocused}
		class:unfocused={isUnfocusing}
	/>
</header>

<div class="coming-soon">
	<div
		class="scene"
		role="region"
		aria-label="Tecnoesis coming soon scene"
		bind:this={scene}
		onpointermove={handlePointerMove}
		onpointerleave={resetParallax}
		class:zoomed={isZoomed}
		class:focused={isFocused}
		class:unfocused={isUnfocusing}
		style={`--parallax-x: ${parallaxX}px; --parallax-y: ${parallaxY}px;`}
	>
		<!-- <img src="/coming-soon/D01/background.png" alt="" class="scene-layer background" /> -->

		<div class="moon-glow" aria-hidden="true"></div>
		<div class="moon" aria-hidden="true"></div>

		<!-- Spacecrafts -->
		{#each spacecrafts as craft (craft.id)}
			<img
				src={spacecraftImages[craft.type]}
				alt="Spacecraft"
				class="spacecraft"
				style="top: {craft.top}%; left: {craft.left}%; width: {craft.size}%; animation-duration: {craft.duration}s; animation-delay: {craft.delay}s; animation-direction: {craft.direction}; z-index: {craft.zIndex}; --flip: {craft.direction ===
				'reverse'
					? -1
					: 1};"
			/>
		{/each}

		<img
			src="https://res.cloudinary.com/rfteglss/image/upload/v1789303364/layer3.png"
			alt=""
			class="scene-layer layer-3"
		/>

		<div class="blur-overlay" class:hidden={isFocused || isZoomed}></div>

		<img src="/coming-soon/D01/layer-2.png" alt="" class="scene-layer layer-2" />

		<!-- <img src="/coming-soon/D01/Rectangle 62.png" alt="" class="scene-layer rectangle-62" /> -->

		<button
			type="button"
			class="scene-layer layer-1"
			aria-label={isFocused ? 'Tecnoesis logo focused' : 'Open Tecnoesis coming soon message'}
		>
			<img
				src="https://res.cloudinary.com/rfteglss/image/upload/v1789302578/astronaut.png"
				alt=""
			/>
		</button>

		<img
			src="https://res.cloudinary.com/rfteglss/image/upload/v1789302581/rocks.png"
			alt=""
			class="fg-element rocks"
		/>
		<img
			src="https://res.cloudinary.com/rfteglss/image/upload/v1789302579/ground.png"
			alt=""
			class="fg-element ground"
		/>

		<div class:visible={isZoomed} class="coming-soon-message" aria-live="polite">
			<span class="coming-soon-title">
				<span class="type-line">COMING</span>
				<span class="type-line">SOON</span>
			</span>
		</div>

		<img
			src="https://res.cloudinary.com/rfteglss/image/upload/v1789302588/decor.png"
			alt=""
			class="decor decor-a"
		/>
		<img
			src="https://res.cloudinary.com/rfteglss/image/upload/v1789302588/decor.png"
			alt=""
			class="decor decor-b"
		/>
	</div>
</div>

<style>
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	:global(body) {
		background: linear-gradient(
			180deg,
			#09062d 0%,
			#16083f 28%,
			#3b116d 54%,
			#7b1d9c 77%,
			#c347d1 100%
		);
	}

	.coming-soon {
		width: 100vw;
		height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.site-header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		padding: 2rem;
		display: flex;
		justify-content: center;
		z-index: 100;
		pointer-events: none;
	}

	.header-logo {
		height: 150px;
		width: auto;
		object-fit: contain;
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
		transform: translate3d(calc(var(--parallax-x) * 0.3), calc(var(--parallax-y) * 0.3), 0);
		transition: transform 0.3s ease-out;
		animation: header-levitate 3s ease-in-out infinite alternate;
	}
	.header-logo.glow-logo {
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 15px rgba(217, 58, 238, 0.7))
			drop-shadow(0 0 35px rgba(137, 38, 190, 0.5));
	}

	.scene {
		position: relative;
		width: max(100vw, 160dvh);
		aspect-ratio: 1440 / 900;
		overflow: hidden;
		--parallax-x: 0px;
		--parallax-y: 0px;
		transition: transform 1.2s cubic-bezier(0.2, 0.75, 0.25, 1);
		transform-origin: center;
	}

	.scene.zoomed {
		transform: scale(1.12);
	}

	.scene.focused {
		transform: scale(1.25);
	}

	.scene-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: fill;
		display: block;
		pointer-events: none;
		user-select: none;
	}

	.blur {
		z-index: 2;
	}

	.moon {
		position: absolute;
		z-index: 4;
		top: 36%;
		left: 43%;
		width: 30%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(
			circle at 42% 37%,
			#b844cf 0%,
			#9031ad 42%,
			#68258e 64%,
			#382064 78%,
			#30205c 90%,
			#2e1a5a 100%
		);
		box-shadow: 0 0 18px rgba(178, 49, 214, 0.34);
		animation: moon-breathe 18s ease-in-out infinite alternate;
		will-change: transform;
	}

	.moon::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background-image:
			repeating-radial-gradient(
				circle at 28% 34%,
				rgba(255, 255, 255, 0.12) 0 1px,
				transparent 1px 4px
			),
			repeating-linear-gradient(113deg, rgba(255, 255, 255, 0.06) 0 1px, transparent 1px 5px);
		mix-blend-mode: screen;
		opacity: 0.28;
	}

	.moon-glow {
		position: absolute;
		z-index: 3;
		top: 17%;
		left: 24%;
		width: 68%;
		aspect-ratio: 1;
		border-radius: 50%;
		pointer-events: none;
		background: radial-gradient(
			circle,
			rgba(217, 58, 238, 0.58) 0%,
			rgba(180, 48, 220, 0.46) 28%,
			rgba(137, 38, 190, 0.28) 52%,
			rgba(95, 29, 148, 0.12) 70%,
			transparent 82%
		);
		filter: blur(34px);
	}

	@keyframes moon-breathe {
		from {
			transform: scale(0.99);
		}

		to {
			transform: scale(1.015);
		}
	}

	.spacecraft {
		position: absolute;
		z-index: 3;
		object-fit: contain;
		pointer-events: none;
		user-select: none;
		animation: drift-horizontal linear infinite;
		will-change: transform;
	}

	@keyframes drift-horizontal {
		0% {
			transform: translateX(-100vw) translateY(0) scaleX(var(--flip, 1));
		}
		100% {
			transform: translateX(100vw) translateY(3vh) scaleX(var(--flip, 1));
		}
	}

	.layer-3 {
		z-index: 4;
		opacity: 0.95;
		filter: contrast(1.08) saturate(1.06);
		animation: skyline-breathe 16s ease-in-out infinite alternate;
		will-change: transform;
	}

	.layer-2 {
		z-index: 5;
		opacity: 0.94;
		filter: contrast(1.1) saturate(1.08);
		animation: clouds-drift 24s ease-in-out infinite alternate;
		will-change: transform;
		left: 5vw;
	}

	.blur-overlay {
		position: absolute;
		inset: -10%;
		z-index: 4;
		backdrop-filter: blur(3px);
		-webkit-backdrop-filter: blur(3px);
		pointer-events: none;
		transition:
			opacity 1.5s ease-in-out,
			backdrop-filter 1.5s ease-in-out;
	}
	.blur-overlay.hidden {
		opacity: 0;
		backdrop-filter: blur(0px);
		-webkit-backdrop-filter: blur(0px);
	}

	/* .rectangle-62 {
		z-index: 6;
	} */

	.rectangle-63 {
		z-index: 7;
	}

	.layer-1 {
		z-index: 8;
		padding: 0;
		border: 0;
		background: transparent;
		transform: translate3d(var(--parallax-x), var(--parallax-y), 0);
		transition: transform 0.3s ease-out;
		pointer-events: auto;
		cursor: pointer;
	}

	.layer-1 img {
		display: block;
		position: absolute;
		bottom: 15%;
		left: 10%;
		width: 30%;
		height: 60%;
		object-fit: contain;
		animation: astronaut-levitate 4s ease-in-out infinite alternate;
		will-change: transform;
	}

	@keyframes astronaut-levitate {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-10px);
		}
	}

	@keyframes scenery-levitate {
		0% {
			translate: 0 0;
		}
		100% {
			translate: 0 -15px;
		}
	}

	.fg-element {
		position: absolute;
		pointer-events: none;
		user-select: none;
	}

	.rocks {
		width: 20%;
		height: 100%;
		bottom: -10%;
		left: 0;
		z-index: 7;
		filter: contrast(1.1) saturate(1.08);
		transform: translate3d(calc(var(--parallax-x) * 1.8), calc(var(--parallax-y) * 1.6), 0);
		transition: transform 0.3s ease-out;
		will-change: transform;
		animation: scenery-levitate 5s ease-in-out infinite alternate;
	}

	.ground {
		width: 55%;
		bottom: -10%;
		left: 0;
		z-index: 7;
		filter: contrast(1.1) saturate(1.08);
		transform: translate3d(calc(var(--parallax-x) * 1.2), calc(var(--parallax-y) * 1.5), 0);
		transition: transform 0.3s ease-out;
		will-change: transform;
		animation: scenery-levitate 6s ease-in-out infinite alternate-reverse;
	}

	.layer-1:focus-visible {
		outline: 3px solid #ff5fa2;
		outline-offset: -6px;
	}

	.scene.focused .layer-1 {
		animation: astronaut-zoom-leave 3s ease-in-out forwards;
		transform-origin: 50% 12%;
	}

	.scene.focused .rocks {
		animation:
			scenery-leave 2s ease-in-out forwards,
			scenery-levitate 5s ease-in-out infinite alternate;
		transform-origin: 10% 90%;
	}

	.scene.focused .ground {
		animation:
			scenery-ground 2s ease-in-out forwards,
			scenery-levitate 6s ease-in-out infinite alternate-reverse;
		transform-origin: 10% 90%;
	}

	.scene.unfocused .layer-1 {
		animation: astronaut-zoom-leave-reverse 1.5s ease-in-out forwards;
		transform-origin: 50% 12%;
	}

	.scene.unfocused .rocks {
		animation:
			scenery-leave-reverse 1.5s ease-in-out forwards,
			scenery-levitate 5s ease-in-out infinite alternate;
		transform-origin: 10% 90%;
	}

	.scene.unfocused .ground {
		animation:
			scenery-ground-reverse 1.5s ease-in-out forwards,
			scenery-levitate 6s ease-in-out infinite alternate-reverse;
		transform-origin: 10% 90%;
	}

	.header-logo.zoomed {
		animation: header-levitate 3s ease-in-out infinite alternate;
	}
	.header-logo.focused {
		animation:
			scenery-header 2s forwards,
			header-levitate 3s ease-in-out infinite alternate;
		transform-origin: 10% 90%;
	}
	.header-logo.unfocused {
		animation:
			scenery-header-reverse 2s forwards,
			header-levitate 3s ease-in-out infinite alternate;
		transform-origin: 10% 90%;
	}

	.scene.focused .coming-soon-message {
		animation: coming-soon 1s ease-in-out forwards;
		transform-origin: 10% 90%;
	}
	.scene.unfocused .coming-soon-message {
		animation: coming-soon-reverse 2.4s ease-in-out forwards;
		transform-origin: 10% 90%;
	}
	@keyframes astronaut-zoom-leave {
		0% {
			transform: translate3d(var(--parallax-x), var(--parallax-y), 0) scale(1);
			opacity: 1;
		}
		50% {
			transform: translate3d(var(--parallax-x), calc(var(--parallax-y) + 0%), 0) scale(2.5);
			opacity: 1;
		}
		100% {
			transform: translate3d(calc(var(--parallax-x) - 150%), calc(var(--parallax-y) + 0%), 0)
				scale(2.2);
			opacity: 0;
		}
	}
	@keyframes astronaut-zoom-leave-reverse {
		0% {
			transform: translate3d(calc(var(--parallax-x) - 150%), calc(var(--parallax-y) + 0%), 0)
				scale(2.2);
			opacity: 0;
		}
		50% {
			transform: translate3d(var(--parallax-x), calc(var(--parallax-y) + 0%), 0) scale(2.5);
			opacity: 1;
		}
		100% {
			transform: translate3d(var(--parallax-x), var(--parallax-y), 0) scale(1);
			opacity: 1;
		}
	}

	@keyframes scenery-leave {
		0% {
			transform: translate3d(calc(var(--parallax-x) * 1.2), calc(var(--parallax-y) * 1.2), 0)
				scale(1);
			opacity: 1;
		}
		50% {
			transform: translate3d(-100%, 0, 0) scale(1.2);
			opacity: 1;
		}
		100% {
			transform: translate3d(-250%, 0, 0) scale(1.4);
			opacity: 0;
		}
	}
	@keyframes scenery-leave-reverse {
		0% {
			transform: translate3d(-250%, 0, 0) scale(1.4);
			opacity: 0;
		}
		50% {
			transform: translate3d(-100%, 0, 0) scale(1.2);
			opacity: 1;
		}
		100% {
			transform: translate3d(calc(var(--parallax-x) * 1.2), calc(var(--parallax-y) * 1.2), 0)
				scale(1);
			opacity: 1;
		}
	}

	@keyframes scenery-ground {
		0% {
			transform: translate3d(calc(var(--parallax-x) * 1.1), calc(var(--parallax-y) * 1.1), 0)
				scale(1);
			opacity: 1;
		}
		50% {
			transform: translate3d(-30%, 50%, 0) scale(1.2);
			opacity: 1;
		}
		100% {
			transform: translate3d(-250%, 0, 0) scale(1.4);
			opacity: 0;
		}
	}
	@keyframes scenery-ground-reverse {
		0% {
			transform: translate3d(-250%, 0, 0) scale(1.4);
			opacity: 0;
		}
		50% {
			transform: translate3d(-30%, 50%, 0) scale(1.2);
			opacity: 1;
		}
		100% {
			transform: translate3d(calc(var(--parallax-x) * 1.1), calc(var(--parallax-y) * 1.1), 0)
				scale(1);
			opacity: 1;
		}
	}

	@keyframes scenery-header {
		0% {
			transform: translate3d(0, 0, 0) scale(1);
			opacity: 1;
		}
		100% {
			transform: translate3d(-10vw, 42vh, 0) scale(2);
			opacity: 1;
		}
	}
	@keyframes scenery-header-reverse {
		0% {
			transform: translate3d(-10vw, 42vh, 0) scale(2);
			opacity: 1;
		}
		100% {
			transform: translate3d(0, 0, 0) scale(1);
			opacity: 1;
		}
	}

	@keyframes coming-soon {
		0% {
			transform: translate3d(0, 0, 0) scale(1);
			opacity: 1;
		}
		100% {
			transform: translate3d(150%, 0, 0) scale(1);
			opacity: 1;
		}
	}
	@keyframes coming-soon-reverse {
		0% {
			transform: translate3d(150%, 0, 0) scale(1);
			opacity: 1;
		}
		100% {
			transform: translate3d(0, 0, 0) scale(1);
			opacity: 1;
		}
	}

	@keyframes header-levitate {
		from {
			translate: 0 -15px;
		}
		to {
			translate: 0 15px;
		}
	}

	.coming-soon-message {
		position: absolute;
		inset: 0 2% 0 52%;
		z-index: 15;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 0.8rem;
		pointer-events: none;
		opacity: 0;
		visibility: hidden;
		transform: translate3d(calc(var(--parallax-x) * 0.7), calc(var(--parallax-y) * 0.7), 0);
		transition:
			opacity 0.4s ease,
			transform 0.3s ease-out;
	}

	.coming-soon-message.visible {
		visibility: visible;
		opacity: 1;
	}

	.coming-soon-title {
		color: #fff;
		font-family: 'Bruno Ace', sans-serif;
		font-size: clamp(3rem, 6.7vw, 7.2rem);
		font-weight: 400;
		letter-spacing: 0.025em;
		line-height: 0.88;
		text-align: left;
		display: grid;
		gap: 0.12em;
		transform: translateY(1rem) scale(0.86);
		opacity: 0;
	}

	.coming-soon-message.visible .coming-soon-title {
		animation: message-title-in 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
	}

	.type-line {
		display: block;
		width: 0;
		overflow: hidden;
		white-space: nowrap;
	}

	.type-line:last-child {
		margin-left: 1.5ch;
	}

	.coming-soon-message.visible .type-line:first-child {
		animation: typewriter-coming 1.1s steps(7, end) 0.35s forwards;
	}

	.coming-soon-message.visible .type-line:last-child {
		animation: typewriter-soon 0.8s steps(4, end) 1.6s forwards;
	}

	.decor {
		position: absolute;
		left: 8.125%;
		top: 10.22%;
		width: 86.495%;
		height: auto;
		display: block;
		z-index: 9;
		pointer-events: none;
		user-select: none;
		will-change: transform;
	}

	.decor-a {
		animation: diagonal-fall 18s linear infinite;
	}

	.decor-b {
		animation: diagonal-fall 18s linear infinite;
		animation-delay: -9s;
	}

	@keyframes diagonal-fall {
		from {
			transform: translate3d(-7%, -12%, 0) rotate(-2deg);
		}
		to {
			transform: translate3d(7%, 12%, 0) rotate(2deg);
		}
	}

	@keyframes clouds-drift {
		from {
			transform: translateX(-1.5%);
		}
		to {
			transform: translateX(1.5%);
		}
	}

	@keyframes skyline-breathe {
		from {
			transform: translate3d(-0.25%, 0, 0) scale(1);
		}
		to {
			transform: translate3d(0.25%, -0.35%, 0) scale(1.008);
		}
	}

	@keyframes message-title-in {
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes typewriter-coming {
		to {
			width: 8.5ch;
		}
	}

	@keyframes typewriter-soon {
		to {
			width: 5.5ch;
		}
	}

	/* M screens: keep the moon centered as the scene narrows. */
	@media (min-width: 601px) and (max-width: 1200px) {
		.moon {
			top: 34%;
			left: 45%;
			width: 48%;
		}

		.moon-glow {
			top: 14%;
			left: 19%;
			width: 76%;
			filter: blur(32px);
		}
	}

	@media (max-width: 600px), (max-aspect-ratio: 3 / 4) {
		.coming-soon {
			width: 100vw;
			height: 100dvh;
		}

		.scene {
			width: 100vw;
			height: 100dvh;
			aspect-ratio: auto;
		}

		/* S screens: enlarge the moon to remain visible on the portrait crop. */
		.moon {
			top: 32%;
			left: 28%;
			width: 60vw;
		}

		.moon-glow {
			top: 11%;
			left: 4%;
			width: 100vw;
			filter: blur(26px);
		}

		.scene-layer {
			object-fit: cover;
			object-position: 15% center;
		}

		.layer-1 {
			object-fit: contain;
			object-position: bottom left;
		}

		.layer-1 img {
			width: 35vw;
			bottom: -3%;
			left: 10%;
		}

		.rocks {
			width: 30vw;
			bottom: -5%;
			left: -20%;
		}

		.ground {
			width: 100vw;
			bottom: -5%;
			left: -9%;
		}

		.site-header {
			padding: 1rem;
		}

		.header-logo {
			width: 80vw;
			height: auto;
		}

		.header-logo.focused,
		.header-logo.unfocused {
			transform-origin: center;
		}

		@keyframes scenery-header {
			0% {
				transform: translate3d(0, 0, 0) scale(1);
				opacity: 1;
			}
			100% {
				transform: translate3d(0, 35vh, 0) scale(1.1);
				opacity: 1;
			}
		}
		@keyframes scenery-header-reverse {
			0% {
				transform: translate3d(0, 35vh, 0) scale(1.1);
				opacity: 1;
			}
			100% {
				transform: translate3d(0, 0, 0) scale(1);
				opacity: 1;
			}
		}

		.coming-soon-message {
			inset: 0;
		}

		.coming-soon-title {
			text-align: center;
			justify-items: center;
		}

		.type-line:last-child {
			margin-left: 0;
		}

		.decor {
			left: 0;
			width: 100%;
		}

		.button {
			left: 4%;
			bottom: 3%;
			width: 12%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.layer-1,
		.decor-a,
		.decor-b {
			animation: none;
			transition: none;
		}
		.layer-2,
		.layer-3,
		.moon,
		.decor {
			animation: none;
		}

		.layer-1 {
			transition: none;
			transform: none;
		}

		.scene {
			transition: none;
		}

		.scene.focused .layer-1 {
			transition: none;
		}

		.scene.focused .rocks,
		.scene.focused .ground {
			animation: none;
		}

		.coming-soon-message {
			transition: none;
			transform: none;
		}

		.coming-soon-message.visible .coming-soon-title {
			animation: none;
			opacity: 1;
			transform: none;
		}

		.coming-soon-message.visible .type-line {
			animation: none;
			width: auto;
		}
	}
</style>
