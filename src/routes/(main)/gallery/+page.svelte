<script lang="ts">
	import { tick } from 'svelte';
	import GalleryPhoto from '$lib/components/GalleryPhoto.svelte';
	import { photos, categories, formatGalleryDate, type GalleryCategory } from '$lib/data/gallery';

	let category = $state<GalleryCategory>('All moments');
	let selectedId = $state<number | null>(null);
	let viewer: HTMLDialogElement;
	let touchStart: { x: number; y: number } | null = null;
	const featured = photos.find((photo) => photo.id === 19)!;
	const secondFeature = photos.find((photo) => photo.id === 22)!;
	const eventCount = new Set(photos.map((photo) => photo.title)).size;
	const filteredPhotos = $derived(
		category === 'All moments' ? photos : photos.filter((photo) => photo.category === category)
	);
	const viewerPhotos = $derived(
		filteredPhotos.some((photo) => photo.id === selectedId) ? filteredPhotos : photos
	);
	const selectedIndex = $derived(viewerPhotos.findIndex((photo) => photo.id === selectedId));
	const selectedPhoto = $derived(selectedIndex >= 0 ? viewerPhotos[selectedIndex] : null);
	const number = (value: number) => String(value).padStart(2, '0');

	
	let slideDirection = $state<'next' | 'prev'>('next');

	let previousPhoto = $state<typeof selectedPhoto>(null);

	let isSliding = $state(false);

	function movePhoto(direction: 1 | -1) {
		if (isSliding || viewerPhotos.length <= 1 || !selectedPhoto) {
			return;
		}

		const nextIndex =
			(selectedIndex + direction + viewerPhotos.length) %
			viewerPhotos.length;

		const nextPhoto = viewerPhotos[nextIndex];

		if (!nextPhoto || nextPhoto.id === selectedId) {
			return;
		}

		// Store the currently visible photo for the exit animation
		previousPhoto = selectedPhoto;

		// Set the animation direction
		slideDirection = direction === 1 ? 'next' : 'prev';

		// Lock navigation during animation
		isSliding = true;

		// Display the new photo
		selectedId = nextPhoto.id;
	}

	function handleSlideEnd() {
		// Remove the outgoing photo after the animation
		previousPhoto = null;

		// Allow navigation again
		isSliding = false;
	}

	async function openPhoto(id: number) {
		// Reset any unfinished animation when opening a photo
		previousPhoto = null;
		isSliding = false;

		selectedId = id;

		await tick();

		viewer.showModal();
	}

	function closeViewer() {
		viewer.close();

		selectedId = null;
		previousPhoto = null;
		isSliding = false;
	}

	function handleKeys(event: KeyboardEvent) {
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			movePhoto(1);
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			movePhoto(-1);
		} else if (event.key === 'Escape') {
			event.preventDefault();
			closeViewer();
		}
	}

	function handleTouchEnd(event: TouchEvent) {
		if (!touchStart || isSliding) {
			return;
		}

		const touch = event.changedTouches[0];

		if (!touch) {
			touchStart = null;
			return;
		}

		const dx = touch.clientX - touchStart.x;
		const dy = touch.clientY - touchStart.y;

		if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
			movePhoto(dx < 0 ? 1 : -1);
		}

		touchStart = null;
	}
	$effect(() => {
		if (selectedId === null) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	});
</script>

<svelte:head>
	<title>Gallery | The Tecnoesis Archive</title>
	<meta
		name="description"
		content="Relive Tecnoesis 2026 at NIT Silchar. Explore 25 photographs of the performances, competitions, and people who made it unforgettable."
	/>
</svelte:head>

