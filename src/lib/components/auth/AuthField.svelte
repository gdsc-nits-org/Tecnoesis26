<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import AuthIcon from './AuthIcon.svelte';

	interface Props {
		label: string;
		name: string;
		type?: HTMLInputAttributes['type'];
		icon?: string;
		placeholder?: string;
		value?: string;
		autocomplete?: HTMLInputAttributes['autocomplete'];
		required?: boolean;
		readonly?: boolean;
		minlength?: number;
		maxlength?: number;
		pattern?: string;
		hint?: string;
	}

	let {
		label,
		name,
		type = 'text',
		icon,
		placeholder = '',
		value = $bindable(''),
		autocomplete,
		required = false,
		readonly = false,
		minlength,
		maxlength,
		pattern,
		hint
	}: Props = $props();

	let passwordVisible = $state(false);
	let inputId = $derived(`auth-${name.replace(/[^a-zA-Z0-9_-]/g, '-')}`);
	let hintId = $derived(`${inputId}-hint`);
	let isPasswordField = $derived(type === 'password');
	let resolvedType = $derived(isPasswordField && passwordVisible ? 'text' : type);
</script>

<div class="auth-field">
	<label class="auth-field__label" for={inputId}>{label}</label>
	<div class:auth-field__control--readonly={readonly} class="auth-field__control">
		{#if icon}
			<span class="auth-field__icon"><AuthIcon name={icon} size={20} /></span>
		{/if}
		<input
			id={inputId}
			class:auth-field__input--with-icon={icon}
			class:auth-field__input--password={isPasswordField}
			class="auth-field__input"
			{name}
			type={resolvedType}
			{placeholder}
			bind:value
			{autocomplete}
			{required}
			{readonly}
			{minlength}
			{maxlength}
			{pattern}
			aria-describedby={hint ? hintId : undefined}
		/>
		{#if isPasswordField}
			<button
				class="auth-field__reveal"
				type="button"
				aria-label={passwordVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
				aria-pressed={passwordVisible}
				onclick={() => (passwordVisible = !passwordVisible)}
			>
				<AuthIcon name={passwordVisible ? 'eye-off' : 'eye'} size={19} />
			</button>
		{/if}
	</div>
	{#if hint}
		<p class="auth-field__hint" id={hintId}>{hint}</p>
	{/if}
</div>
