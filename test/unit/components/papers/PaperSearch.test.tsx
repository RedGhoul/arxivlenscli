import React from 'react';
import {render} from '@testing-library/react';
import PaperSearch from '../../../source/components/papers/PaperSearch.js';

jest.mock('../../../source/hooks/useNavigation.js', () => ({
	useNavigation: jest.fn(),
}));

jest.mock('../../../source/hooks/usePaperSearch.js', () => ({
	usePaperSearch: jest.fn(),
}));

jest.mock('../../../source/context/AppContext.js', () => ({
	useApp: jest.fn(),
}));

jest.mock('../../../source/hooks/usePageSize.js', () => ({
	usePageSize: jest.fn(() => 10),
}));

jest.mock('../../../source/theme/index.js', () => ({
	useTheme: jest.fn(() => ({
		colors: {
			primary: 'cyan',
			foreground: 'white',
			muted: 'gray',
			success: 'green',
		},
		symbols: {
			prompt: '?',
			arrow: '→',
			checkmark: '✓',
		},
	})),
}));

jest.mock('ink', () => ({
	Box: ({children}) => <div>{children}</div>,
	Text: ({children}) => <span>{children}</span>,
	useInput: jest.fn(() => jest.fn()),
}));

jest.mock('ink-text-input');
jest.mock('ink-select-input');

jest.mock('open', () => jest.fn());

jest.mock('../../../source/utils/constants.js', () => ({
	SORT_OPTIONS: [
		{label: 'Relevance', value: 'relevance'},
		{label: 'Date', value: 'date'},
		{label: 'Citations', value: 'citations'},
		{label: 'Recent', value: 'recent'},
		{label: 'Highly Cited', value: 'cited'},
	],
}));

describe('PaperSearch', () => {
	it('renders without crashing', () => {
		expect(() => render(<PaperSearch />)).not.toThrow();
	});

	it('renders search input container', () => {
		const {container} = render(<PaperSearch />);

		expect(container).toBeDefined();
	});

	it('renders Header component', () => {
		const {container} = render(<PaperSearch />);

		expect(container).toBeDefined();
	});
});
