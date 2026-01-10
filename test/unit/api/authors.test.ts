import {apiClient} from '../../../source/api/client.js';
import {http} from 'msw';
import {server} from '../../helpers/mockApi.js';
import type {
	AuthorSearchResponse,
	AuthorProfileResponse,
} from '../../../source/api/types.js';

describe('api/authors - searchAuthors', () => {
	beforeAll(() => {
		server.listen();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		server.close();
	});

	it('sends correct request with author name', async () => {
		const {searchAuthors} = await import('../../../source/api/authors.js');

		await searchAuthors('John Smith');

		expect(apiClient.get).toHaveBeenCalledWith('/authors', {
			params: {
				authorName: 'John Smith',
				page: 1,
				pageSize: 10,
			},
		});
	});

	it('sends pagination parameters', async () => {
		const {searchAuthors} = await import('../../../source/api/authors.js');

		await searchAuthors('test', 2, 15);

		expect(apiClient.get).toHaveBeenCalledWith('/authors', {
			params: {
				authorName: 'test',
				page: 2,
				pageSize: 15,
			},
		});
	});

	it('returns authors data on success', async () => {
		const {searchAuthors} = await import('../../../source/api/authors.js');

		const result = await searchAuthors('test');

		expect(result.authors).toHaveLength(1);
		expect(result.totalCount).toBe(1);
		expect(result.page).toBe(1);
		expect(result.pageSize).toBe(10);
		expect(result.totalPages).toBe(1);
		expect(result.hasNextPage).toBe(false);
		expect(result.hasPreviousPage).toBe(false);
	});
});

describe('api/authors - getAuthorProfile', () => {
	beforeAll(() => {
		server.listen();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		server.close();
	});

	it('sends correct request with genSlug', async () => {
		const {getAuthorProfile} = await import('../../../source/api/authors.js');

		await getAuthorProfile('john-smith');

		expect(apiClient.get).toHaveBeenCalledWith('/authors/john-smith');
	});

	it('returns author profile on success', async () => {
		const {getAuthorProfile} = await import('../../../source/api/authors.js');

		const result = await getAuthorProfile('john-smith');

		expect(result.name).toBe('John Smith');
		expect(result.genSlug).toBe('john-smith');
		expect(result.paperCount).toBe(10);
		expect(result.papers).toHaveLength(1);
		expect(result.paperTitles).toContain('Test Paper');
	});
	it('throws error on invalid author', async () => {
		const {getAuthorProfile} = await import('../../../source/api/authors.js');

		await expect(getAuthorProfile('invalid')).rejects.toThrow();
	});
});
