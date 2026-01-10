import {apiClient} from '../../../source/api/client.js';
import {http} from 'msw';
import {server} from '../../helpers/mockApi.js';

describe('apiClient', () => {
	beforeAll(() => {
		server.listen();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		server.close();
	});

	it('creates axios instance with correct config', () => {
		expect(axios.create).toHaveBeenCalledWith({
			baseURL: 'https://arxivlens.com/api/v1',
			timeout: 30000,
			headers: {
				'Content-Type': 'application/json',
			},
		});
		expect(apiClient).toBeDefined();
	});

	it('has response interceptor', () => {
		const interceptorSpy = jest.spyOn(apiClient.interceptors.response, 'use');
		expect(interceptorSpy).toHaveBeenCalled();
	});

	it('rejects on 4xx errors', async () => {
		server.use(
			http.get('https://arxivlens.com/api/v1/test', () => {
				return new Response(null, {status: 404});
			}),
		);

		await expect(apiClient.get('/test')).rejects.toThrow('Not Found');
	});

	it('rejects on 5xx errors', async () => {
		server.use(
			http.get('https://arxivlens.com/api/v1/test', () => {
				return new Response(null, {status: 500});
			}),
		);

		await expect(apiClient.get('/test')).rejects.toThrow(
			'Internal Server Error',
		);
	});

	it('rejects with response data message', async () => {
		server.use(
			http.get('https://arxivlens.com/api/v1/test', () => {
				return Response.json({message: 'Custom error'}, {status: 400});
			}),
		);

		await expect(apiClient.get('/test')).rejects.toThrow('Custom error');
	});

	it('rejects with error message on network error', async () => {
		server.use(
			http.get('https://arxivlens.com/api/v1/test', () => {
				return new Error('Network error');
			}),
		);

		await expect(apiClient.get('/test')).rejects.toThrow('Network error');
	});
});
