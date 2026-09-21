<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AuthIcon from '$lib/components/auth/AuthIcon.svelte';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';

	let { form } = $props();
	let submitting = $state(false);

	const queryError = $derived(page.url.searchParams.get('error'));
	const error = $derived(form?.error ?? queryError);

	const enhanceSignup: SubmitFunction = () => {
		submitting = true;
		return async ({ update }) => {
			await update();
			submitting = false;
		};
	};
</script>

<svelte:head>
	<title>Sign up | Tecnoesis 2026</title>
	<meta
		name="description"
		content="Create your Tecnoesis 2026 participant account with your institute Google account."
	/>
</svelte:head>

<AuthShell
	title="Join the Universe"
	description="Create your participant identity for Tecnoesis 2026."
	mode="signup"
>
	{#if error}
		<div class="auth-error" role="alert">
			<AuthIcon name="info" size={18} />
			<span>{error}</span>
		</div>
	{/if}

	<div class="auth-note">
		<AuthIcon name="check" size={18} />
		<div>
			<strong>Use your institute Google account</strong>
			<p>We'll verify your email, then ask you to choose your Tecnoesis credentials.</p>
		</div>
	</div>

	<form method="POST" class="auth-form" use:enhance={enhanceSignup} aria-busy={submitting}>
		<button
			type="submit"
			formaction="?/google"
			class="auth-button signup-button"
			disabled={submitting}
		>
			<AuthIcon name="google" size={21} />
			<span>{submitting ? 'Connecting...' : 'Continue with Google'}</span>
			{#if !submitting}<AuthIcon name="arrow-right" size={20} />{/if}
		</button>
	</form>

	<p class="terms-copy">By continuing, you agree to follow the Tecnoesis participant guidelines.</p>

	<p class="auth-footer">
		Already registered? <a class="auth-text-link" href={resolve('/login')}>Log in</a>
	</p>
</AuthShell>

<style>
	.signup-button :global(span:nth-child(2)) {
		flex: 1;
	}

	.terms-copy {
		margin: 1rem auto 0;
		max-width: 24rem;
		color: rgb(204 194 239 / 66%);
		font-size: 0.72rem;
		line-height: 1.6;
		text-align: center;
	}

	.auth-note strong {
		display: block;
		margin-bottom: 0.2rem;
		color: #f4efff;
		font-size: 0.82rem;
	}

	.auth-note p {
		margin: 0;
	}
</style>
