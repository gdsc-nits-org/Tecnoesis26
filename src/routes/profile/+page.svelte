<script lang="ts">
	import { resolve } from '$app/paths';
	import { GENDER_OPTIONS } from '$lib/auth-options';

	let { data, form } = $props();
	let submitting = $state(false);

	const genderLabel = (value: string | null) =>
		GENDER_OPTIONS.find((option) => option.value === value)?.label ?? '—';
</script>

<svelte:head><title>Profile | Tecnoesis</title></svelte:head>

<div class="profile-page">
	<div class="profile-page__backdrop" aria-hidden="true"></div>
	<div class="profile-page__veil" aria-hidden="true"></div>

	<main class="profile-shell">
		<a class="profile-back" href={resolve('/home')}>← Back to home</a>

		<h1 class="profile-title">Your Profile</h1>
		<p class="profile-subtitle">Keep your contact details current for event coordination.</p>

		{#if form?.error}
			<p class="profile-alert profile-alert--error" role="alert">{form.error}</p>
		{/if}
		{#if form?.success}
			<p class="profile-alert profile-alert--ok" role="status">Profile updated.</p>
		{/if}

		<form method="POST" class="profile-form" onsubmit={() => (submitting = true)}>
			<label class="profile-field">
				<span>Full name</span>
				<input name="full_name" value={data.profile!.full_name ?? ''} maxlength={100} />
			</label>

			<label class="profile-field">
				<span>Phone number</span>
				<input
					name="phone_number"
					value={data.profile!.phone_number ?? ''}
					inputmode="numeric"
					maxlength={15}
				/>
			</label>

			<label class="profile-field">
				<span>Hostel</span>
				<input name="hostel_number" value={data.profile!.hostel_number ?? ''} maxlength={40} />
			</label>

			<dl class="profile-readonly">
				<div>
					<dt>Institute email</dt>
					<dd>{data.profile!.institute_email}</dd>
				</div>
				<div>
					<dt>Scholar ID</dt>
					<dd>{data.profile!.scholar_id ?? '—'}</dd>
				</div>
				<div>
					<dt>Gender</dt>
					<dd>{genderLabel(data.profile!.gender)}</dd>
				</div>
				<div>
					<dt>Signed in with</dt>
					<dd>{data.profile!.auth_provider}</dd>
				</div>
			</dl>

			<button class="profile-save" disabled={submitting}>
				{submitting ? 'Saving…' : 'Save profile'}
			</button>
		</form>
	</main>
</div>

<style>
	.profile-page {
		position: relative;
		/* isolate + non-negative layers: a z-index:-2 backdrop paints behind the
		   root layout's own background colour, which hid the artwork entirely. */
		isolation: isolate;
		min-height: 100svh;
		padding: clamp(84px, 14vw, 120px) 1rem clamp(96px, 18vw, 120px);
		color: #f4efff;
		font-family: 'Bruno Ace', sans-serif;
	}

	.profile-page__backdrop {
		position: fixed;
		z-index: 0;
		inset: 0;
		background-image: url('/background.jpg');
		background-position: center;
		background-size: cover;
		filter: saturate(1.1);
	}

	/* Keeps the form readable over the artwork without hiding it. */
	.profile-page__veil {
		position: fixed;
		z-index: 1;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(9, 6, 45, 0.5), rgba(9, 6, 45, 0.74)),
			radial-gradient(circle at 50% 18%, rgba(168, 85, 247, 0.2), transparent 55%);
	}

	.profile-shell {
		position: relative;
		z-index: 2;
		width: min(100%, 620px);
		margin: 0 auto;
		padding: clamp(1.4rem, 5vw, 2.4rem);
		border: 1px solid rgba(170, 116, 255, 0.28);
		border-radius: 14px;
		background: rgba(16, 12, 62, 0.72);
		box-shadow: 0 24px 60px rgba(4, 2, 30, 0.5);
		backdrop-filter: blur(10px);
	}

	.profile-back {
		color: #d9a7ff;
		font-size: 0.76rem;
		text-decoration: none;
	}

	.profile-back:hover,
	.profile-back:focus-visible {
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.profile-title {
		margin: 1rem 0 0.4rem;
		font-size: clamp(1.6rem, 6.5vw, 2.2rem);
		line-height: 1.15;
		letter-spacing: 0.02em;
	}

	.profile-subtitle {
		margin: 0;
		color: rgba(226, 214, 250, 0.72);
		font-size: clamp(0.76rem, 3.2vw, 0.85rem);
		line-height: 1.55;
	}

	.profile-alert {
		margin: 1.2rem 0 0;
		padding: 0.75rem 0.9rem;
		border: 1px solid transparent;
		border-radius: 8px;
		font-size: 0.78rem;
		line-height: 1.5;
	}

	.profile-alert--error {
		border-color: rgba(255, 128, 168, 0.45);
		background: rgba(120, 22, 60, 0.4);
		color: #ffd7e4;
	}

	.profile-alert--ok {
		border-color: rgba(122, 240, 190, 0.42);
		background: rgba(14, 92, 68, 0.4);
		color: #ccffeb;
	}

	.profile-form {
		display: grid;
		margin-top: 1.6rem;
		gap: 1.1rem;
	}

	.profile-field {
		display: grid;
		gap: 0.45rem;
	}

	.profile-field span {
		color: rgba(222, 208, 250, 0.82);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.profile-field input {
		width: 100%;
		min-height: 46px;
		padding: 0 0.9rem;
		border: 1.5px solid #9152ee;
		border-radius: 6px;
		background: rgba(27, 24, 91, 0.62);
		color: #f6f1ff;
		font-family: inherit;
		font-size: 0.82rem;
	}

	.profile-field input:focus {
		border-color: #d48cff;
		background: rgba(37, 28, 112, 0.72);
		outline: none;
		box-shadow: 0 0 0 2px rgba(162, 79, 255, 0.18);
	}

	.profile-readonly {
		display: grid;
		margin: 0;
		padding: 1rem;
		border: 1px solid rgba(170, 116, 255, 0.2);
		border-radius: 8px;
		background: rgba(9, 7, 48, 0.55);
		gap: 0.85rem;
	}

	.profile-readonly dt {
		color: rgba(222, 208, 250, 0.7);
		font-size: 0.66rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.profile-readonly dd {
		margin: 0.25rem 0 0;
		color: #f2ecff;
		font-size: 0.8rem;
		overflow-wrap: anywhere;
	}

	.profile-save {
		min-height: 48px;
		margin-top: 0.3rem;
		border: 0;
		border-radius: 6px;
		background: linear-gradient(120deg, #7a33e0, #b455ff);
		color: #fff;
		cursor: pointer;
		font-family: inherit;
		font-size: 0.82rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.profile-save:hover:not(:disabled),
	.profile-save:focus-visible:not(:disabled) {
		filter: brightness(1.12);
	}

	.profile-save:disabled {
		cursor: progress;
		opacity: 0.65;
	}

	@media (min-width: 620px) {
		.profile-readonly {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
