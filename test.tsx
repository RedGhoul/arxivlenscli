import test from 'ava';
import {
	formatDate,
	truncate,
	formatAuthors,
	getApiDateString,
} from './source/utils/formatting.js';

test('formatDate formats ISO date correctly', t => {
	const result = formatDate('2024-12-20T00:00:00Z');
	t.true(result.includes('2024'));
	t.true(result.includes('Dec'));
	t.true(result.includes('20'));
});

test('truncate shortens long text', t => {
	const longText = 'This is a very long text that should be truncated';
	t.is(truncate(longText, 20), 'This is a very lo...');
});

test('truncate returns short text unchanged', t => {
	t.is(truncate('Short', 20), 'Short');
});

test('formatAuthors handles empty array', t => {
	t.is(formatAuthors([]), 'Unknown authors');
});

test('formatAuthors handles single author', t => {
	const authors = [{name: 'Alice', genSlug: 'alice'}];
	t.is(formatAuthors(authors), 'Alice');
});

test('formatAuthors handles multiple authors with limit', t => {
	const authors = [
		{name: 'Alice', genSlug: 'alice'},
		{name: 'Bob', genSlug: 'bob'},
		{name: 'Charlie', genSlug: 'charlie'},
		{name: 'Diana', genSlug: 'diana'},
	];
	t.is(formatAuthors(authors, 2), 'Alice, Bob +2 more');
});

test('getApiDateString returns correct format', t => {
	const date = new Date('2024-12-20T12:00:00Z');
	t.regex(getApiDateString(date), /^\d{4}-\d{2}-\d{2}$/);
});
