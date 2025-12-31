import {useCallback} from 'react';
import {useApi} from './useApi.js';
import {getKeyFindings} from '../api/keyFindings.js';

export function useKeyFindings() {
	const api = useApi(getKeyFindings);

	const fetchKeyFindings = useCallback(
		(paperId: string) => api.execute(paperId),
		[api.execute],
	);

	return {
		...api,
		fetchKeyFindings,
	};
}