{#snippet arrow(direction: 'left' | 'right' | 'diagonal' | 'down' = 'right')}
	<svg
		class="arrow-icon"
		class:left={direction === 'left'}
		class:diagonal={direction === 'diagonal'}
		class:down={direction === 'down'}
		width="22"
		height="22"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg
	>
{/snippet}

<main class="gallery-page" id="gallery-top">
	<div class="gallery-wrap">
		<section class="gallery-hero" aria-labelledby="gallery-title">
			<div class="hero-copy">
				<p class="eyebrow">
					<span class="status-dot"></span> The Tecnoesis archive <span class="edition">/ 2026</span>
				</p>
				<h1 id="gallery-title"><span>You had to</span> <em>be there.</em></h1>
				<p class="hero-description">
					From the first idea to the final encore.<br />A few frames of everything we felt.
				</p>
				<a class="explore-link" href="#moments"
					><span>Explore the moments</span><span class="explore-arrow">{@render arrow('down')}</span
					></a
				>
				<div class="hero-facts" aria-label="Archive summary">
					<div><strong>{number(photos.length)}</strong><span>photographs</span></div>
					<div><strong>{number(eventCount)}</strong><span>events</span></div>
					<div class="hero-location"><span>NIT SILCHAR</span><span>09—13 MAR 2026</span></div>
				</div>
			</div>

			<div class="hero-montage">
				<span class="montage-orbit" aria-hidden="true"></span>
				<span class="montage-cross" aria-hidden="true">+</span>
				<span class="montage-note">A FESTIVAL. A FEELING.</span>
				<button
					class="featured-photo"
					type="button"
					onclick={() => openPhoto(featured.id)}
					aria-label={`Open ${featured.title} photo ${featured.id}`}
				>
					<GalleryPhoto photo={featured} eager />
					<span class="featured-label"><span>THE NIGHT WE REMEMBER</span><span>↗</span></span>
				</button>
				<button
					class="snapshot"
					type="button"
					onclick={() => openPhoto(secondFeature.id)}
					aria-label={`Open ${secondFeature.title} photo ${secondFeature.id}`}
				>
					<GalleryPhoto photo={secondFeature} eager />
					<span class="snapshot-caption"><span>Spark Night</span><span>13.03.26 ↗</span></span>
				</button>
				<span class="frame-note">LIVE LOUD. KEEP THE FRAME.</span>
			</div>
		</section>

		<div class="archive-divider" aria-hidden="true">
			<span>THE MOMENTS STAY</span><span class="divider-line"></span><span>SCROLL TO REWIND ↓</span>
		</div>

		<section class="collection" id="moments" aria-label="Photo collection">
			<div class="collection-heading">
				<div>
					<p class="eyebrow">The collection</p>
					<h2>More than a <em>memory.</em></h2>
				</div>
				<p class="collection-instruction">
					A closer look at the days that brought us together.<br /><span
						>Tap any photograph to step inside.</span
					>
				</p>
			</div>
			<div class="collection-toolbar">
				<div class="filters" role="group" aria-label="Filter gallery">
					{#each categories as filter (filter)}
						<button
							type="button"
							class:active={category === filter}
							aria-pressed={category === filter}
							onclick={() => (category = filter)}
							>{filter}<span
								>{number(
									filter === 'All moments'
										? photos.length
										: photos.filter((photo) => photo.category === filter).length
								)}</span
							></button
						>
					{/each}
				</div>
				<p class="frame-count" aria-live="polite">
					{number(filteredPhotos.length)} frames <span>/</span> 2026
				</p>
			</div>

			<div class="photo-wall">
				{#each filteredPhotos as photo (photo.id)}
					<figure class="photo-card">
						<button
							type="button"
							class="photo-trigger"
							onclick={() => openPhoto(photo.id)}
							aria-label={`Open ${photo.title} photo ${photo.id}`}
						>
							<GalleryPhoto {photo} />
							<span class="photo-open" aria-hidden="true">{@render arrow('diagonal')}</span>
							<span class="photo-category" aria-hidden="true">{photo.category}</span>
						</button>
						<figcaption>
							<div>
								<span class="photo-number">{number(photo.id)}</span>
								<h3>{photo.title}</h3>
							</div>
							<time datetime={photo.date.split('.').reverse().join('-')}
								>{formatGalleryDate(photo.date)}</time
							>
						</figcaption>
					</figure>
				{/each}
			</div>
		</section>

		<footer class="gallery-footer">
			<div>
				<span class="eyebrow">Until the next chapter</span>
				<p>Some things stay with you.</p>
			</div>
			<div class="footer-links">
				<nav aria-label="Tecnoesis social links">
					<a href="https://instagram.com/tecnoesis" target="_blank" rel="noopener noreferrer"
						>Instagram ↗</a
					>
					<a href="https://linkedin.com/company/tecnoesis" target="_blank" rel="noopener noreferrer"
						>LinkedIn ↗</a
					>
					<a href="https://facebook.com/tecnoesis" target="_blank" rel="noopener noreferrer"
						>Facebook ↗</a
					>
				</nav>
				<a href="#gallery-top">Back to top {@render arrow('diagonal')}</a>
			</div>
		</footer>
	</div>
</main>


<dialog
	bind:this={viewer}
	class="photo-viewer"
	aria-label="Photo viewer"
	onclose={() => {
		selectedId = null;
		previousPhoto = null;
		isSliding = false;
	}}
	onkeydown={handleKeys}
	onclick={(event) => {
		if (event.target === viewer) closeViewer();
	}}
>
	{#if selectedPhoto}
		<div class="viewer-shell">
			<!-- Dynamic blurred background -->
			<div
				class="viewer-backdrop"
				style={`background-image: url("${selectedPhoto.src}");`}
				aria-hidden="true"
			></div>

			<!-- Dark gradient overlay -->
			<div class="viewer-overlay" aria-hidden="true"></div>

			<!-- Top bar -->
			<div class="viewer-topbar">
				<span class="eyebrow">The Tecnoesis archive</span>

				<button
					class="viewer-close"
					type="button"
					aria-label="Close photo viewer"
					onclick={closeViewer}
				>
					<svg
						width="21"
						height="21"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"
					>
						<path d="M6 6l12 12M18 6L6 18" />
					</svg>
				</button>
			</div>

			<!-- Single photo stage -->
			<div
				class="viewer-stage single-photo-stage"
				role="group"
				aria-roledescription="carousel"
				aria-label="Photo carousel"
				tabindex="0"
			>
				<!-- Previous photo: exits diagonally -->
				{#if previousPhoto}
					<div
						class="single-photo-slide outgoing"
						class:slide-out-next={slideDirection === 'next'}
						class:slide-out-prev={slideDirection === 'prev'}
						onanimationend={handleSlideEnd}
					>
						<GalleryPhoto
							photo={previousPhoto}
							eager
							contained
						/>
					</div>
				{/if}

				<!-- Current photo: enters diagonally -->
				{#if selectedPhoto}
					<div
						class="single-photo-slide incoming"
						class:slide-in-next={isSliding && slideDirection === 'next'}
						class:slide-in-prev={isSliding && slideDirection === 'prev'}
					>
						<GalleryPhoto
							photo={selectedPhoto}
							eager
							contained
						/>
					</div>
				{/if}
			</div>

			<!-- Bottom information -->
			<div class="viewer-bottom">
				<div class="viewer-caption" aria-live="polite">
					<p>
						{selectedPhoto.category}
						<span>·</span>
						{formatGalleryDate(selectedPhoto.date)}
					</p>

					<h2>{selectedPhoto.title}</h2>
				</div>

				<!-- Navigation controls -->
				<div class="viewer-controls">
					<button
						class="viewer-icon-button"
						type="button"
						aria-label="Previous photo"
						disabled={isSliding}
						onclick={() => movePhoto(-1)}
					>
						{@render arrow('left')}
					</button>

					<span class="viewer-count" aria-live="polite">
						{number(selectedIndex + 1)}
						<span>/ {number(viewerPhotos.length)}</span>
					</span>

					<button
						class="viewer-icon-button"
						type="button"
						aria-label="Next photo"
						disabled={isSliding}
						onclick={() => movePhoto(1)}
					>
						{@render arrow()}
					</button>
				</div>
			</div>

			<!-- Keyboard help -->
			<p class="viewer-help">
				Swipe or use the arrow keys to explore
				<span>·</span>
				Escape to close
			</p>
		</div>
	{/if}
</dialog>

<style>
	:global(body:has(.gallery-page) .site-header) {
		background: rgba(9, 6, 45, 0.82);
		backdrop-filter: blur(16px);
	}
	.gallery-page {
		--paper: #f4efff;
		--muted: rgba(214, 200, 246, 0.6);
		--accent: #d58aff;
		--accent-deep: #a855f7;
		--edge: rgba(170, 116, 255, 0.26);
		/* The angular corner cut used across the site (auth card, nav register). */
		--notch: polygon(
			0 9px,
			9px 0,
			calc(100% - 9px) 0,
			100% 9px,
			100% calc(100% - 9px),
			calc(100% - 9px) 100%,
			9px 100%,
			0 calc(100% - 9px)
		);
		min-height: 100svh;
		color: var(--paper);
		/* Translucent, so the fixed site artwork behind the (main) layout shows
		   through instead of being covered by a flat panel. */
		background:
			radial-gradient(ellipse at 76% 6%, rgba(134, 65, 255, 0.24), transparent 42%),
			linear-gradient(180deg, rgba(9, 6, 45, 0.86), rgba(7, 5, 38, 0.95));
		font-family: 'Bruno Ace', sans-serif;
	}
	.gallery-wrap {
		width: min(1440px, calc(100% - 144px));
		margin: 0 auto;
	}
	.gallery-hero {
		display: grid;
		grid-template-columns: 1fr 1.04fr;
		align-items: center;
		gap: 48px;
		padding: 160px 0 62px;
		min-height: min(870px, 100svh);
	}
	.eyebrow {
		margin: 0;
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--accent);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.22em;
		line-height: 1.6;
		text-transform: uppercase;
	}
	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #e68cff;
		box-shadow: 0 0 14px rgba(214, 138, 255, 0.85);
	}
	.edition {
		margin-left: 10px;
		color: rgba(200, 186, 240, 0.55);
	}
	h1 {
		margin: 30px 0 23px;
		font-family: 'GameDemo', 'Bruno Ace', sans-serif;
		font-size: clamp(46px, 5.6vw, 88px);
		font-weight: 500;
		line-height: 1.02;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		text-shadow:
			0 2px 0 rgba(109, 58, 170, 0.75),
			0 0 22px rgba(192, 136, 255, 0.32);
	}
	h1 span,
	h1 em {
		display: block;
	}
	h1 em {
		color: #e2b6ff;
		font-family: 'Delicatus', 'GameDemo', sans-serif;
		font-size: 1.04em;
		font-weight: 400;
		font-style: normal;
		letter-spacing: 0.04em;
	}
	.hero-description {
		margin: 0;
		max-width: 46ch;
		color: rgba(214, 200, 246, 0.82);
		font-size: 13px;
		line-height: 1.85;
		letter-spacing: 0.01em;
	}
	.explore-link {
		display: inline-flex;
		gap: 24px;
		align-items: center;
		margin-top: 28px;
		color: var(--paper);
		text-decoration: none;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 11px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}
	.explore-arrow {
		display: grid;
		width: 40px;
		height: 40px;
		place-items: center;
		border: 1px solid rgba(170, 116, 255, 0.55);
		border-radius: 50%;
		transition:
			background 180ms,
			transform 180ms;
	}
	.explore-link:hover .explore-arrow {
		border-color: var(--accent);
		background: rgba(120, 58, 205, 0.4);
		box-shadow: 0 0 18px rgba(168, 85, 247, 0.4);
		transform: translateY(3px);
	}
	.arrow-icon {
		flex: 0 0 auto;
	}
	.arrow-icon.left {
		transform: rotate(180deg);
	}
	.arrow-icon.diagonal {
		transform: rotate(-45deg);
	}
	.arrow-icon.down {
		transform: rotate(90deg);
	}
	.hero-facts {
		display: flex;
		align-items: center;
		gap: 28px;
		margin-top: 53px;
	}
	.hero-facts > div {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.hero-facts strong {
		font-family: 'GameDemo', 'Bruno Ace', sans-serif;
		font-size: 30px;
		font-weight: 500;
		line-height: 1;
		letter-spacing: 0.03em;
		color: #f4efff;
	}
	.hero-facts span {
		color: rgba(200, 186, 240, 0.6);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 9px;
		line-height: 1.5;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	.hero-facts .hero-location {
		gap: 3px;
		padding-left: 26px;
		border-left: 1px solid rgba(170, 116, 255, 0.3);
	}
	.hero-location span {
		font-size: 9px;
		letter-spacing: 0.08em;
	}
	.hero-montage {
		position: relative;
		min-width: 0;
		height: clamp(420px, 42vw, 595px);
	}
	.montage-orbit {
		position: absolute;
		width: 90%;
		aspect-ratio: 1;
		border: 1px solid rgba(170, 116, 255, 0.24);
		border-radius: 50%;
		top: 0;
		right: -3%;
	}
	.montage-orbit::after {
		content: '';
		position: absolute;
		inset: 25px;
		border: 1px dashed rgba(214, 138, 255, 0.16);
		border-radius: 50%;
	}
	.montage-cross {
		position: absolute;
		top: 5%;
		left: 0;
		color: var(--accent);
		font: 28px monospace;
		font-weight: 200;
		text-shadow: 0 0 14px rgba(214, 138, 255, 0.6);
	}
	.montage-note {
		position: absolute;
		top: 28%;
		right: -12px;
		writing-mode: vertical-rl;
		color: rgba(200, 186, 240, 0.5);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 9px;
		letter-spacing: 0.3em;
	}
	.featured-photo {
		position: absolute;
		top: 8%;
		left: 9%;
		width: 57%;
		padding: 0;
		border: 0;
		border-radius: 0;
		clip-path: var(--notch);
		background: linear-gradient(140deg, #c56aff, #6e52f6 52%, #9639ff);
		transform: rotate(-6deg);
		cursor: pointer;
		box-shadow:
			0 26px 75px rgba(3, 2, 22, 0.62),
			0 0 34px rgba(150, 57, 255, 0.28);
		transition:
			transform 250ms ease,
			box-shadow 250ms ease;
	}
	/* 1px gradient rim: the inner surface is inset, so the edge reads as a lit frame. */
	.featured-photo > :global(picture) {
		clip-path: var(--notch);
		margin: 1px;
		width: calc(100% - 2px);
	}
	.featured-photo:hover {
		transform: rotate(-3deg) translateY(-6px);
		box-shadow:
			0 30px 80px rgba(3, 2, 22, 0.68),
			0 0 48px rgba(168, 85, 247, 0.42);
	}
	.featured-label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 14px 13px;
		background: rgba(9, 6, 45, 0.9);
		color: var(--accent);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 8px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
	}
	.featured-label > span:last-child {
		font-size: 18px;
	}
	.snapshot {
		position: absolute;
		bottom: 10%;
		right: 0;
		width: 58%;
		padding: 9px 9px 0;
		border: 0;
		background: #f1eaf9;
		transform: rotate(7deg);
		cursor: pointer;
		box-shadow:
			0 15px 45px rgba(3, 2, 22, 0.66),
			0 0 30px rgba(168, 85, 247, 0.22);
		transition:
			transform 250ms ease,
			box-shadow 250ms ease;
	}
	.snapshot:hover {
		transform: rotate(3deg) translateY(-6px);
		box-shadow:
			0 20px 55px rgba(3, 2, 22, 0.7),
			0 0 42px rgba(214, 138, 255, 0.38);
	}
	.snapshot-caption {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 6px;
		color: #2b1740;
		font:
			italic 17px Georgia,
			serif;
	}
	.snapshot-caption > span:last-child {
		color: #6a4b8c;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 8px;
		letter-spacing: 0.14em;
	}
	.frame-note {
		position: absolute;
		top: -18px;
		left: 11%;
		color: rgba(200, 186, 240, 0.45);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 8px;
		letter-spacing: 0.3em;
	}
	.archive-divider {
		display: flex;
		align-items: center;
		gap: 22px;
		color: rgba(200, 186, 240, 0.55);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 9px;
		letter-spacing: 0.26em;
	}
	.divider-line {
		height: 1px;
		flex: 1;
		background: linear-gradient(90deg, transparent, rgba(170, 116, 255, 0.4), transparent);
	}
	.collection {
		padding-top: 74px;
		scroll-margin-top: 115px;
	}
	.collection-heading {
		display: flex;
		gap: 24px;
		align-items: end;
		justify-content: space-between;
	}
	h2 {
		margin: 10px 0 0;
		font-family: 'GameDemo', 'Bruno Ace', sans-serif;
		font-size: clamp(26px, 2.8vw, 42px);
		font-weight: 500;
		line-height: 1.12;
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}
	h2 em {
		color: #e2b6ff;
		font-family: 'Delicatus', 'GameDemo', sans-serif;
		font-style: normal;
		font-weight: 400;
	}
	.collection-instruction {
		margin: 0 0 2px;
		color: rgba(214, 200, 246, 0.72);
		font-size: 11px;
		line-height: 1.8;
	}
	.collection-instruction span {
		color: rgba(200, 186, 240, 0.45);
	}
	.collection-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		margin: 34px 0;
		padding-bottom: 25px;
		border-bottom: 1px solid var(--edge);
	}
	.filters {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	.filters button {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		min-height: 42px;
		padding: 0 19px;
		border: 1px solid rgba(145, 82, 238, 0.55);
		border-radius: 0;
		clip-path: polygon(0 0, 100% 0, 100% 62%, 92% 100%, 0 100%);
		color: rgba(222, 208, 250, 0.82);
		background: rgba(27, 24, 91, 0.42);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			color 180ms,
			background 180ms,
			border-color 180ms,
			box-shadow 180ms;
	}
	.filters button > span {
		font-size: 9px;
		opacity: 0.65;
	}
	.filters button:hover {
		border-color: var(--accent);
		background: rgba(120, 58, 205, 0.36);
		color: #fff;
	}
	.filters button.active {
		border-color: transparent;
		background: linear-gradient(120deg, #7a33e0, #b455ff);
		color: #fff;
		box-shadow: 0 0 20px rgba(168, 85, 247, 0.45);
	}
	.frame-count {
		margin: 0;
		flex-shrink: 0;
		color: rgba(214, 200, 246, 0.7);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	.frame-count > span {
		margin: 0 7px;
		color: rgba(170, 116, 255, 0.55);
	}
	.photo-wall {
		columns: 3;
		column-gap: 25px;
	}
	.photo-card {
		break-inside: avoid;
		margin: 0 0 31px;
	}
	.photo-trigger {
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		overflow: hidden;
		border: 1px solid var(--edge);
		border-radius: 0;
		clip-path: var(--notch);
		background: #120e35;
		text-align: left;
		cursor: zoom-in;
		transition:
			border-color 220ms ease,
			box-shadow 220ms ease,
			transform 220ms ease;
	}
	.photo-trigger:hover,
	.photo-trigger:focus-visible {
		border-color: rgba(214, 138, 255, 0.75);
		box-shadow: 0 0 26px rgba(168, 85, 247, 0.32);
		transform: translateY(-3px);
	}
	.photo-trigger :global(picture) {
		transition: filter 250ms;
	}
	.photo-trigger:hover :global(picture) {
		filter: brightness(1.12);
	}
	.photo-open {
		position: absolute;
		top: 12px;
		right: 12px;
		display: grid;
		width: 36px;
		height: 36px;
		place-items: center;
		border: 1px solid rgba(214, 138, 255, 0.6);
		border-radius: 50%;
		background: rgba(18, 14, 53, 0.72);
		color: #fff;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 180ms,
			transform 180ms;
	}
	.photo-trigger:hover .photo-open,
	.photo-trigger:focus-visible .photo-open {
		opacity: 1;
		transform: translateY(0);
	}
	.photo-category {
		position: absolute;
		top: 13px;
		left: 12px;
		padding: 7px 10px;
		background: rgba(18, 14, 53, 0.85);
		border: 1px solid rgba(170, 116, 255, 0.4);
		border-radius: 0;
		clip-path: polygon(0 0, 100% 0, 100% 66%, 88% 100%, 0 100%);
		color: #e9dcff;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 8px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0;
		transition: opacity 180ms;
	}
	.photo-trigger:hover .photo-category,
	.photo-trigger:focus-visible .photo-category {
		opacity: 1;
	}
	figcaption {
		display: flex;
		justify-content: space-between;
		align-items: start;
		gap: 8px;
		padding: 13px 0 0;
	}
	figcaption > div {
		display: flex;
		align-items: baseline;
		gap: 10px;
		min-width: 0;
	}
	.photo-number {
		color: rgba(170, 116, 255, 0.75);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 9px;
		letter-spacing: 0.1em;
	}
	h3 {
		margin: 0;
		color: #ece2ff;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 11px;
		line-height: 1.4;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	figcaption time {
		flex-shrink: 0;
		color: rgba(200, 186, 240, 0.5);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 8px;
		line-height: 1.8;
		letter-spacing: 0.14em;
	}
	.gallery-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 30px;
		margin-top: 45px;
		padding: 42px 0 76px;
		border-top: 1px solid var(--edge);
	}
	.gallery-footer p {
		margin: 9px 0 0;
		color: #e2b6ff;
		font-family: 'Delicatus', 'GameDemo', sans-serif;
		font-size: clamp(22px, 2.4vw, 30px);
		letter-spacing: 0.03em;
	}
	.gallery-footer a {
		display: flex;
		align-items: center;
		gap: 16px;
		color: rgba(222, 208, 250, 0.85);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-decoration: none;
	}
	.footer-links {
		display: flex;
		flex-direction: column;
		align-items: end;
		gap: 24px;
	}
	.footer-links nav {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
	}
	.gallery-page :is(button, a):focus-visible {
		outline: 2px solid #debaff;
		outline-offset: 6px;
	}
	.viewer-shell {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto auto;
		height: 100%;
		padding: 14px 28px 14px;
	}
	.viewer-topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 12px;
	}
	.viewer-stage {
		min-width: 0;
		min-height: 0;
		touch-action: pan-y pinch-zoom;
	}
	.viewer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		padding: 19px 0 10px;
	}
	.viewer-caption p {
		margin: 0;
		color: rgba(200, 186, 240, 0.7);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 9px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	.viewer-caption p span {
		margin: 0 7px;
	}
	.viewer-caption h2 {
		margin-top: 9px;
		font-size: clamp(18px, 2.2vw, 26px);
		letter-spacing: 0.03em;
	}
	.viewer-controls {
		display: flex;
		align-items: center;
		gap: 18px;
	}
	.viewer-icon-button {
		display: grid;
		width: 44px;
		height: 44px;
		flex: 0 0 auto;
		place-items: center;
		border: 1px solid rgba(170, 116, 255, 0.5);
		border-radius: 50%;
		color: #e9dcff;
		background: transparent;
		cursor: pointer;
	}
	.viewer-icon-button:hover {
		border-color: var(--accent);
		background: rgba(120, 58, 205, 0.4);
	}
	.viewer-icon-button:focus-visible {
		outline: 2px solid #debaff;
		outline-offset: 3px;
	}
	.viewer-count {
		min-width: 64px;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 11px;
		letter-spacing: 0.1em;
		text-align: center;
	}
	.viewer-count span {
		color: rgba(170, 116, 255, 0.7);
	}
	.viewer-help {
		margin: 4px 0 0;
		color: rgba(200, 186, 240, 0.5);
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		font-size: 8px;
		line-height: 1.5;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		text-align: center;
	}
	.viewer-help span {
		margin: 0 7px;
	}
	
	.photo-viewer {
		position: fixed;
		inset: 0;

		width: 100vw;
		height: 100dvh;

		max-width: none;
		max-height: none;

		margin: 0;
		padding: 0;

		border: none;
		background: transparent;

		overflow: hidden;
		color: white;
	}

	.photo-viewer::backdrop {
		background: #080808;
	}

	/* Main viewer container */

	.viewer-shell {
		position: relative;

		display: flex;
		flex-direction: column;

		width: 100%;
		height: 100%;

		min-height: 0;

		isolation: isolate;
		overflow: hidden;
	}


	.viewer-backdrop {
		position: absolute;
		inset: -48px;

		z-index: -3;

		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;

		filter: blur(30px);
		transform: scale(1.12);

		opacity: 0.65;

		transition:
			background-image 250ms ease,
			opacity 250ms ease;
	}

	.viewer-overlay {
		position: absolute;
		inset: 0;

		z-index: -2;

		background:
			linear-gradient(
				180deg,
				rgba(5, 5, 5, 0.88) 0%,
				rgba(5, 5, 5, 0.18) 27%,
				rgba(5, 5, 5, 0.12) 55%,
				rgba(5, 5, 5, 0.92) 100%
			);

		pointer-events: none;
	}


	.viewer-topbar {
		position: relative;
		z-index: 10;

		display: flex;
		align-items: center;
		justify-content: space-between;

		width: 100%;

		padding: clamp(1.1rem, 3vw, 2rem)
			clamp(1.1rem, 4vw, 3.5rem);
	}

	.eyebrow {
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		line-height: 1.4;
		text-transform: uppercase;

		color: rgba(255, 255, 255, 0.64);
	}

	/* Close button */

	.viewer-close {
		display: grid;
		place-items: center;

		width: 2.75rem;
		height: 2.75rem;

		padding: 0;

		border: 1px solid rgba(255, 255, 255, 0.28);
		border-radius: 999px;

		background: rgba(0, 0, 0, 0.2);
		color: white;

		cursor: pointer;

		backdrop-filter: blur(14px);

		transition:
			background 180ms ease,
			border-color 180ms ease,
			transform 180ms ease;
	}

	.viewer-close:hover {
		background: rgba(255, 255, 255, 0.14);
		border-color: rgba(255, 255, 255, 0.65);

		transform: rotate(90deg);
	}

	.viewer-close:focus-visible,
	.viewer-icon-button:focus-visible {
		outline: 2px solid white;
		outline-offset: 4px;
	}


	.viewer-stage {
		position: relative;
		flex: 1;

		min-height: 0;
		min-width: 0;
	}

	.single-photo-stage {
		display: grid;
		place-items: center;

		width: 100%;
		height: 100%;

		padding: clamp(1rem, 3vw, 3rem);
	}

	.single-photo-slide {
		position: absolute;
		inset: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		width: 100%;
		height: 100%;

		padding: clamp(1rem, 3vw, 3rem);

		will-change: transform, opacity;

		backface-visibility: hidden;
		transform-origin: center center;

		pointer-events: none;
	}



	.single-photo-slide :global(img) {
		display: block;

		width: auto;
		height: auto;

		max-width: min(86vw, 1200px);
		max-height: min(65vh, 720px);

		object-fit: contain;

		border-radius: 0.45rem;

		box-shadow:
			0 25px 80px rgba(0, 0, 0, 0.4),
			0 8px 24px rgba(0, 0, 0, 0.25);
	}

	/* Keep the incoming photo above the outgoing photo */

	.single-photo-slide.incoming {
		z-index: 2;
	}

	.single-photo-slide.outgoing {
		z-index: 1;
	}



	.slide-out-next {
		animation: photo-out-next 520ms
			cubic-bezier(0.76, 0, 0.24, 1)
			forwards;
	}

	.slide-in-next {
		animation: photo-in-next 520ms
			cubic-bezier(0.76, 0, 0.24, 1)
			forwards;
	}

	@keyframes photo-out-next {
		0% {
			opacity: 1;
			transform: translate3d(0, 0, 0) rotate(0deg);
		}

		100% {
			opacity: 0;
			transform: translate3d(-115%, -115%, 0) rotate(-30deg);
		}
	}

	@keyframes photo-in-next {
		0% {
			opacity: 0;
			transform: translate3d(115%, 115%, 0) rotate(30deg);
		}

		100% {
			opacity: 1;
			transform: translate3d(0, 0, 0) rotate(0deg);
		}
	}


	.slide-out-prev {
		animation: photo-out-prev 520ms
			cubic-bezier(0.76, 0, 0.24, 1)
			forwards;
	}

	.slide-in-prev {
		animation: photo-in-prev 520ms
			cubic-bezier(0.76, 0, 0.24, 1)
			forwards;
	}

	@keyframes photo-out-prev {
		0% {
			opacity: 1;
			transform: translate3d(0, 0, 0) rotate(0deg);
		}

		100% {
			opacity: 0;
			transform: translate3d(115%, 115%, 0) rotate(30deg);
		}
	}

	@keyframes photo-in-prev {
		0% {
			opacity: 0;
			transform: translate3d(-115%, -115%, 0) rotate(-30deg);
		}

		100% {
			opacity: 1;
			transform: translate3d(0, 0, 0) rotate(0deg);
		}
	}


	.viewer-bottom {
		position: relative;
		z-index: 10;

		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 2rem;

		width: 100%;

		padding: clamp(1rem, 3vw, 2rem)
			clamp(1.1rem, 4vw, 3.5rem);
	}

	.viewer-caption {
		min-width: 0;
	}

	.viewer-caption p {
		display: flex;
		align-items: center;
		gap: 0.55rem;

		margin: 0 0 0.45rem;

		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		line-height: 1.5;
		text-transform: uppercase;

		color: rgba(255, 255, 255, 0.58);
	}

	.viewer-caption h2 {
		max-width: min(55vw, 600px);

		margin: 0;

		font-size: clamp(1.1rem, 2.2vw, 1.8rem);
		font-weight: 500;
		line-height: 1.15;
		letter-spacing: -0.04em;

		color: white;
	}


	.viewer-controls {
		display: flex;
		align-items: center;
		gap: 0.85rem;

		flex-shrink: 0;
	}

	.viewer-icon-button {
		display: grid;
		place-items: center;

		width: 2.8rem;
		height: 2.8rem;

		padding: 0;

		border: 1px solid rgba(255, 255, 255, 0.28);
		border-radius: 999px;

		background: rgba(0, 0, 0, 0.2);
		color: white;

		cursor: pointer;

		backdrop-filter: blur(14px);

		transition:
			background 180ms ease,
			border-color 180ms ease,
			opacity 180ms ease,
			transform 180ms ease;
	}

	.viewer-icon-button:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.14);
		border-color: rgba(255, 255, 255, 0.65);
		transform: translateY(-2px);
	}

	.viewer-icon-button:disabled {
		opacity: 0.35;
		cursor: not-allowed;
		transform: none;
	}

	.viewer-count {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;

		min-width: 4rem;

		justify-content: center;

		font-size: 0.8rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.05em;
	}

	.viewer-count span {
		color: rgba(255, 255, 255, 0.42);
	}


	.viewer-help {
		position: relative;
		z-index: 10;

		margin: 0;

		padding: 0
			clamp(1.1rem, 4vw, 3.5rem)
			clamp(1rem, 2vw, 1.5rem);

		font-size: 0.65rem;
		letter-spacing: 0.08em;
		text-align: center;

		color: rgba(255, 255, 255, 0.4);
	}

	.viewer-help span {
		margin: 0 0.5rem;
	}


	@media (max-width: 640px) {
		.viewer-topbar {
			padding: 1rem;
		}

		.viewer-close {
			width: 2.45rem;
			height: 2.45rem;
		}

		.single-photo-stage {
			padding: 0.75rem;
		}

		.single-photo-slide {
			padding: 0.75rem;
		}

		.single-photo-slide :global(img) {
			max-width: 94vw;
			max-height: 58vh;

			border-radius: 0.3rem;
		}

		.viewer-bottom {
			flex-direction: column;
			align-items: stretch;
			gap: 1.1rem;

			padding: 1rem;
		}

		.viewer-caption h2 {
			max-width: 100%;
			font-size: 1.25rem;
		}

		.viewer-controls {
			justify-content: center;
		}

		.viewer-icon-button {
			width: 2.6rem;
			height: 2.6rem;
		}

		.viewer-help {
			padding: 0 1rem 1rem;

			font-size: 0.58rem;
		}
	}

	
	@media (prefers-reduced-motion: reduce) {
		.slide-out-next,
		.slide-in-next,
		.slide-out-prev,
		.slide-in-prev {
			animation-duration: 1ms;
		}

		.viewer-close,
		.viewer-icon-button {
			transition: none;
		}
	}

	@media (min-width: 1800px) {
		.gallery-wrap {
			width: min(1920px, calc(100% - 200px));
		}
		.gallery-hero {
			grid-template-columns: 1fr 1fr;
			gap: 100px;
		}
		h1 {
			font-size: 120px;
		}
		.hero-montage {
			height: 720px;
			max-width: 770px;
		}
		.photo-wall {
			columns: 4;
		}
	}
	@media (max-width: 1150px) {
		.gallery-wrap {
			width: calc(100% - 100px);
		}
		.gallery-hero {
			gap: 20px;
		}
		h1 {
			font-size: 6.5vw;
		}
		.hero-montage {
			height: 410px;
		}
		.hero-description {
			font-size: 12px;
			line-height: 1.75;
		}
		.hero-facts {
			gap: 20px;
		}
		.hero-facts .hero-location {
			padding-left: 18px;
		}
		.collection-instruction {
			font-size: 12px;
		}
		.photo-wall {
			column-gap: 18px;
		}
		figcaption {
			flex-wrap: wrap;
		}
	}
	@media (max-width: 900px) {
		.gallery-wrap {
			width: calc(100% - 56px);
		}
		.gallery-hero {
			padding-top: 125px;
			min-height: auto;
		}
		.hero-montage {
			height: 365px;
		}
		.hero-copy > .eyebrow {
			font-size: 8px;
			gap: 7px;
		}
		.edition {
			margin-left: 3px;
		}
		.hero-facts {
			flex-wrap: wrap;
			margin-top: 32px;
			gap: 18px;
		}
		.hero-facts .hero-location {
			display: none;
		}
		.montage-note {
			right: -5px;
			font-size: 7px;
		}
		.featured-label {
			padding: 10px 7px;
			font-size: 6px;
		}
		.snapshot-caption {
			padding: 11px 2px;
			font-size: 13px;
		}
		.photo-wall {
			columns: 2;
		}
		.collection-heading {
			display: block;
		}
		.collection-instruction {
			margin-top: 17px;
		}
		.collection-toolbar {
			flex-wrap: wrap;
			gap: 18px;
		}
		.photo-viewer {
			width: calc(100vw - 28px);
			height: calc(100dvh - 28px);
		}
	}
	@media (max-width: 600px) {
		.footer-links {
			align-items: start;
		}
		.gallery-wrap {
			width: calc(100% - 40px);
		}
		.gallery-hero {
			grid-template-columns: 1fr;
			gap: 22px;
			padding: 110px 0 38px;
		}
		.hero-copy > .eyebrow {
			font-size: 9px;
		}
		h1 {
			margin: 22px 0 17px;
			font-size: clamp(46px, 11.7vw, 70px);
		}
		.hero-description {
			font-size: 15px;
		}
		.explore-link {
			margin-top: 20px;
			gap: 18px;
		}
		.hero-facts {
			margin-top: 27px;
			gap: 24px;
		}
		.hero-facts .hero-location {
			display: flex;
		}
		.hero-facts strong {
			font-size: 23px;
		}
		.hero-montage {
			width: min(100%, 430px);
			height: min(124vw, 480px);
			margin: 16px auto 0;
		}
		/* Bigger cards with a tighter overlap: at 56% each they read as two small
		   thumbnails rather than one layered stack. */
		.featured-photo {
			top: 5%;
			left: 2%;
			width: 63%;
		}
		.snapshot {
			right: 0;
			bottom: 7%;
			width: 60%;
		}
		.featured-label {
			padding: 11px 9px;
			font-size: 7px;
		}
		.frame-note {
			font-size: 7px;
			left: 8%;
		}
		.montage-note {
			right: 1px;
			top: 22%;
			font-size: 7px;
			letter-spacing: 0.22em;
		}
		.archive-divider {
			gap: 12px;
			font-size: 7px;
			letter-spacing: 0.08em;
		}
		.collection {
			padding-top: 43px;
			scroll-margin-top: 90px;
		}
		h2 {
			font-size: 30px;
		}
		.collection-instruction {
			font-size: 13px;
		}
		.collection-toolbar {
			margin: 25px 0;
			padding-bottom: 19px;
		}
		.filters {
			gap: 7px;
		}
		.filters button {
			min-height: 40px;
			padding: 0 13px;
			gap: 8px;
			font-size: 10px;
		}
		.frame-count {
			font-size: 9px;
		}
		.photo-wall {
			column-gap: 12px;
		}
		.photo-card {
			margin-bottom: 23px;
		}
		figcaption {
			gap: 3px;
			padding-top: 10px;
		}
		figcaption > div {
			gap: 5px;
		}
		h3 {
			font-size: 10px;
		}
		.photo-number {
			font-size: 7px;
		}
		figcaption time {
			margin-left: 17px;
			font-size: 7px;
		}
		.photo-open {
			width: 26px;
			height: 26px;
			right: 7px;
			top: 7px;
			opacity: 1;
			transform: none;
		}
		.photo-open .arrow-icon {
			width: 17px;
			height: 17px;
		}
		.photo-category {
			display: none;
		}
		.gallery-footer {
			align-items: start;
			flex-direction: column;
			margin-top: 24px;
			padding: 28px 0 56px;
			gap: 22px;
		}
		.gallery-footer p {
			font-size: 27px;
		}
		.photo-viewer {
			width: 100%;
			height: 100dvh;
			border-radius: 0;
			border: 0;
		}
		.viewer-shell {
			padding: max(14px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
		}
		.viewer-topbar .eyebrow {
			font-size: 8px;
		}
		.viewer-bottom {
			align-items: start;
			flex-wrap: wrap;
			gap: 18px;
		}
		.viewer-caption {
			width: 100%;
		}
		.viewer-controls {
			width: 100%;
			justify-content: space-between;
		}
		.viewer-help {
			margin-top: 12px;
			font-size: 8px;
		}
	}
	@media (max-width: 360px) {
		.gallery-wrap {
			width: calc(100% - 32px);
		}
		.hero-facts {
			gap: 16px;
		}
		.hero-facts .hero-location {
			padding-left: 14px;
		}
		.hero-location span {
			font-size: 8px;
		}
		.photo-wall {
			columns: 1;
		}
		h3 {
			font-size: 13px;
		}
		figcaption time {
			font-size: 9px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			transition: none !important;
			scroll-behavior: auto !important;
		}
	}
</style>
