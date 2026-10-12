import { expect, test } from '@playwright/test';

const origin = 'http://localhost:4173';

// Every public route, at the widths real visitors use. A page that scrolls
// sideways is the single most visible responsive failure, and it is easy to
// reintroduce: an unconstrained flex child (a w-max marquee, a wide grid) will
// happily push the document wider than the screen without any warning at build
// time. These tests pin that down.
const ROUTES = ['/', '/home', '/gallery', '/modules', '/spark', '/team', '/login', '/signup'];

const VIEWPORTS = [
	{ name: 'phone-sm', width: 360, height: 740 },
	{ name: 'phone', width: 390, height: 844 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'laptop', width: 1280, height: 800 },
	{ name: 'wide', width: 1920, height: 1080 }
];

for (const viewport of VIEWPORTS) {
	test(`no horizontal scrolling at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
		await page.setViewportSize({ width: viewport.width, height: viewport.height });
		for (const route of ROUTES) {
			await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
			await page.waitForTimeout(400);
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - window.innerWidth
			);
			expect(overflow, `${route} scrolls sideways by ${overflow}px`).toBeLessThanOrEqual(2);
		}
	});
}

test('the mobile menu reveals every link', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(`${origin}/home`, { waitUntil: 'domcontentloaded' });
	await page.getByRole('button', { name: 'Toggle navigation' }).click();

	// A row-direction flex menu puts most links off-screen while still reporting
	// them visible, so assert each one is actually inside the viewport.
	const links = page.locator('.site-header__nav a');
	await expect(links).toHaveCount(5);
	for (let i = 0; i < 5; i += 1) {
		const box = await links.nth(i).boundingBox();
		expect(box, 'menu link has no box').not.toBeNull();
		expect(box!.y).toBeGreaterThanOrEqual(0);
		expect(box!.y + box!.height).toBeLessThanOrEqual(844);
		expect(box!.x + box!.width).toBeLessThanOrEqual(390);
	}
});

test('the fixed social bar does not cover the last section on phones', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(`${origin}/home`, { waitUntil: 'domcontentloaded' });
	await page.waitForTimeout(800);
	await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
	await page.waitForTimeout(600);

	const overlaps = await page.evaluate(() => {
		const bar = document.querySelector('a[aria-label="Instagram"]')?.parentElement;
		const heading = [...document.querySelectorAll('h2')].find((h) =>
			h.textContent?.includes('Previous')
		);
		if (!bar || !heading?.parentElement) return null;
		const b = bar.getBoundingClientRect();
		const m = heading.parentElement.getBoundingClientRect();
		return b.top < m.bottom && b.bottom > m.top;
	});
	expect(overlaps, 'social icons overlap the Previous Sponsors marquee').toBe(false);
});

test('signed-out visitors see Log in, not an account chip', async ({ page }) => {
	await page.goto(`${origin}/home`, { waitUntil: 'domcontentloaded' });
	await expect(page.locator('.site-header__login')).toBeVisible();
	await expect(page.locator('.site-header__account')).toHaveCount(0);
});
