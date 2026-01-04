import React from 'react';
import {Box, Text} from 'ink';
import {colors} from '../../theme/index.js';
import {useSpinner} from '../../hooks/useAnimations.js';

type SpinnerType = 'dots' | 'line' | 'blocks' | 'scanning';

interface SpinnerProps {
	message?: string;
	type?: SpinnerType;
}

export function Spinner({
	message = 'Loading...',
	type = 'scanning',
}: SpinnerProps) {
	const spinnerChar = useSpinner(type);

	return (
		<Box>
			<Text color={colors.primary}>{spinnerChar}</Text>
			<Text color={colors.foreground}> {message}</Text>
		</Box>
	);
}

// Progress bar component
interface ProgressBarProps {
	progress: number; // 0-100
	width?: number;
	showPercentage?: boolean;
	label?: string;
}

export function ProgressBar({
	progress,
	width = 30,
	showPercentage = true,
	label,
}: ProgressBarProps) {
	const clampedProgress = Math.max(0, Math.min(100, progress));
	const filled = Math.floor((clampedProgress / 100) * width);
	const empty = width - filled;

	return (
		<Box>
			{label && <Text color={colors.foreground}>{label} </Text>}
			<Text color={colors.border}>[</Text>
			<Text color={colors.primary}>{'\u2588'.repeat(filled)}</Text>
			<Text color={colors.muted}>{'\u2591'.repeat(empty)}</Text>
			<Text color={colors.border}>]</Text>
			{showPercentage && (
				<Text color={colors.foreground}> {clampedProgress}%</Text>
			)}
		</Box>
	);
}

// Status indicator with different states
interface StatusIndicatorProps {
	status: 'success' | 'warning' | 'error' | 'info' | 'loading';
	message: string;
}

export function StatusIndicator({status, message}: StatusIndicatorProps) {
	const statusConfig = {
		success: {color: colors.success, symbol: '\u2713'}, // ✓
		warning: {color: colors.warning, symbol: '\u26A0'}, // ⚠
		error: {color: colors.error, symbol: '\u2717'}, // ✗
		info: {color: colors.info, symbol: '\u2139'}, // ℹ
		loading: {color: colors.primary, symbol: '\u25CF'}, // ●
	};

	const config = statusConfig[status];

	return (
		<Box>
			<Text color={config.color}>{config.symbol}</Text>
			<Text color={colors.foreground}> {message}</Text>
		</Box>
	);
}
