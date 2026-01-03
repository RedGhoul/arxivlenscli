import {Buffer} from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';

const CACHE_DIR = path.join(os.tmpdir(), 'arxivlens-pdf-cache');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(url: string): string {
	return createHash('md5').update(url).digest('hex');
}

function getCachePath(url: string): string {
	const key = getCacheKey(url);
	return path.join(CACHE_DIR, `${key}.pdf`);
}

export async function downloadPdf(url: string): Promise<string> {
	// Ensure cache directory exists
	await fs.promises.mkdir(CACHE_DIR, {recursive: true});

	const cachePath = getCachePath(url);

	// Check if cached and not expired
	try {
		const stat = await fs.promises.stat(cachePath);
		if (Date.now() - stat.mtimeMs < CACHE_TTL_MS) {
			return cachePath;
		}
	} catch {
		// File doesn't exist, proceed with download
	}

	// Download PDF
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download PDF: ${response.statusText}`);
	}

	const buffer = await response.arrayBuffer();
	await fs.promises.writeFile(cachePath, Buffer.from(buffer));

	return cachePath;
}

export async function clearPdfCache(): Promise<void> {
	try {
		await fs.promises.rm(CACHE_DIR, {recursive: true, force: true});
	} catch {
		// Ignore errors
	}
}
