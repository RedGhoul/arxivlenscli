import React, {useState, useEffect} from 'react';
import {Box, Text, useInput, useStdout, useApp as useInkApp} from 'ink';
import terminalImage from 'terminal-image';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Spinner} from '../common/Spinner.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {usePdf} from '../../hooks/usePdf.js';
import {detectTerminalCapabilities} from '../../utils/terminalCapabilities.js';

type ViewMode = 'text' | 'image';

export function PdfViewer() {
	const {params, goBack} = useNavigation();
	const {exit} = useInkApp();
	const pdfUrl = params['pdfUrl'] as string;
	const paperTitle = params['paperTitle'] as string | undefined;

	const {stdout} = useStdout();
	const terminalCaps = detectTerminalCapabilities();

	const {
		loading,
		error,
		totalPages,
		currentPage,
		textContent,
		nextPage,
		prevPage,
		loadPageImage,
	} = usePdf(pdfUrl);

	const [viewMode, setViewMode] = useState<ViewMode>('text');
	const [scrollOffset, setScrollOffset] = useState(0);
	const [imageData, setImageData] = useState<string | null>(null);
	const [loadingImage, setLoadingImage] = useState(false);

	// Calculate visible lines based on terminal height
	const terminalHeight = stdout?.rows ?? 24;
	const contentHeight = Math.max(10, terminalHeight - 10); // Account for header, footer, margins

	// Load image when switching to image mode
	useEffect(() => {
		if (viewMode !== 'image') return;

		let cancelled = false;

		const loadImage = async () => {
			setLoadingImage(true);
			try {
				const img = await loadPageImage(currentPage);
				if (cancelled) return;

				if (img) {
					const rendered = await terminalImage.buffer(img.imageBuffer, {
						width: '80%',
						preserveAspectRatio: true,
					});
					if (cancelled) return;

					setImageData(rendered);
				}
			} catch {
				// PDF rendering failed - clear image and let finally handle loading state
				if (!cancelled) {
					setImageData(null);
				}
			} finally {
				if (!cancelled) {
					setLoadingImage(false);
				}
			}
		};

		loadImage();

		return () => {
			cancelled = true;
		};
	}, [viewMode, currentPage, loadPageImage]);

	useInput((input, key) => {
		if (key.escape) {
			goBack();
			return;
		}

		if (input === 'q') {
			exit();
			return;
		}

		// Page navigation
		if (input === 'n' || key.rightArrow) {
			nextPage();
			setScrollOffset(0);
			setImageData(null);
		}

		if (input === 'p' || key.leftArrow) {
			prevPage();
			setScrollOffset(0);
			setImageData(null);
		}

		// Scroll within page (text mode only)
		if (viewMode === 'text' && textContent) {
			const maxScroll = Math.max(0, textContent.lines.length - contentHeight);

			if (key.upArrow) {
				setScrollOffset(prev => Math.max(0, prev - 1));
			}

			if (key.downArrow) {
				setScrollOffset(prev => Math.min(maxScroll, prev + 1));
			}

			if (input === 'k') {
				setScrollOffset(prev => Math.max(0, prev - 5));
			}

			if (input === 'j') {
				setScrollOffset(prev => Math.min(maxScroll, prev + 5));
			}
		}

		// Mode toggle
		if (input === 'i' && terminalCaps.hasGraphicsSupport) {
			setViewMode(prev => (prev === 'text' ? 'image' : 'text'));
			setImageData(null);
		}
	});

	if (loading && !textContent) {
		return (
			<Box flexDirection="column">
				<Header subtitle="PDF Viewer" />
				{paperTitle && (
					<Box marginBottom={1}>
						<Text color="gray">{paperTitle}</Text>
					</Box>
				)}
				<Spinner message="Loading PDF..." />
				<Footer hints={[]} />
			</Box>
		);
	}

	if (error) {
		return (
			<Box flexDirection="column">
				<Header subtitle="PDF Viewer" />
				<Box
					flexDirection="column"
					paddingX={2}
					paddingY={1}
					borderStyle="round"
					borderColor="yellow"
				>
					<Text color="yellow">⚠ {error}</Text>
					<Box marginTop={1}>
						<Text color="gray">
							You can view this PDF in your browser or a dedicated PDF reader.
						</Text>
					</Box>
					{pdfUrl && (
						<Box marginTop={1}>
							<Text color="gray" dimColor>
								URL: {pdfUrl}
							</Text>
						</Box>
					)}
				</Box>
				<Footer hints={[]} />
			</Box>
		);
	}

	const hints = [
		{key: 'n/p', action: 'Next/Prev Page'},
		{key: '\u2191\u2193', action: 'Scroll'},
	];

	if (terminalCaps.hasGraphicsSupport) {
		hints.push({
			key: 'i',
			action: viewMode === 'text' ? 'Image mode' : 'Text mode',
		});
	}

	return (
		<Box flexDirection="column">
			<Header subtitle="PDF Viewer" />

			{/* Title and page info */}
			<Box marginBottom={1} justifyContent="space-between">
				<Box flexShrink={1}>
					<Text color="gray" wrap="truncate">
						{paperTitle ? `"${paperTitle}"` : 'PDF Document'}
					</Text>
				</Box>
				<Box marginLeft={2}>
					<Text>
						<Text color="cyan">Page {currentPage}</Text>
						<Text color="gray"> of {totalPages}</Text>
						<Text color="gray" dimColor>
							{' '}
							[{viewMode.toUpperCase()}]
						</Text>
					</Text>
				</Box>
			</Box>

			{/* Content area */}
			<Box
				flexDirection="column"
				height={contentHeight}
				borderStyle="single"
				borderColor="gray"
				paddingX={1}
				overflow="hidden"
			>
				{viewMode === 'text' && textContent && (
					<Box flexDirection="column">
						{textContent.lines
							.slice(scrollOffset, scrollOffset + contentHeight - 2)
							.map((line, idx) => (
								<Text key={`line-${scrollOffset + idx}`} wrap="truncate-end">
									{line || ' '}
								</Text>
							))}
					</Box>
				)}

				{viewMode === 'image' &&
					(loadingImage ? (
						<Spinner message="Rendering page..." />
					) : imageData ? (
						<Text>{imageData}</Text>
					) : (
						<Text color="gray">Unable to render image</Text>
					))}
			</Box>

			{/* Scroll indicator (text mode) */}
			{viewMode === 'text' &&
				textContent &&
				textContent.lines.length > contentHeight - 2 && (
					<Box justifyContent="center">
						<Text color="gray" dimColor>
							Lines {scrollOffset + 1}-
							{Math.min(
								scrollOffset + contentHeight - 2,
								textContent.lines.length,
							)}{' '}
							of {textContent.lines.length}
						</Text>
					</Box>
				)}

			{/* Terminal info when image mode unavailable */}
			{!terminalCaps.hasGraphicsSupport && (
				<Box marginTop={1}>
					<Text color="gray" dimColor>
						Image mode unavailable (Terminal: {terminalCaps.terminalName})
					</Text>
				</Box>
			)}

			<Footer hints={hints} />
		</Box>
	);
}
