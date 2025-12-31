import type {Author} from '../api/types.js';

export function formatDate(isoDate: string): string {
	const date = new Date(isoDate);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

export function getApiDateString(date: Date): string {
	return date.toISOString().split('T')[0]!;
}

export function getPresetDate(preset: string): string {
	const now = new Date();
	switch (preset) {
		case 'today': {
			return getApiDateString(now);
		}

		case 'yesterday': {
			now.setDate(now.getDate() - 1);
			return getApiDateString(now);
		}

		case 'last-week': {
			now.setDate(now.getDate() - 7);
			return getApiDateString(now);
		}

		default: {
			return getApiDateString(now);
		}
	}
}

export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength - 3) + '...';
}

export function formatAuthors(authors: Author[], maxDisplay = 3): string {
	if (authors.length === 0) return 'Unknown authors';
	if (authors.length <= maxDisplay) {
		return authors.map(a => a.name).join(', ');
	}

	const displayed = authors.slice(0, maxDisplay).map(a => a.name);
	return `${displayed.join(', ')} +${authors.length - maxDisplay} more`;
}

export function parseCategories(categoriesStr: string): string[] {
	return categoriesStr.split(' ').filter(Boolean);
}
