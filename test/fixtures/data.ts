import type {
	PaperListItem,
	PaperDetail,
	Author,
	AuthorProfile,
	KeyFindingsResponse,
	Category,
} from '../../source/api/types.js';

export const mockPaper: PaperListItem = {
	id: 1,
	title: 'Test Paper Title',
	twoLineSummary: 'Test summary line 1\nTest summary line 2',
	categories: 'cs.AI',
	paperId: '2301.00001',
	genSlug: 'test-paper-title',
	arxivLink: 'https://arxiv.org/abs/2301.00001',
	pdfLink: 'https://arxiv.org/pdf/2301.00001.pdf',
	published: '2024-01-15',
	authors: [
		{name: 'Alice Smith', genSlug: 'alice-smith'},
		{name: 'Bob Jones', genSlug: 'bob-jones'},
	],
	thumbnailUrl: null,
	source: 'arxiv',
};

export const mockPaper2: PaperListItem = {
	id: 2,
	title: 'Another Test Paper',
	twoLineSummary: 'Another summary',
	categories: 'cs.LG',
	paperId: '2301.00002',
	genSlug: 'another-test-paper',
	arxivLink: 'https://arxiv.org/abs/2301.00002',
	pdfLink: 'https://arxiv.org/pdf/2301.00002.pdf',
	published: '2024-01-10',
	authors: [{name: 'Charlie Brown', genSlug: 'charlie-brown'}],
	thumbnailUrl: null,
	source: 'arxiv',
};

export const mockPaperDetail: PaperDetail = {
	...mockPaper,
	summary:
		'This is a test abstract that describes the paper. It should be long enough to test truncation functionality.',
	journalRef: null,
	doi: null,
	updated: '2024-01-16',
};

export const mockAuthor: Author = {
	name: 'Alice Smith',
	genSlug: 'alice-smith',
};

export const mockAuthorProfile: AuthorProfile = {
	name: 'Alice Smith',
	genSlug: 'alice-smith',
	paperCount: 42,
	paperTitles: ['Test Paper Title', 'Another Test Paper'],
	papers: [
		{
			title: 'Test Paper Title',
			twoLineSummary: 'Test summary line 1\nTest summary line 2',
			categories: 'cs.AI',
			paperId: '2301.00001',
			genSlug: 'test-paper-title',
			published: '2024-01-15',
		},
	],
};

export const mockKeyFindings: KeyFindingsResponse = {
	status: 'completed',
	generatedAt: '2024-01-15T10:00:00Z',
	llmModelVersion: 'gpt-4',
	findings: {
		methodology: 'The methodology involved testing various approaches...',
		keyResults: ['Result 1', 'Result 2'],
		significance: 'This work is significant because it advances the field.',
		limitations: ['Limitation 1', 'Limitation 2'],
		futureWork: ['Future work 1', 'Future work 2'],
		technicalContribution: 'Technical contribution description.',
		novelty: 'Novelty description.',
	},
};

export const mockCategory: Category = {
	code: 'cs.AI',
	name: 'Artificial Intelligence',
};

export const mockCategory2: Category = {
	code: 'cs.LG',
	name: 'Machine Learning',
};
