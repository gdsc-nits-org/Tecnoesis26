import mobileImages from './mobile.json';
import tabletImages from './tablet.json';
import desktopImages from './desktop.json';
import ultraImages from './4k.json';

export const categories = ['All moments', 'On stage', 'The arena', 'Campus stories'] as const;

export type GalleryCategory = (typeof categories)[number];

export type GalleryPhoto = {
	id: number;
	title: string;
	date: string;
	category: Exclude<GalleryCategory, 'All moments'>;
	width: number;
	height: number;
	src: string;
	sources: {
		mobile: string;
		tablet: string;
		desktop: string;
		ultra: string;
	};
};

const displayTitles: Record<string, string> = {
	LaserTag: 'Laser tag',
	RoboDrift: 'Robo drift',
	'Comedy-Night': 'Comedy night',
	'VANGUARD-Arena': 'Vanguard Arena',
	'Foto-Galleria': 'Foto Galleria',
	RoboSoccer: 'Robo soccer',
	'Nexus Creativa': 'Nexus Creativa',
	'Opening Ceremony': 'Opening ceremony',
	Robowar: 'Robowar',
	Algomaze: 'Algomaze',
	Conferenza: 'Conferenza',
	'School-Genius': 'School Genius',
	SparkNight: 'Spark Night',
	'DJ-Night': 'DJ Night',
	Electromap: 'Electromap'
};

const stageIds = new Set([3, 10, 11, 19, 20, 21, 22, 23]);
const arenaIds = new Set([1, 2, 4, 5, 7, 9, 12, 13, 14, 17, 24]);

// Dimensions describe the mobile exports' natural aspect ratios, shared by all
// four tiers. They reserve layout space without claiming desktop pixel widths.
const imageHeights = [
	1440, 810, 1620, 1350, 810, 720, 810, 810, 810, 1350, 1350, 864, 720, 810, 1350, 811, 864, 810,
	1620, 720, 1440, 720, 1440, 810, 720
];

function sourceFor(images: { id: number; src: string }[], id: number): string {
	const image = images.find((item) => item.id === id);
	if (!image) throw new Error(`Missing gallery image ${id}`);
	return image.src;
}

export const photos: GalleryPhoto[] = desktopImages.map((image) => ({
	id: image.id,
	title: displayTitles[image.title] ?? image.title,
	date: image.date,
	category: stageIds.has(image.id)
		? 'On stage'
		: arenaIds.has(image.id)
			? 'The arena'
			: 'Campus stories',
	width: 1080,
	height: imageHeights[image.id - 1],
	src: image.src,
	sources: {
		mobile: sourceFor(mobileImages, image.id),
		tablet: sourceFor(tabletImages, image.id),
		desktop: image.src,
		ultra: sourceFor(ultraImages, image.id)
	}
}));

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
	day: '2-digit',
	month: 'short',
	year: 'numeric',
	timeZone: 'UTC'
});

export function formatGalleryDate(value: string): string {
	const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
	if (!match) return value;
	const [, day, month, year] = match;
	const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
	if (
		date.getUTCFullYear() !== Number(year) ||
		date.getUTCMonth() !== Number(month) - 1 ||
		date.getUTCDate() !== Number(day)
	) {
		return value;
	}
	return dateFormatter.format(date).toUpperCase();
}
