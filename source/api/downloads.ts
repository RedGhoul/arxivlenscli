import {Buffer} from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import type {PaperListItem} from './types.js';
import type {Settings} from '../config/settings.js';

const MAX_FILENAME_LENGTH = 200;

export async function checkFileExists(filePath: string): Promise<boolean> {
	try {
		await fs.promises.access(filePath);
		return true;
	} catch {
		return false;
	}
}

export function sanitizeFileName(name: string): string {
	let sanitized = name
		.replace(/[<>:"/\\|?*]/g, '-')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();

	if (sanitized.length > MAX_FILENAME_LENGTH) {
		sanitized = sanitized.slice(0, MAX_FILENAME_LENGTH);
	}

	return sanitized;
}

export function generateFileName(
	paper: PaperListItem,
	settings: Settings,
): string {
	if (settings.fileNameFormat === 'id-only') {
		return `${paper.paperId}.pdf`;
	}

	const sanitizedTitle = sanitizeFileName(paper.title);
	return `${sanitizedTitle}-${paper.paperId}.pdf`;
}

export function getDownloadPath(
	basePath: string,
	paper: PaperListItem,
	settings: Settings,
): string {
	const fileName = generateFileName(paper, settings);
	return path.join(basePath, fileName);
}

export interface DownloadProgress {
	downloaded: number;
	total: number;
	percentage: number;
}

export interface DownloadOptions {
	onProgress?: (progress: DownloadProgress) => void;
	signal?: AbortSignal;
}

export async function downloadPaper(
	paper: PaperListItem,
	downloadPath: string,
	options?: DownloadOptions,
): Promise<string> {
	const dir = path.dirname(downloadPath);
	await fs.promises.mkdir(dir, {recursive: true});

	if (await checkFileExists(downloadPath)) {
		return downloadPath;
	}

	const response = await fetch(paper.pdfLink, {signal: options?.signal});

	if (!response.ok) {
		throw new Error(`Failed to download PDF: ${response.statusText}`);
	}

	const total = Number(response.headers.get('content-length')) || 0;
	let downloaded = 0;
	const chunks: Uint8Array[] = [];

	const reader = response.body?.getReader();
	if (!reader) {
		throw new Error('Response body is not readable');
	}

	// eslint-disable-next-line no-constant-condition -- This is the correct pattern for reading from a ReadableStream
	while (true) {
		// eslint-disable-next-line no-await-in-loop -- This is required for reading from a ReadableStream
		const {done, value} = await reader.read();
		if (done) break;

		chunks.push(value);
		downloaded += value.length;

		if (options?.onProgress) {
			options.onProgress({
				downloaded,
				total,
				percentage: total > 0 ? (downloaded / total) * 100 : 0,
			});
		}
	}

	const buffer = Buffer.concat(chunks);
	await fs.promises.writeFile(downloadPath, buffer);

	return downloadPath;
}

export async function promptForDownloadPath(
	defaultPath?: string,
): Promise<string> {
	const process = await import('node:process');
	const downloadPath = defaultPath || process.cwd();

	return downloadPath;
}
