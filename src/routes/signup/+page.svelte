<script lang="ts">
	let { form } = $props();
	let submitting = $state(false);
</script>

<svelte:head><title>Sign up | Tecnoesis</title></svelte:head>

<main class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
	<p class="text-sm font-semibold tracking-[0.25em] text-cyan-600 uppercase">Tecnoesis 2026</p>
	<h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-950">Join the fest</h1>
	<p class="mt-2 text-slate-600">
		Use your institute Google account to create your Tecnoesis profile.
	</p>
	{#if form?.error}<p class="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
			{form.error}
		</p>{/if}
	<form method="POST" class="mt-8" onsubmit={() => (submitting = true)}>
		<button
			disabled={submitting}
			formaction="?/google"
			class="w-full rounded-md bg-slate-950 px-4 py-3 font-semibold text-white hover:bg-slate-800"
			>{submitting ? 'Connecting...' : 'Continue with Google'}</button
		>
	</form>
	<p class="mt-8 text-center text-sm text-slate-600">
		Already registered? <a class="font-semibold text-cyan-700 hover:underline" href="/login"
			>Log in</a
		>
	</p>
</main>
