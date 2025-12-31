import React from 'react';
import {Box, Text} from 'ink';
import type {AuthorProfile} from '../../api/types.js';
import {truncate} from '../../utils/formatting.js';

interface AuthorListItemProps {
	author: AuthorProfile;
	isSelected: boolean;
	index: number;
}

export function AuthorListItem({
	author,
	isSelected,
	index,
}: AuthorListItemProps) {
	const recentPaper = author.papers?.[0];
	const recentTitle = recentPaper?.title || author.paperTitles?.[0];

	return (
		<Box
			flexDirection="column"
			paddingLeft={1}
			borderStyle={isSelected ? 'single' : undefined}
			borderColor={isSelected ? 'cyan' : undefined}
		>
			<Text>
				<Text color={isSelected ? 'cyan' : 'white'} bold>
					{index + 1}. {author.name}
				</Text>
			</Text>
			<Box paddingLeft={2}>
				<Text color="gray">
					{author.paperCount} paper{author.paperCount === 1 ? '' : 's'}
				</Text>
			</Box>
			{recentTitle && (
				<Box paddingLeft={2}>
					<Text color="gray" dimColor>
						Recent: {truncate(recentTitle, 60)}
					</Text>
				</Box>
			)}
		</Box>
	);
}
