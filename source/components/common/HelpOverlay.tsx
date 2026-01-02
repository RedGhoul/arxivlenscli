import React from 'react';
import {Box, Text, useInput} from 'ink';

interface HelpOverlayProps {
	onClose: () => void;
}

const SHORTCUTS = {
	global: [
		{key: 'Esc', action: 'Go back'},
		{key: 'q', action: 'Quit app'},
		{key: '?', action: 'Show/hide help'},
	],
	navigation: [
		{key: '\u2191/\u2193', action: 'Move selection'},
		{key: 'Enter', action: 'Select/Confirm'},
		{key: 'n/p', action: 'Next/Prev page'},
	],
	paperView: [
		{key: 'o', action: 'Open arXiv'},
		{key: 'p', action: 'Open PDF'},
		{key: 'a', action: 'View authors'},
		{key: 'k', action: 'Key findings'},
		{key: 's', action: 'Similar papers'},
		{key: 'm', action: 'Toggle abstract'},
	],
	search: [
		{key: 'Tab', action: 'Next field'},
		{key: 'Enter', action: 'Execute search'},
	],
};

export function HelpOverlay({onClose}: HelpOverlayProps) {
	useInput((input, key) => {
		if (key.escape || input === '?') {
			onClose();
		}
	});

	const renderSection = (
		title: string,
		shortcuts: Array<{key: string; action: string}>,
	) => (
		<Box flexDirection="column" marginBottom={1}>
			<Text bold color="white">
				{title}
			</Text>
			{shortcuts.map(s => (
				<Box key={s.key}>
					<Box width={12}>
						<Text color="yellow">{s.key}</Text>
					</Box>
					<Text color="gray">{s.action}</Text>
				</Box>
			))}
		</Box>
	);

	return (
		<Box
			flexDirection="column"
			borderStyle="double"
			borderColor="cyan"
			paddingX={2}
			paddingY={1}
		>
			<Box justifyContent="space-between" marginBottom={1}>
				<Text bold color="cyan">
					Keyboard Shortcuts
				</Text>
				<Text color="gray">[Esc/?] Close</Text>
			</Box>

			<Box>
				<Box flexDirection="column" marginRight={4}>
					{renderSection('Global', SHORTCUTS.global)}
					{renderSection('Paper View', SHORTCUTS.paperView)}
				</Box>

				<Box flexDirection="column">
					{renderSection('Navigation', SHORTCUTS.navigation)}
					{renderSection('Search', SHORTCUTS.search)}
				</Box>
			</Box>
		</Box>
	);
}
