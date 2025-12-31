import React from 'react';
import {Box, Text, useInput, useApp as useInkApp} from 'ink';
import {AppProvider, useApp} from './context/AppContext.js';
import {MainMenu} from './components/menu/MainMenu.js';
import {PaperSearch} from './components/papers/PaperSearch.js';
import {PaperList} from './components/papers/PaperList.js';
import {PaperDetail} from './components/papers/PaperDetail.js';
import {DateBrowser} from './components/papers/DateBrowser.js';
import {CategoryBrowser} from './components/papers/CategoryBrowser.js';
import {Header} from './components/common/Header.js';
import {Footer} from './components/common/Footer.js';

function PlaceholderScreen({title}: {title: string}) {
	return (
		<Box flexDirection="column">
			<Header subtitle={title} />
			<Box marginY={1}>
				<Box borderStyle="round" paddingX={2}>
					<Text color="yellow">Coming Soon</Text>
				</Box>
			</Box>
			<Text color="gray">This feature is not yet implemented.</Text>
			<Footer hints={[]} />
		</Box>
	);
}

function Router() {
	const {navigation, goBack} = useApp();
	const {exit} = useInkApp();

	useInput((input, key) => {
		if (input === 'Q') {
			exit();
		}

		if (key.escape && navigation.route !== 'main-menu') {
			goBack();
		}
	});

	const {route} = navigation;

	switch (route) {
		case 'main-menu': {
			return <MainMenu />;
		}

		case 'paper-search': {
			return <PaperSearch />;
		}

		case 'paper-list': {
			return <PaperList />;
		}

		case 'paper-detail': {
			return <PaperDetail />;
		}

		case 'date-browser': {
			return <DateBrowser />;
		}

		case 'category-browser': {
			return <CategoryBrowser />;
		}

		case 'author-search': {
			return <PlaceholderScreen title="Search Authors" />;
		}

		case 'settings': {
			return <PlaceholderScreen title="Settings" />;
		}

		default: {
			return <MainMenu />;
		}
	}
}

export default function App() {
	return (
		<AppProvider>
			<Router />
		</AppProvider>
	);
}
