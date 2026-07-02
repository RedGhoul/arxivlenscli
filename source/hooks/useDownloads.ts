import {useState, useCallback, useRef, useEffect} from 'react';
import type {PaperListItem} from '../api/types.js';
import {downloadPaper, getDownloadPath} from '../api/downloads.js';
import type {Settings} from '../config/settings.js';
import {
	MAX_DOWNLOAD_RETRIES,
	DOWNLOAD_QUEUE_DELAY_MS,
} from '../config/constants.js';

export type DownloadStatus = 'pending' | 'downloading' | 'completed' | 'failed';

export interface DownloadItem {
	paper: PaperListItem;
	status: DownloadStatus;
	progress: number;
	error: string | null;
	filePath: string | null;
}

export function useDownloads(settings: Settings) {
	const [queue, setQueue] = useState<DownloadItem[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
	const retryCountRef = useRef<Map<string, number>>(new Map());
	// Use ref to track if processQueue is currently executing (prevents concurrent execution)
	const isExecutingRef = useRef(false);
	// Use ref to track if we have a pending processQueue call scheduled
	const pendingProcessRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const addToQueue = useCallback((papers: PaperListItem[]) => {
		setQueue(prev => {
			const existingIds = new Set(prev.map(item => item.paper.paperId));
			const newPapers = papers.filter(p => !existingIds.has(p.paperId));
			const newItems: DownloadItem[] = newPapers.map(paper => ({
				paper,
				status: 'pending',
				progress: 0,
				error: null,
				filePath: null,
			}));
			return [...prev, ...newItems];
		});
	}, []);

	const updateItemStatus = useCallback(
		(paperId: string, updates: Partial<DownloadItem>) => {
			setQueue(prev =>
				prev.map(item =>
					item.paper.paperId === paperId ? {...item, ...updates} : item,
				),
			);
		},
		[],
	);

	const processQueue = useCallback(async () => {
		// Prevent concurrent execution of processQueue
		if (isExecutingRef.current) return;
		isExecutingRef.current = true;

		if (!settings.downloadPath) {
			isExecutingRef.current = false;
			setIsProcessing(false);
			return;
		}

		// Ensure UI state shows processing
		setIsProcessing(true);

		// Get current queue state synchronously to avoid stale closures
		let currentQueue: DownloadItem[] = [];
		setQueue(prev => {
			currentQueue = prev;
			return prev;
		});

		const pendingItems = currentQueue.filter(item => item.status === 'pending');

		const activeCount = currentQueue.filter(
			item => item.status === 'downloading',
		).length;

		const slotsAvailable = settings.maxConcurrentDownloads - activeCount;
		const {downloadPath} = settings;

		const downloadTasks = pendingItems
			.slice(0, slotsAvailable)
			.map(async item => {
				if (!item) return;

				const controller = new AbortController();
				abortControllersRef.current.set(item.paper.paperId, controller);

				const filePath = getDownloadPath(downloadPath, item.paper, settings);

				updateItemStatus(item.paper.paperId, {
					status: 'downloading',
					progress: 0,
					filePath,
				});

				try {
					await downloadPaper(item.paper, filePath, {
						signal: controller.signal,
						// eslint-disable-next-line object-shorthand -- Error message is a string, not a variable named error
						onProgress: ({percentage: progress}) => {
							updateItemStatus(item.paper.paperId, {
								progress,
							});
						},
					});

					updateItemStatus(item.paper.paperId, {
						status: 'completed',
						progress: 100,
						error: null,
					});
				} catch (error) {
					const errorMessage =
						error instanceof Error ? error.message : 'Unknown error';
					const currentRetries =
						retryCountRef.current.get(item.paper.paperId) ?? 0;

					if (currentRetries < MAX_DOWNLOAD_RETRIES) {
						retryCountRef.current.set(item.paper.paperId, currentRetries + 1);
						updateItemStatus(item.paper.paperId, {
							status: 'pending',
							progress: 0,
							error: null,
						});
					} else {
						updateItemStatus(item.paper.paperId, {
							status: 'failed',
							error: errorMessage,
						});
					}
				} finally {
					abortControllersRef.current.delete(item.paper.paperId);
				}
			});

		await Promise.all(downloadTasks);

		// Re-check queue state after downloads complete
		let hasMoreWork = false;
		setQueue(prev => {
			hasMoreWork = prev.some(
				item => item.status === 'pending' || item.status === 'downloading',
			);
			return prev;
		});

		// Clear any existing pending timeout before scheduling a new one
		if (pendingProcessRef.current) {
			clearTimeout(pendingProcessRef.current);
			pendingProcessRef.current = null;
		}

		if (hasMoreWork) {
			// Reset executing flag before scheduling to allow next iteration
			isExecutingRef.current = false;
			pendingProcessRef.current = setTimeout(() => {
				pendingProcessRef.current = null;
				void processQueue();
			}, DOWNLOAD_QUEUE_DELAY_MS);
		} else {
			isExecutingRef.current = false;
			setIsProcessing(false);
		}
	}, [settings, updateItemStatus]);

	// Cleanup pending timeout on unmount
	useEffect(() => {
		return () => {
			if (pendingProcessRef.current) {
				clearTimeout(pendingProcessRef.current);
			}
		};
	}, []);

	const startDownloads = useCallback(() => {
		if (!isExecutingRef.current) {
			// Set processing state immediately for UI responsiveness
			setIsProcessing(true);
			void processQueue();
		}
	}, [processQueue]);

	const pauseDownloads = useCallback(() => {
		// Clear pending process timeout
		if (pendingProcessRef.current) {
			clearTimeout(pendingProcessRef.current);
			pendingProcessRef.current = null;
		}

		for (const controller of abortControllersRef.current.values()) {
			controller.abort();
		}

		abortControllersRef.current.clear();
		setQueue(prev =>
			prev.map(item =>
				item.status === 'downloading'
					? {...item, status: 'pending', progress: 0}
					: item,
			),
		);
		isExecutingRef.current = false;
		setIsProcessing(false);
	}, []);

	const retryFailed = useCallback(() => {
		setQueue(prev =>
			prev.map(item =>
				item.status === 'failed'
					? {
							...item,
							status: 'pending',
							progress: 0,
							error: null,
					  }
					: item,
			),
		);
		retryCountRef.current.clear();
	}, []);

	const clearCompleted = useCallback(() => {
		setQueue(prev => prev.filter(item => item.status !== 'completed'));
	}, []);

	const cancelDownload = useCallback(
		(paperId: string) => {
			const controller = abortControllersRef.current.get(paperId);
			if (controller) {
				controller.abort();
				abortControllersRef.current.delete(paperId);
			}

			updateItemStatus(paperId, {
				status: 'failed',
				error: 'Cancelled by user',
			});
		},
		[updateItemStatus],
	);

	const clearAll = useCallback(() => {
		// Clear pending process timeout
		if (pendingProcessRef.current) {
			clearTimeout(pendingProcessRef.current);
			pendingProcessRef.current = null;
		}

		for (const controller of abortControllersRef.current.values()) {
			controller.abort();
		}

		abortControllersRef.current.clear();
		retryCountRef.current.clear();
		setQueue([]);
		isExecutingRef.current = false;
		setIsProcessing(false);
	}, []);

	const getProgress = useCallback(() => {
		if (queue.length === 0) return {completed: 0, total: 0, percentage: 0};
		const completed = queue.filter(item => item.status === 'completed').length;
		return {
			completed,
			total: queue.length,
			percentage: (completed / queue.length) * 100,
		};
	}, [queue]);

	return {
		queue,
		addToQueue,
		startDownloads,
		pauseDownloads,
		retryFailed,
		clearCompleted,
		cancelDownload,
		clearAll,
		isProcessing,
		getProgress,
	};
}
