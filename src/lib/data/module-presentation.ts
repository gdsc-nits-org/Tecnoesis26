const moduleAccents = [
	'#8de7ff',
	'#ffba71',
	'#ff8db4',
	'#ffe17c',
	'#a8ffad',
	'#78ffe0',
	'#ff9de1',
	'#ffd272',
	'#c2a1ff',
	'#a5ff83',
	'#8ee1ff',
	'#ffd489',
	'#ff9b7c',
	'#f6dc77',
	'#ff93b8',
	'#91dcff',
	'#b8ffb2'
];

export function getModulePresentation(module: {
	module_id: string;
	name: string;
	description: string | null;
	cover_image: string | null;
}) {
	let hash = 0;
	for (const character of module.module_id) {
		hash = (hash * 31 + character.charCodeAt(0)) | 0;
	}

	return {
		slug: module.module_id,
		name: module.name,
		kicker: `MODULE / ${module.name.toUpperCase()}`,
		description: module.description ?? '',
		coverImage: module.cover_image,
		accent: moduleAccents[Math.abs(hash) % moduleAccents.length] ?? moduleAccents[0]
	};
}
