import Conf from 'conf';

export interface Settings {
	resultsPerPage: number;
	defaultSort: 'relevance' | 'date' | 'citations';
	showTwoLineSummaries: boolean;
	compactMode: boolean;
	autoRefreshKeyFindings: boolean;
	colorScheme: 'default' | 'monochrome' | 'high-contrast';
}

const defaults: Settings = {
	resultsPerPage: 20,
	defaultSort: 'relevance',
	showTwoLineSummaries: true,
	compactMode: false,
	autoRefreshKeyFindings: true,
	colorScheme: 'default',
};

const config = new Conf<Settings>({
	projectName: 'arxivlens-cli',
	defaults,
});

export function getSettings(): Settings {
	return {
		resultsPerPage: config.get('resultsPerPage'),
		defaultSort: config.get('defaultSort'),
		showTwoLineSummaries: config.get('showTwoLineSummaries'),
		compactMode: config.get('compactMode'),
		autoRefreshKeyFindings: config.get('autoRefreshKeyFindings'),
		colorScheme: config.get('colorScheme'),
	};
}

export function getSetting<K extends keyof Settings>(key: K): Settings[K] {
	return config.get(key);
}

export function updateSetting<K extends keyof Settings>(
	key: K,
	value: Settings[K],
): void {
	config.set(key, value);
}

export function updateSettings(updates: Partial<Settings>): void {
	for (const [key, value] of Object.entries(updates)) {
		config.set(key as keyof Settings, value);
	}
}

export function resetSettings(): void {
	config.clear();
}

export const settingsConfig = config;
