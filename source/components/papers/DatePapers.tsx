import React, {useState, useEffect, useCallback} from 'react';
import {Box, Text} from 'ink';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Pagination} from '../common/Pagination.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {PaperListItem} from './PaperListItem.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {usePapersByDate} from '../../hooks/usePapers.js';
import {useApp} from '../../context/AppContext.js';
import {useTheme} from '../../theme/index.js';
import {usePaperListNavigation} from '../../hooks/usePaperListNavigation.js';
import type {PaperListItem as PaperListItemType} from '../../api/types.js';

export function DatePapers() {
	const {params, navigate, goBack} = useNavigation();
	const {setSelectedPaper} = useApp();
	const {fetchByDate, loading, error} = usePapersByDate();
	const {colors} = useTheme();

	const [papers, setPapers] = useState<PaperListItemType[]>([]);

	const title = (params['title'] as string) || 'Papers';
	const date = params['date'] as string;
	const page = (params['page'] as number) || 1;
	const totalPages = (params['totalPages'] as number) || 1;
	const hasNext = (params['hasNext'] as boolean) || false;
	const hasPrev = (params['hasPrev'] as boolean) || false;
	const totalCount = (params['totalCount'] as number) || 0;
	const pageSize = (params['pageSize'] as number) || 20;

	useEffect(() => {
		async function fetchResults() {
			if (date) {
				const result = await fetchByDate(date, page, pageSize);
				if (result) {
					setPapers(result.papers || []);
				}
			}
		}

		void fetchResults();
	}, [page, date, pageSize, fetchByDate]);

	const handleSelectPaper = useCallback(
		(paper: PaperListItemType) => {
			setSelectedPaper(paper);
			navigate('paper-detail', {
				paperId: paper.genSlug,
			});
		},
		[setSelectedPaper, navigate],
	);

	const handlePreviousPage = useCallback(async () => {
		if (date) {
			const result = await fetchByDate(date, page - 1, pageSize);
			if (result?.pagination) {
				setPapers(result.papers || []);
				navigate('date-papers', {
					...params,
					page: page - 1,
					totalPages: Math.ceil(result.pagination.total / pageSize),
					hasNext: (page - 1) * pageSize < result.pagination.total,
					hasPrev: page - 1 > 1,
				});
			}
		}
	}, [date, fetchByDate, page, pageSize, navigate, params]);

	const handleNextPage = useCallback(async () => {
		if (date) {
			const result = await fetchByDate(date, page + 1, pageSize);
			if (result?.pagination) {
				setPapers(result.papers || []);
				navigate('date-papers', {
					...params,
					page: page + 1,
					totalPages: Math.ceil(result.pagination.total / pageSize),
					hasNext: (page + 1) * pageSize < result.pagination.total,
					hasPrev: true,
				});
			}
		}
	}, [date, fetchByDate, page, pageSize, navigate, params]);

	const {selectedIndex} = usePaperListNavigation({
		papers,
		loading,
		page,
		hasNext,
		hasPrev,
		onSelectPaper: handleSelectPaper,
		onPreviousPage: handlePreviousPage,
		onNextPage: handleNextPage,
		onGoBack: goBack,
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
