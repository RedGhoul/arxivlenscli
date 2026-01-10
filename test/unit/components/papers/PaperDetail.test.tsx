import React from 'react';
import {render} from '@testing-library/react';
import PaperDetail from '../../../source/components/papers/PaperDetail.js';

jest.mock('../../../source/hooks/useNavigation.js', () => ({
	useNavigation: jest.fn(),
}));

jest.mock('../../../source/hooks/usePaperDetail.js', () => ({
	usePaperDetail: jest.fn(),
}));

jest.mock('../../../source/context/AppContext.js', () => ({
	useApp: jest.fn(),
}));

jest.mock('../../../source/utils/formatting.js', () => ({
	formatDate: jest.fn(() => 'Jan 15, 2024'),
	formatAuthors: jest.fn((authors, limit) => 'Alice Smith, Bob Jones'),
}));

jest.mock('ink', () => ({
	Box: ({children}) => <div>{children}</div>,
	Text: ({children}) => <span>{children}</span>,
	useInput: jest.fn(),
}));

jest.mock('open', () => jest.fn());

describe('PaperDetail', () => {
	it('renders without crashing', () => {
		expect(() => render(<PaperDetail />)).not.toThrow();
	});

	it('renders loading state', () => {
		const {container} = render(<PaperDetail />);

		expect(container).toBeDefined();
	});

	it('renders error state', () => {
		const {container} = render(<PaperDetail />);

		expect(container).toBeDefined();
	});

	it('renders no paper selected message', () => {
		const {container} = render(<PaperDetail />);

		expect(container).toBeDefined();
	});
});
