import {useState, useCallback, useRef, useEffect} from 'react';
import {searchPapers} from '../api/papers.js';
import type {Category} from '../api/types.js';
import {
	CATEGORY_COUNT_CONCURRENCY,
	CATEGORY_COUNT_PAGE_SIZE,
} from '../config/constants.js';

interface CategoryCountState {
	counts: Map<string, number>;
	loading: Set<string>;
	failed: Set<string>;
}

export function useCategoryCounts() {
	const [state, setState] = useState<CategoryCountState>({
		counts: new Map(),
		loading: new Set(),
		failed: new Set(),
	});
	const cacheRef = useRef<Map<string, number>>(new Map());
	const loadingRef = useRef<Set<string>>(new Set());
	const mountedRef = useRef(true);

	useEffect(
		() => () => {
			mountedRef.current = false;
		},
		[],
	);

	const fetchCountsForCategories = useCallback(
		async (categories: Category[]) => {
			const toFetch = categories.filter(
				cat =>
					!cacheRef.current.has(cat.code) && !loadingRef.current.has(cat.code),
			);

			if (toFetch.length === 0) return;

			// Mark as loading
			for (const cat of toFetch) {
				loadingRef.current.add(cat.code);
			}

			if (mountedRef.current) {
				setState(prev => {
					const newLoading = new Set(prev.loading);
					for (const cat of toFetch) {
						newLoading.add(cat.code);
					}

					return {...prev, loading: newLoading};
				});
			}

			// Fetch in batches
			for (let i = 0; i < toFetch.length; i += CATEGORY_COUNT_CONCURRENCY) {
				if (!mountedRef.current) return;

				const batch = toFetch.slice(i, i + CATEGORY_COUNT_CONCURRENCY);
				// eslint-disable-next-line no-await-in-loop
				const results = await Promise.allSettled(
					batch.map(async cat => {
						const response = await searchPapers({
							categories: [cat.code],
							page: 1,
							pageSize: CATEGORY_COUNT_PAGE_SIZE,
						});
						return {code: cat.code, count: response.totalCount};
					}),
				);

				// Still update cache even if unmounted (for future re-mounts)
				for (const [idx, result] of results.entries()) {
					const cat = batch[idx];
					if (!cat) continue;

					if (result.status === 'fulfilled') {
						cacheRef.current.set(result.value.code, result.value.count);
					}

					loadingRef.current.delete(cat.code);
				}

				if (!mountedRef.current) return;

				setState(prev => {
					const newCounts = new Map(prev.counts);
					const newLoading = new Set(prev.loading);
					const newFailed = new Set(prev.failed);

					for (const [idx, result] of results.entries()) {
						const cat = batch[idx];
						if (!cat) continue;

						if (result.status === 'fulfilled') {
							newCounts.set(result.value.code, result.value.count);
							newFailed.delete(cat.code);
						} else {
							newFailed.add(cat.code);
						}

						newLoading.delete(cat.code);
					}

					return {counts: newCounts, loading: newLoading, failed: newFailed};
				});
			}
		},
		[],
	);

	const getCount = useCallback(
		(code: string): number | undefined =>
			state.counts.get(code) ?? cacheRef.current.get(code),
		[state.counts],
	);

	const isLoading = useCallback(
		(code: string): boolean => state.loading.has(code),
		[state.loading],
	);

	const hasFailed = useCallback(
		(code: string): boolean => state.failed.has(code),
		[state.failed],
	);

	return {
		fetchCountsForCategories,
		getCount,
		isLoading,
		hasFailed,
	};
}
