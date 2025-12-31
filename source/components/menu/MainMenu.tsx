import React from 'react';
import {Box, Text, useInput, useApp as useInkApp} from 'ink';
import SelectInput from 'ink-select-input';
import {Header} from '../common/Header.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {MENU_ITEMS, type Route} from '../../utils/constants.js';

export function MainMenu() {
	const {navigate} = useNavigation();
	const {exit} = useInkApp();

	const handleSelect = (item: {value: string}) => {
		if (item.value === 'exit') {
			exit();
			return;
		}

		if (item.value === 'settings') {
			return;
		}

		navigate(item.value as Route);
	};

	useInput(input => {
		if (input === 'q') {
			exit();
		}
	});

	const items = MENU_ITEMS.map(item => ({
		label:
			item.value === 'settings' ? `${item.label} (coming soon)` : item.label,
		value: item.value,
	}));

	return (
		<Box flexDirection="column">
			<Header subtitle="Navigate with arrow keys, Enter to select" />
			<SelectInput items={items} onSelect={handleSelect} />
			<Box marginTop={1}>
				<Text color="gray">
					<Text color="yellow">[q]</Text> Quit
				</Text>
			</Box>
		</Box>
	);
}
