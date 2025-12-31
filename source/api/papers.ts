import {apiClient} from './client.js';
import type {
	PaperSearchResponse,
	PapersByDateResponse,
	PaperDetailResponse,
	CategoriesResponse,
	SearchParams,
} from './types.js';

export async function searchPapers(
	params: SearchParams,
): Promise<PaperSearchResponse> {
	const response = await apiClient.get<PaperSearchResponse>('/papers', {
		params: {
			query: params.query,
			rankBy: params.rankBy,
			page: params.page || 1,
			pageSize: params.pageSize || 20,
			dateFrom: params.dateFrom,
			dateTo: params.dateTo,
			categories: params.categories?.join(','),
			prioritizeRecent: params.prioritizeRecent,
			prioritizeCited: params.prioritizeCited,
		},
	});
	return response.data;
}

export async function getPapersByDate(
	date: string,
	page = 1,
	limit = 20,
): Promise<PapersByDateResponse> {
	const response = await apiClient.get<PapersByDateResponse>(
		`/papers/by-date/${date}`,
		{
			params: {page, limit},
		},
	);
	return response.data;
}

export async function getPaperDetail(
	identifier: string,
): Promise<PaperDetailResponse> {
	const response = await apiClient.get<PaperDetailResponse>(
		`/papers/${identifier}`,
	);
	return response.data;
}

export async function getCategories(): Promise<CategoriesResponse> {
	const response = await apiClient.get<CategoriesResponse>('/arxiv/categories');
	return response.data;
}
