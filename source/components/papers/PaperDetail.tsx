import React, {useEffect, useRef, useState} from 'react';
import {Box, Text, useInput, useApp as useInkApp} from 'ink';
import open from 'open';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {usePaperDetail} from '../../hooks/usePapers.js';
import {useApp} from '../../context/AppContext.js';
import {formatDate, formatAuthors} from '../../utils/formatting.js';

/**
 * Validates that a URL is a safe arXiv URL before opening it.
 * Prevents potential security issues from malicious API responses.
 */
function isValidArxivUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		// Only allow HTTPS protocol
		if (parsed.protocol !== 'https:') {
			return false;
		}

		// Allow arxiv.org and its subdomains (e.g., export.arxiv.org)
		const validHosts = ['arxiv.org', 'export.arxiv.org', 'browse.arxiv.org'];
		const isArxivHost =
			validHosts.includes(parsed.hostname) ||
			parsed.hostname.endsWith('.arxiv.org');

		return isArxivHost;
	} catch {
		// Invalid URL format - treat as unsafe
		return false;
	}
}

export function PaperDetail() {
	const {params, goBack, navigate} = useNavigation();
	const {selectedPaper} = useApp();
	const {fetchDetail, data, loading, error} = usePaperDetail();
	const [showFullAbstract, setShowFullAbstract] = useState(false);
	const [actionError, setActionError] = useState<string | null>(null);
	const {exit} = useInkApp();
	const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Cleanup timeout on unmount to prevent memory leaks
	useEffect(() => {
		return () => {
			if (errorTimeoutRef.current) {
				clearTimeout(errorTimeoutRef.current);
			}
		};
	}, []);

	const paperId = params['paperId'] as string;

	useEffect(() => {
		if (paperId) {
			fetchDetail(paperId);
		}
	}, [paperId, fetchDetail]);

	const paper = data?.paper ?? selectedPaper;

	useInput(async (input, key) => {
		if (key.escape) {
			goBack();
			return;
		}

		if (input === 'q') {
			exit();
			return;
		}

		if (paper) {
			if (input === 'o') {
				try {
					if (!isValidArxivUrl(paper.arxivLink)) {
						throw new Error(
							'Invalid arXiv URL: only arxiv.org links are allowed',
						);
					}

					await open(paper.arxivLink);
					setActionError(null);
				} catch (error) {
					const errorMessage =
						error instanceof Error ? error.message : 'Failed to open link';
					setActionError(errorMessage);
					if (errorTimeoutRef.current) {
						clearTimeout(errorTimeoutRef.current);
					}

					errorTimeoutRef.current = setTimeout(
						() => setActionError(null),
						3000,
					);
				}
			}

			if (input === 'p') {
				try {
					if (!isValidArxivUrl(paper.pdfLink)) {
						throw new Error(
							'Invalid PDF URL: only arxiv.org links are allowed',
						);
					}

					await open(paper.pdfLink);
					setActionError(null);
				} catch (error) {
					const errorMessage =
						error instanceof Error ? error.message : 'Failed to open PDF';
					setActionError(errorMessage);
					if (errorTimeoutRef.current) {
						clearTimeout(errorTimeoutRef.current);
					}

					errorTimeoutRef.current = setTimeout(
						() => setActionError(null),
						3000,
					);
				}
			}

			if (input === 'd') {
				navigate('download-manager', {
					papers: [paper],
				});
			}

			if (input === 'a') {
				const authors = paper.authors || [];
				if (authors.length > 0 && authors[0]) {
					navigate('author-profile', {
						authorSlug: authors[0].genSlug,
					});
				}
			}

			if (input === 'm') {
				setShowFullAbstract(!showFullAbstract);
			}

			if (input === 'k') {
				navigate('key-findings', {
					paperId: paper.genSlug,
					paperTitle: paper.title,
				});
			}

			if (input === 'v') {
				navigate('pdf-viewer', {
					pdfUrl: paper.pdfLink,
					paperTitle: paper.title,
				});
			}
		}
	});

	if (loading && !paper) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Loading paper details..." />
				<Spinner message="Fetching paper details..." />
			</Box>
		);
	}

	if (error && !paper) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Paper Details" />
				<ErrorMessage message={error} />
				<Footer hints={[]} />
			</Box>
		);
	}

	if (!paper) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Paper Details" />
				<Text color="gray">No paper selected.</Text>
				<Footer hints={[]} />
			</Box>
		);
	}

	const fullPaper = data?.paper ?? paper;
	const abstractText: string =
		'summary' in fullPaper && typeof fullPaper.summary === 'string'
			? fullPaper.summary
			: fullPaper.twoLineSummary || '';

	const displayAbstract: string =
		showFullAbstract || abstractText.length <= 500
			? abstractText
			: abstractText.slice(0, 500) + '...';

	const journalRef =
		'journalRef' in fullPaper && typeof fullPaper.journalRef === 'string'
			? fullPaper.journalRef
			: null;

	const doi =
		'doi' in fullPaper && typeof fullPaper.doi === 'string'
			? fullPaper.doi
			: null;

	return (
		<Box flexDirection="column">
			<Header subtitle="Paper Details" />
			{actionError && <ErrorMessage message={actionError} />}

			<Box marginBottom={1}>
				<Text bold color="cyan">
					{fullPaper.title}
				</Text>
			</Box>

			<Box marginBottom={1}>
				<Text>
					<Text color="gray">Authors: </Text>
					{formatAuthors(fullPaper.authors, 10)}
				</Text>
			</Box>

			<Box marginBottom={1} flexDirection="column">
				<Text>
					<Text color="gray">Published: </Text>
					{formatDate(fullPaper.published)}
				</Text>
				<Text>
					<Text color="gray">Categories: </Text>
					{fullPaper.categories}
				</Text>
				<Text>
					<Text color="gray">arXiv ID: </Text>
					{fullPaper.paperId}
				</Text>
				{journalRef && (
					<Text>
						<Text color="gray">Journal: </Text>
						{journalRef}
					</Text>
				)}
				{doi && (
					<Text>
						<Text color="gray">DOI: </Text>
						{doi}
					</Text>
				)}
			</Box>

			<Box marginBottom={1} flexDirection="column">
				<Text color="gray" bold>
					Abstract:
				</Text>
				<Box marginLeft={2}>
					<Text wrap="wrap">{displayAbstract || 'No abstract available.'}</Text>
				</Box>
				{abstractText.length > 500 && (
					<Text color="cyan">
						[m] {showFullAbstract ? 'Show less' : 'Show more'}
					</Text>
				)}
			</Box>

			<Box marginTop={1} flexDirection="column">
				<Text color="gray">Actions:</Text>
				<Text>
					{'  '}
					<Text color="yellow">[a]</Text> View Authors{'  '}
					<Text color="yellow">[k]</Text> Key Findings{'  '}
					<Text color="yellow">[v]</Text> View PDF{'  '}
					<Text color="yellow">[d]</Text> Download PDF{'  '}
					<Text color="yellow">[o]</Text> Open arXiv{'  '}
					<Text color="yellow">[p]</Text> Open PDF (browser)
				</Text>
			</Box>

			<Footer hints={[]} />
		</Box>
	);
}
