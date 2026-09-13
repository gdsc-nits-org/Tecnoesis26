<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let menuOpen = $state(false);
</script>

<header class="navbar-shell">
	<nav class:menu-open={menuOpen} class="navbar z-999" aria-label="Main navigation">
		<a class="brand" href="/" aria-label="Tecnoesis home">
			<img src="/full-logo-nav.svg" alt="Tecnoesis" />
		</a>

		<button
			class="menu-toggle"
			type="button"
			aria-label="Toggle navigation"
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span></span><span></span><span></span>
		</button>

		<div class:menu-open={menuOpen} class="nav-links">
			<a class:active={page.url.pathname === '/'} href="/" onclick={() => (menuOpen = false)}><span class="nav-marker square" aria-hidden="true"></span>Home</a>
			<a class:active={page.url.pathname.startsWith('/gallery')} href="/gallery" onclick={() => (menuOpen = false)}><span class="nav-marker triangle" aria-hidden="true"></span>Gallery</a>
			<a class:active={page.url.pathname.startsWith('/modules')} href="/modules" onclick={() => (menuOpen = false)}><span class="nav-marker circle" aria-hidden="true"></span>Modules</a>
			<a class:active={page.url.pathname.startsWith('/spark')} href="/spark" onclick={() => (menuOpen = false)}><span class="nav-marker plus" aria-hidden="true"></span>Spark</a>
			<a class:active={page.url.pathname.startsWith('/team')} href="/team" onclick={() => (menuOpen = false)}><span class="nav-marker diamond" aria-hidden="true"></span>Team</a>
		</div>

		<div class="register-slot">
			<button class="register-button" type="button" onclick={() => goto('/auth/signup')}>Register</button>
		</div>
	</nav>
</header>

