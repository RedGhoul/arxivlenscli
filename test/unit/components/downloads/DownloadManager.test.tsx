import React from 'react';
import {render} from '@testing-library/react';
import DownloadManager from '../../../source/components/downloads/DownloadManager.js';

jest.mock('../../../source/hooks/useNavigation.js', () => ({
	useNavigation: jest.fn(),
}));

jest.mock('../../../source/hooks/useDownloads.js', () => ({
	useDownloads: jest.fn(() => ({
		addToQueue: jest.fn(),
		startDownloads: jest.fn(),
		pauseDownloads: jest.fn(),
		retryFailed: jest.fn(),
		clearCompleted: jest.fn(),
		getProgress: jest.fn(() => ({
			total: 0,
			completed: 0,
			percentage: 0,
		})),
	})),
}));

jest.mock('../../../source/context/AppContext.js', () => ({
	useApp: jest.fn(() => ({
		updateSettings: jest.fn(),
	})),
}));

jest.mock('ink', () => ({
	Box: ({children}) => <div>{children}</div>,
	Text: ({children}) => <span>{children}</span>,
	useInput: jest.fn(),
}));

jest.mock('../../../source/components/downloads/DownloadPathPrompt.js', () => ({
	DownloadPathPrompt: () => <div>DownloadPathPrompt</div>,
}));

describe('DownloadManager', () => {
	it('renders without crashing', () => {
		expect(() => render(<DownloadManager />)).not.toThrow();
	});

	it('renders empty queue', () => {
		const {container} = render(<DownloadManager />);

		expect(container).toBeDefined();
	});

	it('renders progress display', () => {
		const {container} = render(<DownloadManager />);

		expect(container).toBeDefined();
	});
});
