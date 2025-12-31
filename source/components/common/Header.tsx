import React from 'react';
import {Box, Text} from 'ink';
import {APP_NAME} from '../../utils/constants.js';

interface HeaderProps {
	subtitle?: string;
}

export function Header({subtitle}: HeaderProps) {
	return (
		<Box flexDirection="column" marginBottom={1}>
			<Text bold color="cyan">
				{APP_NAME}
			</Text>
			{subtitle && <Text color="gray">{subtitle}</Text>}
		</Box>
	);
}
