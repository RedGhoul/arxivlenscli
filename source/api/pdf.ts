import {Buffer} from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {PDF_CACHE_TTL_MS} from '../config/constants.js';

const CACHE_DIR = path.join(os.tmpdir(), 'arxivlens-pdf-cache');

/**
 * In-memory lock to prevent concurrent downloads of the same PDF.
 * Maps URL to a Promise that resolves when the download completes.
 */
const downloadLocks = new Map<string, Promise<string>>();

function getCacheKey(url: string): string {
	// Use SHA-256 instead of MD5 for stronger collision resistance
	return createHash('sha256').update(url).digest('hex');
}

function getCachePath(url: string): string {
	const key = getCacheKey(url);
	return path.join(CACHE_DIR, `${key}.pdf`);
}

async function verifyFileIntegrity(filePath: string): Promise<boolean> {
	try {
		const stats = await fs.promises.stat(filePath);

		if (stats.size === 0) {
			return false;
		}

		await fs.promises.access(filePath, fs.constants.R_OK);

		if (!filePath.toLowerCase().endsWith('.pdf')) {
			return false;
		}

		const buffer = await fs.promises.readFile(filePath, {encoding: null});

		if (buffer.length < 4) {
			return false;
		}

		const header = buffer.toString('ascii', 0, 4);

		if (header !== '%PDF') {
			return false;
		}

		return true;
	} catch {
		// Cache file unreadable or corrupted - treat as invalid
		return false;
	}
}

/**
 * Internal function that performs the actual download.
 * Should only be called through downloadPdf which handles locking.
 */
async function downloadPdfInternal(url: string): Promise<string> {
	await fs.promises.mkdir(CACHE_DIR, {recursive: true});

	const cachePath = getCachePath(url);

	try {
		const stat = await fs.promises.stat(cachePath);
		if (Date.now() - stat.mtimeMs < PDF_CACHE_TTL_MS) {
			const isValid = await verifyFileIntegrity(cachePath);
			if (isValid) {
				return cachePath;
			}
		}
	} catch {
		// Cache miss or file doesn't exist - proceed to download
	}

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download PDF: ${response.statusText}`);
	}

	const buffer = await response.arrayBuffer();

	if (buffer.byteLength < 4) {
		throw new Error('Downloaded file is too small to be a valid PDF');
	}

	const header = Buffer.from(buffer).toString('ascii', 0, 4);

	if (header !== '%PDF') {
		throw new Error('Downloaded file is not a valid PDF');
	}

	await fs.promises.writeFile(cachePath, Buffer.from(buffer));

	const isValid = await verifyFileIntegrity(cachePath);
	if (!isValid) {
		throw new Error('Downloaded PDF is corrupted');
	}

	return cachePath;
}

/**
 * Downloads a PDF and caches it locally.
 * Uses locking to prevent concurrent downloads of the same URL,
 * which could corrupt the cache file.
 */
export async function downloadPdf(url: string): Promise<string> {
	// Check if this URL is already being downloaded
	const existingDownload = downloadLocks.get(url);
	if (existingDownload) {
		// Wait for the existing download to complete
		return existingDownload;
	}

	// Create a new download promise and store it
	const downloadPromise = downloadPdfInternal(url).finally(() => {
		// Clean up the lock when done (success or failure)
		downloadLocks.delete(url);
	});

	downloadLocks.set(url, downloadPromise);

	return downloadPromise;
}

export async function clearPdfCache(): Promise<void> {
	try {
		await fs.promises.rm(CACHE_DIR, {recursive: true, force: true});
	} catch {
		// Ignore errors when clearing cache - directory may not exist
	}
}
