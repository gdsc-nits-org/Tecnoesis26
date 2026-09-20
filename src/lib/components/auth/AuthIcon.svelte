<script lang="ts">
	interface Props {
		name: string;
		size?: number | string;
	}

	let { name, size = 20 }: Props = $props();
</script>

<svg
	class="auth-icon"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
	focusable="false"
>
	{#if name === 'google'}
		<path
			d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.232c1.891-1.742 2.981-4.31 2.981-7.351Z"
			fill="#4285F4"
		/>
		<path
			d="M12 22c2.7 0 4.964-.895 6.619-2.423l-3.232-2.509c-.895.6-2.041.955-3.387.955-2.605 0-4.81-1.759-5.6-4.123H3.059v2.591A9.997 9.997 0 0 0 12 22Z"
			fill="#34A853"
		/>
		<path
			d="M6.4 13.9A6.01 6.01 0 0 1 6.087 12c0-.659.114-1.3.313-1.9V7.509H3.059A9.997 9.997 0 0 0 2 12c0 1.614.386 3.141 1.059 4.491L6.4 13.9Z"
			fill="#FBBC05"
		/>
		<path
			d="M12 5.977c1.468 0 2.786.505 3.827 1.496l2.864-2.864C16.959 2.995 14.695 2 12 2a9.997 9.997 0 0 0-8.941 5.509L6.4 10.1c.791-2.364 2.995-4.123 5.6-4.123Z"
			fill="#EA4335"
		/>
	{:else if name === 'user'}
		<circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.7" />
		<path
			d="M5.5 20c.45-3.45 2.85-5.5 6.5-5.5s6.05 2.05 6.5 5.5"
			stroke="currentColor"
			stroke-width="1.7"
			stroke-linecap="round"
		/>
	{:else if name === 'lock'}
		<rect x="5.5" y="10" width="13" height="10" rx="2" stroke="currentColor" stroke-width="1.7" />
		<path
			d="M8.5 10V7.4a3.5 3.5 0 0 1 7 0V10M12 14v2.5"
			stroke="currentColor"
			stroke-width="1.7"
			stroke-linecap="round"
		/>
	{:else if name === 'mail'}
		<rect x="3" y="5.5" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.7" />
		<path
			d="m4.5 7 7.5 6 7.5-6"
			stroke="currentColor"
			stroke-width="1.7"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{:else if name === 'id-card'}
		<rect x="2.75" y="5" width="18.5" height="14" rx="2" stroke="currentColor" stroke-width="1.6" />
		<circle cx="8" cy="10.5" r="2" stroke="currentColor" stroke-width="1.5" />
		<path
			d="M5.25 16c.35-1.75 1.25-2.65 2.75-2.65s2.4.9 2.75 2.65M13.5 9.5h4.75M13.5 13h4.75M13.5 16.5h3"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
		/>
	{:else if name === 'eye'}
		<path
			d="M2.5 12s3.4-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.4 5.5-9.5 5.5S2.5 12 2.5 12Z"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linejoin="round"
		/>
		<circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.6" />
	{:else if name === 'eye-off'}
		<path
			d="m3 3 18 18M10.2 6.7c.58-.13 1.18-.2 1.8-.2 6.1 0 9.5 5.5 9.5 5.5a15 15 0 0 1-2.25 2.85M6.15 7.8A15.2 15.2 0 0 0 2.5 12s3.4 5.5 9.5 5.5c1.42 0 2.69-.3 3.8-.76M9.8 9.8a3.1 3.1 0 0 0 4.4 4.4"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{:else if name === 'arrow-right'}
		<path
			d="M4 12h15M14 6.5l5.5 5.5-5.5 5.5"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{:else if name === 'check'}
		<path
			d="m4.5 12.5 4.5 4.5L19.5 6.5"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{:else if name === 'info'}
		<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" />
		<path
			d="M12 10.5V17M12 7.25v.25"
			stroke="currentColor"
			stroke-width="1.9"
			stroke-linecap="round"
		/>
	{:else}
		<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7" />
	{/if}
</svg>

<style>
	.auth-icon {
		display: block;
		flex: 0 0 auto;
	}
</style>
