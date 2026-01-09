import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Pagination} from '../common/Pagination.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {PaperListItem} from './PaperListItem.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {usePapersByDate} from '../../hooks/usePapers.js';
import {useApp} from '../../context/AppContext.js';
import {colors} from '../../theme/index.js';

export function DatePapers() {
	const {params, navigate, goBack} = useNavigation();
	const {setSelectedPaper} = useApp();
	const {fetchByDate, loading, error} = usePapersByDate();

	const [papers, setPapers] = useState<unknown[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const title = (params['title'] as string) || 'Papers';
	const date = params['date'] as string;
	const page = (params['page'] as number) || 1;
	const totalPages = (params['totalPages'] as number) || 1;
	const hasNext = (params['hasNext'] as boolean) || false;
	const hasPrev = (params['hasPrev'] as boolean) || false;
	const totalCount = (params['totalCount'] as number) || 0;
	const pageSize = (params['pageSize'] as number) || 20;

	useEffect(() => {
		setSelectedIndex(0);
	}, [page]);

	useEffect(() => {
		async function fetchResults() {
			if (date) {
				const result = await fetchByDate(date, page, pageSize);
				if (result) {
					setPapers(result.papers || []);
				}
			}
		}

		fetchResults();
	}, [page, date, pageSize, fetchByDate]);

	const handlePageChange = async (newPage: number) => {
		if (date) {
			const result = await fetchByDate(date, newPage, pageSize);
			if (result?.pagination) {
				setPapers(result.papers || []);
				navigate('date-papers', {
					...params,
					page: newPage,
					totalPages: Math.ceil(result.pagination.total / pageSize),
					hasNext: newPage * pageSize < result.pagination.total,
					hasPrev: newPage > 1,
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

		if ((input === 'p' || key.leftArrow) && hasPrev) {
			handlePageChange(page - 1);
		}

		if ((input === 'n' || key.rightArrow) && hasNext) {
			handlePageChange(page + 1);
		}

		if (key.return && papers[selectedIndex]) {
			setSelectedPaper(papers[selectedIndex] as never);
			navigate('paper-detail', {
				paperId: (papers[selectedIndex] as {genSlug: string}).genSlug,
			});
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
							key={(paper as {paperId: string}).paperId}
							paper={paper as never}
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
