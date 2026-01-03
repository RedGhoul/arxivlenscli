import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {usePaperSearch} from '../../hooks/usePapers.js';
import {usePageSize} from '../../hooks/usePageSize.js';
import {useApp} from '../../context/AppContext.js';
import {SORT_OPTIONS} from '../../utils/constants.js';

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
			navigate('paper-list', {
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
				<Header subtitle="Searching papers..." />
				<Spinner message="Searching..." />
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Header subtitle="Search for academic papers" />

			{error && <ErrorMessage message={error} />}

			<Box marginBottom={1}>
				<Text color={focusField === 'query' ? 'cyan' : 'white'}>Search: </Text>
				<TextInput
					value={query}
					onChange={setQuery}
					onSubmit={handleSearch}
					focus={focusField === 'query'}
					placeholder="Enter search terms..."
				/>
			</Box>

			<Box marginBottom={1}>
				<Text color={focusField === 'sort' ? 'cyan' : 'white'}>
					Sort by: {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
					{focusField === 'sort' && ' [Enter to change]'}
				</Text>
			</Box>

			{showSortDropdown && (
				<Box marginLeft={2} marginBottom={1}>
					<SelectInput
						items={SORT_OPTIONS.map(o => ({label: o.label, value: o.value}))}
						onSelect={item => {
							setSortBy(item.value as typeof sortBy);
							setShowSortDropdown(false);
						}}
					/>
				</Box>
			)}

			<Box marginBottom={1}>
				<Text color={focusField === 'recent' ? 'cyan' : 'white'}>
					[{prioritizeRecent ? 'x' : ' '}] Prioritize Recent
				</Text>
			</Box>

			<Box marginBottom={1}>
				<Text color={focusField === 'cited' ? 'cyan' : 'white'}>
					[{prioritizeCited ? 'x' : ' '}] Prioritize Highly Cited
				</Text>
			</Box>

			<Box>
				<Text
					color={focusField === 'submit' ? 'black' : 'white'}
					backgroundColor={focusField === 'submit' ? 'cyan' : undefined}
				>
					{' Search '}
				</Text>
			</Box>

			<Footer
				hints={[
					{key: 'Tab', action: 'Next field'},
					{key: 'Enter', action: 'Select/Submit'},
				]}
			/>
		</Box>
	);
}
