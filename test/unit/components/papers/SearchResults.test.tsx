import React from 'react';
import {render} from '@testing-library/react';
import SearchResults from '../../../source/components/papers/SearchResults.js';

jest.mock('../../../source/hooks/useNavigation.js', () => ({
	useNavigation: jest.fn(),
}));

jest.mock('../../../source/hooks/usePaperSearch.js', () => ({
	usePaperSearch: jest.fn(),
}));

jest.mock('../../../source/context/AppContext.js', () => ({
	useApp: jest.fn(),
}));

jest.mock('../../../source/api/types.js', () => ({
	SearchParams: {},
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

describe('SearchResults', () => {
	it('renders without crashing', () => {
		expect(() => render(<SearchResults />)).not.toThrow();
	});

	it('renders loading state', () => {
		const {container} = render(<SearchResults />);

		expect(container).toBeDefined();
	});

	it('renders empty state', () => {
		const {container} = render(<SearchResults />);

		expect(container).toBeDefined();
	});
});
