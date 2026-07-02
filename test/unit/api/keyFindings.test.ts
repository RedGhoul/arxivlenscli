import {apiClient} from '../../../source/api/client.js';
import {getKeyFindings} from '../../../source/api/keyFindings.js';
import {mockKeyFindings} from '../../fixtures/data.js';

jest.mock('../../../source/api/client.js', () => ({
	apiClient: {get: jest.fn()},
}));

const get = apiClient.get as unknown as jest.Mock;

describe('api/keyFindings - getKeyFindings', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('requests the correct endpoint', async () => {
		get.mockResolvedValue({status: 200, data: mockKeyFindings});

		await getKeyFindings('2301.00001');

		expect(get).toHaveBeenCalledWith('/papers/2301.00001/key-findings');
	});

	it('returns ready: true with findings on 200', async () => {
		get.mockResolvedValue({status: 200, data: mockKeyFindings});

		const result = await getKeyFindings('2301.00001');

		expect(result.ready).toBe(true);
		expect(result.data).toEqual(mockKeyFindings);
	});

	it('returns ready: false with status payload on 202', async () => {
		const statusPayload = {
			status: 'processing',
			message: 'Key findings are being generated',
			retryCount: 1,
			updatedAt: '2024-01-15T10:00:00Z',
		};
		get.mockResolvedValue({status: 202, data: statusPayload});

		const result = await getKeyFindings('pending');

		expect(result.ready).toBe(false);
		expect(result.data).toEqual(statusPayload);
	});

	it('throws with the API message on an unexpected status', async () => {
		get.mockResolvedValue({
			status: 500,
			data: {message: 'Generation failed'},
		});

		await expect(getKeyFindings('2301.00001')).rejects.toThrow(
			'Generation failed',
		);
	});

	it('throws a default message when the body has none', async () => {
		get.mockResolvedValue({status: 500, data: null});

		await expect(getKeyFindings('2301.00001')).rejects.toThrow(
			'Failed to fetch key findings',
		);
	});

	it('propagates rejections from the client', async () => {
		get.mockRejectedValue(new Error('Network error'));

		await expect(getKeyFindings('2301.00001')).rejects.toThrow('Network error');
	});
});
