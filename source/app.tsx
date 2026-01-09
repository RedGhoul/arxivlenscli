import React from 'react';
import {useInput, useApp as useInkApp} from 'ink';
import {AppProvider, useApp} from './context/AppContext.js';
import {MainMenu} from './components/menu/MainMenu.js';
import {PaperSearch} from './components/papers/PaperSearch.js';
import {SearchResults} from './components/papers/SearchResults.js';
import {DatePapers} from './components/papers/DatePapers.js';
import {PaperList} from './components/papers/PaperList.js';
import {PaperDetail} from './components/papers/PaperDetail.js';
import {KeyFindingsView} from './components/papers/KeyFindingsView.js';
import {PdfViewer} from './components/papers/PdfViewer.js';
import {DateBrowser} from './components/papers/DateBrowser.js';
import {CategoryBrowser} from './components/papers/CategoryBrowser.js';
import {AuthorSearch} from './components/authors/AuthorSearch.js';
import {AuthorList} from './components/authors/AuthorList.js';
import {AuthorProfile} from './components/authors/AuthorProfile.js';
import {SettingsScreen} from './components/settings/SettingsScreen.js';
import {HelpOverlay} from './components/common/HelpOverlay.js';

function Router() {
	const {navigation, goBack, canGoBack, showHelp, toggleHelp} = useApp();
	const {exit} = useInkApp();

	useInput((input, key) => {
		if (input.toLowerCase() === 'q') {
			exit();
		}

		if (input === '?' && !showHelp) {
			toggleHelp();
			return;
		}

		if (key.escape && canGoBack) {
			goBack();
		}
	});

	if (showHelp) {
		return <HelpOverlay onClose={toggleHelp} />;
	}

	const {route} = navigation;

	switch (route) {
		case 'main-menu': {
			return <MainMenu />;
		}

		case 'paper-search': {
			return <PaperSearch />;
		}

		case 'search-results': {
			return <SearchResults />;
		}

		case 'date-papers': {
			return <DatePapers />;
		}

		case 'paper-list': {
			return <PaperList />;
		}

		case 'paper-detail': {
			return <PaperDetail />;
		}

		case 'key-findings': {
			return <KeyFindingsView />;
		}

		case 'pdf-viewer': {
			return <PdfViewer />;
		}

		case 'date-browser': {
			return <DateBrowser />;
		}

		case 'category-browser': {
			return <CategoryBrowser />;
		}

		case 'author-search': {
			return <AuthorSearch />;
		}

		case 'author-list': {
			return <AuthorList />;
		}

		case 'author-profile': {
			return <AuthorProfile />;
		}

		case 'settings': {
			return <SettingsScreen />;
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
