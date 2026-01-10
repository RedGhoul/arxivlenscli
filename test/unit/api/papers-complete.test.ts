import {apiClient} from '../../../source/api/client.js';
import {http} from 'msw';
import {server} from '../../helpers/mockApi.js';
import type {
	PaperSearchResponse,
	PapersByDateResponse,
	PaperDetailResponse,
	CategoriesResponse,
} from '../../../source/api/types.js';

describe('api/papers - searchPapers', () => {
	beforeAll(() => {
		server.listen();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		server.close();
	});

	it('sends correct request with query parameter', async () => {
		const {searchPapers} = await import('../../../source/api/papers.js');

		await searchPapers({query: 'machine learning'});

		expect(apiClient.get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({
				query: 'machine learning',
			}),
		});
	});

	it('sends correct request with rankBy parameter', async () => {
		const {searchPapers} = await import('../../../source/api/papers.js');

		await searchPapers({query: 'ai', rankBy: 'citations'});

		expect(apiClient.get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({
				query: 'ai',
				rankBy: 'citations',
			}),
		});
	});

	it('sends correct request with dateFrom parameter', async () => {
		const {searchPapers} = await import('../../../source/api/papers.js');

		await searchPapers({dateFrom: '2024-01-01'});

		expect(apiClient.get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({
				dateFrom: '2024-01-01',
			}),
		});
	});

	it('sends correct request with dateTo parameter', async () => {
		const {searchPapers} = await import('../../../source/api/papers.js');

		await searchPapers({dateTo: '2024-01-31'});

		expect(apiClient.get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({
				dateTo: '2024-01-31',
			}),
		});
	});

	it('sends correct request with categories parameter', async () => {
		const {searchPapers} = await import('../../../source/api/papers.js');

		await searchPapers({categories: ['cs.AI', 'cs.LG']});

		expect(apiClient.get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({
				categories: 'cs.AI,cs.LG',
			}),
		});
	});

	it('sends correct request with prioritization parameters', async () => {
		const {searchPapers} = await import('../../../source/api/papers.js');

		await searchPapers({prioritizeRecent: true, prioritizeCited: true});

		expect(apiClient.get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({
				prioritizeRecent: true,
				prioritizeCited: true,
			}),
		});
	});

	it('sends pagination parameters', async () => {
		const {searchPapers} = await import('../../../source/api/papers.js');

		await searchPapers({page: 2, pageSize: 25});

		expect(apiClient.get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({
				page: 2,
				pageSize: 25,
			}),
		});
	});

	it('returns papers data on success', async () => {
		const {searchPapers} = await import('../../../source/api/papers.js');

		const result = await searchPapers({query: 'test'});

		expect(result.papers).toHaveLength(1);
		expect(result.totalCount).toBe(1);
		expect(result.page).toBe(1);
		expect(result.pageSize).toBe(10);
		expect(result.totalPages).toBe(1);
		expect(result.hasNextPage).toBe(false);
		expect(result.hasPreviousPage).toBe(false);
	});
});

describe('api/papers - getPapersByDate', () => {
	beforeAll(() => {
		server.listen();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		server.close();
	});

	it('sends correct request with date', async () => {
		const {getPapersByDate} = await import('../../../source/api/papers.js');

		await getPapersByDate('2024-01-15');

		expect(apiClient.get).toHaveBeenCalledWith('/papers/by-date/2024-01-15');
	});

	it('sends pagination parameters', async () => {
		const {getPapersByDate} = await import('../../../source/api/papers.js');

		await getPapersByDate('2024-01-15', 1, 15);

		expect(apiClient.get).toHaveBeenCalledWith('/papers/by-date/2024-01-15', {
			params: {page: 1, limit: 15},
		});
	});

	it('returns papers data on success', async () => {
		const {getPapersByDate} = await import('../../../source/api/papers.js');

		const result = await getPapersByDate('2024-01-15');

		expect(result.papers).toHaveLength(1);
		expect(result.pagination).toEqual({
			total: 1,
			page: 1,
			limit: 15,
		});
	});
});

describe('api/papers - getPaperDetail', () => {
	beforeAll(() => {
		server.listen();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		server.close();
	});

	it('sends correct request with identifier', async () => {
		const {getPaperDetail} = await import('../../../source/api/papers.js');

		await getPaperDetail('2301.00001');

		expect(apiClient.get).toHaveBeenCalledWith('/papers/2301.00001');
	});

	it('returns paper detail on success', async () => {
		const {getPaperDetail} = await import('../../../source/api/papers.js');

		const result = await getPaperDetail('2301.00001');

		expect(result.paper).toBeDefined();
		expect(result.paper).toMatchObject({
			id: expect.any(Number),
			title: expect.any(String),
			arxivLink: expect.any(String),
			pdfLink: expect.any(String),
		});
	});

	it('throws error on invalid paper', async () => {
		const {getPaperDetail} = await import('../../../source/api/papers.js');

		await expect(getPaperDetail('invalid')).rejects.toThrow();
	});
});

describe('api/papers - getCategories', () => {
	beforeAll(() => {
		server.listen();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		server.close();
	});

	it('fetches categories from API', async () => {
		const {getCategories} = await import('../../../source/api/papers.js');

		const result = await getCategories();

		expect(apiClient.get).toHaveBeenCalledWith('/arxiv/categories');
		expect(result).toHaveLength(2);
		expect(result[0]).toMatchObject({
			name: expect.any(String),
			categories: expect.arrayContaining({
				code: expect.any(String),
				name: expect.any(String),
			}),
		});
	});
});
