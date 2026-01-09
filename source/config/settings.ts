import Conf from 'conf';

export interface Settings {
	resultsPerPage: number;
	defaultSort: 'relevance' | 'date' | 'citations';
	showTwoLineSummaries: boolean;
	compactMode: boolean;
	autoRefreshKeyFindings: boolean;
	colorScheme: 'default' | 'monochrome' | 'high-contrast' | 'mr-robot';
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
	try {
		return {
			resultsPerPage: config.get('resultsPerPage'),
			defaultSort: config.get('defaultSort'),
			showTwoLineSummaries: config.get('showTwoLineSummaries'),
			compactMode: config.get('compactMode'),
			autoRefreshKeyFindings: config.get('autoRefreshKeyFindings'),
			colorScheme: config.get('colorScheme'),
		};
	} catch {
		return defaults;
	}
}

export function getSetting<K extends keyof Settings>(key: K): Settings[K] {
	return config.get(key);
}

export function updateSetting<K extends keyof Settings>(
	key: K,
	value: Settings[K],
): void {
	try {
		config.set(key, value);
	} catch {}
}

export function updateSettings(updates: Partial<Settings>): void {
	try {
		for (const [key, value] of Object.entries(updates)) {
			config.set(key as keyof Settings, value);
		}
	} catch {}
}

export function resetSettings(): void {
	try {
		config.clear();
	} catch {}
}

export const settingsConfig = config;
