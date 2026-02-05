import React, {useEffect, useState} from 'react';
import {Box, Text, useInput} from 'ink';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {DownloadProgress} from './DownloadProgress.js';
import {DownloadPathPrompt} from './DownloadPathPrompt.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {useDownloads} from '../../hooks/useDownloads.js';
import {useApp} from '../../context/AppContext.js';
import {useTheme} from '../../theme/index.js';
import type {PaperListItem} from '../../api/types.js';

export function DownloadManager() {
	const {params, goBack} = useNavigation();
	const {settings, updateSettings} = useApp();
	const {colors} = useTheme();

	const papers = (params['papers'] as PaperListItem[]) || [];
	const [showPathPrompt, setShowPathPrompt] = useState(false);

	const downloads = useDownloads(settings);
	const initialPapers = papers;

	useEffect(() => {
		if (initialPapers.length > 0 && settings.downloadPath) {
			downloads.addToQueue(initialPapers);
		} else if (initialPapers.length > 0 && !settings.downloadPath) {
			setShowPathPrompt(true);
		}
	}, [initialPapers, settings.downloadPath, downloads]);

	const progress = downloads.getProgress();

	const handlePathConfirm = (path: string) => {
		updateSettings({downloadPath: path});
		setShowPathPrompt(false);
		if (initialPapers.length > 0) {
			downloads.addToQueue(initialPapers);
		}
	};

	const handlePathCancel = () => {
		setShowPathPrompt(false);
		goBack();
	};

	useInput((input, key) => {
		if (key.escape || input === 'q') {
			goBack();
			return;
		}

		if (input === 's') {
			downloads.startDownloads();
		}

		if (input === 'p') {
			downloads.pauseDownloads();
		}

		if (input === 'r') {
			downloads.retryFailed();
		}

		if (input === 'c') {
			downloads.clearCompleted();
		}
	});

	if (showPathPrompt) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Download Manager" />
				<Box paddingX={1} marginTop={1}>
					<DownloadPathPrompt
						onConfirm={handlePathConfirm}
						onCancel={handlePathCancel}
					/>
				</Box>
			</Box>
		);
	}

	if (!settings.downloadPath) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Download Manager" />
				<Box paddingX={1}>
					<ErrorMessage message="Please set a download path in settings first" />
				</Box>
				<Footer hints={[{key: 'ESC', action: 'Back'}]} />
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Header subtitle="Download Manager" />

			{downloads.queue.length === 0 && papers.length === 0 ? (
				<Box paddingX={1}>
					<Text color={colors.muted}>No downloads in queue</Text>
				</Box>
			) : (
				<>
					<Box paddingX={1} marginBottom={1}>
						<Text color={colors.foreground}>
							<Text color={colors.muted}>Total: </Text>
							{progress.total} <Text color={colors.muted}>| Completed: </Text>
							<Text color={colors.success}>{progress.completed}</Text>
							<Text color={colors.muted}>
								{' '}
								({Math.round(progress.percentage)}%)
							</Text>
						</Text>
					</Box>

					{downloads.queue.map(item => (
						<DownloadProgress key={item.paper.paperId} item={item} />
					))}
				</>
			)}

			<Box marginTop={1} flexDirection="column" paddingX={1}>
				<Text color={colors.muted}>Actions:</Text>
				<Text>
					{'  '}
					<Text color={colors.primary}>[s]</Text> Start{'  '}
					<Text color={colors.primary}>[p]</Text> Pause{'  '}
					<Text color={colors.primary}>[r]</Text> Retry Failed{'  '}
					<Text color={colors.primary}>[c]</Text> Clear Completed
				</Text>
			</Box>

			<Footer hints={[{key: 'ESC', action: 'Back'}]} />
		</Box>
	);
}
