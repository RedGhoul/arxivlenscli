import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import SelectInput from 'ink-select-input';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Frame} from '../common/Frame.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {useCategories, usePaperSearch} from '../../hooks/usePapers.js';
import {usePageSize} from '../../hooks/usePageSize.js';
import {useApp} from '../../context/AppContext.js';
import type {CategoryGroup} from '../../api/types.js';
import {colors, symbols} from '../../theme/index.js';

type Level = 'groups' | 'categories';

export function CategoryBrowser() {
	const {navigate, goBack} = useNavigation();
	const {
		fetchCategories,
		data: categoriesData,
		loading: loadingCategories,
		error: categoriesError,
	} = useCategories();
	const {search, loading: loadingPapers, error: searchError} = usePaperSearch();
	const {setPapersList, setLastSearchParams} = useApp();
	const pageSize = usePageSize();

	const [level, setLevel] = useState<Level>('groups');
	const [selectedGroup, setSelectedGroup] = useState<CategoryGroup | null>(
		null,
	);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const handleGroupSelect = (item: {value: string}) => {
		const group = categoriesData?.find(g => g.name === item.value);
		if (group) {
			setSelectedGroup(group);
			setLevel('categories');
		}
	};

	const handleCategorySelect = async (item: {value: string}) => {
		const categoryCode = item.value;
		const params = {
			categories: [categoryCode],
			page: 1,
			pageSize,
		};

		const result = await search(params);
		if (result) {
			setLastSearchParams(params);
			setPapersList(result.papers);
			navigate('paper-list', {
				title: `Category: ${categoryCode}`,
				source: 'category',
				category: categoryCode,
				searchParams: params,
				totalCount: result.totalCount,
				page: result.page,
				totalPages: result.totalPages,
				hasNext: result.hasNextPage,
				hasPrev: result.hasPreviousPage,
				pageSize,
			});
		}
	};

	useInput((input, key) => {
		if (loadingCategories || loadingPapers) return;

		if (key.escape) {
			if (level === 'categories') {
				setLevel('groups');
				setSelectedGroup(null);
			} else {
				goBack();
			}

			return;
		}

		if (input === 'q' && level === 'groups') {
			goBack();
		}
	});

	if (loadingCategories || loadingPapers) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Loading..." showLogo={false} compact />
				<Spinner
					message={
						loadingCategories ? 'Loading categories...' : 'Loading papers...'
					}
				/>
			</Box>
		);
	}

	const error = categoriesError || searchError;
	if (error) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Category Browser" showLogo={false} compact />
				<ErrorMessage message={error} />
				<Footer hints={[]} />
			</Box>
		);
	}

	if (level === 'groups' && categoriesData) {
		const groupItems = categoriesData.map(group => ({
			label: `${group.name} (${group.categories.length} categories)`,
			value: group.name,
		}));

		return (
			<Box flexDirection="column">
				<Header subtitle="Select a category group" showLogo={false} compact />
				<Frame title="CATEGORY GROUPS" width={55}>
					<Box flexDirection="column" paddingY={1}>
						<Box marginBottom={1}>
							<Text color={colors.muted}>{symbols.prompt} Select a group:</Text>
						</Box>
						<SelectInput items={groupItems} onSelect={handleGroupSelect} />
					</Box>
				</Frame>
				<Footer hints={[]} />
			</Box>
		);
	}

	if (level === 'categories' && selectedGroup) {
		const categoryItems = selectedGroup.categories.map(cat => ({
			label: `${cat.name} (${cat.code})`,
			value: cat.code,
		}));

		return (
			<Box flexDirection="column">
				<Header
					subtitle={`${selectedGroup.name} - Select a category`}
					showLogo={false}
					compact
				/>
				<Frame title={selectedGroup.name.toUpperCase()} width={60}>
					<Box flexDirection="column" paddingY={1}>
						<SelectInput
							items={categoryItems}
							onSelect={handleCategorySelect}
							limit={15}
						/>
					</Box>
				</Frame>
				<Footer hints={[{key: 'ESC', action: 'Back to groups'}]} />
			</Box>
		);
	}

	return null;
}
