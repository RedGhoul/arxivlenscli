import React from 'react';
import {Box, Text, useInput} from 'ink';
import {colors, borders, separators} from '../../theme/index.js';

interface HelpOverlayProps {
	onClose: () => void;
}

const SHORTCUTS = {
	global: [
		{key: 'ESC', action: 'Go back'},
		{key: 'Q', action: 'Quit app'},
		{key: '?', action: 'Show/hide help'},
	],
	navigation: [
		{key: '\u2191/\u2193', action: 'Move selection'},
		{key: 'ENTER', action: 'Select/Confirm'},
		{key: 'N/P', action: 'Next/Prev page'},
	],
	paperView: [
		{key: 'O', action: 'Open arXiv'},
		{key: 'P', action: 'Open PDF (browser)'},
		{key: 'V', action: 'View PDF (terminal)'},
		{key: 'A', action: 'View authors'},
		{key: 'K', action: 'Key findings'},
		{key: 'S', action: 'Similar papers'},
		{key: 'M', action: 'Toggle abstract'},
	],
	pdfViewer: [
		{key: 'N/P', action: 'Next/Prev page'},
		{key: '\u2191/\u2193', action: 'Scroll up/down'},
		{key: 'J/K', action: 'Scroll 5 lines'},
		{key: 'I', action: 'Toggle image mode'},
	],
	search: [
		{key: 'TAB', action: 'Next field'},
		{key: 'ENTER', action: 'Execute search'},
	],
};

export function HelpOverlay({onClose}: HelpOverlayProps) {
	useInput((input, key) => {
		if (key.escape || input === '?') {
			onClose();
		}
	});

	const border = borders.double;

	const renderSection = (
		title: string,
		shortcuts: Array<{key: string; action: string}>,
	) => (
		<Box flexDirection="column" marginBottom={1}>
			<Text bold color={colors.heading}>
				{title}
			</Text>
			<Text color={colors.border}>{separators.single(20)}</Text>
			{shortcuts.map(s => (
				<Box key={s.key}>
					<Box width={12}>
						<Text color={colors.primary}>[{s.key}]</Text>
					</Box>
					<Text color={colors.foreground}>{s.action}</Text>
				</Box>
			))}
		</Box>
	);

	return (
		<Box flexDirection="column" paddingX={1}>
			{/* Top border with title */}
			<Text color={colors.primary}>
				{border.topLeft}
				{border.horizontal.repeat(5)}
				<Text bold> KEYBOARD SHORTCUTS </Text>
				{border.horizontal.repeat(30)}
				{border.topRight}
			</Text>

			{/* Content */}
			<Box>
				<Text color={colors.primary}>{border.vertical}</Text>
				<Box flexDirection="column" paddingX={2} paddingY={1}>
					<Box justifyContent="flex-end" marginBottom={1}>
						<Text color={colors.muted}>[ESC/?] Close</Text>
					</Box>

					<Box>
						<Box flexDirection="column" marginRight={4}>
							{renderSection('Global', SHORTCUTS.global)}
							{renderSection('Paper View', SHORTCUTS.paperView)}
						</Box>

						<Box flexDirection="column">
							{renderSection('Navigation', SHORTCUTS.navigation)}
							{renderSection('PDF Viewer', SHORTCUTS.pdfViewer)}
							{renderSection('Search', SHORTCUTS.search)}
						</Box>
					</Box>
				</Box>
				<Text color={colors.primary}>{border.vertical}</Text>
			</Box>

			{/* Bottom border */}
			<Text color={colors.primary}>
				{border.bottomLeft}
				{border.horizontal.repeat(58)}
				{border.bottomRight}
			</Text>
		</Box>
	);
}
