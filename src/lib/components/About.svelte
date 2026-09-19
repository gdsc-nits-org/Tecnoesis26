<script lang="ts">
	let { visible = false } = $props();
	let showSecondPanel = $state(false);

	function handleClick(event: MouseEvent) {
		// Don't toggle if clicking social links
		const target = event.target as HTMLElement;
		if (target.closest('.social-links, a, button')) return;
		showSecondPanel = !showSecondPanel;
	}

	function handleWheel(event: WheelEvent) {
		if (event.deltaY > 0 && !showSecondPanel) {
			showSecondPanel = true;
			event.preventDefault();
		} else if (event.deltaY < 0 && showSecondPanel) {
			showSecondPanel = false;
			event.preventDefault();
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<section
	class="about-section"
	class:visible
	onclick={handleClick}
	onwheel={handleWheel}
>
	<!-- Panel 1: Original About Content -->
	<div class="panel panel-1" class:slide-out={showSecondPanel}>
		<div class="about-content">
			<div class="about-text">
				<h2 class="about-title">About Tecnoesis</h2>
				<div class="about-description">
					<p>
						Tecnoesis is the Annual Techno-Managerial Event of NIT Silchar,
						Promising All Tech Geeks The Ideal Niche Of Fascinating Events,
						Workshops, Competitions And Interactions Worth A Lifetime.
					</p>
				</div>
			</div>
			<div class="about-visual">
				<img src="/IMG_8774.GIF" alt="3D Sphere visualization" class="sphere-img" />
			</div>
		</div>
	</div>

	<!-- Panel 2: New Content -->
	<div class="panel panel-2" class:slide-in={showSecondPanel}>
		<div class="about-content reversed">
			<div class="about-text second-text">
				<h2 class="about-title">What Awaits You</h2>
				<div class="about-description">
					<p>
						Dive into a world of cutting-edge technology, mind-bending competitions,
						and electrifying workshops. From robotics to coding challenges, from
						hackathons to guest lectures by industry leaders — Tecnoesis brings
						together the brightest minds from across the nation.
					</p>
					<p class="highlight-text">
						3 Days • 50+ Events • 10,000+ Participants • Infinite Possibilities
					</p>
				</div>
			</div>
			<div class="about-visual">
				<img src="/IMG_8774.GIF" alt="3D Sphere visualization" class="sphere-img" />
			</div>
		</div>
	</div>

	<!-- Slide indicators -->
	<div class="slide-dots">
		<span class="dot" class:active={!showSecondPanel}></span>
		<span class="dot" class:active={showSecondPanel}></span>
	</div>

	<div class="social-links">
		<a href="https://instagram.com/tecnoesis" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
		</a>
		<a href="https://linkedin.com/company/tecnoesis" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
		</a>
		<a href="https://facebook.com/tecnoesis" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
		</a>
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
		position: absolute;
		top: 4rem;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 2rem 3rem 2rem 1rem;
		opacity: 0;
		transform: translateY(100%);
		transition:
			opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
		pointer-events: none;
		z-index: 15;
		overflow: hidden;
	}

	.about-section.visible {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	/* ───── Panel Slide System ───── */
	.panel {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 2rem 3rem 2rem 1rem;
		transition: transform 1.7s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.5s cubic-bezier(0.4, 0, 1, 1);
	}

	.panel-1 {
		transform: translateX(0);
		opacity: 1;
	}

	.panel-1.slide-out {
		transform: translateX(-50%);
		opacity: 1;
	}

	.panel-2 {
		transform: translateX(50%);
		opacity: 0;
	}

	.panel-2.slide-in {
		transform: translateX(50%);
		opacity: 1;
	}

	/* ───── Shared Content Styles ───── */
	.about-content {
		display: flex;
		align-items: center;
		gap: 3rem;
		max-width: 100%;
		border-radius: 5px;
	}

	.about-text {
		flex: 0 0 45%;
		max-width: 580px;
	}

	.about-title {
		font-family: 'Delicatus', sans-serif;
		font-size: clamp(2.6rem, 4vw, 2.6rem);
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
		font-size: clamp(0.85rem, 2.4vw, 1.4rem);
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.88);
		font-weight: 400;
		text-align: justify;
	}

	.highlight-text {
		margin-top: 1.2rem !important;
		font-size: clamp(0.9rem, 1.6vw, 1.2rem) !important;
		color: rgba(200, 170, 255, 0.95) !important;
		font-weight: 700 !important;
		text-align: center !important;
		letter-spacing: 0.06em;
	}

	.about-visual {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sphere-img {
		width: clamp(500px, 80vw, 1800px);
		height: clamp(500px, 50vw, 1500px);
		object-fit: cover;
		border-radius: 50%;
		filter: drop-shadow(0 0 40px rgba(130, 80, 255, 0.35));
		animation: sphere-float 6s ease-in-out infinite;
	}

	@keyframes sphere-float {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-14px) rotate(2deg); }
	}

	/* ───── Slide Dots ───── */
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

	/* Social links */
	.social-links {
		position: absolute;
		right: 2rem;
		bottom: 3rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		z-index: 20;
	}

	.social-links a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 1.5px solid rgba(255, 255, 255, 0.35);
		color: rgba(255, 255, 255, 0.9);
		background: rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(8px);
		transition: all 0.3s ease;
	}

	.social-links a:hover {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(255, 255, 255, 0.6);
		transform: scale(1.1);
	}

	.social-links svg {
		width: 20px;
		height: 20px;
	}

	@media (max-width: 980px) {
		.about-content {
			flex-direction: column;
			gap: 2rem;
		}

		.about-text {
			flex: none;
			max-width: 100%;
		}
	}

	@media (max-width: 720px) {
		.about-section {
			padding: 1rem;
		}

		.panel {
			padding: 1rem;
		}

		.about-content {
			flex-direction: column;
			gap: 1.5rem;
		}

		.about-text {
			flex: none;
			max-width: 100%;
		}

		.sphere-img {
			width: 400px;
		}

		.social-links {
			right: 1rem;
			bottom: 1.5rem;
		}
	}
</style>
