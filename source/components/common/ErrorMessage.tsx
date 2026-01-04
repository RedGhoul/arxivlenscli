import React from 'react';
import {Box, Text} from 'ink';
import {colors, symbols, borders} from '../../theme/index.js';

interface ErrorMessageProps {
	message: string;
}

export function ErrorMessage({message}: ErrorMessageProps) {
	const border = borders.rounded;

	return (
		<Box flexDirection="column" marginY={1}>
			<Text color={colors.error}>
				{border.topLeft}
				{border.horizontal.repeat(Math.min(message.length + 10, 60))}
				{border.topRight}
			</Text>
			<Box>
				<Text color={colors.error}>{border.vertical}</Text>
				<Text color={colors.error}>
					{' '}
					{symbols.cross} ERROR: {message}{' '}
				</Text>
				<Text color={colors.error}>{border.vertical}</Text>
			</Box>
			<Text color={colors.error}>
				{border.bottomLeft}
				{border.horizontal.repeat(Math.min(message.length + 10, 60))}
				{border.bottomRight}
			</Text>
		</Box>
	);
}
