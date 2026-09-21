<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AuthField from '$lib/components/auth/AuthField.svelte';
	import AuthIcon from '$lib/components/auth/AuthIcon.svelte';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';

	let { form } = $props();
	let submitting = $state(false);
	const enhanceRecovery: SubmitFunction = () => {
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
	<title>Recover account | Tecnoesis 2026</title>
	<meta name="description" content="Reset your Tecnoesis 2026 account password." />
</svelte:head>

<AuthShell
	title="Recover Access"
	description="Enter your account email to begin the recovery sequence."
	mode="recovery"
>
	{#if form?.success}
		<div class="auth-notice" role="status" aria-live="polite">
			<AuthIcon name="info" size={18} />
			<div>
				<strong>Check your institute inbox</strong>
				<p>
					If this email has an eligible account, a reset link will be sent. Check spam too, and open
					the link in this same browser.
				</p>
			</div>
		</div>
	{:else if form?.error}
		<div class="auth-error" role="alert">
			<AuthIcon name="info" size={18} />
			<span>{form.error}</span>
		</div>
	{/if}

	<form method="POST" class="auth-form" use:enhance={enhanceRecovery} aria-busy={submitting}>
		<AuthField
			label="Account email"
			name="email"
			type="email"
			icon="mail"
			placeholder="Enter your institute email"
			value={form?.email ?? ''}
			maxlength={254}
			autocomplete="email"
			required
		/>

		<button type="submit" class="auth-button" disabled={submitting}>
			<span>{submitting ? 'Sending...' : 'Send Reset Link'}</span>
			{#if !submitting}<AuthIcon name="arrow-right" size={20} />{/if}
		</button>
	</form>

	<p class="auth-footer">
		Remembered your password? <a class="auth-text-link" href={resolve('/login')}>Return to login</a>
	</p>
</AuthShell>

<style>
	.auth-notice strong {
		display: block;
		margin-bottom: 0.2rem;
		color: #f4efff;
		font-size: 0.82rem;
	}

	.auth-notice p {
		margin: 0;
	}
</style>
