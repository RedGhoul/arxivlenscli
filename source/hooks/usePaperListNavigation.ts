import {useState, useEffect, useCallback} from 'react';
import {useInput} from 'ink';
import type {PaperListItem} from '../api/types.js';

export interface UsePaperListNavigationOptions {
	papers: PaperListItem[];
	loading: boolean;
	page: number;
	hasNext: boolean;
	hasPrev: boolean;
	onSelectPaper: (paper: PaperListItem) => void;
	onPreviousPage?: () => void;
	onNextPage?: () => void;
	onGoBack: () => void;
	onDownload?: (papers: PaperListItem[]) => void;
	enableDownloadSelection?: boolean;
}

export interface UsePaperListNavigationResult {
	selectedIndex: number;
	selectedForDownload: Set<string>;
	toggleDownloadSelection: () => void;
}

export function usePaperListNavigation({
	papers,
	loading,
	page,
	hasNext,
	hasPrev,
	onSelectPaper,
	onPreviousPage,
	onNextPage,
	onGoBack,
	onDownload,
	enableDownloadSelection = false,
}: UsePaperListNavigationOptions): UsePaperListNavigationResult {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [selectedForDownload, setSelectedForDownload] = useState<Set<string>>(
		new Set(),
	);

	// Reset selection when page changes
	useEffect(() => {
		setSelectedIndex(0);
		if (enableDownloadSelection) {
			setSelectedForDownload(new Set());
		}
	}, [page, enableDownloadSelection]);

	const toggleDownloadSelection = useCallback(() => {
		const paper = papers[selectedIndex];
		if (!paper || !enableDownloadSelection) return;

		setSelectedForDownload(prev => {
			const newSet = new Set(prev);
			if (newSet.has(paper.paperId)) {
				newSet.delete(paper.paperId);
			} else {
				newSet.add(paper.paperId);
			}

			return newSet;
		});
	}, [papers, selectedIndex, enableDownloadSelection]);

	useInput((input, key) => {
		if (loading) return;

		// Back navigation
		if (key.escape || input === 'q') {
			onGoBack();
			return;
		}

		if (papers.length === 0) return;

		// Vertical navigation
		if (key.upArrow) {
			setSelectedIndex(prev => Math.max(0, prev - 1));
		}

		if (key.downArrow) {
			const maxIndex = papers.length - 1;
			setSelectedIndex(prev => Math.min(maxIndex, prev + 1));
		}

		// Select paper
		if (key.return && papers[selectedIndex]) {
			onSelectPaper(papers[selectedIndex]);
		}

		// Download selection
		if (enableDownloadSelection) {
			if (input === ' ' && papers[selectedIndex]) {
				toggleDownloadSelection();
			}

			if (input === 'd' && selectedForDownload.size > 0 && onDownload) {
				const selectedPapers = papers.filter(paper =>
					selectedForDownload.has(paper.paperId),
				);
				onDownload(selectedPapers);
			}
		}

		// Pagination
		if ((input === 'p' || key.leftArrow) && hasPrev && onPreviousPage) {
			onPreviousPage();
		}

		if ((input === 'n' || key.rightArrow) && hasNext && onNextPage) {
			onNextPage();
		}
	});

	return {
		selectedIndex,
		selectedForDownload,
		toggleDownloadSelection,
	};
}
