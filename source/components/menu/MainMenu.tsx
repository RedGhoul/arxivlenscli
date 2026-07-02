import React, {useState} from 'react';
import {Box, Text, useInput, useApp as useInkApp} from 'ink';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Frame} from '../common/Frame.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {MENU_ITEMS, type Route} from '../../utils/constants.js';
import {useTheme} from '../../theme/index.js';

export function MainMenu() {
	const {navigate} = useNavigation();
	const {exit} = useInkApp();
	const {colors, symbols, decorators} = useTheme();
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleSelect = (value: string) => {
		if (value === 'exit') {
			exit();
			return;
		}

		navigate(value as Route);
	};

	useInput((input, key) => {
		if (input === 'q') {
			exit();
			return;
		}

		if (key.upArrow) {
			setSelectedIndex(prev => (prev > 0 ? prev - 1 : MENU_ITEMS.length - 1));
		} else if (key.downArrow) {
			setSelectedIndex(prev => (prev < MENU_ITEMS.length - 1 ? prev + 1 : 0));
		} else if (key.return) {
			const item = MENU_ITEMS[selectedIndex];
			if (item) {
				handleSelect(item.value);
			}
		}
	});

	return (
		<Box flexDirection="column">
			<Header subtitle="Navigate with arrow keys, Enter to select" />

			<Frame title="MAIN MENU" variant="single" width={50}>
				<Box flexDirection="column" paddingY={1}>
					{MENU_ITEMS.map((item, index) => {
						const isSelected = index === selectedIndex;
						return (
							<Box key={item.value} paddingLeft={1}>
								<Text color={isSelected ? colors.primary : colors.muted}>
									{isSelected ? symbols.arrowRight : ' '}
								</Text>
								<Text color={colors.muted}>
									{' '}
									{decorators.index(index + 1)}{' '}
								</Text>
								<Text
									color={isSelected ? colors.heading : colors.foreground}
									bold={isSelected}
								>
									{item.label}
								</Text>
							</Box>
						);
					})}
				</Box>
			</Frame>

			<Footer
				hints={[
					{key: '\u2191\u2193', action: 'Navigate'},
					{key: 'ENTER', action: 'Select'},
				]}
			/>
		</Box>
	);
}
