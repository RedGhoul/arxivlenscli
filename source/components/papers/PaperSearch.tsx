import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Frame} from '../common/Frame.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {usePaperSearch} from '../../hooks/usePapers.js';
import {usePageSize} from '../../hooks/usePageSize.js';
import {useApp} from '../../context/AppContext.js';
import {SORT_OPTIONS} from '../../utils/constants.js';
import {colors, symbols} from '../../theme/index.js';

type FocusField = 'query' | 'sort' | 'recent' | 'cited' | 'submit';

export function PaperSearch() {
	const {navigate, goBack} = useNavigation();
	const {search, loading, error} = usePaperSearch();
	const {setLastSearchParams, setPapersList} = useApp();
	const pageSize = usePageSize();

	const [query, setQuery] = useState('');
	const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'citations'>(
		'relevance',
	);
	const [prioritizeRecent, setPrioritizeRecent] = useState(false);
	const [prioritizeCited, setPrioritizeCited] = useState(false);

	const [focusField, setFocusField] = useState<FocusField>('query');
	const [showSortDropdown, setShowSortDropdown] = useState(false);

	const handleSearch = async () => {
		if (!query.trim()) return;

		const params = {
			query: query.trim(),
			rankBy: sortBy,
			prioritizeRecent,
			prioritizeCited,
			page: 1,
			pageSize,
		};

		const result = await search(params);
		if (result) {
			setLastSearchParams(params);
			setPapersList(result.papers);
			navigate('search-results', {
				title: `Search: "${query.trim()}"`,
				source: 'search',
				searchParams: params,
				totalCount: result.totalCount,
				page: result.page,
				totalPages: result.totalPages,
				hasNext: result.hasNextPage,
				hasPrev: result.hasPreviousPage,
				pageSize,
			});
		}
	};

	useInput((input, key) => {
		if (showSortDropdown) {
			if (key.escape) {
				setShowSortDropdown(false);
			}

			return;
		}

		if (key.escape) {
			goBack();
			return;
		}

		if (input === 'q' && focusField !== 'query') {
			goBack();
			return;
		}

		if (key.tab || (key.downArrow && focusField !== 'query')) {
			const fields: FocusField[] = [
				'query',
				'sort',
				'recent',
				'cited',
				'submit',
			];
			const currentIdx = fields.indexOf(focusField);
			const nextIdx = (currentIdx + 1) % fields.length;
			setFocusField(fields[nextIdx]!);
		}

		if (key.upArrow && focusField !== 'query') {
			const fields: FocusField[] = [
				'query',
				'sort',
				'recent',
				'cited',
				'submit',
			];
			const currentIdx = fields.indexOf(focusField);
			const prevIdx = currentIdx === 0 ? fields.length - 1 : currentIdx - 1;
			setFocusField(fields[prevIdx]!);
		}

		if (key.return) {
			if (focusField === 'query' && query.trim()) {
				handleSearch();
			} else if (focusField === 'sort') {
				setShowSortDropdown(true);
			} else if (focusField === 'recent') {
				setPrioritizeRecent(!prioritizeRecent);
			} else if (focusField === 'cited') {
				setPrioritizeCited(!prioritizeCited);
			} else if (focusField === 'submit') {
				handleSearch();
			}
		}

		if (input === ' ' && (focusField === 'recent' || focusField === 'cited')) {
			if (focusField === 'recent') setPrioritizeRecent(!prioritizeRecent);
			if (focusField === 'cited') setPrioritizeCited(!prioritizeCited);
		}
	});

	if (loading) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Searching papers..." showLogo={false} compact />
				<Spinner message="Searching..." />
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Header subtitle="Search for academic papers" showLogo={false} compact />

			{error && <ErrorMessage message={error} />}

			<Frame title="SEARCH PARAMETERS" width={60}>
				<Box flexDirection="column" paddingY={1}>
					<Box marginBottom={1}>
						<Text
							color={
								focusField === 'query' ? colors.primary : colors.foreground
							}
						>
							{symbols.prompt} Query:{' '}
						</Text>
						<TextInput
							value={query}
							onChange={setQuery}
							onSubmit={handleSearch}
							focus={focusField === 'query'}
							placeholder="Enter search terms..."
						/>
					</Box>

					<Box marginBottom={1}>
						<Text
							color={focusField === 'sort' ? colors.primary : colors.foreground}
						>
							{symbols.prompt} Sort by:{' '}
							<Text color={colors.secondary}>
								{SORT_OPTIONS.find(s => s.value === sortBy)?.label}
							</Text>
							{focusField === 'sort' && (
								<Text color={colors.muted}> [ENTER to change]</Text>
							)}
						</Text>
					</Box>

					{showSortDropdown && (
						<Box marginLeft={4} marginBottom={1}>
							<SelectInput
								items={SORT_OPTIONS.map(o => ({
									label: o.label,
									value: o.value,
								}))}
								onSelect={item => {
									setSortBy(item.value as typeof sortBy);
									setShowSortDropdown(false);
								}}
							/>
						</Box>
					)}

					<Box marginBottom={1}>
						<Text
							color={
								focusField === 'recent' ? colors.primary : colors.foreground
							}
						>
							<Text color={prioritizeRecent ? colors.success : colors.muted}>
								[{prioritizeRecent ? symbols.checkmark : ' '}]
							</Text>{' '}
							Prioritize Recent
						</Text>
					</Box>

					<Box marginBottom={1}>
						<Text
							color={
								focusField === 'cited' ? colors.primary : colors.foreground
							}
						>
							<Text color={prioritizeCited ? colors.success : colors.muted}>
								[{prioritizeCited ? symbols.checkmark : ' '}]
							</Text>{' '}
							Prioritize Highly Cited
						</Text>
					</Box>

					<Box>
						<Text
							color={
								focusField === 'submit' ? colors.heading : colors.foreground
							}
							backgroundColor={
								focusField === 'submit' ? colors.primary : undefined
							}
							bold={focusField === 'submit'}
						>
							{' '}
							{symbols.arrow} SEARCH{' '}
						</Text>
					</Box>
				</Box>
			</Frame>

			<Footer
				hints={[
					{key: 'TAB', action: 'Next field'},
					{key: 'ENTER', action: 'Select/Submit'},
				]}
			/>
		</Box>
	);
}
