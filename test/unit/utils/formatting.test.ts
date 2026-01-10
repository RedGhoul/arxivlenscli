import {
	formatDate,
	truncate,
	formatAuthors,
	getApiDateString,
} from '../../../source/utils/formatting';

describe('formatDate', () => {
	it('formats ISO date correctly', () => {
		const result = formatDate('2024-12-20T00:00:00Z');
		expect(result).toContain('2024');
		expect(result).toContain('Dec');
		expect(result).toContain('20');
	});

	it('returns Unknown date for null input', () => {
		const result = formatDate(null);
		expect(result).toBe('Unknown date');
	});

	it('returns Unknown date for undefined input', () => {
		const result = formatDate(undefined);
		expect(result).toBe('Unknown date');
	});

	it('returns Unknown date for invalid date', () => {
		const result = formatDate('invalid-date');
		expect(result).toBe('Unknown date');
	});
});

describe('truncate', () => {
	it('shortens long text', () => {
		const longText = 'This is a very long text that should be truncated';
		const result = truncate(longText, 20);
		expect(result).toBe('This is a very lo...');
	});

	it('returns short text unchanged', () => {
		const result = truncate('Short', 20);
		expect(result).toBe('Short');
	});

	it('handles empty string', () => {
		const result = truncate('', 10);
		expect(result).toBe('');
	});

	it('handles exact length', () => {
		const result = truncate('Exact', 5);
		expect(result).toBe('Exact');
	});
});

describe('formatAuthors', () => {
	it('handles empty array', () => {
		const result = formatAuthors([]);
		expect(result).toBe('Unknown authors');
	});

	it('handles single author', () => {
		const authors = [{name: 'Alice', genSlug: 'alice'}];
		const result = formatAuthors(authors);
		expect(result).toBe('Alice');
	});

	it('handles multiple authors with limit', () => {
		const authors = [
			{name: 'Alice', genSlug: 'alice'},
			{name: 'Bob', genSlug: 'bob'},
			{name: 'Charlie', genSlug: 'charlie'},
			{name: 'Diana', genSlug: 'diana'},
		];
		const result = formatAuthors(authors, 2);
		expect(result).toBe('Alice, Bob +2 more');
	});

	it('handles all authors when within limit', () => {
		const authors = [
			{name: 'Alice', genSlug: 'alice'},
			{name: 'Bob', genSlug: 'bob'},
		];
		const result = formatAuthors(authors, 5);
		expect(result).toBe('Alice, Bob');
	});

	it('handles null authors array', () => {
		const result = formatAuthors(null);
		expect(result).toBe('Unknown authors');
	});
});

describe('getApiDateString', () => {
	it('returns correct format', () => {
		const date = new Date('2024-12-20T12:00:00Z');
		const result = getApiDateString(date);
		expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('formats single digit months and days', () => {
		const date = new Date('2024-01-05T12:00:00Z');
		const result = getApiDateString(date);
		expect(result).toBe('2024-01-05');
	});
});
