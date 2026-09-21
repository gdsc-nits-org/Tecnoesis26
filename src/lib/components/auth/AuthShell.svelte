<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import './auth.css';

	type AuthMode = 'login' | 'signup' | 'recovery';

	interface Props {
		title: string;
		description?: string;
		mode?: AuthMode;
		compact?: boolean;
		children: Snippet;
	}

	let { title, description = '', mode = 'login', compact = false, children }: Props = $props();

	let headingId = $derived(`auth-${mode}-title`);
	let prompt = $derived(
		mode === 'login'
			? { text: "Don't have an account?", action: 'Sign up', href: resolve('/signup') }
			: mode === 'signup'
				? { text: 'Already have an account?', action: 'Log in', href: resolve('/login') }
				: { text: 'Remember your password?', action: 'Log in', href: resolve('/login') }
	);
</script>

<div class:auth-shell--compact={compact} class="auth-shell">
	<div class="auth-shell__backdrop" aria-hidden="true"></div>
	<div class="auth-shell__stars" aria-hidden="true"></div>

	<main class="auth-shell__main" aria-labelledby={headingId}>
		<section class="auth-shell__emblem" aria-label="About Tecnoesis">
			<div class="auth-shell__emblem-glow" aria-hidden="true"></div>
			<img src="/logo.png" alt="" aria-hidden="true" />
			<p>Tecnoesis is the annual<br />techno-managerial<br />event of NIT Silchar</p>
		</section>

		<section class="auth-card">
			<div class="auth-card__surface">
				<span class="auth-card__ticks auth-card__ticks--top" aria-hidden="true"></span>
				<span class="auth-card__ticks auth-card__ticks--bottom" aria-hidden="true"></span>
				<header class="auth-card__header">
					<h1 id={headingId}>{title}</h1>
					<span class="auth-card__title-rule" aria-hidden="true"></span>
					{#if description}<p>{description}</p>{/if}
				</header>
				<div class="auth-card__content">
					{@render children()}
				</div>
			</div>
		</section>
	</main>

	<div class="auth-shell__scroll-cue" aria-hidden="true">
		<span></span>
		<small>Scroll</small>
	</div>
</div>
