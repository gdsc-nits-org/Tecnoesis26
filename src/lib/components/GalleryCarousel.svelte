
<script lang="ts">
	import type { GalleryPhoto } from '$lib/data/gallery';

	type Props = {
		photos: GalleryPhoto[];
		initialIndex?: number;
		onclose?: () => void;
	};

	let { photos, initialIndex = 0, onclose }: Props = $props();

	const getInitialIndex = () => initialIndex;
	let currentIndex = $state(getInitialIndex());
	let isClosing = $state(false);
	let dragging = $state(false);
	let dragStartX = $state(0);
	let dragOffset = $state(0);

	const clamp = (value: number, min: number, max: number) =>
		Math.min(max, Math.max(min, value));

	const currentPhoto = $derived(photos[currentIndex]);

	const previousIndex = $derived(
		currentIndex > 0 ? currentIndex - 1 : photos.length - 1
	);

	const nextIndex = $derived(
		currentIndex < photos.length - 1 ? currentIndex + 1 : 0
	);

	const previousPhoto = $derived(photos[previousIndex]);
	const nextPhoto = $derived(photos[nextIndex]);

	const getImage = (photo: GalleryPhoto) => photo.sources.desktop;

	function goTo(index: number) {
		if (!photos.length) return;

		currentIndex = (index + photos.length) % photos.length;
		dragOffset = 0;
	}

	function goNext() {
		goTo(nextIndex);
	}

	function goPrevious() {
		goTo(previousIndex);
	}

	function close() {
		if (isClosing) return;

		isClosing = true;

		// Allow the close animation to complete.
		setTimeout(() => {
			onclose?.();
		}, 240);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			close();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			goNext();
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			goPrevious();
		} else if (event.key === 'Home') {
			event.preventDefault();
			goTo(0);
		} else if (event.key === 'End') {
			event.preventDefault();
			goTo(photos.length - 1);
		}
	}

	function handlePointerDown(event: PointerEvent) {
		dragging = true;
		dragStartX = event.clientX;
		dragOffset = 0;
	}

	function handlePointerMove(event: PointerEvent) {
		if (!dragging) return;

		dragOffset = event.clientX - dragStartX;
	}

	function handlePointerUp() {
		if (!dragging) return;

		dragging = false;

		const threshold = 60;

		if (dragOffset < -threshold) {
			goNext();
		} else if (dragOffset > threshold) {
			goPrevious();
		} else {
			dragOffset = 0;
		}
	}

	function handlePointerCancel() {
		dragging = false;
		dragOffset = 0;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if currentPhoto}
	<div
		class:closing={isClosing}
		class="carousel-modal"
		role="dialog"
		aria-modal="true"
		aria-label="Gallery photo viewer"
	>
		<!-- Cinematic backdrop -->
		<div
			class="backdrop"
			style={`background-image: url("${getImage(currentPhoto)}");`}
			aria-hidden="true"
		></div>

		<div class="backdrop-tint" aria-hidden="true"></div>
		<div class="backdrop-grain" aria-hidden="true"></div>

		<!-- Header -->
		<header class="carousel-header">
			<div class="brand">
				<span class="brand-mark">T</span>
				<span>TECNOESIS</span>
			</div>

			<div class="counter">
				<span>{String(currentIndex + 1).padStart(2, '0')}</span>
				<span class="counter-separator">/</span>
				<span>{String(photos.length).padStart(2, '0')}</span>
			</div>

			<button
				class="close-button"
				type="button"
				aria-label="Close gallery"
				onclick={close}
			>
				<span>Close</span>
				<span class="close-icon" aria-hidden="true">×</span>
			</button>
		</header>

		<!-- Main carousel -->
		<main class="carousel-main">
			<div
				class="carousel-stage"
				role="group"
				aria-label="Gallery carousel"
			>
				<!-- Previous card -->
				<button
					class="side-card previous-card"
					type="button"
					aria-label={`Previous photo: ${previousPhoto.title}`}
					onclick={goPrevious}
				>
					<img
						src={getImage(previousPhoto)}
						alt=""
						draggable="false"
					/>
				</button>

				<!-- Active image -->
				<div
					class="active-card"
					class:dragging
					style={`transform: translateX(${dragOffset}px);`}
					onpointerdown={handlePointerDown}
					onpointermove={handlePointerMove}
					onpointerup={handlePointerUp}
					onpointercancel={handlePointerCancel}
					role="img"
					aria-label={currentPhoto.title}
				>
					<div class="active-image-wrapper">
						<img
							src={getImage(currentPhoto)}
							alt={`${currentPhoto.title} at Tecnoesis 2026`}
							draggable="false"
						/>
					</div>
				</div>

				<!-- Next card -->
				<button
					class="side-card next-card"
					type="button"
					aria-label={`Next photo: ${nextPhoto.title}`}
					onclick={goNext}
				>
					<img
						src={getImage(nextPhoto)}
						alt=""
						draggable="false"
					/>
				</button>
			</div>
		</main>

		<!-- Bottom content -->
		<footer class="carousel-footer">
			<div class="footer-info">
				<div class="photo-index">
					<span class="index-current">
						{String(currentIndex + 1).padStart(2, '0')}
					</span>
					<span class="index-line"></span>
					<span class="index-total">
						{String(photos.length).padStart(2, '0')}
					</span>
				</div>

				<div class="photo-details">
					<div class="eyebrow">TECNOESIS 2026 / GALLERY</div>
					<h2>{currentPhoto.title}</h2>
				</div>
			</div>

			<div class="navigation-controls">
				<button
					type="button"
					class="nav-button"
					aria-label="Previous photo"
					onclick={goPrevious}
				>
					<span aria-hidden="true">←</span>
				</button>

				<button
					type="button"
					class="nav-button"
					aria-label="Next photo"
					onclick={goNext}
				>
					<span aria-hidden="true">→</span>
				</button>
			</div>
		</footer>

		<!-- Progress rail -->
		<div class="progress-container" aria-hidden="true">
			<div class="progress-track">
				<div
					class="progress-fill"
					style={`width: ${((currentIndex + 1) / photos.length) * 100}%;`}
				></div>
			</div>
		</div>

		<!-- Thumbnail strip -->
		<div class="thumbnail-strip" aria-label="Select photo">
			{#each photos as photo, index}
				<button
					type="button"
					class:active={index === currentIndex}
					class="thumbnail"
					aria-label={`View ${photo.title}`}
					aria-current={index === currentIndex ? 'true' : undefined}
					onclick={() => goTo(index)}
				>
					<img
						src={photo.sources.mobile}
						alt=""
						draggable="false"
					/>
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	:global(body:has(.carousel-modal)) {
		overflow: hidden;
	}

	.carousel-modal {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		color: #fff;
		background: #0c0912;
		animation: modal-in 0.3s ease both;
	}

	.carousel-modal.closing {
		animation: modal-out 0.24s ease both;
	}

	.backdrop,
	.backdrop-tint,
	.backdrop-grain {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.backdrop {
		background-position: center;
		background-size: cover;
		filter: blur(35px);
		transform: scale(1.18);
		opacity: 0.55;
		transition: background-image 0.4s ease;
	}

	.backdrop-tint {
		background:
			linear-gradient(
				180deg,
				rgba(12, 9, 18, 0.86) 0%,
				rgba(12, 9, 18, 0.2) 42%,
				rgba(12, 9, 18, 0.7) 100%
			);
	}

	.backdrop-grain {
		opacity: 0.1;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
		mix-blend-mode: overlay;
	}

	.carousel-header,
	.carousel-main,
	.carousel-footer,
	.progress-container,
	.thumbnail-strip {
		position: relative;
		z-index: 2;
	}

	.carousel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28px clamp(20px, 4vw, 64px);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: Arial, sans-serif;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
	}

	.brand-mark {
		display: grid;
		width: 26px;
		height: 26px;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.45);
		border-radius: 50%;
		font-size: 12px;
	}

	.counter {
		display: flex;
		gap: 10px;
		align-items: center;
		font-family: 'Courier New', monospace;
		font-size: 12px;
		letter-spacing: 0.08em;
	}

	.counter-separator {
		color: rgba(255, 255, 255, 0.4);
	}

	.close-button {
		display: flex;
		align-items: center;
		gap: 14px;
		border: 0;
		color: white;
		background: transparent;
		cursor: pointer;
		font-family: inherit;
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.close-icon {
		display: grid;
		width: 30px;
		height: 30px;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: 50%;
		font-size: 24px;
		font-weight: 300;
		line-height: 1;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.close-button:hover .close-icon {
		color: #111;
		background: #fff;
	}

	.carousel-main {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		min-height: 0;
		padding: 20px 0;
	}

	.carousel-stage {
		position: relative;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		width: 100%;
		height: min(52vh, 510px);
		touch-action: pan-y;
	}

	.side-card {
		position: absolute;
		top: 25%;
		width: clamp(100px, 12vw, 180px);
		height: 50%;
		padding: 0;
		overflow: hidden;
		border: 0;
		background: rgba(255, 255, 255, 0.05);
		cursor: pointer;
		opacity: 0.5;
		transition:
			opacity 0.3s,
			transform 0.3s;
	}

	.side-card:hover {
		opacity: 0.8;
	}

	.side-card img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 25%;
	}

	.previous-card {
		right: calc(50% + clamp(180px, 20vw, 300px));
	}

	.next-card {
		left: calc(50% + clamp(180px, 20vw, 300px));
	}

	.active-card {
		position: relative;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
		width: min(33vw, 400px);
		height: 100%;
		touch-action: pan-y;
		cursor: grab;
		transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.active-card.dragging {
		transition: none;
		cursor: grabbing;
	}

	.active-image-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #1a1423;
		box-shadow: 0 18px 80px rgba(0, 0, 0, 0.3);
	}

	.active-image-wrapper img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		user-select: none;
	}

	.carousel-footer {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;
		padding: 20px clamp(20px, 4vw, 64px) 16px;
	}

	.footer-info {
		display: flex;
		align-items: flex-end;
		gap: clamp(20px, 4vw, 70px);
		min-width: 0;
	}

	.photo-index {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 40px;
		font-family: 'Courier New', monospace;
		font-size: 10px;
	}

	.index-current {
		font-size: 20px;
	}

	.index-line {
		width: 24px;
		height: 1px;
		background: rgba(255, 255, 255, 0.4);
	}

	.index-total {
		color: rgba(255, 255, 255, 0.5);
	}

	.photo-details {
		min-width: 0;
	}

	.eyebrow {
		margin-bottom: 10px;
		color: rgba(255, 255, 255, 0.5);
		font-family: 'Courier New', monospace;
		font-size: 9px;
		letter-spacing: 0.12em;
	}

	.photo-details h2 {
		max-width: 500px;
		margin: 0;
		overflow: hidden;
		font-family: Arial, sans-serif;
		font-size: clamp(24px, 3vw, 44px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 0.95;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.navigation-controls {
		display: flex;
		gap: 8px;
	}

	.nav-button {
		display: grid;
		width: 42px;
		height: 42px;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		color: white;
		background: transparent;
		cursor: pointer;
		font-size: 20px;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.nav-button:hover {
		color: #111;
		background: #fff;
	}

	.progress-container {
		padding: 0 clamp(20px, 4vw, 64px);
	}

	.progress-track {
		width: 100%;
		height: 1px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.2);
	}

	.progress-fill {
		height: 100%;
		background: #fff;
		transition: width 0.35s ease;
	}

	.thumbnail-strip {
		display: flex;
		gap: 8px;
		justify-content: center;
		padding: 18px clamp(20px, 4vw, 64px) 28px;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.thumbnail-strip::-webkit-scrollbar {
		display: none;
	}

	.thumbnail {
		flex: 0 0 auto;
		width: 42px;
		height: 32px;
		padding: 0;
		overflow: hidden;
		border: 1px solid transparent;
		background: rgba(255, 255, 255, 0.1);
		cursor: pointer;
		opacity: 0.45;
		transition:
			opacity 0.2s,
			border-color 0.2s;
	}

	.thumbnail.active {
		border-color: #fff;
		opacity: 1;
	}

	.thumbnail:hover {
		opacity: 0.85;
	}

	.thumbnail img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@keyframes modal-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes modal-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	@media (max-width: 768px) {
		.carousel-header {
			padding: 18px 20px;
		}

		.brand {
			font-size: 10px;
		}

		.counter {
			font-size: 10px;
		}

		.carousel-stage {
			height: min(48vh, 430px);
		}

		.active-card {
			width: min(63vw, 300px);
		}

		.side-card {
			width: 80px;
			height: 40%;
			top: 30%;
		}

		.previous-card {
			right: calc(50% + min(31.5vw, 150px) + 10px);
		}

		.next-card {
			left: calc(50% + min(31.5vw, 150px) + 10px);
		}

		.carousel-footer {
			align-items: flex-end;
			padding: 16px 20px;
		}

		.footer-info {
			gap: 14px;
		}

		.photo-details h2 {
			max-width: 55vw;
			font-size: 24px;
		}

		.eyebrow {
			font-size: 8px;
		}

		.photo-index {
			min-width: 28px;
		}

		.navigation-controls {
			gap: 5px;
		}

		.nav-button {
			width: 36px;
			height: 36px;
			font-size: 16px;
		}

		.thumbnail-strip {
			justify-content: flex-start;
			padding: 14px 20px 20px;
		}

		.thumbnail {
			width: 38px;
			height: 28px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.carousel-modal,
		.carousel-modal.closing,
		.active-card,
		.progress-fill,
		.thumbnail {
			animation: none;
			transition: none;
		}
	}
</style>