<style>
	.navbar-shell {
		padding: 6px 7px 0;
		background: transparent;
	}

	.navbar {
		position: relative;
		display: flex;
		align-items: center;
		min-height: 60px;
		padding: 0 10px 0 12px;
		border: 1px solid rgba(222, 222, 222, 0.55);
		border-radius: 14px 14px 0 0;
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.92) 0%,
			rgba(255, 255, 255, 0.72) 11%,
			rgba(255, 255, 255, 0.3) 28%,
			rgba(255, 255, 255, 0.04) 44%,
			transparent 50%,
			rgba(255, 255, 255, 0.04) 56%,
			rgba(255, 255, 255, 0.3) 72%,
			rgba(255, 255, 255, 0.72) 89%,
			rgba(255, 255, 255, 0.92) 100%
		);
		backdrop-filter: blur(4px);
		color: #3b3b3b;
		font-family: 'Bruno Ace', sans-serif;
		overflow: visible;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		width: 105px;
		text-decoration: none;
	}

	.brand img {
		display: block;
		width: 82px;
		height: auto;
	}

	.nav-links {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(20px, 3vw, 39px);
		flex: 1;
		padding-left: 50px;
	}

	.nav-links a {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: #fff;
		font-size: 13px;
        font-weight: 530;
		line-height: 1;
		text-decoration: none;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.nav-links a::after {
		position: absolute;
		right: 0;
		bottom: -6px;
		left: 0;
		height: 2px;
		background: #8ed8ff;
		content: '';
		transform: scaleX(0);
		transform-origin: center;
		transition: transform 180ms ease;
	}

	.nav-links a:hover,
	.nav-links a:focus-visible,
	.nav-links a.active {
		color: #8ed8ff;
	}

	.nav-links a:hover::after,
	.nav-links a:focus-visible::after,
	.nav-links a.active::after {
		transform: scaleX(1);
	}

	.nav-links a span {
		font-family: Arial, sans-serif;
		font-size: 12px;
		line-height: 1;
	}

	.nav-marker {
		display: inline-block;
		width: 5px;
		height: 5px;
		flex: 0 0 5px;
		align-self: center;
		background: currentColor;
	}

	.nav-marker.circle {
		border-radius: 50%;
	}

	.nav-marker.triangle {
		width: 0;
		height: 0;
		flex-basis: 0;
		border-right: 3px solid transparent;
		border-bottom: 5px solid currentColor;
		border-left: 3px solid transparent;
		background: transparent;
	}

	.nav-marker.plus {
		width: 8px;
		height: 8px;
		flex-basis: 8px;
		clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);
	}

	.nav-marker.diamond {
		width: 7px;
		height: 7px;
		flex-basis: 7px;
		clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
	}

	.register-slot {
		align-self: stretch;
		flex: 0 0 111px;
		margin: 0 -10px 0 12px;
		border-radius: 0 14px 0 0;
		overflow: hidden;
	}

	.register-button {
		width: 100%;
		height: 100%;
		border: 0;
		background: rgba(110, 110, 110, 0.72);
		color: #fff;
		font-family: 'Bruno Ace', sans-serif;
		font-size: 13px;
		text-transform: uppercase;
		clip-path: polygon(0 0, 100% 0, 100% 100%, 14% 100%, 0 72%);
		cursor: pointer;
	}

	.menu-toggle {
		display: none;
		border: 0;
		background: transparent;
		cursor: pointer;
	}

	@media (max-width: 700px) {
		.navbar-shell {
			position: relative;
			z-index: 20;
			padding: 0;
			background: transparent;
		}

		.navbar {
			flex-wrap: wrap;
			min-height: 46px;
			padding: 0;
			border: 0;
			border-radius: 0;
			background: rgba(5, 5, 5, 0.22);
			backdrop-filter: blur(3px);
			color: #fff;
		}

		.navbar.menu-open {
			background: #000;
			border-bottom: 1px solid #fff;
		}

		.brand {
			display: none;
		}

		.menu-toggle {
			position: relative;
			display: grid;
			width: 61px;
			height: 46px;
			gap: 4px;
			align-content: center;
			padding: 8px 15px;
			border-right: 1px solid rgba(255, 255, 255, 0.25);
		}

		.menu-toggle span {
			display: block;
			width: 20px;
			height: 2px;
			background: #fff;
			transition: transform 150ms ease, opacity 150ms ease;
		}

		.menu-toggle[aria-expanded='true'] span:first-child {
			transform: translateY(6px) rotate(45deg);
		}

		.menu-toggle[aria-expanded='true'] span:nth-child(2) {
			opacity: 0;
		}

		.menu-toggle[aria-expanded='true'] span:last-child {
			transform: translateY(-6px) rotate(-45deg);
		}

		.nav-links {
			display: flex;
			position: fixed;
			inset: 46px 0 0;
			width: 100vw;
			height: calc(100dvh - 46px);
			z-index: 30;
			visibility: hidden;
			pointer-events: none;
			opacity: 0;
			align-items: flex-start;
			justify-content: flex-start;
			flex-direction: column;
			gap: 17px;
			padding: 84px 32px 40px;
			background-color: #000;
			background-image: none;
			backdrop-filter: none;
			clip-path: inset(0 100% 0 0);
			transition:
				clip-path 560ms cubic-bezier(0.22, 1, 0.36, 1),
				opacity 360ms ease,
				visibility 0s linear 560ms;
		}

		.nav-links.menu-open {
			visibility: visible;
			pointer-events: auto;
			opacity: 1;
			clip-path: inset(0 0 0 0);
			transition-delay: 0s;
		}

		.nav-links a {
			width: max-content;
			min-height: 52px;
			padding: 0 12px;
			color: #fff;
			font-size: 25px;
			gap: 10px;
			opacity: 0;
			transform: translateX(-24px);
			transition:
				opacity 300ms ease,
				transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
		}

		.nav-links.menu-open a {
			opacity: 1;
			transform: translateX(0);
		}

		.nav-links.menu-open a:nth-child(1) {
			transition-delay: 120ms;
		}

		.nav-links.menu-open a:nth-child(2) {
			transition-delay: 180ms;
		}

		.nav-links.menu-open a:nth-child(3) {
			transition-delay: 240ms;
		}

		.nav-links.menu-open a:nth-child(4) {
			transition-delay: 300ms;
		}

		.nav-links.menu-open a:nth-child(5) {
			transition-delay: 360ms;
		}

		.nav-links a::after {
			display: none;
		}

		.nav-links a.active {
			width: min(280px, 73vw);
			padding: 0 12px;
			background: #29248c;
			clip-path: polygon(0 0, 100% 0, 100% 68%, 90% 100%, 0 100%);
		}

		.nav-links a.active .nav-marker {
			background: #fff;
			border-bottom-color: #fff;
		}

		.nav-links a .nav-marker {
			width: 5px;
			height: 5px;
			flex-basis: 5px;
		}

		.nav-links a .nav-marker.triangle {
			width: 0;
			height: 0;
			flex-basis: 0;
			border-right-width: 3px;
			border-bottom-width: 5px;
			border-left-width: 3px;
		}

		.nav-links a .nav-marker.plus {
			width: 7px;
			height: 7px;
			flex-basis: 7px;
		}

		.register-slot {
			align-self: center;
			flex: 0 0 clamp(88px, 25.5vw, 122px);
			height: 46px;
			margin: 0 0 0 auto;
			border-radius: 0;
		}

		.register-button {
			background: #29248c;
			font-size: 10px;
		}
	}
</style>
