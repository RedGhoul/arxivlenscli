import {apiClient} from './client.js';
import type {AuthorSearchResponse, AuthorProfileResponse} from './types.js';

export async function searchAuthors(
	authorName: string,
	page = 1,
	pageSize = 10,
): Promise<AuthorSearchResponse> {
	const response = await apiClient.get<AuthorSearchResponse>('/authors', {
		params: {authorName, page, pageSize},
	});
	return response.data;
}

export async function getAuthorProfile(
	genSlug: string,
): Promise<AuthorProfileResponse> {
	const response = await apiClient.get<AuthorProfileResponse>(
		`/authors/${genSlug}`,
	);
	return response.data;
}
