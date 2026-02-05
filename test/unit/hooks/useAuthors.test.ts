import {renderHook, act} from '@testing-library/react';
import {
	useAuthorSearch,
	useAuthorProfile,
} from '../../../source/hooks/useAuthors.js';

jest.mock('../../../source/hooks/useApi.js', () => ({
	useApi: jest.fn(() => ({
		data: null,
		loading: false,
		error: null,
		execute: jest.fn(),
		reset: jest.fn(),
	})),
}));

jest.mock('../../../source/api/authors.js', () => ({
	searchAuthors: jest.fn(),
	getAuthorProfile: jest.fn(),
}));

describe('useAuthorSearch', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('initializes with default values', () => {
		const {result} = renderHook(() => useAuthorSearch());

		expect(result.current.data).toBe(null);
		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBe(null);
	});

	it('sets loading to true when searching', async () => {
		const {result} = renderHook(() => useAuthorSearch());

		await act(async () => {
			await result.current.search('test query', 1, 10);
		});
	});

	it('sets data when search succeeds', async () => {
		const {result} = renderHook(() => useAuthorSearch());

		await act(async () => {
			await result.current.search('test');
		});
	});

	it('sets error when search fails', async () => {
		const {result} = renderHook(() => useAuthorSearch());

		await act(async () => {
			await result.current.search('test');
		});
	});
});

describe('useAuthorProfile', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('initializes with default values', () => {
		const {result} = renderHook(() => useAuthorProfile());

		expect(result.current.data).toBe(null);
		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBe(null);
	});

	it('sets loading to true when fetching', async () => {
		const {result} = renderHook(() => useAuthorProfile());

		await act(async () => {
			await result.current.fetchProfile('test-slug');
		});
	});

	it('sets data when fetch succeeds', async () => {
		const {result} = renderHook(() => useAuthorProfile());

		await act(async () => {
			await result.current.fetchProfile('test-slug');
		});
	});

	it('sets error when fetch fails', async () => {
		const {result} = renderHook(() => useAuthorProfile());

		await act(async () => {
			await result.current.fetchProfile('invalid');
		});
	});
});
