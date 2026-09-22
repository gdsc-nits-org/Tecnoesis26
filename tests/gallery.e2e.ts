import { expect, test, type Page } from '@playwright/test';

const origin = process.env.GALLERY_TEST_ORIGIN || 'http://localhost:4173';

function collectionPhotos(page: Page) {
	return page
		.getByRole('region', { name: 'Photo collection', exact: true })
		.getByRole('button', { name: /^Open .+ photo \d+$/ });
}

async function openGallery(page: Page) {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto(`${origin}/gallery`, { waitUntil: 'domcontentloaded' });
	await expect(page.getByRole('heading', { level: 1, name: 'You had to be there.' })).toBeVisible();
	await expect(collectionPhotos(page)).toHaveCount(25);
	// SSR markup can be visible before Svelte hydrates. Wait for a real, idempotent
	// interaction rather than blocking on externally hosted images or using a sleep.
	const stageFilter = page.getByRole('button', { name: /^On stage/ });
	await expect(async () => {
		await stageFilter.click();
		await expect(stageFilter).toHaveAttribute('aria-pressed', 'true', { timeout: 500 });
	}).toPass({ timeout: 10_000 });
	await page.getByRole('button', { name: /^All moments/ }).click();
	await expect(collectionPhotos(page)).toHaveCount(25);
}

test('the gallery initially shows all 25 final photographs', async ({ page }) => {
	await openGallery(page);
	await expect(page.getByRole('button', { name: /^All moments/ })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await expect(collectionPhotos(page).first()).toBeVisible();
	await expect(collectionPhotos(page).last()).toBeVisible();
});

test('category filters show their own photographs and return to the full collection', async ({
	page
}) => {
	await openGallery(page);
	const categories = [
		{ name: /^On stage/, count: 8 },
		{ name: /^The arena/, count: 11 },
		{ name: /^Campus stories/, count: 6 }
	];

	for (const category of categories) {
		const filter = page.getByRole('button', { name: category.name });
		await filter.click();
		await expect(filter).toHaveAttribute('aria-pressed', 'true');
		await expect(page.getByRole('button', { name: /^All moments/ })).toHaveAttribute(
			'aria-pressed',
			'false'
		);
		await expect(collectionPhotos(page)).toHaveCount(category.count);
		await expect(collectionPhotos(page).first()).toBeVisible();
	}

	await page.getByRole('button', { name: /^All moments/ }).click();
	await expect(collectionPhotos(page)).toHaveCount(25);
	for (const category of categories) {
		await expect(page.getByRole('button', { name: category.name })).toHaveAttribute(
			'aria-pressed',
			'false'
		);
	}
});

test('the photo viewer supports buttons, arrow keys, and Escape', async ({ page }) => {
	await openGallery(page);
	const opener = collectionPhotos(page).first();
	await opener.focus();
	await page.keyboard.press('Enter');
	const viewer = page.getByRole('dialog', { name: 'Photo viewer', exact: true });
	await expect(viewer).toBeVisible();
	const counter = viewer.getByTestId('viewer-count');
	await expect(counter).not.toHaveText('');
	const firstCount = (await counter.textContent())!;

	await viewer.getByRole('button', { name: 'Next photo', exact: true }).click();
	await expect(counter).not.toHaveText(firstCount);
	const secondCount = (await counter.textContent())!;
	await viewer.getByRole('button', { name: 'Previous photo', exact: true }).click();
	await expect(counter).toHaveText(firstCount);

	await page.keyboard.press('ArrowRight');
	await expect(counter).toHaveText(secondCount);
	await page.keyboard.press('ArrowLeft');
	await expect(counter).toHaveText(firstCount);
	await page.keyboard.press('Escape');
	await expect(viewer).not.toBeVisible();
	await expect(opener).toBeFocused();
});

test('closing the viewer returns focus and restores page scrolling', async ({ page }) => {
	await openGallery(page);
	const opener = collectionPhotos(page).first();
	await opener.scrollIntoViewIfNeeded();
	await opener.focus();
	const originalOverflow = await page.evaluate(() => ({
		body: getComputedStyle(document.body).overflow,
		root: getComputedStyle(document.documentElement).overflow
	}));
	await page.keyboard.press('Enter');
	const viewer = page.getByRole('dialog', { name: 'Photo viewer', exact: true });
	await expect(viewer).toBeVisible();
	await viewer.getByRole('button', { name: 'Close photo viewer', exact: true }).click();
	await expect(viewer).not.toBeVisible();
	await expect(opener).toBeFocused();
	await expect
		.poll(() =>
			page.evaluate(() => ({
				body: getComputedStyle(document.body).overflow,
				root: getComputedStyle(document.documentElement).overflow
			}))
		)
		.toEqual(originalOverflow);

	const previousScroll = await page.evaluate(() => window.scrollY);
	await page.mouse.move(20, 400);
	await page.mouse.wheel(0, 200);
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(previousScroll);
});

for (const width of [320, 390, 768, 1440]) {
	test(`the gallery and viewer fit a ${width}px viewport`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await openGallery(page);
		const horizontalOverflow = () =>
			page.evaluate(
				() =>
					Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
					window.innerWidth
			);
		await expect.poll(horizontalOverflow).toBeLessThanOrEqual(1);
		await expect(collectionPhotos(page).first()).toBeVisible();
		await expect(collectionPhotos(page).last()).toBeVisible();

		await collectionPhotos(page).first().click();
		const viewer = page.getByRole('dialog', { name: 'Photo viewer', exact: true });
		await expect(viewer).toBeVisible();
		await expect.poll(horizontalOverflow).toBeLessThanOrEqual(1);
		await expect(viewer.getByRole('button', { name: 'Close photo viewer' })).toBeInViewport();
		await expect(viewer.getByRole('button', { name: 'Previous photo' })).toBeInViewport();
		await expect(viewer.getByRole('button', { name: 'Next photo' })).toBeInViewport();
		await viewer.getByRole('button', { name: 'Close photo viewer' }).click();
		await expect(viewer).not.toBeVisible();
	});
}
