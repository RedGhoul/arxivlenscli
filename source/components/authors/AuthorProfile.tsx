import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {useAuthorProfile} from '../../hooks/useAuthors.js';
import {formatDate, truncate} from '../../utils/formatting.js';
import type {AuthorProfile as AuthorProfileType} from '../../api/types.js';

export function AuthorProfile() {
	const {params, navigate, goBack} = useNavigation();
	const {fetchProfile, data, loading, error} = useAuthorProfile();
	const [selectedIndex, setSelectedIndex] = useState(0);

	const authorSlug = params['authorSlug'] as string;
	const initialAuthorData = params['authorData'] as
		| AuthorProfileType
		| undefined;

	useEffect(() => {
		if (authorSlug) {
			fetchProfile(authorSlug);
		}
	}, [authorSlug, fetchProfile]);

	const author = data || initialAuthorData;
	const papers = author?.papers || [];
	const displayPapers = papers.slice(0, 10);

	useInput((input, key) => {
		if (loading && !author) return;

		if (key.escape || input === 'q') {
			goBack();
			return;
		}

		if (key.upArrow) {
			setSelectedIndex(prev => Math.max(0, prev - 1));
		}

		if (key.downArrow) {
			setSelectedIndex(prev => Math.min(displayPapers.length - 1, prev + 1));
		}

		if (key.return && displayPapers[selectedIndex]) {
			navigate('paper-detail', {
				paperId: displayPapers[selectedIndex].genSlug,
			});
		}
	});

	if (loading && !author) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Author Profile" />
				<Spinner message="Loading author profile..." />
			</Box>
		);
	}

	if (error && !author) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Author Profile" />
				<ErrorMessage message={error} />
				<Footer hints={[]} />
			</Box>
		);
	}

	if (!author) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Author Profile" />
				<Text color="gray">Author not found.</Text>
				<Footer hints={[]} />
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Header subtitle="Author Profile" />

			<Box marginBottom={1} flexDirection="column">
				<Text bold color="cyan">
					{author.name}
				</Text>
				<Text color="gray">Total Papers: {author.paperCount}</Text>
			</Box>

			<Box marginBottom={1} flexDirection="column">
				<Text bold color="gray">
					Recent Papers:
				</Text>
				{displayPapers.length === 0 ? (
					<Text color="gray" dimColor>
						No papers found.
					</Text>
				) : (
					displayPapers.map((paper, index) => (
						<Box
							key={paper.genSlug || paper.title || index}
							flexDirection="column"
							paddingLeft={1}
							borderStyle={index === selectedIndex ? 'single' : undefined}
							borderColor={index === selectedIndex ? 'cyan' : undefined}
						>
							<Text color={index === selectedIndex ? 'cyan' : 'white'}>
								{index + 1}. {truncate(paper.title, 65)}
							</Text>
							<Box paddingLeft={2}>
								<Text color="gray">
									{formatDate(paper.published)} |{' '}
									{paper.categories?.split(' ')[0] || 'Unknown'}
								</Text>
							</Box>
						</Box>
					))
				)}
			</Box>

			<Footer
				hints={[
					{key: '↑↓', action: 'Navigate'},
					{key: 'Enter', action: 'View paper'},
				]}
			/>
		</Box>
	);
}
