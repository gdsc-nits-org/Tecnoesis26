<script lang="ts">
	let { data, form } = $props();
	let showPassword = $state(false);
	let showConfirm = $state(false);
	let submitting = $state(false);
</script>

<svelte:head><title>Complete registration | Tecnoesis</title></svelte:head>

<main class="mx-auto max-w-xl px-6 py-14">
	<p class="text-sm font-semibold tracking-[0.25em] text-cyan-600 uppercase">One last step</p>
	<h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-950">Complete your profile</h1>
	<p class="mt-2 text-slate-600">
		Your Google account verifies your institute identity. Choose the credentials you will use at
		Tecnoesis.
	</p>
	{#if form?.error}<p class="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
			{form.error}
		</p>{/if}
	<form method="POST" class="mt-8 space-y-5" onsubmit={() => (submitting = true)}>
		<label class="block text-sm font-medium text-slate-700"
			>Google account<input
				value={data.email}
				readonly
				class="mt-2 w-full rounded-md border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-500"
			/></label
		>
		<label class="block text-sm font-medium text-slate-700"
			>Username<input
				name="username"
				required
				minlength="3"
				maxlength="24"
				value={form?.username ?? ''}
				class="mt-2 w-full rounded-md border-slate-300 px-3 py-2.5"
			/></label
		>
		<label class="block text-sm font-medium text-slate-700"
			>Scholar ID<input
				name="scholar_id"
				required
				value={form?.scholarId ?? ''}
				class="mt-2 w-full rounded-md border-slate-300 px-3 py-2.5"
			/></label
		>
		<label class="block text-sm font-medium text-slate-700"
			>Password<span class="relative mt-2 block"
				><input
					name="password"
					required
					type={showPassword ? 'text' : 'password'}
					class="w-full rounded-md border-slate-300 px-3 py-2.5 pr-20"
				/><button
					type="button"
					class="absolute top-2.5 right-3 text-sm text-slate-500"
					onclick={() => (showPassword = !showPassword)}>{showPassword ? 'Hide' : 'Show'}</button
				></span
			></label
		>
		<label class="block text-sm font-medium text-slate-700"
			>Confirm password<span class="relative mt-2 block"
				><input
					name="confirm_password"
					required
					type={showConfirm ? 'text' : 'password'}
					class="w-full rounded-md border-slate-300 px-3 py-2.5 pr-20"
				/><button
					type="button"
					class="absolute top-2.5 right-3 text-sm text-slate-500"
					onclick={() => (showConfirm = !showConfirm)}>{showConfirm ? 'Hide' : 'Show'}</button
				></span
			></label
		>
		<button
			disabled={submitting}
			class="w-full rounded-md bg-slate-950 px-4 py-3 font-semibold text-white hover:bg-slate-800"
			>{submitting ? 'Creating profile...' : 'Complete registration'}</button
		>
	</form>
</main>
