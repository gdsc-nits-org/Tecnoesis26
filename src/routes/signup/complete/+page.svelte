<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AuthField from '$lib/components/auth/AuthField.svelte';
	import AuthIcon from '$lib/components/auth/AuthIcon.svelte';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { GENDER_OPTIONS } from '$lib/auth-options';

	let { data, form } = $props();
	let submitting = $state(false);

	const enhanceProfile: SubmitFunction = () => {
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
			label="Full name"
			name="full_name"
			icon="user"
			placeholder="Enter your name"
			value={form?.fullName ?? data.fullName ?? ''}
			autocomplete="name"
			maxlength={100}
			hint="Filled in from your Google account - edit it if it is not quite right."
			required
		/>

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
				label="Phone number"
				name="phone_number"
				type="tel"
				icon="user"
				placeholder="10-digit number"
				value={form?.phoneNumber ?? ''}
				autocomplete="tel"
				inputmode="numeric"
				maxlength={15}
				hint="Exactly 10 digits. A +91 prefix is fine, we will trim it."
				hintAsPopover
				required
			/>

			<AuthField
				label="Scholar ID"
				name="scholar_id"
				icon="id-card"
				placeholder="Enter your scholar ID"
				value={form?.scholarId ?? ''}
				maxlength={20}
				required
			/>
		</div>

		<div class="auth-field-row">
			<AuthField
				label="Hostel"
				name="hostel_number"
				icon="lock"
				placeholder="Hostel name or number"
				value={form?.hostelNumber ?? ''}
				maxlength={40}
				required
			/>

			<AuthField
				label="Gender"
				name="gender"
				icon="user"
				placeholder="Select gender"
				value={form?.gender ?? ''}
				options={GENDER_OPTIONS}
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
			maxlength={128}
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
			maxlength={128}
			required
		/>

		<button type="submit" class="auth-button" disabled={submitting}>
			<span>{submitting ? 'Creating profile...' : 'Complete Registration'}</span>
			{#if !submitting}<AuthIcon name="arrow-right" size={20} />{/if}
		</button>
	</form>
</AuthShell>
