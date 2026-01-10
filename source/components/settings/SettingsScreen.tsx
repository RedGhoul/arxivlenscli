import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Frame} from '../common/Frame.js';
import {resetSettings, type Settings} from '../../config/settings.js';
import {useApp} from '../../context/AppContext.js';
import {useTheme} from '../../theme/index.js';

type SettingKey = keyof Settings;

interface SettingOption {
	key: SettingKey;
	label: string;
	type: 'toggle' | 'select';
	options?: Array<{label: string; value: string | number}>;
}

const SETTINGS_OPTIONS: SettingOption[] = [
	{
		key: 'resultsPerPage',
		label: 'Results per page',
		type: 'select',
		options: [
			{label: '10', value: 10},
			{label: '20', value: 20},
			{label: '50', value: 50},
		],
	},
	{
		key: 'defaultSort',
		label: 'Default sort',
		type: 'select',
		options: [
			{label: 'Relevance', value: 'relevance'},
			{label: 'Date', value: 'date'},
			{label: 'Citations', value: 'citations'},
		],
	},
	{
		key: 'showTwoLineSummaries',
		label: 'Show two-line summaries',
		type: 'toggle',
	},
	{
		key: 'compactMode',
		label: 'Compact mode',
		type: 'toggle',
	},
	{
		key: 'autoRefreshKeyFindings',
		label: 'Auto-refresh key findings',
		type: 'toggle',
	},
	{
		key: 'colorScheme',
		label: 'Color scheme',
		type: 'select',
		options: [
			{label: 'Default', value: 'default'},
			{label: 'Monochrome', value: 'monochrome'},
			{label: 'High Contrast', value: 'high-contrast'},
			{label: 'Mr. Robot', value: 'mr-robot'},
		],
	},
	{
		key: 'maxConcurrentDownloads',
		label: 'Max concurrent downloads',
		type: 'select',
		options: [
			{label: '1', value: 1},
			{label: '2', value: 2},
			{label: '3', value: 3},
			{label: '4', value: 4},
			{label: '5', value: 5},
		],
	},
	{
		key: 'fileNameFormat',
		label: 'File name format',
		type: 'select',
		options: [
			{label: 'Title + ID', value: 'title+id'},
			{label: 'ID Only', value: 'id-only'},
		],
	},
];

