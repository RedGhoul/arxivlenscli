import React, {type ReactNode} from 'react';
import {Box, Text} from 'ink';
import {useTheme, type BorderStyle} from '../../theme/index.js';

interface FrameProps {
	children: ReactNode;
	title?: string;
	variant?: BorderStyle;
	width?: number;
	padding?: number;
	color?: string;
	titleColor?: string;
}

export function Frame({
	children,
	title,
	variant = 'single',
	width = 50,
	padding = 1,
	color,
	titleColor,
}: FrameProps) {
	const {colors, borders} = useTheme();
	const frameColor = color ?? colors.border;
	const frameTitleColor = titleColor ?? colors.primary;
	const border = borders[variant];
	const innerWidth = width - 2; // Account for side borders

	const renderTopBorder = () => {
		if (title) {
			const titleDisplay = ` ${title} `;
			const remainingWidth = innerWidth - titleDisplay.length;
			const leftPad = Math.floor(remainingWidth / 2);
			const rightPad = remainingWidth - leftPad;

			return (
				<Text>
					<Text color={frameColor}>{border.topLeft}</Text>
					<Text color={frameColor}>
						{border.horizontal.repeat(Math.max(0, leftPad))}
					</Text>
					<Text color={frameTitleColor} bold>
						{titleDisplay}
					</Text>
					<Text color={frameColor}>
						{border.horizontal.repeat(Math.max(0, rightPad))}
					</Text>
					<Text color={frameColor}>{border.topRight}</Text>
				</Text>
			);
		}

		return (
			<Text color={frameColor}>
				{border.topLeft}
				{border.horizontal.repeat(innerWidth)}
				{border.topRight}
			</Text>
		);
	};

	return (
		<Box flexDirection="column">
			{renderTopBorder()}
			<Box>
				<Text color={frameColor}>{border.vertical}</Text>
				<Box paddingX={padding} flexGrow={1}>
					{children}
				</Box>
				<Text color={frameColor}>{border.vertical}</Text>
			</Box>
			<Text color={frameColor}>
				{border.bottomLeft}
				{border.horizontal.repeat(innerWidth)}
				{border.bottomRight}
			</Text>
		</Box>
	);
}

interface SeparatorProps {
	width?: number;
	variant?: 'single' | 'double' | 'heavy' | 'dots' | 'dashes';
	color?: string;
}

export function Separator({
	width = 50,
	variant = 'single',
	color,
}: SeparatorProps) {
	const {colors} = useTheme();
	const separatorColor = color ?? colors.border;
	const chars: Record<string, string> = {
		single: '\u2500',
		double: '\u2550',
		heavy: '\u2501',
		dots: '\u2504',
		dashes: '\u2508',
	};

	return <Text color={separatorColor}>{chars[variant]?.repeat(width)}</Text>;
}
