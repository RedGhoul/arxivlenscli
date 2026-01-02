import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {
	getSettings,
	updateSetting,
	resetSettings,
	type Settings,
} from '../../config/settings.js';

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
		],
	},
];

export function SettingsScreen() {
	const [settings, setSettings] = useState<Settings>(getSettings);
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
		const option = currentOption;
		if (option.type === 'toggle') {
			const newValue = !settings[option.key];
			updateSetting(option.key, newValue as Settings[typeof option.key]);
			setSettings({...settings, [option.key]: newValue});
		}
	};

	const handleCycleSelect = (direction: 1 | -1) => {
		const option = currentOption;
		if (option.type === 'select' && option.options) {
			const currentValue = settings[option.key];
			const currentIndex = option.options.findIndex(
				o => o.value === currentValue,
			);
			const newIndex =
				(currentIndex + direction + option.options.length) %
				option.options.length;
			const newValue = option.options[newIndex]!.value;
			updateSetting(option.key, newValue as Settings[typeof option.key]);
			setSettings({...settings, [option.key]: newValue});
		}
	};

	const handleReset = () => {
		resetSettings();
		setSettings(getSettings());
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
				<Text color={value ? 'green' : 'gray'}>{value ? '[x]' : '[ ]'}</Text>
			);
		}

		if (option.type === 'select' && option.options) {
			const selected = option.options.find(o => o.value === value);
			return (
				<Text>
					<Text color="gray">&lt; </Text>
					<Text color="cyan">{selected?.label ?? String(value)}</Text>
					<Text color="gray"> &gt;</Text>
				</Text>
			);
		}

		return <Text>{String(value)}</Text>;
	};

	return (
		<Box flexDirection="column">
			<Header subtitle="Settings" />

			<Box flexDirection="column" marginY={1}>
				<Box marginBottom={1}>
					<Text bold color="white">
						Display
					</Text>
				</Box>

				{SETTINGS_OPTIONS.slice(0, 4).map((option, index) => (
					<Box key={option.key}>
						<Text color={selectedIndex === index ? 'cyan' : undefined}>
							{selectedIndex === index ? '> ' : '  '}
							{option.label}:{' '}
						</Text>
						{renderValue(option)}
					</Box>
				))}

				<Box marginTop={1} marginBottom={1}>
					<Text bold color="white">
						Behavior
					</Text>
				</Box>

				{SETTINGS_OPTIONS.slice(4).map((option, index) => (
					<Box key={option.key}>
						<Text color={selectedIndex === index + 4 ? 'cyan' : undefined}>
							{selectedIndex === index + 4 ? '> ' : '  '}
							{option.label}:{' '}
						</Text>
						{renderValue(option)}
					</Box>
				))}
			</Box>

			{message && (
				<Box marginY={1}>
					<Text color="green">{message}</Text>
				</Box>
			)}

			<Footer
				hints={[
					{key: 'Enter', action: 'Toggle/Select'},
					{key: '\u2190/\u2192', action: 'Cycle'},
					{key: 'r', action: 'Reset'},
				]}
			/>
		</Box>
	);
}
