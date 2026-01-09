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
import type {SearchParams} from '../../api/types.js';
import {useTheme} from '../../theme/index.js';

export function PaperList() {
	const {params, navigate, goBack} = useNavigation();
	const {papersList, setPapersList, setSelectedPaper} = useApp();
	const {search, loading: searchLoading, error: searchError} = usePaperSearch();
	const {colors} = useTheme();
	const loading = searchLoading;
	const error = searchError;

	const [selectedIndex, setSelectedIndex] = useState(0);

	const title = (params['title'] as string) || 'Papers';
	const source = params['source'] as 'search' | 'date' | 'category';
	const page = (params['page'] as number) || 1;
	const totalPages = (params['totalPages'] as number) || 1;
	const hasNext = (params['hasNext'] as boolean) || false;
	const hasPrev = (params['hasPrev'] as boolean) || false;
	const totalCount = (params['totalCount'] as number) || 0;
	const pageSize = (params['pageSize'] as number) || 20;

	useEffect(() => {
		setSelectedIndex(0);
	}, [page]);

	const handlePageChange = async (newPage: number) => {
		if (source === 'search' && params['searchParams']) {
			const searchParams = params['searchParams'] as SearchParams;
			const result = await search({...searchParams, page: newPage});
			if (result) {
				setPapersList(result.papers || []);
				navigate('paper-list', {
					...params,
					page: result.page,
					totalPages: result.totalPages,
					hasNext: result.hasNextPage,
					hasPrev: result.hasPreviousPage,
				});
			}
		} else if (source === 'date' && params['date']) {
			navigate('paper-list', {
				...params,
				page: newPage,
				hasNext: newPage * pageSize < (params['totalCount'] as number),
				hasPrev: newPage > 1,
			});
		}
	};

	useInput((input, key) => {
		if (loading) return;

		if (key.escape || input === 'q') {
			goBack();
			return;
		}

		if (papersList.length === 0) return;

		if (key.upArrow) {
			setSelectedIndex(prev => Math.max(0, prev - 1));
		}

		if (key.downArrow) {
			const maxIndex =
				Math.min(pageSize, papersList.length - (page - 1) * pageSize) - 1;
			setSelectedIndex(prev => Math.min(maxIndex, prev + 1));
		}

		if ((input === 'p' || key.leftArrow) && hasPrev) {
			handlePageChange(page - 1);
		}

		if ((input === 'n' || key.rightArrow) && hasNext) {
			handlePageChange(page + 1);
		}

		if (key.return) {
			const actualIndex = (page - 1) * pageSize + selectedIndex;
			if (papersList[actualIndex]) {
				setSelectedPaper(papersList[actualIndex]);
				navigate('paper-detail', {
					paperId: papersList[actualIndex].genSlug,
				});
			}
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

			{papersList.length === 0 ? (
				<Text color={colors.muted}>No papers found.</Text>
			) : (
				<Box flexDirection="column">
					{papersList
						.slice((page - 1) * pageSize, page * pageSize)
						.map((paper, index) => (
							<PaperListItem
								key={paper.paperId}
								paper={paper}
								isSelected={index === selectedIndex}
								index={(page - 1) * pageSize + index}
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
