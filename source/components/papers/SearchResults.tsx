import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Pagination} from '../common/Pagination.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {PaperListItem} from './PaperListItem.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {usePaperSearch} from '../../hooks/usePapers.js';
import {useApp} from '../../context/AppContext.js';
import {useTheme} from '../../theme/index.js';
import type {
	SearchParams,
	PaperListItem as PaperListItemType,
} from '../../api/types.js';

export function SearchResults() {
	const {params, navigate, goBack} = useNavigation();
	const {setSelectedPaper} = useApp();
	const {search, loading, error} = usePaperSearch();
	const {colors} = useTheme();

	const [papers, setPapers] = useState<PaperListItemType[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [selectedForDownload, setSelectedForDownload] = useState<Set<string>>(
		new Set(),
	);

	const title = (params['title'] as string) || 'Papers';
	const searchParams = params['searchParams'] as SearchParams;
	const page = (params['page'] as number) || 1;
	const totalPages = (params['totalPages'] as number) || 1;
	const hasNext = (params['hasNext'] as boolean) || false;
	const hasPrev = (params['hasPrev'] as boolean) || false;
	const totalCount = (params['totalCount'] as number) || 0;

	useEffect(() => {
		setSelectedIndex(0);
		setSelectedForDownload(new Set());
	}, [page]);

	useEffect(() => {
		async function fetchResults() {
			if (searchParams) {
				const result = await search({...searchParams, page});
				if (result) {
					setPapers(result.papers || []);
				}
			}
		}

		fetchResults();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, search]);

	const handlePageChange = async (newPage: number) => {
		if (searchParams) {
			const result = await search({...searchParams, page: newPage});
			if (result) {
				setPapers(result.papers || []);
				navigate('search-results', {
					...params,
					page: result.page,
					totalPages: result.totalPages,
					hasNext: result.hasNextPage,
					hasPrev: result.hasPreviousPage,
				});
			}
		}
	};

	useInput((input, key) => {
		if (loading) return;

		if (key.escape || input === 'q') {
			goBack();
			return;
		}

		if (papers.length === 0) return;

		if (key.upArrow) {
			setSelectedIndex(prev => Math.max(0, prev - 1));
		}

		if (key.downArrow) {
			const maxIndex = papers.length - 1;
			setSelectedIndex(prev => Math.min(maxIndex, prev + 1));
		}

		if (key.return && papers[selectedIndex]) {
			const selectedPaper = papers[selectedIndex];
			setSelectedPaper(selectedPaper);
			navigate('paper-detail', {
				paperId: selectedPaper.genSlug,
			});
		}

		if (input === ' ' && papers[selectedIndex]) {
			const selectedPaper = papers[selectedIndex];
			setSelectedForDownload(prev => {
				const newSet = new Set(prev);
				if (newSet.has(selectedPaper.paperId)) {
					newSet.delete(selectedPaper.paperId);
				} else {
					newSet.add(selectedPaper.paperId);
				}

				return newSet;
			});
		}

		if (input === 'd' && selectedForDownload.size > 0) {
			const selectedPapers = papers.filter((paper: unknown) =>
				selectedForDownload.has((paper as {paperId: string}).paperId),
			);
			navigate('download-manager', {
				papers: selectedPapers,
			});
		}

		if ((input === 'p' || key.leftArrow) && hasPrev) {
			handlePageChange(page - 1);
		}

		if ((input === 'n' || key.rightArrow) && hasNext) {
			handlePageChange(page + 1);
		}
	});

	if (loading) {
		return (
			<Box flexDirection="column">
				<Header subtitle={title} showLogo={false} compact />
				<Spinner message="Loading papers..." />
			</Box>
		);
	}

	if (error) {
		return (
			<Box flexDirection="column">
				<Header subtitle={title} showLogo={false} compact />
				<ErrorMessage message={error} />
				<Footer hints={[]} />
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Header
				subtitle={`${title} (${totalCount} results)`}
				showLogo={false}
				compact
			/>

			{papers.length === 0 ? (
				<Text color={colors.muted}>No papers found.</Text>
			) : (
				<Box flexDirection="column">
					{papers.map((paper, index) => (
						<PaperListItem
							key={paper.paperId}
							paper={paper}
							isSelected={index === selectedIndex}
							index={index}
							isSelectedForDownload={selectedForDownload.has(paper.paperId)}
						/>
					))}
				</Box>
			)}

			<Pagination
				currentPage={page}
				totalPages={totalPages}
				hasNext={hasNext}
				hasPrev={hasPrev}
			/>

			<Footer
				hints={[
					{key: '\u2191\u2193', action: 'Navigate'},
					{key: 'ENTER', action: 'View'},
				]}
			/>
		</Box>
	);
}
