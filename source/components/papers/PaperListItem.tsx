import React from 'react';
import {Box, Text} from 'ink';
import type {PaperListItem as PaperListItemType} from '../../api/types.js';
import {formatDate, formatAuthors, truncate} from '../../utils/formatting.js';

interface PaperListItemProps {
	paper: PaperListItemType;
	isSelected: boolean;
	index: number;
}

export function PaperListItem({paper, isSelected, index}: PaperListItemProps) {
	const primaryCategory = paper.categories.split(' ')[0] || paper.categories;

	return (
		<Box
			flexDirection="column"
			paddingLeft={1}
			borderStyle={isSelected ? 'single' : undefined}
			borderColor={isSelected ? 'cyan' : undefined}
		>
			<Text>
				<Text color={isSelected ? 'cyan' : 'white'} bold>
					{index + 1}. {truncate(paper.title, 70)}
				</Text>
			</Text>
			<Box paddingLeft={2}>
				<Text color="gray">
					{formatAuthors(paper.authors)} | {formatDate(paper.published)} |{' '}
					{primaryCategory}
				</Text>
			</Box>
			<Box paddingLeft={2}>
				<Text color="gray" dimColor>
					{truncate(paper.twoLineSummary || 'No summary available', 90)}
				</Text>
			</Box>
		</Box>
	);
}
