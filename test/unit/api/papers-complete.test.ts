import {apiClient} from '../../../source/api/client.js';
import {
	searchPapers,
	getPapersByDate,
	getPaperDetail,
	getCategories,
} from '../../../source/api/papers.js';
import {mockPaper, mockPaperDetail} from '../../fixtures/data.js';

jest.mock('../../../source/api/client.js', () => ({
	apiClient: {get: jest.fn()},
}));

const get = apiClient.get as unknown as jest.Mock;

const searchResponse = {
	papers: [mockPaper],
	totalCount: 1,
	page: 1,
	pageSize: 20,
	totalPages: 1,
	hasNextPage: false,
	hasPreviousPage: false,
};

describe('api/papers - searchPapers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		get.mockResolvedValue({data: searchResponse});
	});

	it('passes the query through', async () => {
		await searchPapers({query: 'machine learning'});

		expect(get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({query: 'machine learning'}),
		});
	});

	it('passes rankBy through', async () => {
		await searchPapers({query: 'ai', rankBy: 'citations'});

		expect(get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({query: 'ai', rankBy: 'citations'}),
		});
	});

	it('passes date range through', async () => {
		await searchPapers({dateFrom: '2024-01-01', dateTo: '2024-01-31'});

		expect(get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({
				dateFrom: '2024-01-01',
				dateTo: '2024-01-31',
			}),
		});
	});

	it('joins categories into a comma list', async () => {
		await searchPapers({categories: ['cs.AI', 'cs.LG']});

		expect(get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({categories: 'cs.AI,cs.LG'}),
		});
	});

	it('passes prioritization flags through', async () => {
		await searchPapers({prioritizeRecent: true, prioritizeCited: true});

		expect(get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({
				prioritizeRecent: true,
				prioritizeCited: true,
			}),
		});
	});

	it('defaults page and pageSize when omitted', async () => {
		await searchPapers({query: 'test'});

		expect(get).toHaveBeenCalledWith('/papers', {
			params: expect.objectContaining({page: 1, pageSize: 20}),
		});
	});

	it('returns the response payload', async () => {
		const result = await searchPapers({query: 'test'});

		expect(result).toEqual(searchResponse);
	});
});

describe('api/papers - getPapersByDate', () => {
	const dateResponse = {
		papers: [mockPaper],
		pagination: {total: 1, page: 1, limit: 20},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		get.mockResolvedValue({data: dateResponse});
	});

	it('requests the date endpoint with default pagination', async () => {
		await getPapersByDate('2024-01-15');

		expect(get).toHaveBeenCalledWith('/papers/by-date/2024-01-15', {
			params: {page: 1, limit: 20},
		});
	});

	it('forwards explicit pagination', async () => {
		await getPapersByDate('2024-01-15', 2, 15);

		expect(get).toHaveBeenCalledWith('/papers/by-date/2024-01-15', {
			params: {page: 2, limit: 15},
		});
	});

	it('returns the response payload', async () => {
		const result = await getPapersByDate('2024-01-15');

		expect(result).toEqual(dateResponse);
	});
});

describe('api/papers - getPaperDetail', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		get.mockResolvedValue({data: {paper: mockPaperDetail}});
	});

	it('requests the correct endpoint', async () => {
		await getPaperDetail('2301.00001');

		expect(get).toHaveBeenCalledWith('/papers/2301.00001');
	});

	it('returns the paper detail', async () => {
		const result = await getPaperDetail('2301.00001');

		expect(result.paper).toEqual(mockPaperDetail);
	});

	it('propagates rejections from the client', async () => {
		get.mockRejectedValue(new Error('Not found'));

		await expect(getPaperDetail('invalid')).rejects.toThrow('Not found');
	});
});

describe('api/papers - getCategories', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('transforms the grouped object into an array of groups', async () => {
		get.mockResolvedValue({
			data: {
				categories: {
					'Artificial Intelligence': [
						{code: 'cs.AI', name: 'Artificial Intelligence'},
						{code: 'cs.CL', name: 'Computation and Language'},
					],
					'Machine Learning': [{code: 'cs.LG', name: 'Machine Learning'}],
				},
			},
		});

		const result = await getCategories();

		expect(get).toHaveBeenCalledWith('/arxiv/categories');
		expect(result).toEqual([
			{
				name: 'Artificial Intelligence',
				categories: [
					{code: 'cs.AI', name: 'Artificial Intelligence'},
					{code: 'cs.CL', name: 'Computation and Language'},
				],
			},
			{
				name: 'Machine Learning',
				categories: [{code: 'cs.LG', name: 'Machine Learning'}],
			},
		]);
	});
});
