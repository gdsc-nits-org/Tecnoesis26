<script lang="ts">
	import { onMount } from 'svelte';

	let section: HTMLElement;
	let progress = $state(0);

	onMount(() => {
		let frame = 0;
		const updateProgress = () => {
			frame = 0;
			if (!section) return;
			const bounds = section.getBoundingClientRect();
			const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
			progress = Math.min(Math.max(-bounds.top / travel, 0), 1);
		};
		const handleScroll = () => {
			if (!frame) frame = requestAnimationFrame(updateProgress);
		};

		updateProgress();
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll, { passive: true });
		return () => {
			if (frame) cancelAnimationFrame(frame);
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
		};
	});
</script>

<section bind:this={section} class="about-section" style={`--about-progress: ${progress}`}>
	<div class="sticky-viewport">
		<div class="about-track">
			<div class="sub-block text-block panel-left">
				<div class="about-text">
					<h2 class="about-title">About Tecnoesis</h2>
					<div class="about-description">
						<p>
							Tecnoesis is the Annual Techno-Managerial Event of NIT Silchar, Promising All Tech
							Geeks The Ideal Niche Of Fascinating Events, Workshops, Competitions And Interactions
							Worth A Lifetime.
						</p>
					</div>
				</div>
			</div>

			<div class="sub-block gif-block">
				<img src="/IMG_8774.GIF" alt="3D Sphere visualization" class="sphere-img" />
			</div>

			<div class="sub-block text-block panel-right">
				<div class="about-text">
					<h2 class="about-title">What Awaits You</h2>
					<div class="about-description">
						<p>
							Dive into a world of cutting-edge technology, mind-bending competitions, and
							electrifying workshops. From robotics to coding challenges, from hackathons to guest
							lectures by industry leaders — Tecnoesis brings together the brightest minds from
							across the nation.
						</p>
						<p class="highlight-text">
							3 Days • 50+ Events • 10,000+ Participants • Infinite Possibilities
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="slide-dots">
			<span class="dot" class:active={progress < 0.5}></span>
			<span class="dot" class:active={progress >= 0.5}></span>
		</div>
	</div>
