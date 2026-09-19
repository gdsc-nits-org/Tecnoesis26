<script lang="ts">
	
	import Navbar from "$lib/components/Navbar.svelte";
	import About from "$lib/components/About.svelte";

	let logoX = $state(0);
	let logoY = $state(0);
	let showAbout = $state(false);

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

	function handleClick(event: MouseEvent) {
		// Don't toggle if clicking on nav links, buttons, or interactive elements
		const target = event.target as HTMLElement;
		if (target.closest('a, button, .login-btn, .main-nav, nav')) return;
		showAbout = !showAbout;
	}
</script>

<div
	class="landing-page"
	class:about-active={showAbout}
	role="presentation"
	onpointermove={handlePointerMove}
	onpointerleave={resetLogoPosition}
	onclick={handleClick}
>
	<header class="topbar">
		<div
			class="brand"
			class:hidden={showAbout}
			aria-label="Tecnoesis home"
			style={`--logo-x: ${logoX}px; --logo-y: ${logoY}px`}
		>
			<img src="/logo.png" alt="Tecnoesis logo" />
		</div>

		
	</header>

	<div class="page-shell">
		<aside class="left-column">
			<div class="big-letters" aria-label="Tecnoesis title">
				<span>T</span>
				<span>E</span>
				<span>C</span>
				<span>N</span>
				<span>O</span>
				<span>E</span>
				<span>S</span>
				<span class="-m-5">I</span>
				<span>S</span>
			</div>

			<div class="side-links" aria-label="Page sections">
				<span>Hero</span>
				<span>About</span>
				<span>Events</span>
				<span>Sponsors</span>
			</div>

			
		</aside>

		<main class="hero-stage">
		<Navbar />
			<div class="copy-card" class:hidden={showAbout}>
				<p>
					Tecnoesis is the annual<br />
					Techno-Managerial<br />
					Event of NIT Silchar
				</p>
			</div> 
			<div class="map-button" class:hidden={showAbout}><span>3D MAP</span></div>
			<div class="scroll-indicator" class:hidden={showAbout}>
				<span class="arrow">⌄</span>
				<span>scroll</span>
			</div>

			<!-- About Tecnoesis Section -->
			<About visible={showAbout} />
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
