import React from 'react';
import {Box, Text} from 'ink';
import {colors, borders} from '../../theme/index.js';

interface FooterProps {
	hints?: Array<{key: string; action: string}>;
}

export function Footer({hints = []}: FooterProps) {
	const defaultHints = [
		{key: 'ESC', action: 'Back'},
		{key: 'Q', action: 'Quit'},
	];

	// Filter out default hints that are overridden by custom hints
	const customKeys = new Set(hints.map(h => h.key.toUpperCase()));
	const filteredDefaults = defaultHints.filter(
		h => !customKeys.has(h.key.toUpperCase()),
	);
	const allHints = [...hints, ...filteredDefaults];

	const border = borders.single;

	return (
		<Box flexDirection="column" marginTop={1}>
			<Text color={colors.border}>
				{border.teeLeft}
				{border.horizontal.repeat(60)}
				{border.teeRight}
			</Text>
			<Box paddingLeft={1}>
				{allHints.map((h, i) => (
					<Text key={h.key}>
						<Text color={colors.border}>[</Text>
						<Text color={colors.primary}>{h.key}</Text>
						<Text color={colors.border}>]</Text>
						<Text color={colors.foreground}> {h.action}</Text>
						{i < allHints.length - 1 && (
							<Text color={colors.muted}> {' | '} </Text>
						)}
					</Text>
				))}
			</Box>
		</Box>
	);
}
