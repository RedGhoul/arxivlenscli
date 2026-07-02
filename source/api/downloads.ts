import {Buffer} from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import type {PaperListItem} from './types.js';
import type {Settings} from '../config/settings.js';
import {DOWNLOAD_TIMEOUT_MS} from '../config/constants.js';

const MAX_FILENAME_LENGTH = 200;

export async function checkFileExists(filePath: string): Promise<boolean> {
	try {
		await fs.promises.access(filePath);
		return true;
	} catch {
		// File doesn't exist or is inaccessible - treat as non-existent
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
	validateDownloadPath(basePath);
	validateDownloadPath(settings.downloadPath || './downloads');

	const fileName = generateFileName(paper, settings);
	return path.join(basePath, fileName);
}

/**
 * Validates a download path to prevent path traversal attacks.
 * Uses path.resolve() for proper normalization and validates
 * the path doesn't contain dangerous patterns.
 */
export function validateDownloadPath(downloadPath: string): void {
	if (typeof downloadPath !== 'string') {
		throw new TypeError('Invalid download path: must be a string');
	}

	if (downloadPath.trim().length === 0) {
		throw new TypeError('Invalid download path: cannot be empty');
	}

	// Resolve to absolute path to catch any traversal attempts
	const resolvedPath = path.resolve(downloadPath);
	const normalizedInput = path.normalize(downloadPath);

	// Check for path traversal attempts (.. sequences)
	// This catches both forward and backward slashes on all platforms
	if (normalizedInput.includes('..')) {
		throw new TypeError(
			'Invalid download path: path traversal characters detected',
		);
	}

	// Check for shell expansion characters that could be exploited
	const dangerousPatterns = [
		/\${/, // Shell variable expansion ${...}
		/\$\(/, // Command substitution $(...)
		/`/, // Backtick command substitution
		/%[a-zA-Z]+%/, // Windows environment variables %VAR%
	];

	for (const pattern of dangerousPatterns) {
		if (pattern.test(downloadPath)) {
			throw new TypeError(
				'Invalid download path: shell expansion characters detected',
			);
		}
	}

	// On Windows, prevent access to system-critical directories
	if (process.platform === 'win32') {
		const lowerPath = resolvedPath.toLowerCase();
		const restrictedPaths = [
			'c:\\windows',
			'c:\\program files',
			'c:\\program files (x86)',
			'c:\\programdata',
		];
		for (const restricted of restrictedPaths) {
			if (lowerPath.startsWith(restricted)) {
				throw new TypeError(
					'Invalid download path: cannot write to system directories',
				);
			}
		}
	}

	// On Unix, prevent access to system directories
	if (process.platform !== 'win32') {
		const restrictedPaths = [
			'/bin',
			'/sbin',
			'/usr',
			'/etc',
			'/var',
			'/sys',
			'/proc',
		];
		for (const restricted of restrictedPaths) {
			if (resolvedPath.startsWith(restricted)) {
				throw new TypeError(
					'Invalid download path: cannot write to system directories',
				);
			}
		}
	}
}

export interface DownloadProgress {
	downloaded: number;
	total: number;
	percentage: number;
}

export interface DownloadOptions {
	onProgress?: (progress: DownloadProgress) => void;
	signal?: AbortSignal;
	/** Timeout in milliseconds. Defaults to 5 minutes. */
	timeoutMs?: number;
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

	// Set up timeout protection
	const timeoutMs = options?.timeoutMs ?? DOWNLOAD_TIMEOUT_MS;
	const timeoutController = new AbortController();
	const timeoutId = setTimeout(() => {
		timeoutController.abort();
	}, timeoutMs);

	// Combine user signal with timeout signal
	const combinedSignal = options?.signal
		? AbortSignal.any([options.signal, timeoutController.signal])
		: timeoutController.signal;

	try {
		const response = await fetch(paper.pdfLink, {signal: combinedSignal});

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
	} catch (error) {
		// Provide clearer error message for timeout
		if (
			error instanceof Error &&
			error.name === 'AbortError' &&
			timeoutController.signal.aborted
		) {
			throw new Error(`Download timed out after ${timeoutMs / 1000} seconds`);
		}

		throw error;
	} finally {
		clearTimeout(timeoutId);
	}
}

export async function promptForDownloadPath(
	defaultPath?: string,
): Promise<string> {
	const process = await import('node:process');
	const downloadPath = defaultPath || process.cwd();

	return downloadPath;
}