</section>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Bruno+Ace&family=Sulphur+Point:wght@300;400;700&display=swap');

	@font-face {
		font-family: 'Delicatus';
		src: url('/Delicatus.ttf') format('truetype');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}

	.about-section {
		position: relative;
		height: 200vh;
		width: 100%;
		z-index: 2;
		overflow-x: clip;
	}

	.sticky-viewport {
		position: sticky;
		top: 0;
		height: 100vh;
		width: 100%;
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	/* ───── 3-Subsection Track System ───── */
	.about-track {
		display: flex;
		height: 100vh;
		width: 150vw; /* 3 blocks * 50vw each = 150vw */
		transform: translateX(calc(var(--about-progress) * -50vw));
		will-change: transform;
	}

	/* Each subsection takes exactly 50vw of the viewport width */
	.sub-block {
		flex: 0 0 50vw;
		width: 50vw;
		height: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;
	}

	/* Panel 1 Left Alignment: Clears left vertical navbar */
	.panel-left {
		justify-content: flex-start;
		padding-left: clamp(180px, 16vw, 250px);
		padding-right: 1rem;
	}

	/* Panel 2 Right Alignment: Aligns closer to middle sphere while shielding right social icons */
	.panel-right {
		justify-content: flex-start;
		padding-left: clamp(20px, 3vw, 50px);
		padding-right: clamp(70px, 6vw, 110px);
	}

	/* ───── Subsection 2: GIF Image ───── */
	.gif-block {
		justify-content: center;
		position: relative;
		z-index: 10;
	}

	.sphere-img {
		width: clamp(320px, 32vw, 600px);
		height: clamp(320px, 32vw, 600px);
		object-fit: cover;
		border-radius: 50%;
		filter: drop-shadow(0 0 40px rgba(130, 80, 255, 0.35));
		animation: sphere-float 6s ease-in-out infinite;
	}

	@keyframes sphere-float {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-14px) rotate(2deg);
		}
	}

	/* ───── Shared Text Box Styles ───── */
	.about-text {
		width: 100%;
		max-width: clamp(
			450px,
			35vw,
			620px
		); /* Expanded width to eliminate vertical text compression */
		z-index: 15;
	}

	.about-title {
		font-family: 'Delicatus', sans-serif;
		font-size: clamp(2rem, 3.2vw, 2.5rem);
		font-weight: 700;
		color: white;
		margin: 0 0 1.5rem 0;
		padding: 0.5rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.25);
		display: inline-block;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		background: rgba(255, 255, 255, 0.04);
		backdrop-filter: blur(4px);
		border-radius: 5px;
	}

	.about-description {
		border: 1px solid rgba(255, 255, 255, 0.18);
		padding: 1.5rem 1.8rem;
		background: rgba(255, 255, 255, 0.03);
		backdrop-filter: blur(6px);
		border-radius: 5px;
	}

	.about-description p {
		margin: 0;
		font-family: 'Bruno Ace', sans-serif;
		font-size: clamp(0.85rem, 1.15vw, 1.15rem);
		line-height: 1.65;
		color: rgba(255, 255, 255, 0.88);
		font-weight: 400;
		text-align: justify;
	}

	.highlight-text {
		margin-top: 1.2rem !important;
		font-size: clamp(0.85rem, 1vw, 1.05rem) !important;
		color: rgba(200, 170, 255, 0.95) !important;
		font-weight: 700 !important;
		text-align: center !important;
		letter-spacing: 0.06em;
	}

	/* ───── Slide Indicators ───── */
	.slide-dots {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 0.6rem;
		z-index: 25;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.25);
		border: 1px solid rgba(255, 255, 255, 0.4);
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.dot.active {
		background: rgba(255, 255, 255, 0.85);
		transform: scale(1.2);
		box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
	}

	@media (max-width: 980px) {
		.panel-left {
			padding-left: 150px;
		}
		.panel-right {
			padding-left: 15px;
			padding-right: 60px;
		}
		.sphere-img {
			width: 280px;
			height: 280px;
		}
	}

	/*
      Phones and small tablets: drop the horizontal carousel entirely.
      Each panel is 50vw wide, so on a 390px phone a block is ~195px while
      .about-text asks for a 450px minimum - the paragraph collapses to one
      word per line and runs underneath the sphere. Stacking the three blocks
      as ordinary full-width sections is both readable and far less fragile.
    */
	@media (max-width: 860px) {
		.about-section {
			height: auto;
			min-height: 0;
		}

		.sticky-viewport {
			position: static;
			display: block;
			height: auto;
			overflow: visible;
		}

		.about-track {
			display: flex;
			width: 100%;
			height: auto;
			flex-direction: column;
			gap: 2.5rem;
			padding: 3.5rem 0 5.5rem;
			transform: none;
			will-change: auto;
		}

		.sub-block {
			width: 100%;
			height: auto;
			flex: 0 0 auto;
		}

		.panel-left,
		.panel-right {
			justify-content: center;
			padding-right: 1.25rem;
			padding-left: 1.25rem;
		}

		.about-text {
			max-width: 100%;
		}

		.about-title {
			margin-bottom: 1rem;
			font-size: clamp(1.5rem, 7vw, 2rem);
		}

		.about-description {
			padding: 1.1rem 1.15rem;
		}

		.about-description p {
			/* Justified text on a narrow column opens rivers of whitespace. */
			font-size: clamp(0.82rem, 3.7vw, 1rem);
			line-height: 1.6;
			text-align: left;
		}

		.highlight-text {
			font-size: clamp(0.78rem, 3.3vw, 0.95rem) !important;
		}

		.gif-block {
			justify-content: center;
			padding: 0 1.25rem;
		}

		.sphere-img {
			width: min(62vw, 260px);
			height: min(62vw, 260px);
		}

		/* Nothing slides any more, so the dots would be lying. */
		.slide-dots {
			display: none;
		}
	}
</style>
