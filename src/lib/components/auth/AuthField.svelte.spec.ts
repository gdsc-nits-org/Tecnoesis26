import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AuthField from './AuthField.svelte';
import './auth.css';

const hint = '3–24 characters: lowercase letters, numbers, or underscores. Example: mainak123';

describe('AuthField format help', () => {
	it('keeps format help hidden until the info button is clicked', async () => {
		render(AuthField, { label: 'Username', name: 'username', hint, hintAsPopover: true });
		const button = page.getByRole('button', { name: 'Username format' });
		await expect.element(page.getByText(hint)).not.toBeVisible();
		await expect.element(button).toHaveAttribute('type', 'button');
		await button.click();
		await expect.element(page.getByText(hint)).toBeVisible();
		await expect.element(button).toHaveAttribute('aria-expanded', 'true');
		await button.click();
		await expect.element(page.getByText(hint)).not.toBeVisible();
	});

	it('dismisses format help on Escape and when focus leaves the button', async () => {
		render(AuthField, { label: 'Username', name: 'username', hint, hintAsPopover: true });
		const button = page.getByRole('button', { name: 'Username format' });
		await button.click();
		button.element().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		await expect.element(page.getByText(hint)).not.toBeVisible();
		await button.click();
		await page.getByRole('textbox', { name: 'Username', exact: true }).click();
		await expect.element(page.getByText(hint)).not.toBeVisible();
	});

	it('retains inline hints for fields that do not opt into the info button', async () => {
		render(AuthField, { label: 'Password', name: 'password', type: 'password', hint });
		await expect.element(page.getByText(hint)).toBeVisible();
		await expect
			.element(page.getByRole('button', { name: 'Password format' }))
			.not.toBeInTheDocument();
	});
});
