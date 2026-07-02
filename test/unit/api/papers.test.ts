import axios from 'axios';
import {
	API_BASE_URL,
	API_TIMEOUT_MS,
} from '../../../source/config/constants.js';
import '../../../source/api/client.js';

// The client module registers a response interceptor on import. Mock axios so
// we can capture that interceptor and exercise its error-sanitizing logic
// directly, without any real network calls.
jest.mock('axios', () => ({
	__esModule: true,
	default: {
		create: jest.fn(() => ({
			interceptors: {response: {use: jest.fn()}},
		})),
	},
}));

type Rejecter = (error: unknown) => Promise<never>;

const {create} = axios as unknown as {create: jest.Mock};
const instance = create.mock.results[0]!.value as {
	interceptors: {response: {use: jest.Mock}};
};
const onRejected = instance.interceptors.response.use.mock
	.calls[0]![1] as Rejecter;
const ESC = String.fromCodePoint(27); // ASCII escape (0x1B)

describe('api/client', () => {
	it('creates the axios instance with the configured base URL and timeout', () => {
		expect(create).toHaveBeenCalledWith({
			baseURL: API_BASE_URL,
			timeout: API_TIMEOUT_MS,
			headers: {'Content-Type': 'application/json'},
		});
	});

	it('registers a response error interceptor', () => {
		expect(typeof onRejected).toBe('function');
	});

	it('prefers the API-provided message', async () => {
		await expect(
			onRejected({response: {data: {message: 'Custom error'}}}),
		).rejects.toThrow('Custom error');
	});

	it('falls back to the error message', async () => {
		await expect(onRejected({message: 'Network Error'})).rejects.toThrow(
			'Network Error',
		);
	});

	it('falls back to a generic message when nothing is available', async () => {
		await expect(onRejected({})).rejects.toThrow('Unknown error');
	});

	it('strips ANSI escape sequences from error messages', async () => {
		const message = `${ESC}[31mInjected${ESC}[0m`;

		await expect(onRejected({message})).rejects.toThrow(/^Injected$/);
	});

	it('truncates excessively long error messages', async () => {
		const longMessage = 'x'.repeat(1000);

		await expect(onRejected({message: longMessage})).rejects.toThrow(
			/^x{500}$/,
		);
	});
});
