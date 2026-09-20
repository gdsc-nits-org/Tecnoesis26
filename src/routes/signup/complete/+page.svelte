<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AuthField from '$lib/components/auth/AuthField.svelte';
	import AuthIcon from '$lib/components/auth/AuthIcon.svelte';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';

	let { data, form } = $props();
	let submitting = $state(false);

	const enhanceProfile: SubmitFunction = () => {
		submitting = true;
		return async ({ update }) => {
			await update();
			submitting = false;
		};
	};
</script>

<svelte:head>
	<title>Complete registration | Tecnoesis 2026</title>
	<meta name="description" content="Complete your Tecnoesis 2026 participant profile." />
</svelte:head>

<AuthShell
	title="Complete Your Profile"
	description="One last transmission before you enter the Tecnoesis universe."
	mode="signup"
	compact
>
	{#if form?.error}
		<div class="auth-error" role="alert">
			<AuthIcon name="info" size={18} />
			<span>{form.error}</span>
		</div>
	{/if}

	<form method="POST" class="auth-form" use:enhance={enhanceProfile} aria-busy={submitting}>
		<AuthField
			label="Institute Google account"
			name="institute_email"
			type="email"
			icon="mail"
			value={data.email ?? ''}
			autocomplete="email"
			readonly
		/>

		<div class="auth-field-row">
			<AuthField
				label="Username"
				name="username"
				icon="user"
				placeholder="Choose a username"
				value={form?.username ?? ''}
				autocomplete="username"
				minlength={3}
				maxlength={24}
				pattern={'[a-z0-9_]{3,24}'}
				required
			/>

			<AuthField
				label="Scholar ID"
				name="scholar_id"
				icon="id-card"
				placeholder="Enter your Scholar ID"
				value={form?.scholarId ?? ''}
				autocomplete="off"
				required
			/>
		</div>

		<AuthField
			label="Password"
			name="password"
			type="password"
			icon="lock"
			placeholder="Create a password"
			autocomplete="new-password"
			minlength={8}
			hint="8+ characters with uppercase, lowercase, and a number"
			required
		/>

		<AuthField
			label="Confirm password"
			name="confirm_password"
			type="password"
			icon="lock"
			placeholder="Enter your password again"
			autocomplete="new-password"
			minlength={8}
			required
		/>

		<button type="submit" class="auth-button" disabled={submitting}>
			<span>{submitting ? 'Creating profile...' : 'Complete Registration'}</span>
			{#if !submitting}<AuthIcon name="arrow-right" size={20} />{/if}
		</button>
	</form>
</AuthShell>
