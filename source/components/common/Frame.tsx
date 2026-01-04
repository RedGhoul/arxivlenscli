import React, {type ReactNode} from 'react';
import {Box, Text} from 'ink';
import {borders, colors, type BorderStyle} from '../../theme/index.js';

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
	color = colors.border,
	titleColor = colors.primary,
}: FrameProps) {
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
					<Text color={color}>{border.topLeft}</Text>
					<Text color={color}>
						{border.horizontal.repeat(Math.max(0, leftPad))}
					</Text>
					<Text color={titleColor} bold>
						{titleDisplay}
					</Text>
					<Text color={color}>
						{border.horizontal.repeat(Math.max(0, rightPad))}
					</Text>
					<Text color={color}>{border.topRight}</Text>
				</Text>
			);
		}

		return (
			<Text color={color}>
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
				<Text color={color}>{border.vertical}</Text>
				<Box paddingX={padding} flexGrow={1}>
					{children}
				</Box>
				<Text color={color}>{border.vertical}</Text>
			</Box>
			<Text color={color}>
				{border.bottomLeft}
				{border.horizontal.repeat(innerWidth)}
				{border.bottomRight}
			</Text>
		</Box>
	);
}

// Simpler horizontal separator line
interface SeparatorProps {
	width?: number;
	variant?: 'single' | 'double' | 'heavy' | 'dots' | 'dashes';
	color?: string;
}

export function Separator({
	width = 50,
	variant = 'single',
	color = colors.border,
}: SeparatorProps) {
	const chars: Record<string, string> = {
		single: '\u2500',
		double: '\u2550',
		heavy: '\u2501',
		dots: '\u2504',
		dashes: '\u2508',
	};

	return <Text color={color}>{chars[variant]?.repeat(width)}</Text>;
}
