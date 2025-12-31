import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Pagination} from '../common/Pagination.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {PaperListItem} from './PaperListItem.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {usePaperSearch, usePapersByDate} from '../../hooks/usePapers.js';
import {useApp} from '../../context/AppContext.js';
import type {SearchParams} from '../../api/types.js';

export function PaperList() {
	const {params, navigate, goBack} = useNavigation();
	const {papersList, setPapersList, setSelectedPaper} = useApp();
	const {search, loading: searchLoading, error: searchError} = usePaperSearch();
	const {
		fetchByDate,
		loading: dateLoading,
		error: dateError,
	} = usePapersByDate();

	const [selectedIndex, setSelectedIndex] = useState(0);

	const title = (params['title'] as string) || 'Papers';
	const source = params['source'] as 'search' | 'date' | 'category';
	const page = (params['page'] as number) || 1;
	const totalPages = (params['totalPages'] as number) || 1;
	const hasNext = (params['hasNext'] as boolean) || false;
	const hasPrev = (params['hasPrev'] as boolean) || false;
	const totalCount = (params['totalCount'] as number) || 0;

	const loading = searchLoading || dateLoading;
	const error = searchError || dateError;

	useEffect(() => {
		setSelectedIndex(0);
	}, [papersList]);

	const handlePageChange = async (newPage: number) => {
		if (source === 'search' && params['searchParams']) {
			const searchParams = params['searchParams'] as SearchParams;
			const result = await search({...searchParams, page: newPage});
			if (result) {
				setPapersList(result.papers);
				navigate('paper-list', {
					...params,
					page: result.page,
					totalPages: result.totalPages,
					hasNext: result.hasNextPage,
					hasPrev: result.hasPreviousPage,
				});
			}
		} else if (source === 'date' && params['date']) {
			const result = await fetchByDate(params['date'] as string, newPage);
			if (result) {
				setPapersList(result.papers);
				navigate('paper-list', {
					...params,
					page: result.pagination.page,
					totalPages: Math.ceil(
						result.pagination.total / result.pagination.limit,
					),
					hasNext:
						result.pagination.page * result.pagination.limit <
						result.pagination.total,
					hasPrev: result.pagination.page > 1,
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

		if (key.upArrow) {
			setSelectedIndex(prev => Math.max(0, prev - 1));
		}

		if (key.downArrow) {
			setSelectedIndex(prev => Math.min(papersList.length - 1, prev + 1));
		}

		if ((input === 'p' || key.leftArrow) && hasPrev) {
			handlePageChange(page - 1);
		}

		if ((input === 'n' || key.rightArrow) && hasNext) {
			handlePageChange(page + 1);
		}

		if (key.return && papersList[selectedIndex]) {
			setSelectedPaper(papersList[selectedIndex]);
			navigate('paper-detail', {paperId: papersList[selectedIndex].genSlug});
		}
	});

	if (loading) {
		return (
			<Box flexDirection="column">
				<Header subtitle={title} />
				<Spinner message="Loading papers..." />
			</Box>
		);
	}

	if (error) {
		return (
			<Box flexDirection="column">
				<Header subtitle={title} />
				<ErrorMessage message={error} />
				<Footer hints={[]} />
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Header subtitle={`${title} (${totalCount} results)`} />

			{papersList.length === 0 ? (
				<Text color="gray">No papers found.</Text>
			) : (
				<Box flexDirection="column">
					{papersList.map((paper, index) => (
						<PaperListItem
							key={paper.paperId}
							paper={paper}
							isSelected={index === selectedIndex}
							index={(page - 1) * 20 + index}
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
					{key: '↑↓', action: 'Navigate'},
					{key: 'Enter', action: 'View'},
				]}
			/>
		</Box>
	);
}
