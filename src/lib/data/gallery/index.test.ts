import { describe, expect, it } from 'vitest';
import mobileImages from './mobile.json';
import tabletImages from './tablet.json';
import desktopImages from './desktop.json';
import ultraImages from './4k.json';
import { categories, formatGalleryDate, photos } from './index';

describe('gallery collection', () => {
	it('preserves all 25 unique image IDs in their original order', () => {
		expect(photos.map((photo) => photo.id)).toEqual(desktopImages.map((image) => image.id));
		expect(photos).toHaveLength(25);
		expect(new Set(photos.map((photo) => photo.id)).size).toBe(25);
		expect(new Set(photos.map((photo) => photo.src)).size).toBe(25);
	});

	it.each([
		['mobile', mobileImages],
		['tablet', tabletImages],
		['desktop', desktopImages],
		['ultra', ultraImages]
	] as const)(
		'preserves every exact %s URL, including case and filename suffixes',
		(tier, images) => {
			for (const image of images) {
				const photo = photos.find((item) => item.id === image.id);
				expect(photo?.sources[tier]).toBe(image.src);
				expect(photo?.date).toBe(image.date);
			}
		}
	);

	it('keeps desktop URLs as the fallback source', () => {
		expect(photos.map((photo) => photo.src)).toEqual(desktopImages.map((image) => image.src));
	});

	it('organizes images into the expected non-overlapping categories', () => {
		expect(categories).toEqual(['All moments', 'On stage', 'The arena', 'Campus stories']);
		expect(
			photos.filter((photo) => photo.category === 'On stage').map((photo) => photo.id)
		).toEqual([3, 10, 11, 19, 20, 21, 22, 23]);
		expect(
			photos.filter((photo) => photo.category === 'The arena').map((photo) => photo.id)
		).toEqual([1, 2, 4, 5, 7, 9, 12, 13, 14, 17, 24]);
		expect(
			photos.filter((photo) => photo.category === 'Campus stories').map((photo) => photo.id)
		).toEqual([6, 8, 15, 16, 18, 25]);
	});

	it('provides natural aspect ratios for every photo', () => {
		expect(photos.map((photo) => photo.width)).toEqual(Array(25).fill(1080));
		expect(photos.map((photo) => photo.height)).toEqual([
			1440, 810, 1620, 1350, 810, 720, 810, 810, 810, 1350, 1350, 864, 720, 810, 1350, 811, 864,
			810, 1620, 720, 1440, 720, 1440, 810, 720
		]);
	});

	it('uses readable display titles without changing the source metadata', () => {
		expect(photos[0].title).toBe('Laser tag');
		expect(photos[4].title).toBe('Vanguard Arena');
		expect(photos[18].title).toBe('Spark Night');
		expect(desktopImages[0].title).toBe('LaserTag');
	});
});

describe('formatGalleryDate', () => {
	it.each([
		['13.03.2026', '13 MAR 2026'],
		['09.03.2026', '09 MAR 2026'],
		['01.01.2026', '01 JAN 2026'],
		['31.12.2026', '31 DEC 2026'],
		['29.02.2024', '29 FEB 2024']
	])('formats %s as %s without local-time conversion', (input, expected) => {
		expect(formatGalleryDate(input)).toBe(expected);
	});

	it.each(['', 'not a date', '2026-03-13', '31.02.2026', '00.03.2026', '01.13.2026'])(
		'leaves invalid source date %s unchanged',
		(input) => {
			expect(formatGalleryDate(input)).toBe(input);
		}
	);
});
