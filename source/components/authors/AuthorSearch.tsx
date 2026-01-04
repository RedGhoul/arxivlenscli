import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import TextInput from 'ink-text-input';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Frame} from '../common/Frame.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {useAuthorSearch} from '../../hooks/useAuthors.js';
import {colors, symbols} from '../../theme/index.js';

export function AuthorSearch() {
	const {navigate, goBack} = useNavigation();
	const {search, loading, error} = useAuthorSearch();
	const [query, setQuery] = useState('');

	const handleSearch = async () => {
		if (!query.trim()) return;

		const result = await search(query.trim(), 1, 10);
		if (result) {
			navigate('author-list', {
				searchQuery: query.trim(),
				authors: result.authors,
				totalCount: result.totalCount,
				page: result.page,
				totalPages: result.totalPages,
				hasNext: result.hasNextPage,
				hasPrev: result.hasPreviousPage,
			});
		}
	};

	useInput((input, key) => {
		if (key.escape || input === 'q') {
			goBack();
			return;
		}

		if (key.return && query.trim()) {
			handleSearch();
		}
	});

	if (loading) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Searching authors..." showLogo={false} compact />
				<Spinner message="Searching..." />
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Header subtitle="Search for authors" showLogo={false} compact />

			{error && <ErrorMessage message={error} />}

			<Frame title="AUTHOR SEARCH" width={50}>
				<Box flexDirection="column" paddingY={1}>
					<Box>
						<Text color={colors.primary}>{symbols.prompt} Author name: </Text>
						<TextInput
							value={query}
							onChange={setQuery}
							onSubmit={handleSearch}
							placeholder="Enter author name..."
						/>
					</Box>
				</Box>
			</Frame>

			<Footer hints={[{key: 'ENTER', action: 'Search'}]} />
		</Box>
	);
}
