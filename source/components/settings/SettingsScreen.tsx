import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Frame} from '../common/Frame.js';
import {
	getSettings,
	updateSetting,
	resetSettings,
	type Settings,
} from '../../config/settings.js';
import {colors, symbols, separators} from '../../theme/index.js';

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

					{SETTINGS_OPTIONS.slice(4).map((option, index) => (
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
