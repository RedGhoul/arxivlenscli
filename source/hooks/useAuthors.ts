import {useCallback} from 'react';
import {useApi} from './useApi.js';
import {searchAuthors, getAuthorProfile} from '../api/authors.js';

export function useAuthorSearch() {
	const api = useApi(searchAuthors);

	const search = useCallback(
		(authorName: string, page?: number, pageSize?: number) =>
			api.execute(authorName, page, pageSize),
		[api],
	);

	return {
		...api,
		search,
	};
}

export function useAuthorProfile() {
	const api = useApi(getAuthorProfile);

	const fetchProfile = useCallback(
		(genSlug: string) => api.execute(genSlug),
		[api],
	);

	return {
		...api,
		fetchProfile,
	};
}
