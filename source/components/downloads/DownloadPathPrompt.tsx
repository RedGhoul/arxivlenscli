import React, {useState} from 'react';
import process from 'node:process';
import {Box, Text, useInput} from 'ink';
import TextInput from 'ink-text-input';
import {Frame} from '../common/Frame.js';
import {useApp} from '../../context/AppContext.js';
import {useTheme} from '../../theme/index.js';

interface DownloadPathPromptProps {
	onConfirm: (path: string) => void;
	onCancel: () => void;
}

export function DownloadPathPrompt({
	onConfirm,
	onCancel,
}: DownloadPathPromptProps) {
	const {colors, symbols} = useTheme();
	const {settings} = useApp();
	const defaultPath = settings.downloadPath || process.cwd();
	const [path, setPath] = useState(defaultPath);

	const handleSubmit = () => {
		if (path.trim()) {
			onConfirm(path.trim());
		}
	};

	useInput((input, key) => {
		if (key.escape || (input === 'q' && path === defaultPath)) {
			onCancel();
			return;
		}

		if (key.return && path.trim()) {
			handleSubmit();
		}
	});

	return (
		<Box flexDirection="column">
			<Frame title="DOWNLOAD PATH REQUIRED" width={60} padding={1}>
				<Box flexDirection="column" paddingY={1}>
					<Text color={colors.muted}>
						Please enter a path where papers should be downloaded.
					</Text>

					<Box marginTop={1}>
						<Text color={colors.foreground}>{symbols.prompt} Path: </Text>
						<TextInput
							value={path}
							onChange={setPath}
							onSubmit={handleSubmit}
							placeholder={defaultPath}
						/>
					</Box>

					<Box marginTop={1}>
						<Text color={colors.muted}>Default: {defaultPath}</Text>
					</Box>

					<Box marginTop={2}>
						<Text color={colors.muted}>
							{symbols.bullet} This path will be saved to settings
						</Text>
					</Box>
				</Box>
			</Frame>

			<Box marginTop={1}>
				<Text color={colors.muted}>[ESC] Cancel [ENTER] Confirm</Text>
			</Box>
		</Box>
	);
}
