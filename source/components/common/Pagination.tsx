import React from 'react';
import {Box, Text} from 'ink';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export function Pagination({
	currentPage,
	totalPages,
	hasNext,
	hasPrev,
}: PaginationProps) {
	return (
		<Box marginTop={1}>
			<Text color="gray">
				Page {currentPage} of {totalPages}
				{'  '}
				{hasPrev && <Text color="yellow">[p] Prev</Text>}
				{hasPrev && hasNext && '  '}
				{hasNext && <Text color="yellow">[n] Next</Text>}
			</Text>
		</Box>
	);
}
