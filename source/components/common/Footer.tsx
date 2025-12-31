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

	const allHints = [...hints, ...defaultHints];

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
