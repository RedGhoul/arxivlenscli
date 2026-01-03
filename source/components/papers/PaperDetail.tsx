import React, {useEffect, useState} from 'react';
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

export function PaperDetail() {
	const {params, goBack, navigate} = useNavigation();
	const {selectedPaper} = useApp();
	const {fetchDetail, data, loading, error} = usePaperDetail();
	const [showFullAbstract, setShowFullAbstract] = useState(false);
	const {exit} = useInkApp();

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
				await open(paper.arxivLink);
			}

			if (input === 'p') {
				await open(paper.pdfLink);
			}

			if (input === 'a') {
				const firstAuthor = paper.authors?.[0];
				if (firstAuthor) {
					navigate('author-profile', {
						authorSlug: firstAuthor.genSlug,
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
					<Text color="yellow">[o]</Text> Open arXiv{'  '}
					<Text color="yellow">[p]</Text> Open PDF (browser)
				</Text>
			</Box>

			<Footer hints={[]} />
		</Box>
	);
}
