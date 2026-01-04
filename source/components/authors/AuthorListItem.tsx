import React from 'react';
import {Box, Text} from 'ink';
import type {AuthorProfile} from '../../api/types.js';
import {truncate} from '../../utils/formatting.js';
import {colors, symbols, decorators} from '../../theme/index.js';

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
					{author.name}
				</Text>
			</Box>
			<Box paddingLeft={6}>
				<Text color={colors.secondary}>
					{author.paperCount} paper{author.paperCount === 1 ? '' : 's'}
				</Text>
			</Box>
			{recentTitle && (
				<Box paddingLeft={6}>
					<Text color={colors.caption} dimColor>
						Recent: {truncate(recentTitle, 55)}
					</Text>
				</Box>
			)}
		</Box>
	);
}
