<script lang="ts">
	import { resolve } from '$app/paths';
	import AuthField from '$lib/components/auth/AuthField.svelte';
	import AuthIcon from '$lib/components/auth/AuthIcon.svelte';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';

	let previewSubmitted = $state(false);

	function previewRecovery(event: SubmitEvent) {
		event.preventDefault();
		previewSubmitted = true;
	}
</script>

<svelte:head>
	<title>Recover account | Tecnoesis 2026</title>
	<meta name="description" content="Tecnoesis 2026 account recovery preview." />
</svelte:head>

<AuthShell
	title="Recover Access"
	description="Enter your account email to begin the recovery sequence."
	mode="recovery"
>
	{#if previewSubmitted}
		<div class="auth-notice" role="status" aria-live="polite">
			<AuthIcon name="info" size={18} />
			<div>
				<strong>Recovery preview complete</strong>
				<p>No email was sent. Password recovery is not connected yet.</p>
			</div>
		</div>
	{:else}
		<div class="auth-note">
			<AuthIcon name="info" size={18} />
			<p>UI preview: submitting this form will not send a recovery email yet.</p>
		</div>
	{/if}

	<form class="auth-form" onsubmit={previewRecovery}>
		<AuthField
			label="Account email"
			name="email"
			type="email"
			icon="mail"
			placeholder="Enter your institute email"
			autocomplete="email"
			required
		/>

		<button type="submit" class="auth-button">
			<span>Preview Recovery</span>
			<AuthIcon name="arrow-right" size={20} />
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

	.auth-notice p,
	.auth-note p {
		margin: 0;
	}
</style>
