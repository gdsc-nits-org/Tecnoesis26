<script lang="ts">
	let { form } = $props();
	let showPassword = $state(false);
	let submitting = $state(false);
</script>

<svelte:head><title>Login | Tecnoesis</title></svelte:head>

<main class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
	<div class="mb-8">
		<p class="text-sm font-semibold tracking-[0.25em] text-cyan-600 uppercase">Tecnoesis 2026</p>
		<h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-950">Welcome back</h1>
		<p class="mt-2 text-slate-600">Sign in to continue to your fest account.</p>
	</div>
	{#if form?.error}<p class="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
			{form.error}
		</p>{/if}
	<form method="POST" class="space-y-5" onsubmit={() => (submitting = true)}>
		<label class="block text-sm font-medium text-slate-700"
			>Username<input
				name="username"
				required
				autocomplete="username"
				value={form?.username ?? ''}
				class="mt-2 w-full rounded-md border-slate-300 px-3 py-2.5"
			/></label
		>
		<label class="block text-sm font-medium text-slate-700"
			>Password
			<span class="relative mt-2 block"
				><input
					name="password"
					required
					type={showPassword ? 'text' : 'password'}
					autocomplete="current-password"
					class="w-full rounded-md border-slate-300 px-3 py-2.5 pr-20"
				/><button
					type="button"
					class="absolute top-2.5 right-3 text-sm text-slate-500"
					onclick={() => (showPassword = !showPassword)}>{showPassword ? 'Hide' : 'Show'}</button
				></span
			>
		</label>
		<button
			disabled={submitting}
			class="w-full rounded-md bg-slate-950 px-4 py-3 font-semibold text-white hover:bg-slate-800"
			formaction="?/default">{submitting ? 'Signing in...' : 'Login'}</button
		>
	</form>
	<div class="my-6 flex items-center gap-3 text-xs tracking-widest text-slate-400 uppercase">
		<span class="h-px flex-1 bg-slate-200"></span>or<span class="h-px flex-1 bg-slate-200"></span>
	</div>
	<form method="POST" onsubmit={() => (submitting = true)}>
		<button
			disabled={submitting}
			formaction="?/google"
			class="w-full rounded-md border border-slate-300 px-4 py-3 font-semibold text-slate-800 hover:bg-slate-50"
			>{submitting ? 'Connecting...' : 'Continue with Google'}</button
		>
	</form>
	<p class="mt-8 text-center text-sm text-slate-600">
		New to Tecnoesis? <a class="font-semibold text-cyan-700 hover:underline" href="/signup"
			>Create an account</a
		>
	</p>
</main>
