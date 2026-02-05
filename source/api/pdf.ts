import {Buffer} from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {PDF_CACHE_TTL_MS} from '../config/constants.js';

const CACHE_DIR = path.join(os.tmpdir(), 'arxivlens-pdf-cache');

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

export async function downloadPdf(url: string): Promise<string> {
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

export async function clearPdfCache(): Promise<void> {
	try {
		await fs.promises.rm(CACHE_DIR, {recursive: true, force: true});
	} catch {
		// Ignore errors when clearing cache - directory may not exist
	}
}
