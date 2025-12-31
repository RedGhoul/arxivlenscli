import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Pagination} from '../common/Pagination.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {AuthorListItem} from './AuthorListItem.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {useAuthorSearch} from '../../hooks/useAuthors.js';
import type {AuthorProfile} from '../../api/types.js';

export function AuthorList() {
	const {params, navigate, goBack} = useNavigation();
	const {search, loading, error} = useAuthorSearch();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [authors, setAuthors] = useState<AuthorProfile[]>(
		(params['authors'] as AuthorProfile[]) || [],
	);

	const searchQuery = (params['searchQuery'] as string) || '';
	const page = (params['page'] as number) || 1;
	const totalPages = (params['totalPages'] as number) || 1;
	const hasNext = (params['hasNext'] as boolean) || false;
	const hasPrev = (params['hasPrev'] as boolean) || false;
	const totalCount = (params['totalCount'] as number) || 0;

	useEffect(() => {
		setSelectedIndex(0);
	}, [authors]);

	const handlePageChange = async (newPage: number) => {
		const result = await search(searchQuery, newPage, 10);
		if (result) {
			setAuthors(result.authors);
			navigate('author-list', {
				...params,
				authors: result.authors,
				page: result.page,
				totalPages: result.totalPages,
				hasNext: result.hasNextPage,
				hasPrev: result.hasPreviousPage,
			});
		}
	};

	useInput((input, key) => {
		if (loading) return;

		if (key.escape || input === 'q') {
			goBack();
			return;
		}

		if (key.upArrow) {
			setSelectedIndex(prev => Math.max(0, prev - 1));
		}

		if (key.downArrow) {
			setSelectedIndex(prev => Math.min(authors.length - 1, prev + 1));
		}

		if ((input === 'p' || key.leftArrow) && hasPrev) {
			handlePageChange(page - 1);
		}

		if ((input === 'n' || key.rightArrow) && hasNext) {
			handlePageChange(page + 1);
		}

		if (key.return && authors[selectedIndex]) {
			navigate('author-profile', {
				authorSlug: authors[selectedIndex].genSlug,
				authorData: authors[selectedIndex],
			});
		}
	});

	if (loading) {
		return (
			<Box flexDirection="column">
				<Header subtitle={`Authors: "${searchQuery}"`} />
				<Spinner message="Loading authors..." />
			</Box>
		);
	}

	if (error) {
		return (
			<Box flexDirection="column">
				<Header subtitle={`Authors: "${searchQuery}"`} />
				<ErrorMessage message={error} />
				<Footer hints={[]} />
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Header subtitle={`Authors: "${searchQuery}" (${totalCount} results)`} />

			{authors.length === 0 ? (
				<Text color="gray">No authors found.</Text>
			) : (
				<Box flexDirection="column">
					{authors.map((author, index) => (
						<AuthorListItem
							key={author.genSlug}
							author={author}
							isSelected={index === selectedIndex}
							index={(page - 1) * 10 + index}
						/>
					))}
				</Box>
			)}

			<Pagination
				currentPage={page}
				totalPages={totalPages}
				hasNext={hasNext}
				hasPrev={hasPrev}
			/>

			<Footer
				hints={[
					{key: '↑↓', action: 'Navigate'},
					{key: 'Enter', action: 'View Profile'},
				]}
			/>
		</Box>
	);
}
