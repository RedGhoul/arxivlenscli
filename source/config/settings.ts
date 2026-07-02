import Conf from 'conf';

export interface DownloadRecord {
	paperId: string;
	title: string;
	downloadedAt: string;
	filePath: string;
}

export interface Settings {
	resultsPerPage: number;
	defaultSort: 'relevance' | 'date' | 'citations';
	showTwoLineSummaries: boolean;
	compactMode: boolean;
	autoRefreshKeyFindings: boolean;
	colorScheme: 'default' | 'monochrome' | 'high-contrast' | 'mr-robot';
	downloadPath: string | null;
	maxConcurrentDownloads: number;
	fileNameFormat: 'title+id' | 'id-only';
	downloadHistory: DownloadRecord[];
	searchHistory: string[];
}

const defaults: Settings = {
	resultsPerPage: 20,
	defaultSort: 'relevance',
	showTwoLineSummaries: true,
	compactMode: false,
	autoRefreshKeyFindings: true,
	colorScheme: 'default',
	downloadPath: null,
	maxConcurrentDownloads: 3,
	fileNameFormat: 'title+id',
	downloadHistory: [],
	searchHistory: [],
};

const config = new Conf<Settings>({
	projectName: 'arxivlens-cli',
	defaults,
});

function validateSettings(settings: Partial<Settings>): void {
	if (settings.resultsPerPage !== undefined) {
		const validSizes = [10, 20, 50];
		if (!validSizes.includes(settings.resultsPerPage)) {
			throw new TypeError(
				`Invalid resultsPerPage: ${
					settings.resultsPerPage
				}. Must be one of: ${validSizes.join(', ')}`,
			);
		}
	}

	if (settings.maxConcurrentDownloads !== undefined) {
		if (
			settings.maxConcurrentDownloads < 1 ||
			settings.maxConcurrentDownloads > 5
		) {
			throw new TypeError(
				`Invalid maxConcurrentDownloads: ${settings.maxConcurrentDownloads}. Must be between 1 and 5`,
			);
		}
	}

	if (settings.defaultSort !== undefined) {
		const validSorts = ['relevance', 'date', 'citations'];
		if (!validSorts.includes(settings.defaultSort)) {
			throw new TypeError(
				`Invalid defaultSort: ${
					settings.defaultSort
				}. Must be one of: ${validSorts.join(', ')}`,
			);
		}
	}

	if (settings.colorScheme !== undefined) {
		const validSchemes = ['default', 'monochrome', 'high-contrast', 'mr-robot'];
		if (!validSchemes.includes(settings.colorScheme)) {
			throw new TypeError(
				`Invalid colorScheme: ${
					settings.colorScheme
				}. Must be one of: ${validSchemes.join(', ')}`,
			);
		}
	}

	if (settings.fileNameFormat !== undefined) {
		const validFormats = ['title+id', 'id-only'];
		if (!validFormats.includes(settings.fileNameFormat)) {
			throw new TypeError(
				`Invalid fileNameFormat: ${
					settings.fileNameFormat
				}. Must be one of: ${validFormats.join(', ')}`,
			);
		}
	}

	if (settings.searchHistory !== undefined) {
		if (!Array.isArray(settings.searchHistory)) {
			throw new TypeError('Invalid searchHistory: must be an array');
		}
	}

	if (settings.downloadPath !== undefined && settings.downloadPath !== null) {
		if (typeof settings.downloadPath !== 'string') {
			throw new TypeError('Invalid downloadPath: must be a string or null');
		}

		if (settings.downloadPath.trim().length === 0) {
			throw new TypeError('Invalid downloadPath: cannot be empty string');
		}
	}
}

export function getSettings(): Settings {
	try {
		return {
			resultsPerPage: config.get('resultsPerPage'),
			defaultSort: config.get('defaultSort'),
			showTwoLineSummaries: config.get('showTwoLineSummaries'),
			compactMode: config.get('compactMode'),
			autoRefreshKeyFindings: config.get('autoRefreshKeyFindings'),
			colorScheme: config.get('colorScheme'),
			downloadPath: config.get('downloadPath'),
			maxConcurrentDownloads: config.get('maxConcurrentDownloads'),
			fileNameFormat: config.get('fileNameFormat'),
			downloadHistory: config.get('downloadHistory'),
			searchHistory: config.get('searchHistory'),
		};
	} catch {
		// Config file may be corrupted or inaccessible - return defaults
		// This is a graceful fallback to ensure the app can still function
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
	} catch {
		// Silently fail if config cannot be written (e.g., permission issues)
		// The app will continue with in-memory values until next restart
	}
}

export function updateSettings(updates: Partial<Settings>): {
	success: boolean;
	error?: string;
} {
	try {
		validateSettings(updates);
		for (const [key, value] of Object.entries(updates)) {
			config.set(key as keyof Settings, value);
		}

		return {success: true};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to save settings',
		};
	}
}

export function resetSettings(): void {
	try {
		config.clear();
	} catch {
		// Config clear failed (e.g., permission issues)
		// User may need to manually delete config file
	}
}

export const settingsConfig = config;
