import {Buffer} from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';

const CACHE_DIR = path.join(os.tmpdir(), 'arxivlens-pdf-cache');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function getCacheKey(url: string): string {
	return createHash('md5').update(url).digest('hex');
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
		return false;
	}
}

export async function downloadPdf(url: string): Promise<string> {
	await fs.promises.mkdir(CACHE_DIR, {recursive: true});

	const cachePath = getCachePath(url);

	try {
		const stat = await fs.promises.stat(cachePath);
		if (Date.now() - stat.mtimeMs < CACHE_TTL_MS) {
			const isValid = await verifyFileIntegrity(cachePath);
			if (isValid) {
				return cachePath;
			}
		}
	} catch {}

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
	} catch {}
}
