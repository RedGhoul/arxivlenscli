import React from 'react';
import {Box, Text} from 'ink';
import type {PaperListItem as PaperListItemType} from '../../api/types.js';
import {formatDate, formatAuthors, truncate} from '../../utils/formatting.js';
import {colors, symbols, decorators} from '../../theme/index.js';

interface PaperListItemProps {
	paper: PaperListItemType;
	isSelected: boolean;
	index: number;
}

export function PaperListItem({paper, isSelected, index}: PaperListItemProps) {
	const primaryCategory =
		paper.categories?.split(' ')[0] || paper.categories || 'Unknown';

	return (
		<Box
			flexDirection="column"
			paddingLeft={1}
			borderStyle={isSelected ? 'single' : undefined}
			borderColor={isSelected ? colors.primary : undefined}
		>
			<Box>
				<Text color={isSelected ? colors.primary : colors.muted}>
					{isSelected ? symbols.arrowRight : ' '}
				</Text>
				<Text color={colors.muted}> {decorators.index(index + 1)} </Text>
				<Text
					color={isSelected ? colors.heading : colors.foreground}
					bold={isSelected}
				>
					{truncate(paper.title, 65)}
				</Text>
			</Box>
			<Box paddingLeft={6}>
				<Text color={colors.muted}>{symbols.arrowRight} </Text>
				<Text color={colors.secondary}>{formatAuthors(paper.authors)}</Text>
				<Text color={colors.muted}> | </Text>
				<Text color={colors.caption}>{formatDate(paper.published)}</Text>
				<Text color={colors.muted}> | </Text>
				<Text color={colors.info}>{primaryCategory}</Text>
			</Box>
			<Box paddingLeft={6}>
				<Text color={colors.caption} dimColor>
					{truncate(paper.twoLineSummary || 'No summary available', 75)}
				</Text>
			</Box>
		</Box>
	);
}
