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
	// Track current loading operation to prevent race conditions
	const loadingIdRef = useRef(0);
	const cacheRef = useRef<{
		text: Map<number, PdfTextPage>;
		images: Map<number, PdfImagePage>;
	}>({text: new Map(), images: new Map()});

	// Load PDF on mount
	useEffect(() => {
		let cancelled = false;
		// Increment loading ID to track this specific load operation
		const currentLoadId = ++loadingIdRef.current;

		// Destroy previous PDF document before loading new one
		if (pdfDocRef.current) {
			try {
				pdfDocRef.current.destroy();
			} catch {
				// PDF document may already be destroyed or invalid
			}

			pdfDocRef.current = null;
		}

		// Clear caches when URL changes
		cacheRef.current.text.clear();
		cacheRef.current.images.clear();

		const loadPdf = async () => {
			try {
				setState(s => ({...s, loading: true, error: null}));

				const filePath = await downloadPdf(pdfUrl);
				// Check if this load operation is still current
				if (cancelled || currentLoadId !== loadingIdRef.current) return;

				const pdfDoc = await loadPdfDocument(filePath);
				// Check again after async operation
				if (cancelled || currentLoadId !== loadingIdRef.current) {
					pdfDoc.destroy();
					return;
				}

				pdfDocRef.current = pdfDoc;

				// Load first page text
				const textContent = await extractPageText(pdfDoc, 1);
				if (cancelled || currentLoadId !== loadingIdRef.current) return;

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
				if (cancelled || currentLoadId !== loadingIdRef.current) return;
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

		void loadPdf();

		return () => {
			cancelled = true;
			// Only destroy if this cleanup is for the current document
			// Note: currentLoadId is captured at effect creation time, which is the correct behavior
			// eslint-disable-next-line react-hooks/exhaustive-deps -- currentLoadId is intentionally captured at effect creation
			const isCurrentLoad = currentLoadId === loadingIdRef.current;
			if (isCurrentLoad && pdfDocRef.current) {
				try {
					pdfDocRef.current.destroy();
				} catch {
					// PDF document may already be destroyed or invalid
				}

				pdfDocRef.current = null;
			}
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
