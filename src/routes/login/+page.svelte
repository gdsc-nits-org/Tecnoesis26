<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AuthField from '$lib/components/auth/AuthField.svelte';
	import AuthIcon from '$lib/components/auth/AuthIcon.svelte';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';

	let { form } = $props();
	let submitting = $state(false);
	const queryError = $derived(page.url.searchParams.get('error'));
	const error = $derived(form?.error ?? queryError);

	const enhanceCredentials: SubmitFunction = () => {
		submitting = true;
		return async ({ update }) => {
			try {
				await update({ reset: false });
			} finally {
				submitting = false;
			}
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
	{#if page.url.searchParams.get('reset') === 'success'}
		<div class="auth-notice" role="status">
			<AuthIcon name="info" size={18} />
			<span>Password updated. Log in with your institute email and new password.</span>
		</div>
	{/if}
	{#if error}
		<div class="auth-error" role="alert">
			<AuthIcon name="info" size={18} />
			<span>{error}</span>
		</div>
	{/if}

	<form method="POST" class="auth-form" use:enhance={enhanceCredentials} aria-busy={submitting}>
		<AuthField
			label="Institute email"
			name="email"
			type="email"
			icon="mail"
			placeholder="Enter your institute email"
			value={form?.email ?? ''}
			autocomplete="email"
			maxlength={254}
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

		<button type="submit" class="auth-button" disabled={submitting}>
			<span>{submitting ? 'Entering...' : 'Log In'}</span>
			{#if !submitting}<AuthIcon name="arrow-right" size={20} />{/if}
		</button>
	</form>

	<p class="auth-footer">
		New here? <a class="auth-text-link" href={resolve('/signup')}>Sign up with Google</a> to create your
		profile and password.
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
