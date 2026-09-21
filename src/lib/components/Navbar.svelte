<script lang="ts">
	import { page } from '$app/state';

	let menuOpen = $state(false);
</script>

<header class="site-header">
	<a class="site-header__brand" href="/home" aria-label="Tecnoesis 2026 home">
		<img src="/TecnoLogoFull.png" alt="Tecnoesis 2026" />
	</a>

	<button
		class="site-header__menu-button"
		type="button"
		aria-label="Toggle navigation"
		aria-expanded={menuOpen}
		onclick={() => (menuOpen = !menuOpen)}
	>
		<span></span><span></span><span></span>
	</button>

	<nav class:site-header__nav--open={menuOpen} class="site-header__nav" aria-label="Primary navigation">
		<a class:active={page.url.pathname === '/'} href="/" onclick={() => (menuOpen = false)}><span class="marker marker-square"></span>Home</a>
		<a class:active={page.url.pathname.startsWith('/gallery')} href="/gallery" onclick={() => (menuOpen = false)}><span class="marker marker-triangle"></span>Gallery</a>
		<a class:active={page.url.pathname.startsWith('/modules')} href="/modules" onclick={() => (menuOpen = false)}><span class="marker marker-dot"></span>Modules</a>
		<a class:active={page.url.pathname.startsWith('/spark')} href="/spark" onclick={() => (menuOpen = false)}><span class="marker marker-star"></span>Spark</a>
		<a class:active={page.url.pathname.startsWith('/team')} href="/team" onclick={() => (menuOpen = false)}><span class="marker marker-diamond"></span>Team</a>
	</nav>

	<a class="site-header__login" href="/login">Log in</a>
	<a class="site-header__register" href="/signup">Register</a>
</header>

