import {useCallback} from 'react';
import {useApi} from './useApi.js';
import {
	searchPapers,
	getPapersByDate,
	getPaperDetail,
	getCategories,
} from '../api/papers.js';
import type {SearchParams} from '../api/types.js';

export function usePaperSearch() {
	const api = useApi(searchPapers);

	const search = useCallback(
		(params: SearchParams) => api.execute(params),
		[api.execute],
	);

	return {
		...api,
		search,
	};
}

export function usePapersByDate() {
	const api = useApi(getPapersByDate);

	const fetchByDate = useCallback(
		(date: string, page?: number, limit?: number) =>
			api.execute(date, page, limit),
		[api.execute],
	);

	return {
		...api,
		fetchByDate,
	};
}

export function usePaperDetail() {
	const api = useApi(getPaperDetail);

	const fetchDetail = useCallback(
		(identifier: string) => api.execute(identifier),
		[api.execute],
	);

	return {
		...api,
		fetchDetail,
	};
}

export function useCategories() {
	const api = useApi(getCategories);

	const fetchCategories = useCallback(() => api.execute(), [api.execute]);

	return {
		...api,
		fetchCategories,
	};
}
