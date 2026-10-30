<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { resolve } from '$app/paths';
	import GalleryPhoto from '$lib/components/GalleryPhoto.svelte';
	import { photos, type GalleryPhoto as GalleryPhotoType } from '$lib/data/gallery';
	import raghavPortrait from './Raghav_Chaitanya.png';
	import raghavWordmark from './Raghav_name.png';
	import backgroundVideoPath from './Banner_video.mp4?url';

	const sparkArchive = photos.filter((photo) => photo.title === 'Spark Night');
	const artistTracks = [
		{ title: 'Ek Tukda Dhoop', film: 'Thappad' },
		{ title: 'Dil', film: 'Ek Villain Returns' },
		{ title: 'Hua Main', film: 'Animal' },
		{ title: 'Tum Se', film: 'Teri Baaton Mein Aisa Uljha Jiya' }
	];
	let pageRoot: HTMLElement;
	let backgroundVideo: HTMLVideoElement;
	let photoViewer: HTMLDialogElement;
	let activeSparkIndex = $state(0);
	let selectedPhoto = $state<GalleryPhotoType | null>(null);
	let selectedTrackIndex = $state(0);
	let trackRotationPaused = $state(false);
	let progressVersion = $state(0);
	let trackTimer = 0;
	let photoTimer = 0;
	let photoRotationPaused = $state(false);
	const selectedTrack = $derived(artistTracks[selectedTrackIndex]);

	function selectArtistTrack(index: number) {
		selectedTrackIndex = index;
		progressVersion += 1;
	}

	function advanceArtistTrack() {
		selectedTrackIndex = (selectedTrackIndex + 1) % artistTracks.length;
		progressVersion += 1;
	}
	let cursorTrail = $state<{ id: number; x: number; y: number; angle: number }[]>([]);
	let nextTrailId = 0;
	let lastTrailPoint = { x: 0, y: 0 };

	function showPreviousSparkPhoto() {
		activeSparkIndex = (activeSparkIndex - 1 + sparkArchive.length) % sparkArchive.length;
	}

	function showNextSparkPhoto() {
		activeSparkIndex = (activeSparkIndex + 1) % sparkArchive.length;
	}

	async function openSparkPhoto(index: number) {
		activeSparkIndex = index;
		selectedPhoto = sparkArchive[index];
		await tick();
		photoViewer.showModal();
		window.dispatchEvent(new Event('tecnoesis:modal-open'));
	}

	function closeSparkPhoto() {
		photoViewer.close();
		selectedPhoto = null;
	}

	function moveViewerPhoto(direction: 1 | -1) {
		if (direction === 1) showNextSparkPhoto();
		else showPreviousSparkPhoto();
		selectedPhoto = sparkArchive[activeSparkIndex];
	}

	function handleViewerKeys(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			closeSparkPhoto();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			moveViewerPhoto(1);
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			moveViewerPhoto(-1);
		}
	}

	function updateIntroProgress(reduceMotion: boolean) {
		const fadeDistance = Math.max(window.innerHeight * 0.7, 1);
		const progress = Math.min(1, Math.max(0, window.scrollY / fadeDistance));
		pageRoot.style.setProperty('--intro-progress', String(progress));
		if (progress >= 1 || reduceMotion) {
			backgroundVideo.pause();
		} else if (backgroundVideo.paused) {
			void backgroundVideo.play().catch((error: unknown) => {
				console.error('Could not resume the Spark Night background video:', error);
			});
		}
	}

	function scrollIntoContent(event: MouseEvent) {
		event.preventDefault();
		document
			.getElementById('spark-content')
			?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	onMount(() => {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (reduceMotion.matches) backgroundVideo.pause();
		trackTimer = window.setInterval(() => {
			if (!trackRotationPaused) advanceArtistTrack();
		}, 5000);
		photoTimer = window.setInterval(() => {
			if (!photoRotationPaused && !photoViewer.open && sparkArchive.length > 1) {
				showNextSparkPhoto();
			}
		}, 5000);

		let previousScrollY = window.scrollY;

		const handlePointerMove = (event: PointerEvent) => {
			if (reduceMotion.matches || (event.pointerType !== 'mouse' && event.pointerType !== 'pen'))
				return;
			pageRoot.style.setProperty('--pointer-x', `${event.clientX}px`);
			pageRoot.style.setProperty('--pointer-y', `${event.clientY}px`);
			pageRoot.classList.add('pointer-active');

			const deltaX = event.clientX - lastTrailPoint.x;
			const deltaY = event.clientY - lastTrailPoint.y;
			if (Math.hypot(deltaX, deltaY) < 22) return;

			const trailId = nextTrailId++;
			cursorTrail = [
				...cursorTrail.slice(-5),
				{
					id: trailId,
					x: event.clientX,
					y: event.clientY,
					angle: (Math.atan2(deltaY, deltaX) * 180) / Math.PI
				}
			];
			lastTrailPoint = { x: event.clientX, y: event.clientY };
			window.setTimeout(() => {
				cursorTrail = cursorTrail.filter((point) => point.id !== trailId);
			}, 560);
		};

		const handlePointerLeave = (event: PointerEvent) => {
			if (!event.relatedTarget) pageRoot.classList.remove('pointer-active');
		};

		const handleScroll = () => {
			const scrollY = window.scrollY;
			updateIntroProgress(reduceMotion.matches);
			if (Math.abs(scrollY - previousScrollY) < 2) return;
			pageRoot.classList.add('is-scrolling');
			pageRoot.classList.toggle('scrolling-down', scrollY > previousScrollY);
			pageRoot.classList.toggle('scrolling-up', scrollY < previousScrollY);
			previousScrollY = scrollY;
			window.clearTimeout(scrollEndTimer);
			scrollEndTimer = window.setTimeout(
				() => pageRoot.classList.remove('is-scrolling', 'scrolling-down', 'scrolling-up'),
				1100
			);
		};

		let scrollEndTimer = 0;
		updateIntroProgress(reduceMotion.matches);
		window.addEventListener('pointermove', handlePointerMove, { passive: true });
		window.addEventListener('pointerout', handlePointerLeave, { passive: true });
		window.addEventListener('scroll', handleScroll, { passive: true });

		if (reduceMotion.matches || !('IntersectionObserver' in window)) {
			return () => {
				window.removeEventListener('pointermove', handlePointerMove);
				window.removeEventListener('pointerout', handlePointerLeave);
				window.removeEventListener('scroll', handleScroll);
				window.clearTimeout(scrollEndTimer);
				window.clearInterval(trackTimer);
				window.clearInterval(photoTimer);
			};
		}

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

		return () => {
			observer.disconnect();
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('pointerout', handlePointerLeave);
			window.removeEventListener('scroll', handleScroll);
			window.clearTimeout(scrollEndTimer);
			window.clearInterval(trackTimer);
			window.clearInterval(photoTimer);
		};
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
	<section class="spark-intro" aria-label="Spark Night introduction">
		<video
			bind:this={backgroundVideo}
			src={backgroundVideoPath}
			autoplay
			muted
			loop
			playsinline
			preload="metadata"
			aria-hidden="true"
		></video>
		<div class="intro-video-shade" aria-hidden="true"></div>
		<a
			class="intro-scroll-cue"
			href="#spark-content"
			aria-label="Scroll to Spark Night details"
			onclick={scrollIntoContent}
		>
			<i aria-hidden="true">↓</i>
		</a>
	</section>
	<div class="intro-scroll-space" aria-hidden="true"></div>
	<div class="cursor-trail" aria-hidden="true">
		{#each cursorTrail as point (point.id)}
			<span
				style={`--trail-x: ${point.x}px; --trail-y: ${point.y}px; --trail-angle: ${point.angle}deg`}
			></span>
		{/each}
	</div>
	<div class="cursor-warp" aria-hidden="true"></div>
	<div class="spark-backdrop" aria-hidden="true"></div>
	<div class="spark-grain" aria-hidden="true"></div>

	<div class="spark-wrap" id="spark-content">
		<section class="spark-hero" aria-labelledby="spark-title">
			<div class="hero-copy">
				<div class="hero-copy-lead" data-reveal>
					<p class="eyebrow">
						<span class="status-dot" aria-hidden="true"></span>
						THE TECNOESIS LIVE EXPERIENCE <span class="edition">/ 2026</span>
					</p>
					<p class="hero-index">ONE NIGHT. ALL THE FEELING.</p>
				</div>
				<h1 id="spark-title" class="performance-title" aria-label="Spark Night">
					<span class="spark-title-top" aria-hidden="true">
						{#each ['S', 'P', 'A', 'R', 'K'] as letter (letter)}
							<span>{letter}</span>
						{/each}
					</span>
					<span class="night-title-word" aria-hidden="true">
						{#each ['N', 'I', 'G', 'H', 'T'] as letter (letter)}
							<span>{letter}</span>
						{/each}
					</span>
				</h1>
				<div class="hero-copy-details" data-reveal>
					<p class="artist-intro">LIVE AT TECNOESIS</p>
					<p class="hero-description">
						Spark Night is Tecnoesis’ closing-night celebration: a live music experience that brings
						the festival crowd together for one last unforgettable night. From guitar-driven energy
						to soulful melodies, it’s a chance to sing along, find your rhythm, and make the finale
						yours.
					</p>

					<div class="hero-facts" aria-label="Spark event details">
						<div>
							<span>DATE</span>
							<strong>01 November</strong>
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
			</div>

			<div class="portrait-stage" data-reveal style="--reveal-delay: 120ms">
				<div class="portrait-glow" aria-hidden="true"></div>
				<div class="portrait-grid" aria-hidden="true"></div>
				<img
					class="portrait-image"
					src={raghavPortrait}
					alt="Raghav Chaitanya singing on stage"
					width="1123"
					height="1401"
					loading="eager"
					fetchpriority="high"
				/>
				<span class="portrait-image-sweep" aria-hidden="true"></span>
				<span class="stage-coordinate stage-coordinate--top">26° 43′ N</span>
				<span class="stage-coordinate stage-coordinate--bottom">LIVE / NIT SILCHAR</span>
			</div>
		</section>

		<section class="artist-finale" aria-labelledby="about-spark-title" data-reveal>
			<div class="artist-finale-copy">
				<p class="about-kicker">THE GRAND FINALE</p>
				<h2 id="about-spark-title">When the lights go down, <em>the music takes over.</em></h2>
				<p>
					This edition welcomes <strong>Raghav Chaitanya</strong>, whose expressive voice moves
					effortlessly from intimate moments to full-stage anthems. Come for the performance; leave
					with a night worth remembering.
				</p>
				<div class="about-tags" aria-label="Spark highlights">
					<span>LIVE PERFORMANCE</span>
					<span>ONE FINAL NIGHT</span>
					<span>NIT SILCHAR</span>
				</div>
			</div>
			<figure class="artist-wordmark">
				<img
					src={raghavWordmark}
					alt="Raghav Chaitanya's name in filled and outlined burgundy lettering"
					width="3197"
					height="1783"
					loading="lazy"
					decoding="async"
				/>
			</figure>
		</section>

		<div class="spark-divider" aria-hidden="true" data-reveal>
			<span>FEEL THE BUILD-UP</span>
			<span class="divider-line"></span>
			<span>MEET US IN THE CROWD&nbsp; ↘</span>
		</div>

		<section class="night-note" aria-label="Raghav Chaitanya song highlights" data-reveal>
			<div class="section-index"><span>01</span><i></i> THE NIGHT</div>
			<div class="spark-guitar-player" aria-label="Raghav Chaitanya songs">
				<div class="guitar-art" aria-hidden="true">
					<span class="guitar-string guitar-string--one"></span>
					<span class="guitar-string guitar-string--two"></span>
					<span class="guitar-string guitar-string--three"></span>
					<span class="guitar-string guitar-string--four"></span>
					<span class="guitar-string guitar-string--five"></span>
					<span class="guitar-neck"></span>
					<span class="guitar-fret guitar-fret--one"></span>
					<span class="guitar-fret guitar-fret--two"></span>
					<span class="guitar-fret guitar-fret--three"></span>
					<span class="guitar-fret guitar-fret--four"></span>
					<span class="guitar-body"><i></i></span>
				</div>
				<div class="song-carousel" aria-live="polite">
					<span class="song-count"
						>{String(selectedTrackIndex + 1).padStart(2, '0')} / {String(
							artistTracks.length
						).padStart(2, '0')}</span
					>
					{#key selectedTrackIndex}
						<a
							class="song-slide"
							href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`Raghav Chaitanya ${selectedTrack.title} official`)}`}
							target="_blank"
							rel="noreferrer"
							aria-label={`Open ${selectedTrack.title} by Raghav Chaitanya on YouTube`}
						>
							<strong>{selectedTrack.title}</strong>
							<span>{selectedTrack.film}</span>
							<i aria-hidden="true">↗</i>
						</a>
					{/key}
					<div class="song-carousel-controls">
						{#key progressVersion}
							<div class="song-progress" aria-hidden="true">
								<span class:progress-paused={trackRotationPaused}></span>
							</div>
						{/key}
						<button
							class="song-pause"
							type="button"
							aria-label={trackRotationPaused ? 'Resume song rotation' : 'Pause song rotation'}
							aria-pressed={trackRotationPaused}
							onclick={() => {
								trackRotationPaused = !trackRotationPaused;
								progressVersion += 1;
							}}>{trackRotationPaused ? '▶' : 'Ⅱ'}</button
						>
					</div>
					<div class="song-track-dots" aria-label="Select song">
						{#each artistTracks as track, index (track.title)}
							<button
								class:song-dot-active={selectedTrackIndex === index}
								type="button"
								aria-label={`Show ${track.title}`}
								aria-pressed={selectedTrackIndex === index}
								onclick={() => selectArtistTrack(index)}
							></button>
						{/each}
					</div>
					<span class="song-track-hint">SELECT A TRACK TO FIND IT ON YOUTUBE</span>
				</div>
			</div>
		</section>

		<section class="spark-archive" id="spark-archive" aria-labelledby="archive-title">
			<div class="archive-heading" data-reveal>
				<div>
					<p class="eyebrow">
						<span class="status-dot" aria-hidden="true"></span> 02 / THE ARCHIVE
					</p>
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
				<div
					class="archive-roulette"
					aria-label="Spark Night photo carousel"
					aria-roledescription="carousel"
				>
					<div class="roulette-stage">
						{#each sparkArchive as photo, index (photo.id)}
							{@const offset =
								((index - activeSparkIndex + sparkArchive.length / 2) % sparkArchive.length) -
								sparkArchive.length / 2}
							<button
								class="roulette-card"
								class:roulette-active={offset === 0}
								class:roulette-previous={offset === -1}
								class:roulette-next={offset === 1}
								class:roulette-far={Math.abs(offset) > 1}
								class:roulette-landscape={photo.id === 20 || photo.id === 22}
								aria-label={`Show photo ${index + 1} of ${sparkArchive.length}: ${photo.title}`}
								aria-pressed={activeSparkIndex === index}
								onclick={() => openSparkPhoto(index)}
							>
								<div class="archive-image">
									<GalleryPhoto {photo} eager={activeSparkIndex === index} />
									<span class="photo-count">{String(index + 1).padStart(2, '0')}</span>
									<span class="photo-corner" aria-hidden="true">↗</span>
								</div>
								<span class="roulette-caption">
									<span>{photo.title}</span>
									<time datetime="2026-03-13">{photo.date}</time>
								</span>
							</button>
						{/each}
					</div>
					<div class="roulette-controls">
						<button
							class="roulette-arrow"
							aria-label="Previous Spark photo"
							onclick={showPreviousSparkPhoto}
						>
							<span aria-hidden="true">←</span>
						</button>
						<p aria-live="polite">
							<span>{String(activeSparkIndex + 1).padStart(2, '0')}</span>
							/ {String(sparkArchive.length).padStart(2, '0')} <i></i>
							{sparkArchive[activeSparkIndex]?.title}
						</p>
						<button
							class="roulette-arrow"
							aria-label="Next Spark photo"
							onclick={showNextSparkPhoto}
						>
							<span aria-hidden="true">→</span>
						</button>
						<button
							class="roulette-autoplay-toggle"
							type="button"
							aria-label={photoRotationPaused ? 'Resume photo rotation' : 'Pause photo rotation'}
							aria-pressed={photoRotationPaused}
							onclick={() => (photoRotationPaused = !photoRotationPaused)}
							>{photoRotationPaused ? '▶' : 'Ⅱ'}</button
						>
					</div>
				</div>
			{:else}
				<p class="archive-empty">Performance photographs will appear here soon.</p>
			{/if}
		</section>

		<footer class="spark-footer" data-reveal>
			<div>
				<span>THE SPARK NIGHT</span>
				<p>See you under the lights.</p>
			</div>
			<a href="#spark-top">Back to top <span aria-hidden="true">↗</span></a>
		</footer>
	</div>
</main>

<dialog
	bind:this={photoViewer}
	class="spark-photo-viewer"
	aria-label="Spark Night photo viewer"
	onclose={() => (selectedPhoto = null)}
	onkeydown={handleViewerKeys}
	onclick={(event) => {
		if (event.target === photoViewer) closeSparkPhoto();
	}}
>
	{#if selectedPhoto}
		<div class="viewer-shell">
			<div
				class="viewer-backdrop"
				style={`background-image: url("${selectedPhoto.src}")`}
				aria-hidden="true"
			></div>
			<div class="viewer-overlay" aria-hidden="true"></div>
			<div class="viewer-topbar">
				<span>THE TECNOESIS ARCHIVE</span>
				<button
					class="viewer-close"
					type="button"
					aria-label="Close photo viewer"
					onclick={closeSparkPhoto}
				>
					<span aria-hidden="true">×</span>
				</button>
			</div>
			<div class="viewer-stage">
				<GalleryPhoto photo={selectedPhoto} eager contained />
				<button
					class="viewer-nav viewer-nav--previous"
					type="button"
					aria-label="Previous Spark photo"
					onclick={() => moveViewerPhoto(-1)}>←</button
				>
				<button
					class="viewer-nav viewer-nav--next"
					type="button"
					aria-label="Next Spark photo"
					onclick={() => moveViewerPhoto(1)}>→</button
				>
			</div>
			<div class="viewer-bottom">
				<div class="viewer-caption">
					<p>{selectedPhoto.category}</p>
					<h2>{selectedPhoto.title}</h2>
				</div>
				<div class="viewer-controls">
					<span
						>{String(activeSparkIndex + 1).padStart(2, '0')} / {String(
							sparkArchive.length
						).padStart(2, '0')}</span
					>
				</div>
			</div>
		</div>
	{/if}
</dialog>

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
		background: #100b23;
		font-family: 'Sulphur Point', sans-serif;
	}

	.spark-intro {
		position: fixed;
		z-index: 0;
		inset: 0;
		min-height: 100svh;
		pointer-events: none;
		background: #090615;
		opacity: calc(1 - var(--intro-progress, 0));
		transition: opacity 180ms linear;
	}

	.spark-intro > video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: brightness(0.72) saturate(0.95);
		transform: scale(1.035);
	}

	.intro-video-shade {
		position: absolute;
		inset: 0;
		background-color: rgba(14, 6, 30, calc(var(--intro-progress, 0) * 0.62));
		background-image: linear-gradient(
			180deg,
			rgba(9, 6, 21, 0.14),
			rgba(9, 6, 21, 0.28) 52%,
			#0e061e 100%
		);
	}

	.intro-scroll-cue {
		position: absolute;
		z-index: 1;
		pointer-events: auto;
		bottom: 34px;
		left: 50%;
		display: grid;
		width: 44px;
		aspect-ratio: 1;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.46);
		border-radius: 50%;
		background: rgba(10, 7, 22, 0.16);
		color: rgba(255, 255, 255, 0.86);
		text-decoration: none;
		backdrop-filter: blur(6px);
		transform: translateX(-50%);
		transition:
			background 700ms ease,
			border-color 700ms ease,
			opacity 700ms ease;
	}

	.intro-scroll-space {
		height: 100svh;
		pointer-events: none;
	}

	.cursor-trail {
		position: fixed;
		z-index: 9;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.cursor-trail span {
		position: absolute;
		top: var(--trail-y);
		left: var(--trail-x);
		width: 42px;
		height: 7px;
		border-radius: 50%;
		background: rgba(145, 222, 255, 0.11);
		filter: blur(5px);
		opacity: 0;
		transform: translate(-50%, -50%) rotate(var(--trail-angle)) scaleX(0.45);
		animation: cursor-afterglow 560ms ease-out forwards;
	}

	.intro-scroll-cue i {
		display: grid;
		font: normal 1.2rem sans-serif;
		animation: scroll-nudge 2.8s ease-in-out infinite;
	}

	.intro-scroll-cue:hover {
		border-color: rgba(255, 255, 255, 0.8);
		background: rgba(255, 255, 255, 0.12);
	}

	.intro-scroll-cue:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 5px;
	}

	.cursor-warp {
		position: fixed;
		z-index: 10;
		top: var(--pointer-y, 50%);
		left: var(--pointer-x, 50%);
		width: 270px;
		aspect-ratio: 1;
		border: 1px solid rgba(168, 232, 255, 0.075);
		border-radius: 50%;
		background:
			radial-gradient(circle, rgba(121, 206, 255, 0.035), transparent 62%),
			radial-gradient(circle, transparent 62%, rgba(117, 230, 244, 0.035) 63%, transparent 64%);
		backdrop-filter: blur(2.5px) contrast(1.035);
		mask-image: radial-gradient(circle, black 25%, transparent 72%);
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.84);
		transition:
			top 320ms cubic-bezier(0.2, 0.65, 0.3, 1),
			left 320ms cubic-bezier(0.2, 0.65, 0.3, 1),
			opacity 700ms ease,
			transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
		pointer-events: none;
	}

	:global(.spark-page.pointer-active) .cursor-warp {
		opacity: 0.34;
		transform: translate(-50%, -50%) scale(1);
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
		position: relative;
		z-index: 1;
		width: min(1320px, calc(100% - 64px));
		margin-inline: auto;
	}

	.spark-hero {
		display: grid;
		min-height: min(790px, calc(100svh - 82px));
		grid-template-columns: minmax(0, 1.02fr) minmax(360px, 0.98fr);
		align-items: center;
		gap: clamp(28px, 5vw, 80px);
		padding-block: 92px clamp(16px, 2vw, 28px);
	}

	.hero-copy {
		position: relative;
		z-index: 2;
		padding-block: 28px;
	}

	.hero-copy-lead,
	.hero-copy-details {
		display: flow-root;
	}

	.eyebrow,
	.hero-index,
	.artist-intro,
	.hero-facts > div > span,
	.edition-mark,
	.stage-coordinate,
	.spark-divider,
	.section-index,
	.archive-toolbar,
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
		margin: 34px 0 8px;
		color: var(--cyan);
		font-size: 0.62rem;
		letter-spacing: 0.14em;
	}

	.spark-hero h1 {
		display: grid;
		justify-items: start;
		margin: 0;
		font-family: 'Orbitron', sans-serif;
		font-size: clamp(3.7rem, 8vw, 7.4rem);
		font-weight: 800;
		line-height: 0.82;
	}

	.performance-title {
		margin-top: 6px !important;
	}

	.spark-title-top,
	.night-title-word {
		display: flex;
		gap: 0.055em;
		white-space: nowrap;
		font-family: 'Orbitron', sans-serif;
		font-weight: 800;
		line-height: 0.95;
	}

	.spark-title-top {
		font-size: 1em;
		letter-spacing: 0;
		color: #fff;
		background: linear-gradient(105deg, #fff 8%, #f5eaf0 52%, #cf829e 100%);
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.night-title-word {
		margin-top: 0.12em;
		font-size: 0.78em;
		letter-spacing: 0;
		color: transparent;
		-webkit-text-fill-color: transparent;
		-webkit-text-stroke: 0.5px #12617c;
		text-shadow: none;
		filter: none;
		box-shadow: none;
	}

	.artist-intro {
		margin: 22px 0 3px;
		color: var(--muted);
		font-size: 0.59rem;
		letter-spacing: 0.2em;
	}

	.hero-description {
		max-width: 510px;
		margin: 16px 0 0;
		color: var(--muted);
		font-size: clamp(1rem, 1.4vw, 1.15rem);
		line-height: 1.7;
	}

	.all-moments-link:focus-visible,
	.spark-footer a:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 4px;
	}

	.hero-facts {
		display: flex;
		flex-wrap: wrap;
		gap: 28px clamp(24px, 4vw, 58px);
		margin-top: 36px;
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
		min-height: 650px;
		place-items: center;
		isolation: isolate;
	}

	.portrait-image {
		position: absolute;
		z-index: 3;
		inset: auto auto -1% 50%;
		width: min(112%, 620px);
		height: 112%;
		translate: -50% 0;
		object-fit: contain;
		object-position: center bottom;
		filter: brightness(0.9) saturate(0.82) contrast(0.98)
			drop-shadow(0 12px 28px rgba(0, 0, 0, 0.3));
		transition:
			filter 800ms ease,
			transform 1000ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.portrait-stage:hover .portrait-image {
		filter: brightness(0.9) saturate(0.88) contrast(1) drop-shadow(0 16px 34px rgba(0, 0, 0, 0.34));
		transform: translateY(-7px) scale(1.025);
	}

	.portrait-image-sweep {
		position: absolute;
		z-index: 5;
		top: 13%;
		bottom: 2%;
		left: -36%;
		width: 24%;
		background: linear-gradient(90deg, transparent, rgba(173, 252, 255, 0.2), transparent);
		filter: blur(16px);
		transform: skewX(-18deg);
		animation: portrait-light-pass 8s ease-in-out 1.2s infinite;
		pointer-events: none;
	}

	.portrait-glow {
		position: absolute;
		z-index: 0;
		inset: 0 auto 0 50%;
		width: 176%;
		height: 148%;
		margin-block: auto;
		translate: -50% 0;
		border-radius: 50%;
		background:
			radial-gradient(ellipse at 50% 42%, rgba(93, 243, 255, 0.4), transparent 30%),
			radial-gradient(ellipse at 50% 48%, rgba(30, 172, 255, 0.3), transparent 54%),
			radial-gradient(ellipse at 51% 56%, rgba(128, 58, 241, 0.22), transparent 74%);
		filter: blur(76px);
		animation: artist-bloom 5.6s ease-in-out infinite;
	}

	.portrait-grid {
		position: absolute;
		z-index: 1;
		inset: 0;
		background-color: transparent;
		background-image:
			radial-gradient(circle, rgba(153, 67, 226, 0.66) 1.5px, transparent 1.9px),
			linear-gradient(rgba(153, 67, 226, 0.4) 1px, transparent 1px),
			linear-gradient(90deg, rgba(153, 67, 226, 0.4) 1px, transparent 1px);
		background-position: center;
		background-size: 66px 66px;
		-webkit-mask-image: radial-gradient(ellipse at center, #000 45%, transparent 100%);
		mask-image: radial-gradient(ellipse at center, #000 45%, transparent 100%);
		opacity: 0.52;
		pointer-events: none;
	}

	.artist-finale {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		align-items: center;
		gap: clamp(28px, 5vw, 72px);
		margin-block: clamp(0px, 0.5vw, 8px) clamp(32px, 5vw, 64px);
		padding: clamp(16px, 2vw, 28px);
		background:
			radial-gradient(ellipse at 28% 50%, rgba(68, 194, 255, 0.035), transparent 42%),
			linear-gradient(90deg, transparent, rgba(19, 15, 43, 0.18));
	}

	.artist-wordmark {
		display: grid;
		width: 100%;
		min-width: 0;
		max-width: 100%;
		margin: 0;
	}

	.artist-wordmark img {
		display: block;
		width: 100%;
		max-width: 100%;
		height: clamp(300px, 38vw, 480px);
		object-fit: contain;
		object-position: center;
		filter: brightness(1.24) saturate(0.98) drop-shadow(0 0 16px rgba(255, 72, 124, 0.14));
	}

	.artist-finale-copy {
		display: grid;
		gap: 16px;
	}

	.about-kicker {
		margin: 0;
		color: var(--cyan);
		font-family: 'Bruno Ace', sans-serif;
		font-size: 0.54rem;
		letter-spacing: 0.14em;
	}

	.artist-finale-copy h2 {
		max-width: 560px;
		margin: 0;
		font-family: 'Orbitron', sans-serif;
		font-size: clamp(1.75rem, 3.25vw, 3.2rem);
		font-weight: 500;
		letter-spacing: -0.06em;
		line-height: 1.18;
	}

	.artist-finale-copy h2 em {
		color: var(--pink);
		font-style: normal;
		text-shadow: 0 0 28px rgba(255, 115, 190, 0.2);
	}

	.artist-finale-copy > p:not(.about-kicker) {
		margin: 0;
		color: var(--muted);
		font-size: clamp(0.94rem, 1.2vw, 1.05rem);
		line-height: 1.8;
	}

	.artist-finale-copy strong {
		color: #fff;
		font-weight: 700;
	}

	.about-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 3px;
	}

	.about-tags span {
		padding: 7px 10px;
		border: 1px solid rgba(117, 230, 244, 0.24);
		border-radius: 999px;
		background: rgba(10, 21, 42, 0.26);
		color: rgba(223, 250, 255, 0.76);
		font-family: 'Bruno Ace', sans-serif;
		font-size: 0.42rem;
		letter-spacing: 0.08em;
	}

	.stage-coordinate {
		position: absolute;
		z-index: 6;
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
		grid-template-columns: minmax(130px, 0.32fr) minmax(0, 1.68fr);
		align-items: center;
		gap: clamp(24px, 4vw, 56px);
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

	.archive-heading h2 {
		margin: 0;
		font-family: 'Orbitron', sans-serif;
		font-size: clamp(2rem, 5.2vw, 4.5rem);
		font-weight: 500;
		letter-spacing: -0.07em;
		line-height: 1.12;
	}

	.archive-heading h2 em {
		color: var(--pink);
		font-style: normal;
	}

	.spark-guitar-player {
		--player-cyan: #77e8f3;
		position: relative;
		z-index: 1;
		display: grid;
		grid-column: 2;
		width: min(100%, 780px);
		min-height: 270px;
		grid-template-columns: minmax(190px, 0.9fr) minmax(0, 1.1fr);
		align-items: center;
		gap: clamp(20px, 4vw, 48px);
		padding: 28px clamp(20px, 4vw, 48px);
		border-block: 1px solid rgba(117, 230, 244, 0.32);
		background:
			radial-gradient(ellipse at 20% 50%, rgba(117, 230, 244, 0.07), transparent 44%),
			linear-gradient(100deg, rgba(21, 13, 39, 0.38), rgba(10, 11, 29, 0.18));
		transition:
			border-color 450ms ease,
			background 450ms ease;
	}

	.spark-guitar-player:hover {
		border-color: rgba(117, 230, 244, 0.48);
		background: linear-gradient(100deg, rgba(21, 13, 39, 0.52), rgba(10, 11, 29, 0.3));
	}

	.guitar-art {
		position: relative;
		width: 205px;
		height: 250px;
		justify-self: center;
		filter: drop-shadow(0 0 16px rgba(117, 230, 244, 0.22));
		transform: rotate(-11deg);
		transition:
			transform 800ms cubic-bezier(0.16, 1, 0.3, 1),
			filter 800ms ease;
	}

	.spark-guitar-player:hover .guitar-art {
		filter: drop-shadow(0 0 22px rgba(117, 230, 244, 0.34));
		transform: rotate(-7deg) translateY(-4px);
	}

	.guitar-body {
		position: absolute;
		bottom: 7px;
		left: 32px;
		width: 111px;
		height: 108px;
		border: 1px solid rgba(219, 181, 255, 0.9);
		border-radius: 48% 52% 46% 54% / 42% 44% 56% 58%;
		background:
			radial-gradient(ellipse at 40% 37%, rgba(255, 127, 211, 0.35), transparent 48%),
			linear-gradient(
				145deg,
				rgba(117, 230, 244, 0.16),
				rgba(29, 17, 49, 0.9) 58%,
				rgba(255, 115, 190, 0.2)
			);
		box-shadow:
			inset 0 0 20px rgba(117, 230, 244, 0.13),
			0 0 15px rgba(205, 154, 255, 0.13);
	}

	.guitar-body::before {
		position: absolute;
		top: 31px;
		left: 41px;
		width: 25px;
		aspect-ratio: 1;
		border: 1px solid rgba(231, 218, 255, 0.72);
		border-radius: 50%;
		box-shadow: 0 0 9px rgba(117, 230, 244, 0.2);
		content: '';
	}

	.guitar-body::after {
		position: absolute;
		right: 21px;
		bottom: 16px;
		left: 21px;
		height: 3px;
		border-block: 1px solid rgba(225, 213, 250, 0.6);
		content: '';
	}

	.guitar-body > i {
		position: absolute;
		z-index: 2;
		top: 8px;
		left: 52px;
		width: 7px;
		height: 17px;
		border-radius: 3px;
		background: rgba(230, 224, 255, 0.8);
	}

	.guitar-neck {
		position: absolute;
		z-index: 1;
		top: 9px;
		left: 77px;
		width: 19px;
		height: 112px;
		border: 1px solid rgba(213, 198, 244, 0.84);
		border-bottom: 0;
		background: linear-gradient(
			90deg,
			rgba(42, 31, 65, 0.95),
			rgba(135, 114, 158, 0.82),
			rgba(37, 28, 59, 0.95)
		);
		transform: rotate(13deg);
		transform-origin: bottom center;
	}

	.guitar-neck::after {
		position: absolute;
		top: -18px;
		left: -3px;
		width: 24px;
		height: 22px;
		border: 1px solid rgba(213, 198, 244, 0.82);
		border-radius: 5px 5px 2px 2px;
		background: linear-gradient(120deg, #33264b, #17172e);
		content: '';
	}

	.guitar-string {
		position: absolute;
		z-index: 3;
		top: 5px;
		left: 79px;
		width: 1px;
		height: 190px;
		background: rgba(228, 244, 255, 0.68);
		box-shadow: 0 0 4px rgba(117, 230, 244, 0.32);
		transform: rotate(13deg);
		transform-origin: top center;
	}

	.guitar-string--two {
		left: 83px;
		opacity: 0.8;
	}
	.guitar-string--three {
		left: 87px;
		opacity: 0.68;
	}
	.guitar-string--four {
		left: 91px;
		opacity: 0.55;
	}
	.guitar-string--five {
		left: 95px;
		opacity: 0.42;
	}

	.guitar-fret {
		position: absolute;
		z-index: 4;
		left: 72px;
		width: 27px;
		height: 1px;
		background: rgba(228, 224, 249, 0.68);
		transform: rotate(13deg);
	}

	.guitar-fret--one {
		top: 39px;
	}
	.guitar-fret--two {
		top: 56px;
	}
	.guitar-fret--three {
		top: 73px;
	}
	.guitar-fret--four {
		top: 90px;
	}

	.song-carousel {
		display: grid;
		min-width: 0;
		gap: 14px;
		align-content: center;
	}

	.song-count {
		color: var(--player-cyan);
		font-family: 'Bruno Ace', sans-serif;
		font-size: 0.48rem;
		letter-spacing: 0.16em;
	}

	.song-slide {
		position: relative;
		display: grid;
		min-width: 0;
		gap: 8px;
		padding: 5px 28px 6px 0;
		color: #fff;
		text-decoration: none;
		animation: song-arrive 650ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	.song-slide strong {
		overflow-wrap: anywhere;
		font-family: 'Orbitron', sans-serif;
		font-size: clamp(1rem, 1.6vw, 1.35rem);
		font-weight: 600;
		line-height: 1.2;
	}

	.song-slide > span {
		color: rgba(235, 224, 245, 0.64);
		font-size: 0.78rem;
		line-height: 1.35;
	}

	.song-slide > i {
		position: absolute;
		top: 50%;
		right: 0;
		color: var(--player-cyan);
		font-size: 1.15rem;
		font-style: normal;
		transform: translateY(-50%);
		transition:
			color 300ms ease,
			transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.song-slide:hover > i {
		color: #fff;
		transform: translate(3px, -50%);
	}

	.song-carousel-controls {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.song-progress {
		height: 2px;
		flex: 1;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.16);
	}

	.song-progress > span {
		display: block;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, #ff73be, var(--player-cyan));
		transform: scaleX(0);
		transform-origin: left center;
		animation: song-progress 5s linear forwards;
	}

	.song-progress > span.progress-paused {
		animation-play-state: paused;
	}

	.song-pause {
		display: grid;
		width: 30px;
		aspect-ratio: 1;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.26);
		border-radius: 50%;
		background: rgba(12, 10, 26, 0.48);
		color: rgba(255, 255, 255, 0.86);
		font-size: 0.62rem;
		cursor: pointer;
		transition:
			background 300ms ease,
			border-color 300ms ease,
			transform 300ms ease;
	}

	.song-pause:hover,
	.song-pause:focus-visible {
		transform: scale(1.06);
		border-color: var(--player-cyan);
		background: rgba(117, 230, 244, 0.12);
	}

	.song-pause:focus-visible,
	.song-slide:focus-visible,
	.song-track-dots button:focus-visible {
		outline: 2px solid var(--player-cyan);
		outline-offset: 3px;
	}

	.song-track-dots {
		display: flex;
		gap: 8px;
		justify-content: end;
	}

	.song-track-dots button {
		width: 7px;
		height: 7px;
		padding: 0;
		border: 1px solid rgba(237, 225, 247, 0.48);
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
		transition:
			transform 300ms ease,
			background 300ms ease,
			border-color 300ms ease;
	}

	.song-track-dots button:hover {
		transform: scale(1.28);
	}

	.song-track-dots button.song-dot-active {
		border-color: var(--player-cyan);
		background: var(--player-cyan);
		box-shadow: 0 0 10px rgba(117, 230, 244, 0.44);
	}

	.song-track-hint {
		color: rgba(230, 224, 245, 0.42);
		font-family: 'Bruno Ace', sans-serif;
		font-size: 0.38rem;
		letter-spacing: 0.11em;
		text-align: right;
	}

	.roulette-autoplay-toggle {
		display: grid;
		width: 34px;
		aspect-ratio: 1;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: 50%;
		background: rgba(14, 8, 30, 0.88);
		color: #fff;
		font-size: 0.72rem;
		cursor: pointer;
		transition:
			border-color 250ms ease,
			background 250ms ease,
			transform 250ms ease;
	}

	.roulette-autoplay-toggle:hover,
	.roulette-autoplay-toggle:focus-visible {
		transform: scale(1.06);
		border-color: var(--cyan);
		background: rgba(117, 230, 244, 0.16);
	}

	.roulette-autoplay-toggle:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 3px;
	}

	@keyframes song-arrive {
		from {
			opacity: 0;
			transform: translateY(9px);
			filter: blur(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
			filter: blur(0);
		}
	}

	@keyframes song-progress {
		to {
			transform: scaleX(1);
		}
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

	.archive-roulette {
		position: relative;
		padding-top: 30px;
	}

	.roulette-stage {
		position: relative;
		height: clamp(470px, 54vw, 650px);
		isolation: isolate;
		overflow: hidden;
	}

	.roulette-card {
		position: absolute;
		top: 50%;
		left: 50%;
		width: min(68%, 820px);
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		text-align: left;
		cursor: pointer;
		opacity: 0;
		filter: saturate(0.72) brightness(0.7);
		transform: translate(-50%, -50%) scale(0.84);
		transition:
			left 760ms cubic-bezier(0.22, 1, 0.36, 1),
			top 760ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 760ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 520ms ease,
			filter 520ms ease;
	}

	.roulette-card:focus-visible,
	.roulette-arrow:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 5px;
	}

	.roulette-active {
		z-index: 3;
		left: 50%;
		top: 50%;
		opacity: 1;
		filter: none;
		pointer-events: auto;
		transform: translate(-50%, -50%) scale(1);
	}

	.roulette-previous,
	.roulette-next {
		z-index: 2;
		top: 60%;
		width: min(68%, 820px);
		opacity: 0.58;
		filter: saturate(0.7) brightness(0.72);
		pointer-events: auto;
		transform: translate(-50%, -50%) scale(0.78);
	}

	.roulette-previous {
		left: 12%;
	}

	.roulette-next {
		left: 88%;
	}

	.roulette-far {
		z-index: 0;
		left: 50%;
		opacity: 0;
		filter: saturate(0.6) brightness(0.6);
		pointer-events: none;
		transform: translate(-50%, -50%) scale(0.68);
	}

	.archive-image {
		position: relative;
		height: clamp(270px, 39vw, 470px);
		overflow: hidden;
		background: #1b1026;
		box-shadow: 0 28px 80px rgba(0, 0, 0, 0.52);
	}

	.archive-image :global(picture),
	.archive-image :global(img) {
		width: 100%;
		height: 100%;
	}

	.archive-image :global(picture) {
		overflow: hidden;
	}

	.archive-image :global(img) {
		object-fit: cover;
		transition: transform 700ms cubic-bezier(0.2, 0.65, 0.3, 1);
	}

	.roulette-landscape .archive-image :global(img) {
		object-fit: contain;
		background: rgba(8, 6, 18, 0.72);
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

	.roulette-card:hover .archive-image :global(img),
	.roulette-active:hover .archive-image :global(img) {
		transform: scale(1.045);
	}

	.roulette-card:hover .archive-image::before,
	.roulette-active .archive-image::before {
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

	.roulette-caption {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding-top: 11px;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.5rem;
		letter-spacing: 0.08em;
		font-family: 'Bruno Ace', sans-serif;
		text-transform: uppercase;
	}

	.roulette-caption time {
		color: var(--cyan);
		white-space: nowrap;
	}

	.roulette-controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 28px;
		margin-top: 24px;
	}

	.roulette-controls p {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
		color: var(--muted);
		font-family: 'Bruno Ace', sans-serif;
		font-size: 0.55rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.roulette-controls p > span {
		color: var(--cyan);
	}

	.roulette-controls i {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--pink);
		box-shadow: 0 0 12px var(--pink);
	}

	.roulette-arrow {
		display: grid;
		width: 48px;
		aspect-ratio: 1;
		place-items: center;
		border: 1px solid rgba(117, 230, 244, 0.7);
		border-radius: 50%;
		background: rgba(23, 12, 38, 0.94);
		color: #e9fbff;
		font-size: 1.35rem;
		line-height: 1;
		box-shadow:
			0 5px 20px rgba(0, 0, 0, 0.28),
			0 0 14px rgba(117, 230, 244, 0.12);
		cursor: pointer;
		transition:
			transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
			border-color 350ms ease,
			background 350ms ease,
			box-shadow 350ms ease;
	}

	.roulette-arrow:hover {
		transform: scale(1.045);
		border-color: #d9fbff;
		background: rgba(35, 21, 52, 0.98);
		box-shadow:
			0 7px 24px rgba(0, 0, 0, 0.34),
			0 0 19px rgba(117, 230, 244, 0.22);
	}

	.archive-empty {
		padding: 44px 0;
		color: var(--muted);
		font-size: 1rem;
	}

	.spark-photo-viewer {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100dvh;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 0;
		overflow: hidden;
		border: 0;
		background: transparent;
		color: white;
		opacity: 0;
		transform: scale(0.985);
		transition:
			opacity 500ms ease,
			transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
			display 500ms allow-discrete,
			overlay 500ms allow-discrete;
	}

	.spark-photo-viewer[open] {
		opacity: 1;
		transform: scale(1);
	}

	.spark-photo-viewer::backdrop {
		background: #080808;
		transition: background 500ms ease;
	}

	@starting-style {
		.spark-photo-viewer[open] {
			opacity: 0;
			transform: scale(0.985);
		}
	}

	.viewer-shell {
		position: relative;
		display: flex;
		width: 100%;
		height: 100%;
		min-height: 0;
		flex-direction: column;
		isolation: isolate;
		overflow: hidden;
	}

	.viewer-backdrop {
		position: absolute;
		z-index: -2;
		inset: -48px;
		background-position: center;
		background-size: cover;
		filter: blur(30px);
		opacity: 0.76;
		transform: scale(1.12);
		transition: opacity 500ms ease;
	}

	.viewer-overlay {
		position: absolute;
		z-index: -1;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(5, 5, 5, 0.84),
			rgba(5, 5, 5, 0.12) 36%,
			rgba(5, 5, 5, 0.9)
		);
	}

	.viewer-topbar,
	.viewer-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: clamp(18px, 3vw, 38px) clamp(20px, 4vw, 56px);
	}

	.viewer-topbar > span,
	.viewer-caption p,
	.viewer-controls > span {
		color: rgba(255, 255, 255, 0.7);
		font-family: 'Bruno Ace', sans-serif;
		font-size: 0.55rem;
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}

	.viewer-stage {
		position: relative;
		display: grid;
		min-width: 0;
		min-height: 0;
		flex: 1;
		place-items: center;
		padding: clamp(16px, 3vw, 48px);
	}

	.viewer-nav {
		position: absolute;
		z-index: 3;
		top: 50%;
		display: grid;
		width: clamp(44px, 4.4vw, 58px);
		aspect-ratio: 1;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.62);
		border-radius: 50%;
		background: rgba(6, 5, 16, 0.55);
		color: white;
		font-size: 1.55rem;
		line-height: 1;
		cursor: pointer;
		box-shadow: 0 6px 30px rgba(0, 0, 0, 0.35);
		backdrop-filter: blur(12px);
		transform: translateY(-50%);
		transition:
			background 500ms ease,
			border-color 500ms ease,
			transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.viewer-nav--previous {
		left: clamp(14px, 3vw, 42px);
	}

	.viewer-nav--next {
		right: clamp(14px, 3vw, 42px);
	}

	.viewer-nav:hover {
		border-color: white;
		background: rgba(25, 19, 48, 0.86);
		transform: translateY(-50%) scale(1.045);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.46),
			0 0 18px rgba(117, 230, 244, 0.16);
	}

	.viewer-close:hover {
		transform: rotate(90deg) scale(1.06);
		border-color: rgba(255, 255, 255, 0.8);
		background: rgba(255, 255, 255, 0.12);
	}

	.viewer-nav:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 4px;
	}

	.viewer-stage :global(picture) {
		position: absolute;
		inset: clamp(16px, 3vw, 48px);
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
	}

	.viewer-stage :global(img) {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.viewer-caption p {
		margin: 0 0 8px;
		color: rgba(200, 186, 240, 0.7);
	}

	.viewer-caption h2 {
		margin: 0;
		font-family: 'Orbitron', sans-serif;
		font-size: clamp(1.1rem, 2.2vw, 1.6rem);
	}

	.viewer-controls {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.viewer-close {
		display: grid;
		width: 44px;
		aspect-ratio: 1;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.34);
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.2);
		color: white;
		font-size: 1.15rem;
		cursor: pointer;
		backdrop-filter: blur(12px);
		transition:
			transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
			background 350ms ease,
			border-color 350ms ease;
	}

	.viewer-close {
		font-size: 1.7rem;
	}

	.viewer-nav:focus-visible,
	.viewer-close:focus-visible {
		outline: 2px solid var(--cyan);
		outline-offset: 4px;
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

	@keyframes scroll-nudge {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(7px);
		}
	}

	@keyframes cursor-afterglow {
		0% {
			opacity: 0.28;
			transform: translate(-50%, -50%) rotate(var(--trail-angle)) scaleX(0.45);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) rotate(var(--trail-angle)) scaleX(1.15);
		}
	}

	@keyframes portrait-light-pass {
		0%,
		68%,
		100% {
			left: -75%;
			opacity: 0;
		}
		74% {
			opacity: 0.8;
		}
		92% {
			left: 145%;
			opacity: 0;
		}
	}

	@keyframes artist-bloom {
		0%,
		100% {
			opacity: 0.9;
			filter: blur(68px);
		}
		50% {
			opacity: 1;
			filter: blur(86px);
		}
	}

	:global(.spark-page.motion-ready [data-reveal]) {
		opacity: 0;
		transform: translateY(38px) scale(0.985);
		transition:
			opacity 1100ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 1100ms cubic-bezier(0.16, 1, 0.3, 1),
			filter 1100ms ease;
		transition-delay: var(--reveal-delay, 0ms);
		filter: blur(5px);
	}

	:global(.spark-page.motion-ready [data-reveal].is-revealed) {
		opacity: 1;
		transform: translateY(0) scale(1);
		filter: blur(0);
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

		.artist-finale {
			gap: 26px;
			padding-inline: 22px;
		}

		.artist-wordmark img {
			height: clamp(280px, 38vw, 400px);
		}

		.hero-copy {
			padding-block: 0;
		}

		.hero-index {
			margin-top: 30px;
		}

		.portrait-stage {
			min-height: 620px;
			margin-top: 8px;
		}

		.portrait-image {
			width: min(112%, 620px);
			height: 112%;
		}

		.night-note {
			grid-template-columns: minmax(100px, 0.3fr) minmax(0, 1.7fr);
			gap: 26px;
		}

		.spark-guitar-player {
			width: 100%;
			grid-template-columns: minmax(150px, 0.8fr) minmax(0, 1.2fr);
		}

		.roulette-stage {
			height: clamp(430px, 68vw, 560px);
		}

		.roulette-card {
			width: 78%;
		}

		.roulette-previous,
		.roulette-next {
			width: 78%;
		}

		.archive-image {
			height: clamp(245px, 48vw, 360px);
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
			margin-top: 24px;
			font-size: 0.53rem;
		}

		.spark-hero h1 {
			font-size: clamp(4rem, 20vw, 7rem);
		}

		.hero-description {
			font-size: 1rem;
		}

		.artist-finale {
			grid-template-columns: 1fr;
			gap: 28px;
			padding: 24px 18px;
		}

		.artist-wordmark img {
			height: min(78vw, 360px);
		}

		.artist-finale-copy h2 {
			max-width: 420px;
			font-size: clamp(2rem, 9vw, 3rem);
		}

		.artist-finale-copy > p:not(.about-kicker) {
			font-size: 0.96rem;
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
			min-height: clamp(470px, 128vw, 570px);
		}

		.portrait-image {
			width: min(116%, 510px);
			height: 112%;
		}

		.portrait-grid {
			inset: -2% -12% 0;
			opacity: 0.48;
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

		.spark-guitar-player {
			grid-column: 1;
			width: 100%;
			min-height: 230px;
			grid-template-columns: 110px minmax(0, 1fr);
			gap: 8px;
			padding: 18px 10px;
			justify-self: center;
		}

		.guitar-art {
			transform: rotate(-11deg) scale(0.66);
			transform-origin: center;
		}

		.song-carousel {
			gap: 11px;
		}

		.song-slide strong {
			font-size: 0.96rem;
		}

		.song-track-hint {
			font-size: 0.31rem;
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

		.roulette-stage {
			height: clamp(390px, 112vw, 470px);
			margin-inline: -6px;
		}

		.roulette-card {
			width: 86%;
		}

		.roulette-previous,
		.roulette-next {
			top: 61%;
			width: 86%;
			transform: translate(-50%, -50%) scale(0.76);
		}

		.roulette-previous {
			left: 8%;
		}

		.roulette-next {
			left: 92%;
		}

		.archive-image {
			height: 270px;
		}

		.roulette-caption {
			flex-direction: column;
			gap: 5px;
			font-size: 0.43rem;
		}

		.roulette-caption time {
			font-size: 0.42rem;
		}

		.roulette-controls {
			gap: 16px;
			margin-top: 18px;
		}

		.roulette-arrow {
			width: 38px;
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

		.cursor-trail {
			display: none;
		}

		.portrait-image-sweep {
			display: none;
		}
	}
</style>
