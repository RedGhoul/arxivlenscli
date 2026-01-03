import type {Buffer} from 'node:buffer';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import {createCanvas, type Canvas} from '@napi-rs/canvas';

// Configure pdfjs worker
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workerPath = path.join(
	__dirname,
	'../../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs',
);
pdfjs.GlobalWorkerOptions.workerSrc = workerPath;

export type PdfTextPage = {
	pageNumber: number;
	text: string;
	lines: string[];
};

export type PdfImagePage = {
	pageNumber: number;
	imageBuffer: Buffer;
	width: number;
	height: number;
};

type TextItem = {
	str: string;
	transform: number[];
};

export async function loadPdfDocument(
	filePath: string,
): Promise<pdfjs.PDFDocumentProxy> {
	const data = new Uint8Array(fs.readFileSync(filePath));
	return pdfjs.getDocument({
		data,
		useSystemFonts: true,
		// Suppress warnings - only show errors (VerbosityLevel.ERRORS = 0)
		verbosity: 0,
	}).promise;
}

export async function extractPageText(
	pdfDoc: pdfjs.PDFDocumentProxy,
	pageNumber: number,
): Promise<PdfTextPage> {
	const page = await pdfDoc.getPage(pageNumber);
	const textContent = await page.getTextContent();

	// Group text items by approximate Y position for line detection
	const items = textContent.items as TextItem[];

	const lineMap = new Map<number, string[]>();
	for (const item of items) {
		// Y position is transform[5], round to group nearby items
		const yValue = item.transform[5];
		if (typeof yValue !== 'number') continue;
		const yPos = Math.round(yValue);
		const existing = lineMap.get(yPos) ?? [];
		existing.push(item.str);
		lineMap.set(yPos, existing);
	}

	// Sort by Y position (descending for top-to-bottom reading)
	const sortedLines = [...lineMap.entries()]
		.sort((a, b) => b[0] - a[0])
		.map(([, lineItems]) => lineItems.join(' '));

	return {
		pageNumber,
		text: sortedLines.join('\n'),
		lines: sortedLines,
	};
}

export async function renderPageToImage(
	pdfDoc: pdfjs.PDFDocumentProxy,
	pageNumber: number,
	scale = 1.5,
): Promise<PdfImagePage> {
	const page = await pdfDoc.getPage(pageNumber);
	const viewport = page.getViewport({scale});

	const canvas: Canvas = createCanvas(
		Math.floor(viewport.width),
		Math.floor(viewport.height),
	);
	const ctx = canvas.getContext('2d');

	// Render PDF page to canvas
	// Using @napi-rs/canvas which is compatible but has different types than browser canvas
	await page.render({
		canvasContext: ctx as unknown as CanvasRenderingContext2D,
		viewport,
		canvas: canvas as unknown as HTMLCanvasElement,
	}).promise;

	return {
		pageNumber,
		imageBuffer: canvas.toBuffer('image/png'),
		width: Math.floor(viewport.width),
		height: Math.floor(viewport.height),
	};
}
