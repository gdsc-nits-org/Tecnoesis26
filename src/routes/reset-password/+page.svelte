<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AuthField from '$lib/components/auth/AuthField.svelte';
	import AuthIcon from '$lib/components/auth/AuthIcon.svelte';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';

	let { data, form } = $props();
	let submitting = $state(false);
	const error = $derived(form?.error ?? data.error);
	const enhanceReset: SubmitFunction = () => {
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
	<title>Reset password | Tecnoesis 2026</title>
	<meta name="description" content="Choose a new password for your Tecnoesis account." />
</svelte:head>

<AuthShell
	title="Reset Password"
	description="Set a new password to restore access to your universe."
	mode="recovery"
>
	{#if error}
		<div class="auth-error" role="alert">
			<AuthIcon name="info" size={18} />
			<span>{error}</span>
		</div>
	{/if}

	{#if data.canReset && !form?.passwordChanged}
		<form method="POST" class="auth-form" use:enhance={enhanceReset} aria-busy={submitting}>
			<AuthField
				label="New password"
				name="password"
				type="password"
				icon="lock"
				placeholder="Create a new password"
				autocomplete="new-password"
				minlength={8}
				maxlength={128}
				hint="8+ characters with uppercase, lowercase, and a number"
				required
			/>
			<AuthField
				label="Confirm password"
				name="confirm_password"
				type="password"
				icon="lock"
				placeholder="Enter your new password again"
				autocomplete="new-password"
				minlength={8}
				maxlength={128}
				required
			/>
			<button type="submit" class="auth-button" disabled={submitting}>
				<span>{submitting ? 'Updating...' : 'Update Password'}</span>
				{#if !submitting}<AuthIcon name="arrow-right" size={20} />{/if}
			</button>
		</form>
	{:else if !form?.passwordChanged}
		<a class="auth-button" href={resolve('/forgot-password')}>Request a New Reset Link</a>
	{/if}

	<p class="auth-footer">
		<a class="auth-text-link" href={resolve('/login')}>Return to login</a>
	</p>
</AuthShell>
