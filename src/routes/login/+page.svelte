<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AuthField from '$lib/components/auth/AuthField.svelte';
	import AuthIcon from '$lib/components/auth/AuthIcon.svelte';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';

	let { form } = $props();
	let activeSubmission = $state<'credentials' | 'google' | null>(null);
	const queryError = $derived(page.url.searchParams.get('error'));
	const error = $derived(form?.error ?? queryError);

	const enhanceCredentials: SubmitFunction = () => {
		activeSubmission = 'credentials';
		return async ({ update }) => {
			await update();
			activeSubmission = null;
		};
	};

	const enhanceGoogle: SubmitFunction = () => {
		activeSubmission = 'google';
		return async ({ update }) => {
			await update();
			activeSubmission = null;
		};
	};
</script>

<svelte:head>
	<title>Log in | Tecnoesis 2026</title>
	<meta name="description" content="Log in to your Tecnoesis 2026 participant account." />
</svelte:head>

<AuthShell
	title="Welcome Back"
	description="Log in to continue to the Tecnoesis universe."
	mode="login"
>
	{#if error}
		<div class="auth-error" role="alert">
			<AuthIcon name="info" size={18} />
			<span>{error}</span>
		</div>
	{/if}

	<form
		method="POST"
		class="auth-form"
		use:enhance={enhanceCredentials}
		aria-busy={activeSubmission === 'credentials'}
	>
		<AuthField
			label="Username"
			name="username"
			icon="user"
			placeholder="Enter your username"
			value={form?.username ?? ''}
			autocomplete="username"
			required
		/>

		<AuthField
			label="Password"
			name="password"
			type="password"
			icon="lock"
			placeholder="Enter your password"
			autocomplete="current-password"
			required
		/>

		<div class="forgot-row">
			<a class="auth-text-link" href={resolve('/forgot-password')}>Forgot password?</a>
		</div>

		<button
			type="submit"
			formaction="?/default"
			class="auth-button"
			disabled={activeSubmission !== null}
		>
			<span>{activeSubmission === 'credentials' ? 'Entering...' : 'Log In'}</span>
			{#if activeSubmission !== 'credentials'}<AuthIcon name="arrow-right" size={20} />{/if}
		</button>
	</form>

	<div class="auth-divider"><span>or</span></div>

	<form method="POST" use:enhance={enhanceGoogle} aria-busy={activeSubmission === 'google'}>
		<button
			type="submit"
			formaction="?/google"
			class="auth-secondary-button"
			disabled={activeSubmission !== null}
		>
			<AuthIcon name="google" size={20} />
			<span>{activeSubmission === 'google' ? 'Connecting...' : 'Continue with Google'}</span>
		</button>
	</form>

	<p class="auth-footer">
		Don't have an account? <a class="auth-text-link" href={resolve('/signup')}>Sign up</a>
	</p>
</AuthShell>

<style>
	.forgot-row {
		display: flex;
		justify-content: flex-end;
		margin-top: -0.45rem;
		font-size: 0.8rem;
	}
</style>
