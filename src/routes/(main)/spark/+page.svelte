<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import GalleryPhoto from '$lib/components/GalleryPhoto.svelte';
	import { photos } from '$lib/data/gallery';

	const sparkArchive = photos.filter((photo) => photo.title === 'Spark Night');
	const backgroundVideoPath = '/videos/spark-night-background.mp4';
	let pageRoot: HTMLElement;
	let backgroundVideo: HTMLVideoElement;

	onMount(() => {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (reduceMotion.matches) {
			backgroundVideo.pause();
			return;
		}

		if (!('IntersectionObserver' in window)) return;

		const observer = new IntersectionObserver(
			(entries, currentObserver) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.classList.add('is-revealed');
					currentObserver.unobserve(entry.target);
				}
			},
			{ threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
		);

		pageRoot.classList.add('motion-ready');
		pageRoot.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
			observer.observe(element);
		});

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Spark | Tecnoesis 2026</title>
	<meta
		name="description"
		content="Get ready for Spark Night at Tecnoesis 2026, featuring Raghav Chaitanya at NIT Silchar."
	/>
</svelte:head>

<main class="spark-page" id="spark-top" bind:this={pageRoot}>
	<div class="spark-video-layer" aria-hidden="true">
		<video
			bind:this={backgroundVideo}
			data-source={backgroundVideoPath}
			autoplay
			muted
			loop
			playsinline
			preload="auto"
		></video>
		<div class="spark-video-shade"></div>
	</div>
	<div class="spark-backdrop" aria-hidden="true"></div>
	<div class="spark-grain" aria-hidden="true"></div>

	<div class="spark-wrap">
		<section class="spark-hero" aria-labelledby="spark-title">
			<div class="hero-copy" data-reveal>
				<p class="eyebrow">
					<span class="status-dot" aria-hidden="true"></span>
					THE TECNOESIS LIVE EXPERIENCE <span class="edition">/ 2026</span>
				</p>

				<p class="hero-index">ONE NIGHT. ALL THE FEELING.</p>
				<h1 id="spark-title">SPARK<span class="title-star" aria-hidden="true">✳</span></h1>
				<p class="artist-intro">SPARK NIGHT <span>·</span> LIVE AT TECNOESIS</p>
				<p class="artist-name">Raghav <em>Chaitanya</em></p>
				<p class="hero-description">
					An evening of live music, bright lights, and a crowd singing together. The next Spark
					night is getting ready to make some noise.
				</p>

				<div class="hero-actions">
					<a class="archive-cta" href="#spark-archive">
						<span>Revisit the last Spark nights</span>
						<span aria-hidden="true">↓</span>
					</a>
					<span class="registration-note">REGISTRATION DETAILS COMING SOON</span>
				</div>

				<div class="hero-facts" aria-label="Spark event details">
					<div>
						<span>DATE</span>
						<strong>TO BE ANNOUNCED</strong>
					</div>
					<div>
						<span>VENUE</span>
						<strong>NIT SILCHAR</strong>
					</div>
					<div class="edition-mark">
						<span>TECNOESIS</span>
						<strong>2026</strong>
					</div>
				</div>
			</div>

			<div
				class="portrait-stage"
				aria-label="Raghav Chaitanya portrait placeholder"
				data-reveal
				style="--reveal-delay: 120ms"
			>
				<div class="portrait-orbit portrait-orbit--outer" aria-hidden="true"></div>
				<div class="portrait-orbit portrait-orbit--inner" aria-hidden="true"></div>
				<div class="portrait-glow" aria-hidden="true"></div>
				<div class="portrait-card">
					<div class="portrait-topline">
						<span>FEATURED ARTIST</span>
						<span>RC <i></i> 01</span>
					</div>
					<div class="portrait-placeholder">
						<span class="portrait-initials" aria-hidden="true">RC</span>
						<span class="portrait-placeholder-label">ARTIST PORTRAIT</span>
						<span class="portrait-placeholder-note">IMAGE TO BE ADDED</span>
					</div>
					<div class="portrait-caption">
						<span>RAGHAV CHAITANYA</span>
						<span>LIVE AT SPARK NIGHT <b aria-hidden="true">↗</b></span>
					</div>
				</div>
				<span class="stage-coordinate stage-coordinate--top">26° 43′ N</span>
				<span class="stage-coordinate stage-coordinate--bottom">LIVE / NIT SILCHAR</span>
				<span class="stage-cross" aria-hidden="true">+</span>
			</div>
		</section>

		<div class="spark-divider" aria-hidden="true" data-reveal>
			<span>FEEL THE BUILD-UP</span>
			<span class="divider-line"></span>
			<span>MEET US IN THE CROWD&nbsp; ↘</span>
		</div>

		<section class="night-note" aria-labelledby="night-note-title" data-reveal>
			<div class="section-index"><span>01</span><i></i> THE NIGHT</div>
			<div class="night-note-copy">
				<h2 id="night-note-title">A little louder.<br /><em>A lot more alive.</em></h2>
				<p>
					Spark brings the festival together for one unforgettable live performance. Expect a
					charged atmosphere, familiar voices, and a night that stays with you long after the lights
					go down.
				</p>
			</div>
			<div class="night-note-stamp" aria-hidden="true">
				<span>TECNOESIS</span><strong>SPARK NIGHT</strong><span>EST. NIT SILCHAR</span>
			</div>
		</section>

		<section class="spark-archive" id="spark-archive" aria-labelledby="archive-title">
			<div class="archive-heading" data-reveal>
				<div>
					<p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> THE ARCHIVE</p>
					<h2 id="archive-title">Past nights.<br /><em>Still echoing.</em></h2>
				</div>
				<div class="archive-aside">
					<p>From the stage to the last song in the crowd.</p>
					<a href={resolve('/gallery')} class="all-moments-link">
						<span>Explore all moments</span><span aria-hidden="true">↗</span>
					</a>
				</div>
			</div>

			<div class="archive-toolbar" data-reveal>
				<span>SPARK NIGHT / SELECTED FRAMES</span>
				<span>{String(sparkArchive.length).padStart(2, '0')} MOMENTS</span>
			</div>

			{#if sparkArchive.length}
				<div class="archive-grid">
					{#each sparkArchive as photo, index (photo.id)}
						<figure
							class:archive-featured={index === 0}
							data-reveal
							style={`--reveal-delay: ${Math.min(index, 3) * 80}ms`}
						>
							<div class="archive-image">
								<GalleryPhoto {photo} />
								<span class="photo-count">{String(index + 1).padStart(2, '0')}</span>
								<span class="photo-corner" aria-hidden="true">↗</span>
							</div>
							<figcaption>
								<span>{photo.title}</span>
								<time datetime="2026-03-13">{photo.date}</time>
							</figcaption>
						</figure>
					{/each}
				</div>
			{:else}
				<p class="archive-empty">Performance photographs will appear here soon.</p>
			{/if}
		</section>

		<footer class="spark-footer" data-reveal>
			<div>
				<span>THE NEXT SPARK NIGHT</span>
				<p>See you under the lights.</p>
			</div>
			<a href="#spark-top">Back to top <span aria-hidden="true">↗</span></a>
		</footer>
	</div>
</main>

<style>
	:global(body .site-header) {
		backdrop-filter: blur(16px);
	}

	.spark-page {
		--paper: #fff7fb;
		--muted: rgba(241, 218, 235, 0.68);
		--pink: #ff73be;
		--violet: #b78aff;
		--cyan: #75e6f4;
		position: relative;
		isolation: isolate;
		min-height: 100svh;
		overflow: clip;
		color: var(--paper);
		background:
			radial-gradient(ellipse at 80% 12%, rgba(138, 42, 120, 0.18), transparent 38%),
			linear-gradient(180deg, rgba(13, 5, 28, 0.88), rgba(14, 6, 30, 0.95));
		font-family: 'Sulphur Point', sans-serif;
	}

	.spark-video-layer {
		position: fixed;
		z-index: -1;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		background: #0d051c;
	}

	.spark-video-layer video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.4;
		filter: brightness(0.65) saturate(0.82);
	}

	.spark-video-shade {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(13, 5, 28, 0.62), rgba(13, 5, 28, 0.76) 50%, #0e061e),
			linear-gradient(90deg, rgba(13, 5, 28, 0.62), transparent 60%);
	}

	.spark-backdrop,
	.spark-grain {
		position: absolute;
		z-index: -1;
		inset: 0;
		pointer-events: none;
	}

	.spark-backdrop {
		position: fixed;
		inset: 0;
		background:
			radial-gradient(ellipse at 74% 28%, rgba(255, 67, 166, 0.16), transparent 34%),
			radial-gradient(ellipse at 56% 70%, rgba(71, 176, 221, 0.1), transparent 38%);
	}

	.spark-grain {
		position: fixed;
		opacity: 0.13;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.2'/%3E%3C/svg%3E");
	}

	.spark-wrap {
		width: min(1320px, calc(100% - 64px));
		margin-inline: auto;
	}

	.spark-hero {
		display: grid;
		min-height: min(790px, calc(100svh - 82px));
		grid-template-columns: minmax(0, 1.02fr) minmax(360px, 0.98fr);
		align-items: center;
		gap: clamp(28px, 5vw, 80px);
		padding-block: 92px 60px;
	}

	.hero-copy {
		position: relative;
		z-index: 2;
		padding-block: 28px;
	}

	.eyebrow,
	.hero-index,
	.artist-intro,
	.hero-facts > div > span,
	.edition-mark,
	.registration-note,
	.portrait-topline,
	.portrait-caption,
	.portrait-placeholder-label,
	.portrait-placeholder-note,
	.stage-coordinate,
	.spark-divider,
	.section-index,
	.night-note-stamp,
	.archive-toolbar,
	.archive-grid figcaption,
	.photo-count,
	.spark-footer > div > span {
		font-family: 'Bruno Ace', sans-serif;
		text-transform: uppercase;
	}

	.eyebrow {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
		color: #f1dced;
		font-size: 0.66rem;
		letter-spacing: 0.11em;
	}

	.status-dot {
		width: 7px;
		height: 7px;
		flex: 0 0 auto;
		border-radius: 50%;
		background: var(--pink);
		box-shadow: 0 0 14px var(--pink);
	}

	.edition {
		color: var(--cyan);
	}

	.hero-index {
		margin: 52px 0 8px;
		color: var(--cyan);
		font-size: 0.62rem;
		letter-spacing: 0.14em;
	}

	.spark-hero h1 {
		margin: 0;
		color: #fff;
		font-family: 'Orbitron', sans-serif;
		font-size: clamp(4.8rem, 12vw, 10.5rem);
		font-weight: 800;
		letter-spacing: -0.09em;
		line-height: 0.9;
		text-shadow: 0 0 52px rgba(255, 87, 186, 0.24);
	}

	.title-star {
		display: inline-block;
		margin-left: 0.12em;
		color: var(--pink);
		font-size: 0.29em;
		vertical-align: top;
		animation: star-pulse 4s ease-in-out infinite;
	}

	.artist-intro {
		margin: 32px 0 3px;
		color: var(--muted);
		font-size: 0.59rem;
		letter-spacing: 0.2em;
	}

	.artist-name {
		margin: 0;
		font-family: 'Orbitron', sans-serif;
		font-size: clamp(1.75rem, 3.5vw, 3.4rem);
		font-weight: 500;
		letter-spacing: -0.055em;
		line-height: 1.1;
	}

	.artist-name em {
		color: var(--pink);
		font-style: normal;
	}

	.hero-description {
		max-width: 510px;
		margin: 22px 0 0;
		color: var(--muted);
		font-size: clamp(1rem, 1.4vw, 1.15rem);
		line-height: 1.7;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 18px 24px;
		margin-top: 30px;
	}

	.archive-cta {
		display: inline-flex;
		min-height: 48px;
		align-items: center;
		gap: 24px;
		padding: 0 18px;
		border: 1px solid rgba(255, 115, 190, 0.76);
		background: linear-gradient(105deg, rgba(255, 115, 190, 0.18), rgba(183, 138, 255, 0.08));
		color: #fff;
		font-size: 0.9rem;
		text-decoration: none;
		transition:
			transform 180ms ease,
			background 180ms ease,
			border-color 180ms ease;
	}

	.archive-cta:hover,
	.archive-cta:focus-visible {
		transform: translateY(-2px);
		border-color: var(--cyan);
		background: rgba(255, 115, 190, 0.25);
	}

	.archive-cta:focus-visible,
	.all-moments-link:focus-visible,
	.spark-footer a:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 4px;
	}

	.archive-cta > span:last-child {
		color: var(--cyan);
		font-size: 1.15rem;
	}

	.registration-note {
		display: inline-flex;
		min-height: 42px;
		align-items: center;
		gap: 9px;
		padding: 0 12px;
		border: 1px solid rgba(117, 230, 244, 0.3);
		background: rgba(117, 230, 244, 0.045);
		color: rgba(255, 255, 255, 0.82);
		font-size: 0.5rem;
		letter-spacing: 0.07em;
	}

	.registration-note::before {
		width: 6px;
		height: 6px;
		flex: 0 0 auto;
		border-radius: 50%;
		background: var(--pink);
		box-shadow: 0 0 10px rgba(255, 115, 190, 0.8);
		content: '';
	}

	.hero-facts {
		display: flex;
		flex-wrap: wrap;
		gap: 28px clamp(24px, 4vw, 58px);
		margin-top: 52px;
		padding-top: 19px;
		border-top: 1px solid rgba(255, 255, 255, 0.16);
	}

	.hero-facts > div {
		display: grid;
		gap: 8px;
	}

	.hero-facts > div > span {
		color: rgba(241, 218, 235, 0.55);
		font-size: 0.52rem;
		letter-spacing: 0.12em;
	}

	.hero-facts strong {
		color: #fff;
		font-size: 0.86rem;
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	.edition-mark {
		grid-template-columns: auto auto;
		align-items: end;
		gap: 8px;
		color: var(--pink);
		font-size: 0.62rem;
		letter-spacing: 0.1em;
	}

	.edition-mark strong {
		color: var(--cyan);
		font-family: 'Orbitron', sans-serif;
		font-size: 1.2rem;
	}

	.portrait-stage {
		position: relative;
		display: grid;
		min-height: 580px;
		place-items: center;
		isolation: isolate;
	}

	.portrait-card {
		position: relative;
		z-index: 1;
		display: flex;
		width: min(100%, 460px);
		height: 510px;
		flex-direction: column;
		justify-content: space-between;
		padding: 19px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.4);
		background:
			linear-gradient(155deg, rgba(38, 13, 52, 0.3), rgba(11, 8, 28, 0.88)),
			radial-gradient(ellipse at 52% 45%, rgba(255, 88, 185, 0.5), transparent 54%),
			linear-gradient(135deg, #371843, #13152f 56%, #15283e);
		box-shadow:
			0 28px 100px rgba(2, 0, 12, 0.52),
			0 0 60px rgba(255, 83, 183, 0.12);
		transform: rotate(2deg);
		transition:
			transform 350ms cubic-bezier(0.2, 0.65, 0.3, 1),
			box-shadow 350ms ease;
	}

	.portrait-stage:hover .portrait-card {
		box-shadow:
			0 38px 110px rgba(2, 0, 12, 0.58),
			0 0 74px rgba(255, 83, 183, 0.2);
		transform: translateY(-5px) rotate(0);
	}

	.portrait-card::before,
	.portrait-card::after {
		position: absolute;
		z-index: -1;
		content: '';
	}

	.portrait-card::before {
		inset: 0;
		background:
			linear-gradient(90deg, transparent 49.8%, rgba(255, 255, 255, 0.08) 50%, transparent 50.2%),
			linear-gradient(0deg, transparent 49.8%, rgba(255, 255, 255, 0.06) 50%, transparent 50.2%);
		background-size: 54px 54px;
		mask-image: linear-gradient(180deg, transparent, black 30%, black 70%, transparent);
	}

	.portrait-card::after {
		right: -19%;
		bottom: 8%;
		width: 112%;
		height: 54%;
		border: 1px solid rgba(117, 230, 244, 0.32);
		border-radius: 50%;
		box-shadow:
			0 0 0 18px rgba(255, 115, 190, 0.05),
			0 0 50px rgba(117, 230, 244, 0.12);
		transform: rotate(-26deg);
	}

	.portrait-topline,
	.portrait-caption {
		position: relative;
		z-index: 2;
		display: flex;
		justify-content: space-between;
		gap: 12px;
		color: rgba(255, 255, 255, 0.88);
		font-size: 0.55rem;
		letter-spacing: 0.1em;
	}

	.portrait-topline span:last-child {
		color: var(--cyan);
	}

	.portrait-topline i {
		display: inline-block;
		width: 4px;
		height: 4px;
		margin: 0 3px 2px;
		border-radius: 50%;
		background: var(--pink);
	}

	.portrait-placeholder {
		position: absolute;
		inset: 66px 19px;
		display: grid;
		place-content: center;
		gap: 10px;
		border: 1px dashed rgba(255, 255, 255, 0.34);
		text-align: center;
	}

	.portrait-placeholder::before,
	.portrait-placeholder::after {
		position: absolute;
		top: 50%;
		left: 50%;
		width: min(75%, 250px);
		aspect-ratio: 1;
		border: 1px solid rgba(255, 115, 190, 0.22);
		border-radius: 50%;
		content: '';
		transform: translate(-50%, -50%);
	}

	.portrait-placeholder::after {
		width: min(58%, 190px);
		border-color: rgba(117, 230, 244, 0.34);
		border-style: dashed;
	}

	.portrait-initials {
		position: relative;
		z-index: 1;
		color: rgba(255, 255, 255, 0.82);
		font-family: 'Orbitron', sans-serif;
		font-size: clamp(4.8rem, 9vw, 7.2rem);
		font-weight: 600;
		letter-spacing: -0.1em;
		text-shadow: 0 0 40px rgba(255, 115, 190, 0.48);
	}

	.portrait-placeholder-label,
	.portrait-placeholder-note {
		position: relative;
		z-index: 1;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.59rem;
		letter-spacing: 0.13em;
	}

	.portrait-placeholder-note {
		color: var(--cyan);
		font-size: 0.48rem;
	}

	.portrait-caption {
		align-items: end;
		padding-top: 14px;
		border-top: 1px solid rgba(255, 255, 255, 0.23);
		font-size: 0.56rem;
	}

	.portrait-caption > span:last-child {
		color: var(--pink);
		text-align: right;
	}

	.portrait-caption b {
		margin-left: 4px;
		color: var(--cyan);
		font: 0.9rem sans-serif;
	}

	.portrait-orbit {
		position: absolute;
		z-index: -1;
		top: 50%;
		left: 50%;
		width: min(78vw, 530px);
		aspect-ratio: 1;
		border: 1px solid rgba(255, 115, 190, 0.3);
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	.portrait-orbit--inner {
		width: min(65vw, 440px);
		border-color: rgba(117, 230, 244, 0.25);
		transform: translate(-50%, -50%) rotateX(68deg) rotate(-18deg);
	}

	.portrait-glow {
		position: absolute;
		z-index: -1;
		top: 50%;
		left: 50%;
		width: 68%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: rgba(211, 63, 166, 0.2);
		filter: blur(90px);
		transform: translate(-50%, -50%);
	}

	.stage-coordinate {
		position: absolute;
		z-index: 2;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.48rem;
		letter-spacing: 0.12em;
		writing-mode: vertical-rl;
	}

	.stage-coordinate--top {
		top: 13%;
		right: 1%;
		color: var(--cyan);
	}

	.stage-coordinate--bottom {
		bottom: 13%;
		left: 2%;
	}

	.stage-cross {
		position: absolute;
		top: 12%;
		left: 7%;
		color: var(--pink);
		font-size: 1.3rem;
	}

	.spark-divider {
		display: flex;
		align-items: center;
		gap: 18px;
		padding-block: 16px;
		border-block: 1px solid rgba(255, 255, 255, 0.17);
		color: rgba(255, 255, 255, 0.65);
		font-size: 0.53rem;
		letter-spacing: 0.12em;
	}

	.divider-line {
		height: 1px;
		flex: 1;
		background: linear-gradient(90deg, rgba(255, 115, 190, 0.5), rgba(117, 230, 244, 0.5));
	}

	.night-note {
		display: grid;
		grid-template-columns: minmax(130px, 0.45fr) minmax(0, 1.5fr) minmax(150px, 0.5fr);
		align-items: center;
		gap: 36px;
		padding-block: clamp(76px, 10vw, 140px);
	}

	.section-index {
		align-self: start;
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--pink);
		font-size: 0.54rem;
		letter-spacing: 0.12em;
	}

	.section-index > span {
		color: var(--cyan);
	}

	.section-index i {
		width: 34px;
		height: 1px;
		background: rgba(255, 115, 190, 0.7);
	}

	.night-note-copy h2,
	.archive-heading h2 {
		margin: 0;
		font-family: 'Orbitron', sans-serif;
		font-size: clamp(2rem, 5.2vw, 4.5rem);
		font-weight: 500;
		letter-spacing: -0.07em;
		line-height: 1.12;
	}

	.night-note-copy h2 em,
	.archive-heading h2 em {
		color: var(--pink);
		font-style: normal;
	}

	.night-note-copy p {
		max-width: 610px;
		margin: 22px 0 0;
		color: var(--muted);
		font-size: 1.06rem;
		line-height: 1.75;
	}

	.night-note-stamp {
		display: grid;
		justify-items: center;
		gap: 10px;
		aspect-ratio: 1;
		align-content: center;
		border: 1px solid rgba(255, 115, 190, 0.38);
		border-radius: 50%;
		color: rgba(255, 255, 255, 0.66);
		font-size: 0.47rem;
		letter-spacing: 0.1em;
		transform: rotate(8deg);
	}

	.night-note-stamp strong {
		color: var(--cyan);
		font-family: 'Orbitron', sans-serif;
		font-size: clamp(1.1rem, 2vw, 1.8rem);
		letter-spacing: -0.04em;
	}

	.spark-archive {
		padding-block: 70px 104px;
		border-top: 1px solid rgba(255, 255, 255, 0.17);
		scroll-margin-top: 100px;
	}

	.archive-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 36px;
		margin-bottom: 42px;
	}

	.archive-heading .eyebrow {
		margin-bottom: 16px;
		color: var(--cyan);
		font-size: 0.56rem;
	}

	.archive-heading h2 {
		font-size: clamp(2.4rem, 6vw, 5rem);
	}

	.archive-aside {
		display: grid;
		justify-items: start;
		gap: 14px;
		padding-bottom: 5px;
	}

	.archive-aside p {
		max-width: 260px;
		margin: 0;
		color: var(--muted);
		line-height: 1.6;
	}

	.all-moments-link {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		color: #fff;
		font-size: 0.9rem;
		text-decoration-color: rgba(255, 115, 190, 0.7);
		text-underline-offset: 5px;
	}

	.all-moments-link span:last-child {
		color: var(--pink);
	}

	.archive-toolbar {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		padding: 12px 0;
		border-block: 1px solid rgba(255, 255, 255, 0.16);
		color: rgba(255, 255, 255, 0.61);
		font-size: 0.5rem;
		letter-spacing: 0.1em;
	}

	.archive-toolbar span:last-child {
		color: var(--cyan);
	}

	.archive-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 28px 18px;
		padding-top: 22px;
	}

	.archive-grid figure {
		min-width: 0;
		margin: 0;
	}

	.archive-grid figure:nth-child(4n + 1) {
		grid-column: span 2;
	}

	.archive-image {
		position: relative;
		height: clamp(210px, 25vw, 340px);
		overflow: hidden;
		background: #1b1026;
	}

	.archive-grid figure:nth-child(4n + 1) .archive-image {
		height: clamp(260px, 34vw, 440px);
	}

	.archive-image :global(picture),
	.archive-image :global(img) {
		width: 100%;
		height: 100%;
	}

	.archive-image :global(img) {
		object-fit: cover;
		transition: transform 500ms cubic-bezier(0.2, 0.65, 0.3, 1);
	}

	.archive-image::before {
		position: absolute;
		z-index: 1;
		inset: 0;
		border: 1px solid rgba(255, 255, 255, 0.08);
		content: '';
		pointer-events: none;
		transition: border-color 250ms ease;
	}

	.archive-grid figure:hover .archive-image :global(img) {
		transform: scale(1.04);
	}

	.archive-grid figure:hover .archive-image::before {
		border-color: rgba(117, 230, 244, 0.7);
	}

	.archive-image::after {
		position: absolute;
		inset: 35% 0 0;
		background: linear-gradient(transparent, rgba(8, 4, 20, 0.55));
		content: '';
		pointer-events: none;
	}

	.photo-count,
	.photo-corner {
		position: absolute;
		z-index: 1;
		top: 13px;
		color: white;
	}

	.photo-count {
		left: 14px;
		font-size: 0.5rem;
		letter-spacing: 0.1em;
	}

	.photo-corner {
		right: 14px;
		display: grid;
		width: 30px;
		height: 30px;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.62);
		border-radius: 50%;
		font: 1rem sans-serif;
	}

	.archive-grid figcaption {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding-top: 11px;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.5rem;
		letter-spacing: 0.08em;
	}

	.archive-grid time {
		color: var(--cyan);
		white-space: nowrap;
	}

	.archive-empty {
		padding: 44px 0;
		color: var(--muted);
		font-size: 1rem;
	}

	.spark-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 24px 0 48px;
		border-top: 1px solid rgba(255, 255, 255, 0.17);
	}

	.spark-footer > div > span {
		color: var(--cyan);
		font-size: 0.5rem;
		letter-spacing: 0.12em;
	}

	.spark-footer p {
		margin: 8px 0 0;
		font-family: 'Orbitron', sans-serif;
		font-size: clamp(1rem, 2.5vw, 1.55rem);
	}

	.spark-footer a {
		color: rgba(255, 255, 255, 0.78);
		font-size: 0.87rem;
		text-decoration: none;
	}

	.spark-footer a span {
		margin-left: 8px;
		color: var(--pink);
	}

	@keyframes star-pulse {
		0%,
		100% {
			opacity: 0.82;
			transform: scale(0.94) rotate(-8deg);
		}
		50% {
			opacity: 1;
			transform: scale(1.08) rotate(8deg);
		}
	}

	:global(.spark-page.motion-ready [data-reveal]) {
		opacity: 0;
		transform: translateY(26px);
		transition:
			opacity 650ms ease,
			transform 650ms cubic-bezier(0.2, 0.65, 0.3, 1);
		transition-delay: var(--reveal-delay, 0ms);
	}

	:global(.spark-page.motion-ready [data-reveal].is-revealed) {
		opacity: 1;
		transform: translateY(0);
	}

	@media (max-width: 900px) {
		.spark-wrap {
			width: min(100% - 44px, 720px);
		}

		.spark-hero {
			min-height: 0;
			grid-template-columns: 1fr;
			gap: 20px;
			padding-top: 112px;
		}

		.hero-copy {
			padding-block: 0;
		}

		.hero-index {
			margin-top: 44px;
		}

		.portrait-stage {
			min-height: 530px;
			margin-top: 8px;
		}

		.portrait-card {
			width: min(78%, 430px);
			height: 460px;
		}

		.night-note {
			grid-template-columns: minmax(100px, 0.36fr) minmax(0, 1.64fr);
			gap: 26px;
		}

		.night-note-stamp {
			display: none;
		}

		.archive-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.archive-grid figure:nth-child(n) {
			grid-column: auto;
		}

		.archive-grid figure:nth-child(4n + 1) {
			grid-column: span 2;
		}

		.archive-grid figure:nth-child(n) .archive-image {
			height: clamp(220px, 38vw, 340px);
		}

		.archive-grid figure:nth-child(4n + 1) .archive-image {
			height: clamp(270px, 48vw, 410px);
		}
	}

	@media (max-width: 600px) {
		.spark-wrap {
			width: calc(100% - 36px);
		}

		.spark-hero {
			padding-top: 104px;
		}

		.eyebrow {
			flex-wrap: wrap;
			font-size: 0.55rem;
		}

		.hero-index {
			margin-top: 37px;
			font-size: 0.53rem;
		}

		.spark-hero h1 {
			font-size: clamp(4rem, 20vw, 7rem);
		}

		.artist-name {
			max-width: 420px;
			font-size: clamp(1.8rem, 9vw, 2.8rem);
		}

		.hero-description {
			font-size: 1rem;
		}

		.hero-facts {
			gap: 20px 28px;
			margin-top: 38px;
		}

		.hero-facts > div > span {
			font-size: 0.46rem;
		}

		.hero-facts strong {
			font-size: 0.72rem;
		}

		.edition-mark {
			display: none;
		}

		.portrait-stage {
			min-height: 450px;
		}

		.portrait-card {
			width: min(84%, 350px);
			height: 390px;
			padding: 14px;
		}

		.portrait-placeholder {
			inset: 56px 14px;
		}

		.stage-coordinate--top {
			right: 0;
		}

		.spark-divider {
			gap: 10px;
			font-size: 0.4rem;
		}

		.night-note {
			grid-template-columns: 1fr;
			gap: 18px;
			padding-block: 76px;
		}

		.night-note-copy h2 {
			font-size: clamp(2.15rem, 10vw, 3.4rem);
		}

		.archive-heading {
			align-items: start;
			flex-direction: column;
			gap: 23px;
			margin-bottom: 28px;
		}

		.archive-heading h2 {
			font-size: clamp(2.3rem, 11vw, 3.6rem);
		}

		.archive-aside {
			grid-template-columns: 1fr auto;
			align-items: center;
			gap: 12px;
		}

		.archive-aside p {
			font-size: 0.9rem;
		}

		.all-moments-link {
			font-size: 0.8rem;
			white-space: nowrap;
		}

		.archive-toolbar {
			font-size: 0.42rem;
		}

		.archive-grid {
			grid-template-columns: 1fr 1fr;
			gap: 21px 11px;
			padding-top: 16px;
		}

		.archive-grid figure:nth-child(n) {
			grid-column: auto;
		}

		.archive-grid figure:nth-child(4n + 1) {
			grid-column: span 2;
		}

		.archive-grid figure:nth-child(n) .archive-image {
			height: clamp(150px, 46vw, 230px);
		}

		.archive-grid figure:nth-child(4n + 1) .archive-image {
			height: clamp(220px, 65vw, 310px);
		}

		.archive-grid figcaption {
			flex-direction: column;
			gap: 5px;
			font-size: 0.43rem;
		}

		.archive-grid time {
			font-size: 0.42rem;
		}

		.spark-footer {
			align-items: flex-start;
		}

		.spark-footer a {
			padding-top: 4px;
			white-space: nowrap;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spark-page *,
		.spark-page *::before,
		.spark-page *::after {
			scroll-behavior: auto !important;
			transform: none !important;
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}

		:global(.spark-page.motion-ready [data-reveal]) {
			opacity: 1;
		}
	}
</style>
