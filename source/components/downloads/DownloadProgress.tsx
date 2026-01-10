import React from 'react';
import {Box, Text} from 'ink';
import type {DownloadItem} from '../../hooks/useDownloads.js';
import {useTheme} from '../../theme/index.js';
import {truncate} from '../../utils/formatting.js';

interface DownloadProgressProps {
	item: DownloadItem;
	onCancel?: () => void;
}

export function DownloadProgress({item, onCancel}: DownloadProgressProps) {
	const {colors} = useTheme();

	const getStatusColor = () => {
		switch (item.status) {
			case 'completed': {
				return colors.success;
			}

			case 'failed': {
				return colors.error;
			}

			case 'downloading': {
				return colors.primary;
			}

			default: {
				return colors.muted;
			}
		}
	};

	const getStatusIcon = () => {
		switch (item.status) {
			case 'completed': {
				return '✓';
			}

			case 'failed': {
				return '✗';
			}

			case 'downloading': {
				return '↓';
			}

			default: {
				return '○';
			}
		}
	};

	const progressBars = Math.floor(item.progress / 10);

	return (
		<Box flexDirection="column" marginBottom={1} paddingX={1}>
			<Box>
				<Text color={getStatusColor()} bold>
					[{getStatusIcon()}]
				</Text>{' '}
				<Text color={colors.foreground}>{truncate(item.paper.title, 50)}</Text>
			</Box>

			{item.status === 'downloading' && (
				<Box paddingLeft={4}>
					<Text color={colors.muted}>Progress: </Text>
					<Text color={colors.primary}>
						{'█'.repeat(progressBars)}
						{'░'.repeat(10 - progressBars)}
					</Text>
					<Text color={colors.muted}> {Math.round(item.progress)}%</Text>
				</Box>
			)}

			{item.status === 'completed' && (
				<Box paddingLeft={4}>
					<Text color={colors.success}>Downloaded successfully</Text>
				</Box>
			)}

			{item.status === 'failed' && item.error && (
				<Box paddingLeft={4}>
					<Text color={colors.error}>Error: {item.error}</Text>
					{onCancel && (
						<>
							{' '}
							<Text color={colors.muted}>(ESC to dismiss)</Text>
						</>
					)}
				</Box>
			)}

			{item.status === 'pending' && (
				<Box paddingLeft={4}>
					<Text color={colors.muted}>Queued...</Text>
				</Box>
			)}
		</Box>
	);
}
