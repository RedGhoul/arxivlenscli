import React from 'react';
import {Box, Text} from 'ink';
import {useTheme} from '../../theme/index.js';

interface SearchSuggestionsProps {
	suggestions: string[];
	selectedIndex: number;
	visible: boolean;
}

export function SearchSuggestions({
	suggestions,
	selectedIndex,
	visible,
}: SearchSuggestionsProps) {
	const {colors, symbols} = useTheme();

	if (!visible || suggestions.length === 0) {
		return null;
	}

	return (
		<Box flexDirection="column" marginLeft={10} marginBottom={1}>
			<Text color={colors.muted}>{symbols.arrowDown} History:</Text>
			{suggestions.map((suggestion, index) => (
				<Box key={suggestion} paddingLeft={1}>
					<Text
						color={index === selectedIndex ? colors.primary : colors.foreground}
						bold={index === selectedIndex}
					>
						{index === selectedIndex ? symbols.arrowRight : ' '} {suggestion}
					</Text>
				</Box>
			))}
		</Box>
	);
}
