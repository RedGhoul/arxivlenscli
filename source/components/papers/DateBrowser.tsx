import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {usePapersByDate} from '../../hooks/usePapers.js';
import {useApp} from '../../context/AppContext.js';
import {DATE_PRESETS} from '../../utils/constants.js';
import {getPresetDate, getApiDateString} from '../../utils/formatting.js';

type Mode = 'preset' | 'custom';

export function DateBrowser() {
	const {navigate, goBack} = useNavigation();
	const {fetchByDate, loading, error} = usePapersByDate();
	const {setPapersList} = useApp();

	const [mode, setMode] = useState<Mode>('preset');
	const [customDate, setCustomDate] = useState(getApiDateString(new Date()));

	const loadPapersForDate = async (date: string) => {
		const result = await fetchByDate(date);
		if (result) {
			setPapersList(result.papers);
			navigate('paper-list', {
				title: `Papers from ${date}`,
				source: 'date',
				date,
				totalCount: result.pagination.total,
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
	};

	const handlePresetSelect = async (item: {value: string}) => {
		if (item.value === 'custom') {
			setMode('custom');
			return;
		}

		const date = getPresetDate(item.value);
		await loadPapersForDate(date);
	};

	useInput((input, key) => {
		if (loading) return;

		if (key.escape) {
			if (mode === 'custom') {
				setMode('preset');
			} else {
				goBack();
			}

			return;
		}

		if (input === 'q' && mode !== 'custom') {
			goBack();
		}

		if (key.return && mode === 'custom') {
			if (/^\d{4}-\d{2}-\d{2}$/.test(customDate)) {
				loadPapersForDate(customDate);
			}
		}
	});

	if (loading) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Loading papers..." />
				<Spinner message="Fetching papers by date..." />
			</Box>
		);
	}

	if (error) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Browse by Date" />
				<ErrorMessage message={error} />
				<Footer hints={[]} />
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Header subtitle="Browse papers by date" />

			{mode === 'preset' ? (
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text color="gray">Select a date option:</Text>
					</Box>
					<SelectInput
						items={DATE_PRESETS.map(p => ({label: p.label, value: p.value}))}
						onSelect={handlePresetSelect}
					/>
				</Box>
			) : (
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text color="gray">Enter date (YYYY-MM-DD):</Text>
					</Box>
					<Box>
						<TextInput
							value={customDate}
							onChange={setCustomDate}
							placeholder="2024-12-20"
						/>
					</Box>
					<Box marginTop={1}>
						<Text color="gray">Press Enter to search, Esc to go back</Text>
					</Box>
				</Box>
			)}

			<Footer
				hints={mode === 'custom' ? [{key: 'Enter', action: 'Search'}] : []}
			/>
		</Box>
	);
}
