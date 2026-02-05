import {apiClient} from '../../../source/api/client.js';
import {http, HttpResponse} from 'msw';
import {server} from '../../helpers/mockApi.js';

describe('api/keyFindings - getKeyFindings', () => {
	beforeAll(() => {
		server.listen();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		server.close();
	});

	it('sends correct request with paperId', async () => {
		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		await getKeyFindings('2301.00001');

		expect(apiClient.get).toHaveBeenCalledWith(
			'/papers/2301.00001/key-findings',
		);
	});

	it('returns ready: true on 200 status', async () => {
		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		const result = await getKeyFindings('2301.00001');

		expect(result.ready).toBe(true);
		expect(result.data).toMatchObject({
			paperId: '2301.00001',
			methodology: expect.any(String),
			keyResults: expect.any(Array),
			significance: expect.any(String),
			limitations: expect.any(Array),
			futureWork: expect.any(Array),
			technicalContribution: expect.any(String),
			novelty: expect.any(String),
			status: expect.stringMatching(/completed|in_progress|failed|timeout/),
		});
	});

	it('returns ready: false on 202 status', async () => {
		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		const result = await getKeyFindings('pending');

		expect(result.ready).toBe(false);
		expect(result.data).toMatchObject({
			status: 'processing',
			message: expect.any(String),
			retryCount: expect.any(Number),
			updatedAt: expect.any(String),
		});
	});

	it('throws error on 404', async () => {
		server.use(
			http.get('/api/v1/papers/invalid/key-findings', () => {
				return HttpResponse.json({message: 'Not found'}, {status: 404});
			}),
		);

		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		await expect(getKeyFindings('invalid')).rejects.toThrow();
	});

	it('throws error on 500', async () => {
		server.use(
			http.get('/api/v1/papers/test/key-findings', () => {
				return HttpResponse.json(
					{message: 'Server error', status: 'failed'},
					{status: 500},
				);
			}),
		);

		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		await expect(getKeyFindings('test')).rejects.toThrow('Server error');
	});

	it('throws error on network error', async () => {
		server.use(
			http.get('https://arxivlens.com/api/v1/papers/test/key-findings', () => {
				return HttpResponse.error();
			}),
		);

		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		await expect(getKeyFindings('test')).rejects.toThrow('Network error');
	});

	it('throws error on 500', async () => {
		server.use(
			http.get('https://arxivlens.com/api/v1/papers/test/key-findings', () => {
				return HttpResponse.json(
					{message: 'Server error', status: 'failed'},
					{status: 500},
				);
			}),
		);

		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		await expect(getKeyFindings('test')).rejects.toThrow('Server error');
	});

	it('throws error on network error', async () => {
		server.use(
			http.get('https://arxivlens.com/api/v1/papers/test/key-findings', () => {
				return HttpResponse.error();
			}),
		);

		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		await expect(getKeyFindings('invalid')).rejects.toThrow();
	});

	it('throws error on 500', async () => {
		server.use(
			http.get('https://arxivlens.com/api/v1/papers/test/key-findings', () => {
				return new Response(
					JSON.stringify({message: 'Server error', status: 'failed'}),
					{status: 500},
				);
			}),
		);

		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		await expect(getKeyFindings('test')).rejects.toThrow('Server error');
	});

	it('throws error on network error', async () => {
		server.use(
			http.get('https://arxivlens.com/api/v1/papers/test/key-findings', () => {
				throw new Error('Network error');
			}),
		);

		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		await expect(getKeyFindings('test')).rejects.toThrow('Network error');
	});

	it('throws error with custom message on 500', async () => {
		server.use(
			http.get('https://arxivlens.com/api/v1/papers/test/key-findings', () => {
				return new Response(null, {status: 500});
			}),
		);

		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		await expect(getKeyFindings('test')).rejects.toThrow();
	});

	it('throws error with API message in response', async () => {
		server.use(
			http.get('https://arxivlens.com/api/v1/papers/test/key-findings', () => {
				return Response.json(
					{message: 'Generation failed', status: 'failed'},
					{status: 500},
				);
			}),
		);

		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		await expect(getKeyFindings('test')).rejects.toThrow('Generation failed');
	});

	it('throws error on network error', async () => {
		server.use(
			http.get('https://arxivlens.com/api/v1/papers/test/key-findings', () => {
				return HttpResponse.error();
			}),
		);

		const {getKeyFindings} = await import('../../../source/api/keyFindings.js');

		await expect(getKeyFindings('test')).rejects.toThrow();
	});
});
