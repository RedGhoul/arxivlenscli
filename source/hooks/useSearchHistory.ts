import {useCallback, useMemo} from 'react';
import {useApp} from '../context/AppContext.js';
import {MAX_SEARCH_HISTORY} from '../config/constants.js';

export function useSearchHistory() {
	const {settings, updateSettings} = useApp();

	const history = useMemo<string[]>(
		() => settings.searchHistory ?? [],
		[settings.searchHistory],
	);

	const addToHistory = useCallback(
		(query: string) => {
			const trimmed = query.trim();
			if (!trimmed) return;

			const filtered = history.filter(
				h => h.toLowerCase() !== trimmed.toLowerCase(),
			);
			const updated = [trimmed, ...filtered].slice(0, MAX_SEARCH_HISTORY);
			updateSettings({searchHistory: updated});
		},
		[history, updateSettings],
	);

	const clearHistory = useCallback(() => {
		updateSettings({searchHistory: []});
	}, [updateSettings]);

	const getMatches = useCallback(
		(prefix: string, limit = 5): string[] => {
			if (!prefix.trim()) return [];
			const lower = prefix.toLowerCase();
			return history
				.filter(h => h.toLowerCase().startsWith(lower))
				.slice(0, limit);
		},
		[history],
	);

	return {
		history,
		addToHistory,
		clearHistory,
		getMatches,
	};
}
