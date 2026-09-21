<script lang="ts">
	import { resolve } from '$app/paths';
	import { GENDER_OPTIONS } from '$lib/auth-options';

	let { data, form } = $props();
	let submitting = $state(false);

	const genderLabel = (value: string | null) =>
		GENDER_OPTIONS.find((option) => option.value === value)?.label ?? '--';
</script>

<svelte:head><title>Profile | Tecnoesis</title></svelte:head>

<main class="mx-auto max-w-2xl px-6 py-14">
	<a href={resolve('/home')} class="text-sm font-semibold text-cyan-700 hover:underline"
		>Back to home</a
	>
	<h1 class="mt-5 text-4xl font-bold tracking-tight text-slate-950">Your profile</h1>
	<p class="mt-2 text-slate-600">Keep your contact details current for event coordination.</p>
	{#if form?.error}<p class="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
			{form.error}
		</p>{/if}
	{#if form?.success}<p
			class="mt-6 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
			role="status"
		>
			Profile updated.
		</p>{/if}
	<form
		method="POST"
		enctype="multipart/form-data"
		class="mt-8 space-y-5"
		onsubmit={() => (submitting = true)}
	>
		<label class="block text-sm font-medium text-slate-700"
			>Full name<input
				name="full_name"
				value={data.profile!.full_name ?? ''}
				class="mt-2 w-full rounded-md border-slate-300 px-3 py-2.5"
			/></label
		>
		<label class="block text-sm font-medium text-slate-700"
			>Phone number<input
				name="phone_number"
				value={data.profile!.phone_number ?? ''}
				inputmode="tel"
				class="mt-2 w-full rounded-md border-slate-300 px-3 py-2.5"
			/></label
		>
		<label class="block text-sm font-medium text-slate-700"
			>Hostel number<input
				name="hostel_number"
				value={data.profile!.hostel_number ?? ''}
				class="mt-2 w-full rounded-md border-slate-300 px-3 py-2.5"
			/></label
		>
		<label class="block text-sm font-medium text-slate-700"
			>Profile image<input
				name="image"
				type="file"
				accept="image/jpeg,image/png,image/webp"
				class="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm"
			/></label
		>
		<div class="grid gap-3 rounded-md bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
			<p><strong>Institute email</strong><br />{data.profile!.institute_email}</p>
			<p><strong>Scholar ID</strong><br />{data.profile!.scholar_id ?? '--'}</p>
			<p><strong>Gender</strong><br />{genderLabel(data.profile!.gender)}</p>
			<p><strong>Provider</strong><br />{data.profile!.auth_provider}</p>
		</div>
		<button
			disabled={submitting}
			class="w-full rounded-md bg-slate-950 px-4 py-3 font-semibold text-white hover:bg-slate-800"
			>{submitting ? 'Saving...' : 'Save profile'}</button
		>
	</form>
</main>