export function SettingsScreen() {
	const {colors, symbols, separators} = useTheme();
	const {settings, updateSettings} = useApp();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => {
				setMessage(null);
			}, 2000);
			return () => {
				clearTimeout(timer);
			};
		}

		return undefined;
	}, [message]);

	const currentOption = SETTINGS_OPTIONS[selectedIndex]!;

	const handleToggle = () => {
		if (currentOption.type === 'toggle') {
			const newValue = !settings[currentOption.key];
			updateSettings({
				[currentOption.key]: newValue as Settings[typeof currentOption.key],
			});
		}
	};

	const handleCycleSelect = (direction: 1 | -1) => {
		if (currentOption.type === 'select' && currentOption.options) {
			const currentValue = settings[currentOption.key];
			const currentIndex = currentOption.options.findIndex(
				o => o.value === currentValue,
			);
			const newIndex =
				(currentIndex + direction + currentOption.options.length) %
				currentOption.options.length;
			const newValue = currentOption.options[newIndex]!.value;
			updateSettings({
				[currentOption.key]: newValue as Settings[typeof currentOption.key],
			});
		}
	};

	const handleReset = () => {
		resetSettings();
		updateSettings({
			resultsPerPage: 20,
			defaultSort: 'relevance',
			showTwoLineSummaries: true,
			compactMode: false,
			autoRefreshKeyFindings: true,
			colorScheme: 'default',
			maxConcurrentDownloads: 3,
			fileNameFormat: 'title+id',
		});
		setMessage('Settings reset to defaults');
	};

	useInput((input, key) => {
		if (key.upArrow) {
			setSelectedIndex(i => Math.max(0, i - 1));
		} else if (key.downArrow) {
			setSelectedIndex(i => Math.min(SETTINGS_OPTIONS.length - 1, i + 1));
		} else if (key.return || input === ' ') {
			if (currentOption.type === 'toggle') {
				handleToggle();
			} else {
				handleCycleSelect(1);
			}
		} else if (key.leftArrow) {
			if (currentOption.type === 'select') {
				handleCycleSelect(-1);
			}
		} else if (key.rightArrow) {
			if (currentOption.type === 'select') {
				handleCycleSelect(1);
			}
		} else if (input === 'r') {
			handleReset();
		}
	});

	const renderValue = (option: SettingOption) => {
		const value = settings[option.key];

		if (option.type === 'toggle') {
			return (
				<Text color={value ? colors.success : colors.muted}>
					[{value ? symbols.checkmark : ' '}]
				</Text>
			);
		}

		if (option.type === 'select' && option.options) {
			const selected = option.options.find(o => o.value === value);
			return (
				<Text>
					<Text color={colors.muted}>&lt; </Text>
					<Text color={colors.primary}>{selected?.label ?? String(value)}</Text>
					<Text color={colors.muted}> &gt;</Text>
				</Text>
			);
		}

		return <Text>{String(value)}</Text>;
	};

	return (
		<Box flexDirection="column">
			<Header subtitle="Settings" showLogo={false} compact />

			{settings.downloadPath ? (
				<Box paddingX={1} marginBottom={1}>
					<Text color={colors.muted}>Download Path: </Text>
					<Text color={colors.primary}>{settings.downloadPath}</Text>
				</Box>
			) : (
				<Box paddingX={1} marginBottom={1}>
					<Text color={colors.error}>No download path set!</Text>
				</Box>
			)}

			<Frame title="CONFIGURATION" width={55}>
				<Box flexDirection="column" paddingY={1}>
					<Box marginBottom={1}>
						<Text bold color={colors.heading}>
							{symbols.arrow} Display
						</Text>
					</Box>

					{SETTINGS_OPTIONS.slice(0, 4).map((option, index) => (
						<Box key={option.key} paddingLeft={2}>
							<Text
								color={
									selectedIndex === index ? colors.primary : colors.foreground
								}
							>
								{selectedIndex === index ? symbols.arrowRight : ' '}{' '}
								{option.label}:{' '}
							</Text>
							{renderValue(option)}
						</Box>
					))}

					<Box marginY={1}>
						<Text color={colors.border}>{separators.single(45)}</Text>
					</Box>

					<Box marginBottom={1}>
						<Text bold color={colors.heading}>
							{symbols.arrow} Behavior
						</Text>
					</Box>

					{SETTINGS_OPTIONS.slice(4, 6).map((option, index) => (
						<Box key={option.key} paddingLeft={2}>
							<Text
								color={
									selectedIndex === index + 4
										? colors.primary
										: colors.foreground
								}
							>
								{selectedIndex === index + 4 ? symbols.arrowRight : ' '}{' '}
								{option.label}:{' '}
							</Text>
							{renderValue(option)}
						</Box>
					))}

					<Box marginY={1}>
						<Text color={colors.border}>{separators.single(45)}</Text>
					</Box>

					<Box marginBottom={1}>
						<Text bold color={colors.heading}>
							{symbols.arrow} Downloads
						</Text>
					</Box>

					{SETTINGS_OPTIONS.slice(6).map((option, index) => (
						<Box key={option.key} paddingLeft={2}>
							<Text
								color={
									selectedIndex === index + 6
										? colors.primary
										: colors.foreground
								}
							>
								{selectedIndex === index + 6 ? symbols.arrowRight : ' '}{' '}
								{option.label}:{' '}
							</Text>
							{renderValue(option)}
						</Box>
					))}
				</Box>
			</Frame>

			{message && (
				<Box marginY={1}>
					<Text color={colors.success}>
						{symbols.checkmark} {message}
					</Text>
				</Box>
			)}

			<Footer
				hints={[
					{key: 'ENTER', action: 'Toggle/Select'},
					{key: '\u2190/\u2192', action: 'Cycle'},
					{key: 'R', action: 'Reset'},
				]}
			/>
		</Box>
	);
}
