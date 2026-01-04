import React from 'react';
import {Box, Text} from 'ink';
import {colors, borders} from '../../theme/index.js';

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
	const border = borders.single;

	return (
		<Box marginTop={1}>
			<Text color={colors.border}>
				{border.teeLeft}
				{border.horizontal.repeat(2)}
			</Text>
			<Text color={colors.foreground}>
				{' '}
				Page <Text color={colors.primary}>{currentPage}</Text> of{' '}
				<Text color={colors.primary}>{totalPages}</Text>{' '}
			</Text>
			<Text color={colors.border}>{border.horizontal.repeat(2)}</Text>
			{hasPrev && (
				<Text>
					<Text color={colors.border}> [</Text>
					<Text color={colors.primary}>P</Text>
					<Text color={colors.border}>]</Text>
					<Text color={colors.foreground}> Prev</Text>
				</Text>
			)}
			{hasNext && (
				<Text>
					<Text color={colors.border}> [</Text>
					<Text color={colors.primary}>N</Text>
					<Text color={colors.border}>]</Text>
					<Text color={colors.foreground}> Next</Text>
				</Text>
			)}
		</Box>
	);
}
