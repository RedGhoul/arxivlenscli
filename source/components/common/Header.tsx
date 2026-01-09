import React from 'react';
import {Box, Text} from 'ink';
import {colors, separators, symbols, ASCII_LOGO} from '../../theme/index.js';
import {useTypingEffect, useBlinkingCursor} from '../../hooks/useAnimations.js';

interface HeaderProps {
	subtitle?: string;
	showLogo?: boolean;
	animated?: boolean;
	compact?: boolean;
}

function getSystemInfo() {
	const now = new Date();
	const date = now.toISOString().split('T')[0];
	const time = now.toTimeString().split(' ')[0];
	const dateStr = date ?? '';
	const timeStr = time ?? '';
	return `SYS.TIME: ${dateStr} ${timeStr}`;
}

export function Header({
	subtitle,
	showLogo = true,
	animated = true,
	compact = false,
}: HeaderProps) {
	const {displayText, isComplete} = useTypingEffect(
		subtitle ?? '',
		animated && Boolean(subtitle),
	);
	const cursor = useBlinkingCursor(animated && !isComplete);

	return (
		<Box flexDirection="column" marginBottom={1}>
			{showLogo && !compact && (
				<Box flexDirection="column">
					<Text color={colors.primary}>{ASCII_LOGO}</Text>
					<Text color={colors.border}>{separators.double(56)}</Text>
				</Box>
			)}

			{showLogo && compact && (
				<Box>
					<Text color={colors.primary} bold>
						{symbols.arrow} ARXIVLENS
					</Text>
					<Text color={colors.border}> {separators.single(40)}</Text>
				</Box>
			)}

			<Box justifyContent="space-between">
				<Box>
					{subtitle && (
						<Text>
							<Text color={colors.secondary}>{symbols.prompt} </Text>
							<Text color={colors.foreground}>
								{displayText}
								{cursor}
							</Text>
						</Text>
					)}
				</Box>
				<Text color={colors.muted} dimColor>
					{getSystemInfo()}
				</Text>
			</Box>
		</Box>
	);
}

// Compact header variant for inner screens
interface HeaderCompactProps {
	title: string;
	subtitle?: string;
}

export function HeaderCompact({title, subtitle}: HeaderCompactProps) {
	return (
		<Box flexDirection="column" marginBottom={1}>
			<Box>
				<Text color={colors.border}>\u251C</Text>
				<Text color={colors.border}>\u2500\u2500</Text>
				<Text color={colors.primary} bold>
					{' '}
					{title}{' '}
				</Text>
				<Text color={colors.border}>
					{'\u2500'.repeat(Math.max(0, 40 - title.length))}
				</Text>
				<Text color={colors.border}>\u2524</Text>
			</Box>
			{subtitle && (
				<Text color={colors.muted}>
					{'   // '}
					{subtitle}
				</Text>
			)}
		</Box>
	);
}
