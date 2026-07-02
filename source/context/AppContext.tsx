import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode,
} from 'react';
import type {Route} from '../utils/constants.js';
import type {PaperListItem, SearchParams} from '../api/types.js';
import type {Settings} from '../config/settings.js';
import {
	getSettings,
	updateSettings as updateConfigSettings,
} from '../config/settings.js';
import {validateDownloadPath} from '../api/downloads.js';

interface NavigationState {
	route: Route;
	params: Record<string, unknown>;
	history: Array<{route: Route; params: Record<string, unknown>}>;
}

interface AppState {
	navigation: NavigationState;
	navigate: (route: Route, params?: Record<string, unknown>) => void;
	goBack: () => void;
	canGoBack: boolean;

	selectedPaper: PaperListItem | null;
	setSelectedPaper: (paper: PaperListItem | null) => void;

	lastSearchParams: SearchParams | null;
	setLastSearchParams: (params: SearchParams | null) => void;

	papersList: PaperListItem[];
	setPapersList: (papers: PaperListItem[]) => void;

	settings: Settings;
	updateSettings: (settings: Partial<Settings>) => {
		success: boolean;
		error?: string;
	};

	showHelp: boolean;
	toggleHelp: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({children}: {children: ReactNode}) {
	const [navigation, setNavigation] = useState<NavigationState>({
		route: 'main-menu',
		params: {},
		history: [],
	});
	const [selectedPaper, setSelectedPaper] = useState<PaperListItem | null>(
		null,
	);
	const [lastSearchParams, setLastSearchParams] = useState<SearchParams | null>(
		null,
	);
	const [papersList, setPapersList] = useState<PaperListItem[]>([]);
	const [settings, setSettings] = useState<Settings>(getSettings());
	const [showHelp, setShowHelp] = useState(false);

	const toggleHelp = useCallback(() => {
		setShowHelp(prev => !prev);
	}, []);

	const updateSettings = useCallback(
		(updates: Partial<Settings>): {success: boolean; error?: string} => {
			// Validate download path before persisting
			if (updates.downloadPath !== undefined && updates.downloadPath !== null) {
				try {
					validateDownloadPath(updates.downloadPath);
				} catch (error) {
					return {
						success: false,
						error:
							error instanceof Error ? error.message : 'Invalid download path',
					};
				}
			}

			const result = updateConfigSettings(updates);
			if (result.success) {
				setSettings(prev => ({...prev, ...updates}));
			}

			return result;
		},
		[],
	);

	const navigate = useCallback(
		(route: Route, params: Record<string, unknown> = {}) => {
			setNavigation(prev => ({
				route,
				params,
				history: [...prev.history, {route: prev.route, params: prev.params}],
			}));
		},
		[],
	);

	const goBack = useCallback(() => {
		setNavigation(prev => {
			if (prev.history.length === 0) return prev;
			const history = [...prev.history];
			const last = history.pop();
			// Defensive check - should never be undefined due to length check above
			if (!last) return prev;
			return {
				route: last.route,
				params: last.params,
				history,
			};
		});
	}, []);

	const canGoBack = navigation.history.length > 0;

	return (
		<AppContext.Provider
			value={{
				navigation,
				navigate,
				goBack,
				canGoBack,
				selectedPaper,
				setSelectedPaper,
				lastSearchParams,
				setLastSearchParams,
				papersList,
				setPapersList,
				settings,
				updateSettings,
				showHelp,
				toggleHelp,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export function useApp(): AppState {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useApp must be used within an AppProvider');
	}

	return context;
}
