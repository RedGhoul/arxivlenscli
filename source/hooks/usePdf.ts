import {useState, useCallback, useRef, useEffect} from 'react';
import {downloadPdf} from '../api/pdf.js';
import {
	loadPdfDocument,
	extractPageText,
	renderPageToImage,
	type PdfTextPage,
	type PdfImagePage,
} from '../utils/pdfRenderer.js';

type PdfDocumentProxy = Awaited<ReturnType<typeof loadPdfDocument>>;

type UsePdfState = {
	loading: boolean;
	error: string | null;
	totalPages: number;
	currentPage: number;
	textContent: PdfTextPage | null;
	imageContent: PdfImagePage | null;
};

export function usePdf(pdfUrl: string) {
	const [state, setState] = useState<UsePdfState>({
		loading: true,
		error: null,
		totalPages: 0,
		currentPage: 1,
		textContent: null,
		imageContent: null,
	});

	const pdfDocRef = useRef<PdfDocumentProxy | null>(null);
	const cacheRef = useRef<{
		text: Map<number, PdfTextPage>;
		images: Map<number, PdfImagePage>;
	}>({text: new Map(), images: new Map()});

	// Load PDF on mount
	useEffect(() => {
		let cancelled = false;

		const loadPdf = async () => {
			try {
				setState(s => ({...s, loading: true, error: null}));

				const filePath = await downloadPdf(pdfUrl);
				if (cancelled) return;

				const pdfDoc = await loadPdfDocument(filePath);
				if (cancelled) {
					pdfDoc.destroy();
					return;
				}

				pdfDocRef.current = pdfDoc;

				// Load first page text
				const textContent = await extractPageText(pdfDoc, 1);
				if (cancelled) return;

				cacheRef.current.text.set(1, textContent);

				setState({
					loading: false,
					error: null,
					totalPages: pdfDoc.numPages,
					currentPage: 1,
					textContent,
					imageContent: null,
				});
			} catch (err) {
				if (cancelled) return;
				const rawMessage =
					err instanceof Error ? err.message : 'Failed to load PDF';
				// Provide user-friendly error messages
				let userMessage = 'This PDF cannot be viewed in the terminal.';
				if (
					rawMessage.includes('Invalid PDF') ||
					rawMessage.includes('PDF structure')
				) {
					userMessage =
						'This PDF cannot be opened. The file may be corrupted or in an unsupported format.';
				} else if (rawMessage.includes('download')) {
					userMessage =
						'Unable to download the PDF. Please check your internet connection.';
				} else if (rawMessage.includes('password')) {
					userMessage = 'This PDF is password-protected and cannot be viewed.';
				}

				setState(s => ({
					...s,
					loading: false,
					error: userMessage,
				}));
			}
		};

		loadPdf();

		return () => {
			cancelled = true;
			pdfDocRef.current?.destroy();
		};
	}, [pdfUrl]);

	const goToPage = useCallback(async (pageNumber: number) => {
		const pdfDoc = pdfDocRef.current;
		if (!pdfDoc || pageNumber < 1 || pageNumber > pdfDoc.numPages) {
			return;
		}

		setState(s => ({...s, loading: true}));

		try {
			// Check cache first
			let textContent = cacheRef.current.text.get(pageNumber);
			if (!textContent) {
				textContent = await extractPageText(pdfDoc, pageNumber);
				cacheRef.current.text.set(pageNumber, textContent);
			}

			setState(s => ({
				...s,
				loading: false,
				currentPage: pageNumber,
				textContent,
				imageContent: null,
			}));
		} catch (err) {
			setState(s => ({
				...s,
				loading: false,
				error: err instanceof Error ? err.message : 'Failed to load page',
			}));
		}
	}, []);

	const loadPageImage = useCallback(async (pageNumber: number) => {
		const pdfDoc = pdfDocRef.current;
		if (!pdfDoc) return null;

		// Check cache
		let imageContent = cacheRef.current.images.get(pageNumber);
		if (!imageContent) {
			imageContent = await renderPageToImage(pdfDoc, pageNumber);
			cacheRef.current.images.set(pageNumber, imageContent);
		}

		setState(s => ({...s, imageContent}));
		return imageContent;
	}, []);

	const nextPage = useCallback(() => {
		if (state.currentPage < state.totalPages) {
			goToPage(state.currentPage + 1);
		}
	}, [state.currentPage, state.totalPages, goToPage]);

	const prevPage = useCallback(() => {
		if (state.currentPage > 1) {
			goToPage(state.currentPage - 1);
		}
	}, [state.currentPage, goToPage]);

	return {
		...state,
		goToPage,
		nextPage,
		prevPage,
		loadPageImage,
	};
}
