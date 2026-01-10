import type {DownloadRecord} from '../config/settings.js';
import {getSettings, updateSettings} from '../config/settings.js';

export function addToHistory(record: DownloadRecord): void {
	const settings = getSettings();
	const newHistory = [record, ...settings.downloadHistory];
	const uniqueHistory = [
		...new Map(newHistory.map(item => [item.paperId, item])).values(),
	];
	updateSettings({downloadHistory: uniqueHistory.slice(0, 100)});
}

export function getHistory(): DownloadRecord[] {
	const settings = getSettings();
	return settings.downloadHistory;
}

export function clearHistory(): void {
	updateSettings({downloadHistory: []});
}

export function isAlreadyDownloaded(paperId: string): boolean {
	const settings = getSettings();
	return settings.downloadHistory.some(record => record.paperId === paperId);
}

export function removeFromHistory(paperId: string): void {
	const settings = getSettings();
	const newHistory = settings.downloadHistory.filter(
		record => record.paperId !== paperId,
	);
	updateSettings({downloadHistory: newHistory});
}
