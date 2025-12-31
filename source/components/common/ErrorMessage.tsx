import React from 'react';
import {Box, Text} from 'ink';

interface ErrorMessageProps {
	message: string;
}

export function ErrorMessage({message}: ErrorMessageProps) {
	return (
		<Box flexDirection="column" marginY={1}>
			<Text color="red">Error: {message}</Text>
		</Box>
	);
}
