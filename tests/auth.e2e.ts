import { expect, test } from '@playwright/test';

const origin = 'http://localhost:4173';

test('forgot password rejects an outside email without sending mail', async ({ page }) => {
	await page.goto(`${origin}/forgot-password`);
	await page.getByLabel('Account email', { exact: true }).fill('student@gmail.com');
	await page.getByRole('button', { name: 'Send Reset Link' }).click();
	await expect(page.getByRole('alert')).toContainText('.nits.ac.in');
	await expect(page.getByRole('button', { name: 'Send Reset Link' })).toBeEnabled();
});

test('an anonymous visitor cannot see the password-update form', async ({ page }) => {
	await page.goto(`${origin}/reset-password`);
	await expect(page.getByRole('alert')).toContainText('invalid or expired');
	await expect(page.getByRole('link', { name: 'Request a New Reset Link' })).toBeVisible();
	await expect(page.getByLabel('New password', { exact: true })).toHaveCount(0);
});

test('a callback without a code shows a recovery error, not the home page', async ({ page }) => {
	await page.goto(`${origin}/auth/callback?next=/reset-password`);
	await expect(page).toHaveURL(`${origin}/reset-password?error=invalid`);
	await expect(page.getByRole('alert')).toContainText('invalid or expired');
});

test('login shows the password-change confirmation and working recovery link', async ({ page }) => {
	await page.goto(`${origin}/login?reset=success`);
	await expect(page.getByRole('status')).toContainText('Password updated');
	await page.getByRole('link', { name: 'Forgot password?' }).click();
	await expect(page).toHaveURL(`${origin}/forgot-password`);
	await expect(page.getByRole('button', { name: 'Send Reset Link' })).toBeVisible();
});

test('recovery validation also works without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	try {
		await page.goto(`${origin}/forgot-password`);
		await page.getByLabel('Account email', { exact: true }).fill('student@gmail.com');
		await page.getByRole('button', { name: 'Send Reset Link' }).click();
		await expect(page.getByRole('alert')).toContainText('.nits.ac.in');
	} finally {
		await context.close();
	}
});
