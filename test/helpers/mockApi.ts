import {setupServer} from 'msw/lib/node/index.js';
import {http, HttpResponse} from 'msw';
import type {
	PaperListItem,
	PaperDetail,
	AuthorProfile,
	KeyFindingsResponse,
} from '../../source/api/types.js';

const mockPaper: PaperListItem = {
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

const mockPaper2: PaperListItem = {
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

const mockPaperDetail: PaperDetail = {
	...mockPaper,
	summary:
		'This is a test abstract that describes the paper. It should be long enough to test truncation functionality.',
	journalRef: null,
	doi: null,
	updated: '2024-01-16',
};

const mockAuthorProfile: AuthorProfile = {
	name: 'John Smith',
	genSlug: 'john-smith',
	paperCount: 10,
	paperTitles: ['Test Paper'],
	papers: [
		{
			title: 'Test Paper',
			twoLineSummary: 'Test summary',
			categories: 'cs.AI',
			paperId: '2301.00001',
			genSlug: 'test-paper',
			published: '2024-01-15',
		},
	],
};

const mockKeyFindings: KeyFindingsResponse = {
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

export const handlers = [
	http.get('https://arxivlens.com/api/v1/papers', ({request}) => {
		const url = new URL(request.url);
		const query = url.searchParams.get('query');

		if (query === 'invalid') {
			return HttpResponse.json({message: 'Invalid query'}, {status: 400});
		}

		return HttpResponse.json({
			papers: [mockPaper, mockPaper2],
			totalCount: 2,
			page: 1,
			pageSize: 10,
			totalPages: 1,
			hasNextPage: false,
			hasPreviousPage: false,
		});
	}),

	http.get('https://arxivlens.com/api/v1/papers/by-date/:date', () => {
		return HttpResponse.json({
			papers: [mockPaper],
			pagination: {
				total: 1,
				page: 1,
				limit: 15,
			},
		});
	}),

	http.get('https://arxivlens.com/api/v1/papers/:identifier', ({params}) => {
		const {identifier} = params;

		if (identifier === 'invalid') {
			return new HttpResponse(null, {status: 404});
		}

		return HttpResponse.json({
			paper: mockPaperDetail,
		});
	}),

	http.get(
		'https://arxivlens.com/api/v1/papers/:paperId/key-findings',
		({params}) => {
			const {paperId} = params;

			if (paperId === 'invalid') {
				return new HttpResponse(null, {status: 404});
			}

			if (paperId === 'pending') {
				return HttpResponse.json(
					{
						status: 'processing',
						message: 'Key findings are being generated',
						retryCount: 1,
						updatedAt: '2024-01-15T10:00:00Z',
					},
					{status: 202},
				);
			}

			return HttpResponse.json(mockKeyFindings);
		},
	),

	http.get('https://arxivlens.com/api/v1/arxiv/categories', () => {
		return HttpResponse.json({
			categories: {
				'Artificial Intelligence': [
					{code: 'cs.AI', name: 'Artificial Intelligence'},
					{code: 'cs.CL', name: 'Computation and Language'},
				],
				'Machine Learning': [
					{code: 'cs.LG', name: 'Machine Learning'},
					{code: 'cs.NE', name: 'Neural and Evolutionary Computing'},
				],
			},
		});
	}),

	http.get('https://arxivlens.com/api/v1/authors', ({request}) => {
		const url = new URL(request.url);
		const authorName = url.searchParams.get('authorName');

		return HttpResponse.json({
			authors: [
				{
					name: authorName || 'Test Author',
					genSlug: 'test-author',
				},
			],
			totalCount: 1,
			page: 1,
			pageSize: 10,
			totalPages: 1,
			hasNextPage: false,
			hasPreviousPage: false,
		});
	}),

	http.get('https://arxivlens.com/api/v1/authors/:genSlug', ({params}) => {
		const {genSlug} = params;

		if (genSlug === 'invalid') {
			return new HttpResponse(null, {status: 404});
		}

		return HttpResponse.json(mockAuthorProfile);
	}),

	http.get('https://arxivlens.com/api/v1/test', () => {
		return new HttpResponse(null, {status: 500});
	}),
];

export const server = setupServer(...handlers);
