import React from 'react';
import {Box, Text} from 'ink';

interface FooterProps {
	hints?: Array<{key: string; action: string}>;
}

export function Footer({hints = []}: FooterProps) {
	const defaultHints = [
		{key: 'Esc', action: 'Back'},
		{key: 'q', action: 'Quit'},
	];

	// Filter out default hints that are overridden by custom hints
	const customKeys = new Set(hints.map(h => h.key));
	const filteredDefaults = defaultHints.filter(h => !customKeys.has(h.key));
	const allHints = [...hints, ...filteredDefaults];

	return (
		<Box marginTop={1}>
			<Text color="gray">
				{allHints.map((h, i) => (
					<Text key={h.key}>
						<Text color="yellow">[{h.key}]</Text> {h.action}
						{i < allHints.length - 1 ? '  ' : ''}
					</Text>
				))}
			</Text>
		</Box>
	);
}