<style>
	.site-header {
		position: fixed;
		z-index: 50;
		top: 0;
		left: 50%;
		display: grid;
		width: min(100%, 1600px);
		min-height: 100px;
		padding: 15px clamp(28px, 4vw, 68px);
		grid-template-columns: 230px 1fr 300px;
		align-items: start;
		color: #f7f2ff;
		font-family: 'BankGothic', 'Bruno Ace', sans-serif;
		transform: translateX(-50%);
	}

	.site-header__brand {
		display: inline-flex;
		width: 190px;
		height: 70px;
		align-items: center;
		filter: drop-shadow(0 0 8px rgba(177, 107, 255, 0.22));
	}

	.site-header__brand img {
		display: block;
		width: 100%;
		height: auto;
	}

	.site-header__nav {
		display: flex;
		justify-content: center;
		gap: clamp(28px, 4vw, 65px);
		padding-top: 25px;
	}

	.site-header__menu-button {
		display: none;
		border: 0;
		background: transparent;
		color: #fff;
		cursor: pointer;
	}

	.site-header__menu-button span {
		display: block;
		height: 2px;
		width: 20px;
		background: currentColor;
		transition: transform 150ms ease, opacity 150ms ease;
	}

	.site-header__register {
		display: none;
	}

	.site-header__nav a,
	.site-header__login {
		position: relative;
		color: #f7f2ff;
		font-size: 0.9rem;
		line-height: 1;
		text-decoration: none;
		text-shadow: 0 0 12px rgba(198, 155, 255, 0.34);
	}

	.site-header__nav a::after,
	.site-header__login::after {
		position: absolute;
		right: 0;
		bottom: -11px;
		left: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, #d58aff, transparent);
		box-shadow: 0 0 10px #a855f7;
		content: '';
		opacity: 0;
		transform: scaleX(0.25);
		transition: 180ms ease;
	}

	.site-header__nav a:hover::after,
	.site-header__nav a:focus-visible::after,
	.site-header__nav a.active::after,
	.site-header__login:hover::after,
	.site-header__login:focus-visible::after {
		opacity: 1;
		transform: scaleX(1);
	}

	.site-header__login {
		justify-self: end;
		padding-top: 24px;
	}

	@media (max-width: 1100px) {
		.site-header {
			grid-template-columns: 190px 1fr 245px;
			padding-inline: 25px;
		}

		.site-header__brand {
			width: 165px;
		}

		.site-header__nav {
			gap: 25px;
		}
	}

	@media (max-width: 900px) {
		.site-header {
			min-height: 46px;
			padding: 0;
			grid-template-columns: 61px 1fr 122px;
			align-items: center;
			background: rgba(5, 5, 5, 0.22);
			backdrop-filter: blur(3px);
		}

		.site-header__brand {
			display: none;
		}

		.site-header__nav {
			position: absolute;
			top: 46px;
			right: 0;
			left: 0;
			display: flex;
			visibility: hidden;
			height: calc(100dvh - 46px);
			align-items: flex-start;
			justify-content: flex-start;
			gap: 17px;
			padding: 84px 32px 40px;
			background: #000;
			opacity: 0;
			clip-path: inset(0 100% 0 0);
			transform: none;
			transition: clip-path 560ms cubic-bezier(0.22, 1, 0.36, 1), opacity 560ms ease, visibility 560ms ease;
			pointer-events: none;
		}

		.site-header__nav--open {
			visibility: visible;
			opacity: 1;
			clip-path: inset(0 0 0 0);
			pointer-events: auto;
		}

		.site-header__nav a {
			width: max-content;
			min-height: 52px;
			display: inline-flex;
			align-items: center;
			gap: 10px;
			padding: 12px;
			font-size: 25px;
			text-transform: uppercase;
			opacity: 0;
			transform: translateX(-24px);
			transition: opacity 300ms ease, transform 300ms ease;
		}

		.site-header__nav--open a {
			opacity: 1;
			transform: translateX(0);
		}

		.site-header__nav a::after {
			display: none;
		}

		.site-header__nav a.active {
			width: min(280px, 73vw);
			background: #29248c;
			clip-path: polygon(0 0, 100% 0, 100% 68%, 90% 100%, 0 100%);
			color: #8ed8ff;
		}

		.marker {
		display: block;
			flex: 0 0 auto;
			background: currentColor;
		}

		.marker-square,
		.marker-dot,
		.marker-diamond {
			height: 5px;
			width: 5px;
		}

		.marker-dot {
			border-radius: 999px;
		}

		.marker-triangle {
			height: 0;
			width: 0;
			border-right: 3px solid transparent;
			border-bottom: 5px solid currentColor;
			border-left: 3px solid transparent;
			background: transparent;
		}

		.marker-star {
			height: 8px;
			width: 8px;
			clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);
		}

		.marker-diamond {
			height: 7px;
			width: 7px;
			clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
		}

		.site-header__menu-button {
			display: flex;
			grid-column: 1;
			grid-row: 1;
			justify-self: stretch;
			width: 61px;
			height: 46px;
			padding: 8px 15px;
			flex-direction: column;
			justify-content: center;
			gap: 5px;
			border-right: 1px solid rgba(255, 255, 255, 0.25);
		}

		.site-header__menu-button[aria-expanded='true'] span:first-child {
			transform: translateY(7px) rotate(45deg);
		}

		.site-header__menu-button[aria-expanded='true'] span:nth-child(2) {
			opacity: 0;
		}

		.site-header__menu-button[aria-expanded='true'] span:last-child {
			transform: translateY(-7px) rotate(-45deg);
		}

		.site-header__login {
			display: none;
		}

		.site-header__register {
			display: flex;
			grid-column: 3;
			grid-row: 1;
			height: 46px;
			align-items: center;
			justify-content: center;
			background: #29248c;
			clip-path: polygon(0 0, 100% 0, 100% 100%, 14% 100%, 0 72%);
			color: #fff;
			font-size: 10px;
			text-transform: uppercase;
		}
	}

	@media (max-width: 560px) {
		.site-header {
			grid-template-columns: 61px 1fr 88px;
		}

		.site-header__menu-button {
			width: 61px;
		}

		.site-header__register {
			height: 46px;
			font-size: 0.68rem;
		}
	}
</style>
