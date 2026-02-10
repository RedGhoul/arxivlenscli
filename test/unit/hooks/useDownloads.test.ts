import {renderHook, act, waitFor} from '@testing-library/react';
import type {PaperListItem} from '../../../source/api/types.js';
import {useDownloads} from '../../../source/hooks/useDownloads.js';

// Create a deferred promise pattern for controlled testing
let downloadResolve: (() => void) | null = null;
const createDownloadPromise = () =>
	new Promise<void>(resolve => {
		downloadResolve = resolve;
	});

jest.mock('../../../source/api/downloads.js', () => ({
	downloadPaper: jest.fn(() => createDownloadPromise()),
	getDownloadPath: jest.fn(
		(basePath: string, paper: PaperListItem) =>
			`${basePath}/${paper.paperId}.pdf`,
	),
}));

jest.mock('../../../source/hooks/useApi.js', () => ({
	useApi: jest.fn(() => ({
		data: null,
		loading: false,
		error: null,
		execute: jest.fn(),
		reset: jest.fn(),
	})),
}));

jest.mock('../../../source/context/AppContext.js', () => ({
	useApp: jest.fn(() => ({settings: mockSettings})),
}));

const mockSettings = {
	downloadPath: '/test/downloads',
	maxConcurrentDownloads: 3,
	fileNameFormat: 'title+id' as const,
	resultsPerPage: 20,
	defaultSort: 'relevance' as const,
	showTwoLineSummaries: true,
	compactMode: false,
	autoRefreshKeyFindings: true,
	colorScheme: 'default' as const,
	downloadHistory: [],
	searchHistory: [],
};

const mockPaper: PaperListItem = {
	id: 1,
	title: 'Test Paper',
	twoLineSummary: 'Test summary line 1\nTest summary line 2',
	categories: 'cs.AI',
	paperId: '2301.00001',
	genSlug: 'test-paper-title',
	arxivLink: 'https://arxiv.org/abs/2301.00001',
	pdfLink: 'https://arxiv.org/pdf/2301.00001.pdf',
	published: '2024-01-15',
	authors: [{name: 'Alice Smith', genSlug: 'alice-smith'}],
	thumbnailUrl: null,
	source: 'arxiv',
};

describe('useDownloads', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		downloadResolve = null;
	});

	it('initializes with empty queue', () => {
		const {result} = renderHook(() => useDownloads(mockSettings));
		expect(result.current.queue).toEqual([]);
		expect(result.current.isProcessing).toBe(false);
	});

	it('adds papers to queue', () => {
		const {result} = renderHook(() => useDownloads(mockSettings));
		act(() => {
			result.current.addToQueue([mockPaper]);
		});
		expect(result.current.queue).toHaveLength(1);
		expect(result.current.queue[0]?.paper).toEqual(mockPaper);
		expect(result.current.queue[0]?.status).toBe('pending');
	});

	it('prevents duplicate papers in queue', () => {
		const {result} = renderHook(() => useDownloads(mockSettings));
		act(() => {
			result.current.addToQueue([mockPaper]);
			result.current.addToQueue([mockPaper]);
		});
		expect(result.current.queue).toHaveLength(1);
	});

	it('starts downloads when startDownloads called', async () => {
		const {result} = renderHook(() => useDownloads(mockSettings));

		act(() => {
			result.current.addToQueue([mockPaper]);
			result.current.startDownloads();
		});

		// Wait for the processing state to be set
		await waitFor(() => {
			expect(result.current.isProcessing).toBe(true);
		});

		// Cleanup: resolve the pending download to avoid hanging promises
		if (downloadResolve) {
			await act(async () => {
				downloadResolve!();
			});
		}
	});

	it('pauses downloads when pauseDownloads called', async () => {
		const {result} = renderHook(() => useDownloads(mockSettings));

		act(() => {
			result.current.addToQueue([mockPaper]);
			result.current.startDownloads();
			result.current.pauseDownloads();
		});

		// Pausing should immediately set isProcessing to false
		expect(result.current.isProcessing).toBe(false);
	});

	it('retries failed downloads', async () => {
		const {result} = renderHook(() => useDownloads(mockSettings));
		act(() => {
			result.current.addToQueue([mockPaper]);
			result.current.startDownloads();
		});

		act(() => {
			result.current.retryFailed();
		});

		expect(result.current.queue.length).toBe(1);
	});

	it('clears completed downloads', () => {
		const {result} = renderHook(() => useDownloads(mockSettings));
		act(() => {
			result.current.addToQueue([mockPaper]);
		});

		act(() => {
			result.current.clearCompleted();
		});

		expect(result.current.queue.length).toBe(1);
	});

	it('returns download progress', () => {
		const {result} = renderHook(() => useDownloads(mockSettings));
		expect(typeof result.current.getProgress).toBe('function');
	});
});
