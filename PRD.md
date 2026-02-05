# Product Requirements Document: ArxivLens Terminal Explorer

## Overview

A terminal-based application for exploring academic papers, authors, and collections from the ArxivLens API. Built with Node.js and the Ink library for a rich, interactive terminal user interface.

---

## Implementation Status

| Phase       | Status          | Description                                                                 |
| ----------- | --------------- | --------------------------------------------------------------------------- |
| **Phase 1** | ✅ **COMPLETE** | Core Paper Browsing - search, date browser, category browser, paper details |
| **Phase 2** | ✅ **COMPLETE** | Author Exploration - search, profiles, papers by author                     |
| **Phase 3** | ✅ **COMPLETE** | Key Findings & AI Summaries                                                 |
| **Phase 4** | ✅ **COMPLETE** | Configuration & Polish                                                      |

### What's Implemented

**Screens & Routes:**

- ✅ Main Menu with navigation to all Phase 1 features
- ✅ Paper Search with query, sort options, and priority checkboxes
- ✅ Paper List with pagination and keyboard navigation
- ✅ Paper Detail with abstract toggle, open arXiv/PDF, and [k] Key Findings
- ✅ Date Browser with presets (Today, Yesterday, Last Week) and custom date
- ✅ Category Browser with two-level hierarchy (groups → subcategories)
- ✅ Author Search, Author List, Author Profile (full navigation)
- ✅ Key Findings View with tabbed navigation and polling support
- ✅ Settings screen with full configuration options

**API Integrations:**

- ✅ `GET /papers` - Search with filters
- ✅ `GET /papers/by-date/{date}` - Date-based browsing
- ✅ `GET /papers/{identifier}` - Paper details
- ✅ `GET /arxiv/categories` - Category taxonomy
- ✅ `GET /authors` and `GET /authors/{genSlug}` - Author search and profiles
- ✅ `GET /papers/{paperId}/key-findings` - AI-generated key findings with polling

**Architecture:**

- ✅ Context-based state management (AppContext)
- ✅ Custom hooks for API calls (useApi, usePapers)
- ✅ Reusable components (Header, Footer, Spinner, ErrorMessage, Pagination)
- ✅ Utility functions for formatting
- ✅ Route-based navigation with history

---

## Technical Stack

**Runtime:** Node.js 18+
**TUI Framework:** Ink 4.x (React for CLI)
**HTTP Client:** Axios or native fetch
**State Management:** React hooks (useState, useReducer, useContext)
**Additional Libraries:**

- `ink-text-input` - Text input fields
- `ink-select-input` - Selection menus
- `ink-spinner` - Loading indicators
- `ink-box` - Layout boxes
- `ink-table` - Table rendering
- `open` - Open URLs in browser
- `conf` - Persistent configuration storage

---

## Phase 1: Core Paper Browsing ✅ COMPLETE

### Scope

Basic paper search, listing, and detail viewing.

### User Flows

**Flow 1.1: Search Papers**

```
App Launch → Main Menu → "Search Papers" → Enter Query → View Results List → Select Paper → View Paper Details
```

**Flow 1.2: Browse by Date**

```
App Launch → Main Menu → "Browse by Date" → Select/Enter Date → View Results List → Select Paper → View Paper Details
```

**Flow 1.3: Browse Categories**

```
App Launch → Main Menu → "Browse Categories" → Select Category Group → Select Subcategory → View Papers in Category
```

### Screens

#### Screen 1.1: Main Menu

```
┌─────────────────────────────────────────────┐
│  ArxivLens Explorer                         │
│  ═══════════════════                        │
│                                             │
│  > Search Papers                            │
│    Browse by Date                           │
│    Browse Categories                        │
│    Search Authors                           │
│    ─────────────────                        │
│    Settings                                 │
│    Exit                                     │
│                                             │
│  [↑/↓] Navigate  [Enter] Select  [q] Quit   │
└─────────────────────────────────────────────┘
```

#### Screen 1.2: Paper Search

```
┌─────────────────────────────────────────────┐
│  Search Papers                    [Esc] Back│
│  ═════════════                              │
│                                             │
│  Query: transformer attention mechanism_    │
│                                             │
│  Sort by: [Relevance ▼]                     │
│  Date from: [          ]  to: [          ]  │
│  Category: [All ▼]                          │
│                                             │
│  [ ] Prioritize recent                      │
│  [ ] Prioritize highly cited                │
│                                             │
│  [Enter] Search  [Tab] Next field           │
└─────────────────────────────────────────────┘
```

#### Screen 1.3: Paper List Results

```
┌─────────────────────────────────────────────────────────────┐
│  Search Results: "transformer attention"        [Esc] Back  │
│  Showing 1-10 of 1,547 results                 Page 1 of 155│
│  ═══════════════════════════════════════════════════════════│
│                                                             │
│  > Attention Is All You Need                                │
│    Vaswani et al. · 2017-06-12 · cs.CL · ⭐ 89,421 citations │
│    The dominant sequence transduction models are based...   │
│    ───────────────────────────────────────────────────────  │
│    BERT: Pre-training of Deep Bidirectional Transformers    │
│    Devlin et al. · 2018-10-11 · cs.CL · ⭐ 45,102 citations  │
│    We introduce a new language representation model...      │
│    ───────────────────────────────────────────────────────  │
│    An Image is Worth 16x16 Words: Transformers for...       │
│    Dosovitskiy et al. · 2020-10-22 · cs.CV · ⭐ 12,847       │
│    While the Transformer architecture has become...         │
│                                                             │
│  [↑/↓] Navigate  [Enter] View  [n/p] Next/Prev Page  [/] Filter │
└─────────────────────────────────────────────────────────────┘
```

#### Screen 1.4: Paper Detail View

```
┌─────────────────────────────────────────────────────────────┐
│  Paper Details                                  [Esc] Back  │
│  ═══════════════════════════════════════════════════════════│
│                                                             │
│  Attention Is All You Need                                  │
│  ─────────────────────────                                  │
│  Authors: A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit..│
│  Published: 2017-06-12  │  Updated: 2017-06-12              │
│  Categories: cs.CL, cs.LG                                   │
│  Citations: 89,421  │  arXiv: 1706.03762                    │
│                                                             │
│  Abstract:                                                  │
│  ─────────                                                  │
│  The dominant sequence transduction models are based on     │
│  complex recurrent or convolutional neural networks that    │
│  include an encoder and a decoder. The best performing      │
│  models also connect the encoder and decoder through an     │
│  attention mechanism. We propose a new simple network...    │
│  [more...]                                                  │
│                                                             │
│  Actions:                                                   │
│  [a] View Authors  [k] Key Findings  [s] Similar Papers     │
│  [o] Open arXiv    [p] Open PDF      [c] Copy Citation      │
└─────────────────────────────────────────────────────────────┘
```

#### Screen 1.5: Date Browser

```
┌─────────────────────────────────────────────┐
│  Browse by Date                   [Esc] Back│
│  ══════════════                             │
│                                             │
│  Enter date (YYYY-MM-DD): 2024-01-15_       │
│                                             │
│  Quick select:                              │
│  > Today                                    │
│    Yesterday                                │
│    Last week                                │
│    Custom date                              │
│                                             │
│  Source filter: [All ▼]                     │
│                                             │
└─────────────────────────────────────────────┘
```

#### Screen 1.6: Category Browser

```
┌─────────────────────────────────────────────┐
│  Browse Categories                [Esc] Back│
│  ═════════════════                          │
│                                             │
│  > Computer Science (cs)                    │
│    Mathematics (math)                       │
│    Physics (physics)                        │
│    Quantitative Biology (q-bio)             │
│    Quantitative Finance (q-fin)             │
│    Statistics (stat)                        │
│    Electrical Engineering (eess)            │
│    Economics (econ)                         │
│                                             │
│  [↑/↓] Navigate  [Enter] Expand  [→] Select │
└─────────────────────────────────────────────┘
```

### Code Implementation

#### Actual Project Structure (Phase 1 - Implemented)

```
arxivlenscli/
├── package.json
├── tsconfig.json
├── source/                       # Source directory (not src/)
│   ├── cli.tsx                   # Entry point with meow CLI parsing
│   ├── app.tsx                   # Main router component
│   ├── api/
│   │   ├── client.ts             # Axios API client setup
│   │   ├── papers.ts             # Papers API calls
│   │   └── types.ts              # TypeScript interfaces
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx        # Page title header
│   │   │   ├── Footer.tsx        # Keyboard hints footer
│   │   │   ├── Spinner.tsx       # Loading indicator
│   │   │   ├── ErrorMessage.tsx  # Error display
│   │   │   └── Pagination.tsx    # Page navigation
│   │   ├── menu/
│   │   │   └── MainMenu.tsx      # Main navigation menu
│   │   └── papers/
│   │       ├── PaperSearch.tsx   # Multi-field search form
│   │       ├── PaperList.tsx     # Paginated results list
│   │       ├── PaperListItem.tsx # Individual paper display
│   │       ├── PaperDetail.tsx   # Full paper details view
│   │       ├── DateBrowser.tsx   # Date selection with presets
│   │       └── CategoryBrowser.tsx # Two-level category hierarchy
│   ├── hooks/
│   │   ├── useApi.ts             # Generic API wrapper hook
│   │   ├── usePapers.ts          # Paper-specific hooks
│   │   └── useNavigation.ts      # Navigation state wrapper
│   ├── context/
│   │   └── AppContext.tsx        # Global state with navigation history
│   └── utils/
│       ├── formatting.ts         # Date, author, text formatting
│       └── constants.ts          # App constants, routes, menu items
└── dist/                         # Compiled output
```

> **Note:** The source directory is `source/` (not `src/`) and the entry point is `cli.tsx` (not `index.tsx`). Uses `meow` for CLI argument parsing.

#### Core Component Examples

**src/api/client.ts**

```typescript
import axios, {AxiosInstance} from 'axios';

const BASE_URL = 'https://arxivlens.com/api/v1';

export const createApiClient = (): AxiosInstance => {
	return axios.create({
		baseURL: BASE_URL,
		timeout: 30000,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export const apiClient = createApiClient();
```

**src/api/papers.ts**

```typescript
import {apiClient} from './client';
import {
	PaperSearchParams,
	PaperSearchResponse,
	PaperDetailsResponse,
	ArxivCategoriesResponse,
} from './types';

export const searchPapers = async (
	params: PaperSearchParams,
): Promise<PaperSearchResponse> => {
	const {data} = await apiClient.get('/papers', {params});
	return data;
};

export const getPapersByDate = async (
	date: string,
	source?: string,
	page = 1,
	pageSize = 50,
): Promise<PaperSearchResponse> => {
	const {data} = await apiClient.get(`/papers/by-date/${date}`, {
		params: {source, page, pageSize},
	});
	return data;
};

export const getPaperDetails = async (
	identifier: string,
): Promise<PaperDetailsResponse> => {
	const {data} = await apiClient.get(`/papers/${identifier}`);
	return data;
};

export const getArxivCategories =
	async (): Promise<ArxivCategoriesResponse> => {
		const {data} = await apiClient.get('/arxiv/categories');
		return data;
	};
```

**src/api/types.ts**

```typescript
export interface PaperSearchParams {
	query?: string;
	rankBy?:
		| 'relevance'
		| 'created'
		| 'oldest'
		| 'citations'
		| 'arxivId'
		| 'random'
		| 'tag';
	page?: number;
	pageSize?: number;
	dateFrom?: string;
	dateTo?: string;
	categories?: string;
	prioritizeRecent?: boolean;
	prioritizeCited?: boolean;
}

export interface AuthorInfo {
	name: string;
	genSlug: string;
}

export interface SimplifiedPaper {
	id: number;
	title: string;
	summary: string;
	twoLineSummary: string | null;
	categories: string;
	paperId: string;
	genSlug: string;
	journalRef: string | null;
	doi: string | null;
	arxivLink: string;
	pdfLink: string;
	published: string;
	updated: string | null;
	authors: AuthorInfo[];
	thumbnailUrl: string | null;
	source: string | null;
}

export interface PaperSearchResponse {
	papers: SimplifiedPaper[];
	totalCount: number;
	page: number;
	pageSize: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface PaperDetailsResponse {
	paper: SimplifiedPaper;
	similarPapers: SimplifiedPaper[];
}

export interface ArxivCategory {
	code: string;
	name: string;
}

export interface ArxivCategoriesResponse {
	categories: Record<string, ArxivCategory[]>;
}
```

**src/components/papers/PaperList.tsx**

```tsx
import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import {SimplifiedPaper} from '../../api/types';
import PaperListItem from './PaperListItem';
import Pagination from '../common/Pagination';

interface Props {
	papers: SimplifiedPaper[];
	totalCount: number;
	page: number;
	totalPages: number;
	onSelectPaper: (paper: SimplifiedPaper) => void;
	onPageChange: (page: number) => void;
	onBack: () => void;
	title: string;
}

const PaperList: React.FC<Props> = ({
	papers,
	totalCount,
	page,
	totalPages,
	onSelectPaper,
	onPageChange,
	onBack,
	title,
}) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	useInput((input, key) => {
		if (key.escape) {
			onBack();
			return;
		}

		if (key.upArrow) {
			setSelectedIndex(prev => Math.max(0, prev - 1));
		} else if (key.downArrow) {
			setSelectedIndex(prev => Math.min(papers.length - 1, prev + 1));
		} else if (key.return) {
			onSelectPaper(papers[selectedIndex]);
		} else if (input === 'n' && page < totalPages) {
			onPageChange(page + 1);
			setSelectedIndex(0);
		} else if (input === 'p' && page > 1) {
			onPageChange(page - 1);
			setSelectedIndex(0);
		}
	});

	return (
		<Box flexDirection="column" padding={1}>
			<Box justifyContent="space-between">
				<Text bold color="cyan">
					{title}
				</Text>
				<Text dimColor>[Esc] Back</Text>
			</Box>

			<Text dimColor>
				Showing {(page - 1) * 10 + 1}-{Math.min(page * 10, totalCount)} of{' '}
				{totalCount} results
			</Text>

			<Box flexDirection="column" marginTop={1}>
				{papers.map((paper, index) => (
					<PaperListItem
						key={paper.id}
						paper={paper}
						isSelected={index === selectedIndex}
					/>
				))}
			</Box>

			<Pagination currentPage={page} totalPages={totalPages} />

			<Box marginTop={1}>
				<Text dimColor>[↑/↓] Navigate [Enter] View [n/p] Next/Prev Page</Text>
			</Box>
		</Box>
	);
};

export default PaperList;
```

**src/components/papers/PaperListItem.tsx**

```tsx
import React from 'react';
import {Box, Text} from 'ink';
import {SimplifiedPaper} from '../../api/types';
import {truncateText, formatDate, formatAuthors} from '../../utils/formatting';

interface Props {
	paper: SimplifiedPaper;
	isSelected: boolean;
}

const PaperListItem: React.FC<Props> = ({paper, isSelected}) => {
	const authorStr = formatAuthors(paper.authors, 3);
	const summaryPreview = truncateText(
		paper.twoLineSummary || paper.summary,
		100,
	);

	return (
		<Box
			flexDirection="column"
			paddingY={1}
			borderStyle={isSelected ? 'single' : undefined}
			borderColor={isSelected ? 'cyan' : undefined}
		>
			<Box>
				<Text color={isSelected ? 'cyan' : 'white'}>
					{isSelected ? '> ' : '  '}
				</Text>
				<Text bold wrap="truncate-end">
					{paper.title}
				</Text>
			</Box>

			<Box marginLeft={2}>
				<Text dimColor>
					{authorStr} · {formatDate(paper.published)} ·{' '}
					{paper.categories.split(' ')[0]}
				</Text>
			</Box>

			<Box marginLeft={2}>
				<Text dimColor wrap="truncate-end">
					{summaryPreview}
				</Text>
			</Box>
		</Box>
	);
};

export default PaperListItem;
```

**src/components/papers/PaperDetail.tsx**

```tsx
import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import open from 'open';
import {SimplifiedPaper} from '../../api/types';
import {getPaperDetails} from '../../api/papers';
import {formatDate, formatAuthors, wrapText} from '../../utils/formatting';
import Spinner from '../common/Spinner';

interface Props {
	paper: SimplifiedPaper;
	onBack: () => void;
	onViewAuthor: (genSlug: string) => void;
	onViewKeyFindings: (genSlug: string) => void;
	onViewSimilar: (papers: SimplifiedPaper[]) => void;
}

const PaperDetail: React.FC<Props> = ({
	paper,
	onBack,
	onViewAuthor,
	onViewKeyFindings,
	onViewSimilar,
}) => {
	const [similarPapers, setSimilarPapers] = useState<SimplifiedPaper[]>([]);
	const [loading, setLoading] = useState(true);
	const [showFullAbstract, setShowFullAbstract] = useState(false);

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				const details = await getPaperDetails(paper.genSlug);
				setSimilarPapers(details.similarPapers || []);
			} catch (error) {
				// Silently fail for similar papers
			} finally {
				setLoading(false);
			}
		};
		fetchDetails();
	}, [paper.genSlug]);

	useInput((input, key) => {
		if (key.escape) {
			onBack();
		} else if (input === 'o') {
			open(paper.arxivLink);
		} else if (input === 'p') {
			open(paper.pdfLink);
		} else if (input === 'a' && paper.authors.length > 0) {
			onViewAuthor(paper.authors[0].genSlug);
		} else if (input === 'k') {
			onViewKeyFindings(paper.genSlug);
		} else if (input === 's' && similarPapers.length > 0) {
			onViewSimilar(similarPapers);
		} else if (input === 'm') {
			setShowFullAbstract(prev => !prev);
		}
	});

	const abstractText = showFullAbstract
		? paper.summary
		: paper.summary.slice(0, 500) + (paper.summary.length > 500 ? '...' : '');

	return (
		<Box flexDirection="column" padding={1}>
			<Box justifyContent="space-between">
				<Text bold color="cyan">
					Paper Details
				</Text>
				<Text dimColor>[Esc] Back</Text>
			</Box>

			<Box flexDirection="column" marginTop={1}>
				<Text bold>{paper.title}</Text>

				<Box marginTop={1}>
					<Text dimColor>Authors: </Text>
					<Text>{formatAuthors(paper.authors, 5)}</Text>
				</Box>

				<Box>
					<Text dimColor>Published: </Text>
					<Text>{formatDate(paper.published)}</Text>
					{paper.updated && (
						<>
							<Text dimColor> │ Updated: </Text>
							<Text>{formatDate(paper.updated)}</Text>
						</>
					)}
				</Box>

				<Box>
					<Text dimColor>Categories: </Text>
					<Text>{paper.categories}</Text>
				</Box>

				<Box>
					<Text dimColor>arXiv ID: </Text>
					<Text>{paper.paperId}</Text>
				</Box>

				<Box marginTop={1} flexDirection="column">
					<Text bold dimColor>
						Abstract:
					</Text>
					<Text>{abstractText}</Text>
					{paper.summary.length > 500 && (
						<Text color="cyan">
							[m] {showFullAbstract ? 'Show less' : 'Show more'}
						</Text>
					)}
				</Box>

				{paper.twoLineSummary && (
					<Box marginTop={1} flexDirection="column">
						<Text bold dimColor>
							Summary:
						</Text>
						<Text color="green">{paper.twoLineSummary}</Text>
					</Box>
				)}
			</Box>

			<Box marginTop={2} flexDirection="column">
				<Text bold dimColor>
					Actions:
				</Text>
				<Text>
					[a] View Authors [k] Key Findings
					{similarPapers.length > 0 ? '[s] Similar Papers  ' : ''}
				</Text>
				<Text>[o] Open arXiv [p] Open PDF</Text>
			</Box>

			{loading && <Spinner text="Loading similar papers..." />}
		</Box>
	);
};

export default PaperDetail;
```

**src/hooks/usePapers.ts**

```typescript
import {useState, useCallback} from 'react';
import {searchPapers, getPapersByDate} from '../api/papers';
import {
	PaperSearchParams,
	SimplifiedPaper,
	PaperSearchResponse,
} from '../api/types';

interface UsePapersState {
	papers: SimplifiedPaper[];
	loading: boolean;
	error: string | null;
	totalCount: number;
	page: number;
	totalPages: number;
}

export const usePapers = () => {
	const [state, setState] = useState<UsePapersState>({
		papers: [],
		loading: false,
		error: null,
		totalCount: 0,
		page: 1,
		totalPages: 0,
	});

	const search = useCallback(async (params: PaperSearchParams) => {
		setState(prev => ({...prev, loading: true, error: null}));

		try {
			const response = await searchPapers(params);
			setState({
				papers: response.papers,
				loading: false,
				error: null,
				totalCount: response.totalCount,
				page: response.page,
				totalPages: response.totalPages,
			});
		} catch (err) {
			setState(prev => ({
				...prev,
				loading: false,
				error: err instanceof Error ? err.message : 'Failed to search papers',
			}));
		}
	}, []);

	const fetchByDate = useCallback(
		async (date: string, source?: string, page = 1) => {
			setState(prev => ({...prev, loading: true, error: null}));

			try {
				const response = await getPapersByDate(date, source, page);
				setState({
					papers: response.papers,
					loading: false,
					error: null,
					totalCount: response.totalCount,
					page: response.page,
					totalPages: response.totalPages,
				});
			} catch (err) {
				setState(prev => ({
					...prev,
					loading: false,
					error: err instanceof Error ? err.message : 'Failed to fetch papers',
				}));
			}
		},
		[],
	);

	return {
		...state,
		search,
		fetchByDate,
	};
};
```

**src/utils/formatting.ts**

```typescript
import {AuthorInfo} from '../api/types';

export const truncateText = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength - 3) + '...';
};

export const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toISOString().split('T')[0];
};

export const formatAuthors = (
	authors: AuthorInfo[],
	maxAuthors: number,
): string => {
	if (authors.length === 0) return 'Unknown';

	const displayAuthors = authors.slice(0, maxAuthors).map(a => a.name);
	const suffix = authors.length > maxAuthors ? ' et al.' : '';

	return displayAuthors.join(', ') + suffix;
};

export const wrapText = (text: string, width: number): string[] => {
	const words = text.split(' ');
	const lines: string[] = [];
	let currentLine = '';

	for (const word of words) {
		if ((currentLine + ' ' + word).length > width) {
			lines.push(currentLine.trim());
			currentLine = word;
		} else {
			currentLine += ' ' + word;
		}
	}

	if (currentLine.trim()) {
		lines.push(currentLine.trim());
	}

	return lines;
};
```

---

## Phase 2: Author Exploration ✅ COMPLETE

### Scope

Author search, profile viewing, and paper browsing by author.

### User Flows

**Flow 2.1: Search Authors**

```
Main Menu → "Search Authors" → Enter Name → View Author List → Select Author → View Author Profile → Browse Author's Papers
```

**Flow 2.2: Navigate from Paper to Author**

```
Paper Detail → [a] View Authors → Select Author → View Author Profile
```

### Screens

#### Screen 2.1: Author Search

```
┌─────────────────────────────────────────────┐
│  Search Authors                   [Esc] Back│
│  ══════════════                             │
│                                             │
│  Author name: Yann LeCun_                   │
│                                             │
│  [Enter] Search                             │
└─────────────────────────────────────────────┘
```

#### Screen 2.2: Author List Results

```
┌─────────────────────────────────────────────────────────────┐
│  Search Results: "Yann LeCun"                   [Esc] Back  │
│  Showing 1-10 of 23 authors                                 │
│  ═══════════════════════════════════════════════════════════│
│                                                             │
│  > Yann LeCun                                               │
│    127 papers                                               │
│    Recent: "A Path Towards Autonomous Machine Intelligence" │
│    ───────────────────────────────────────────────────────  │
│    Yann A. LeCun                                            │
│    3 papers                                                 │
│    Recent: "Deep Learning for NLP"                          │
│                                                             │
│  [↑/↓] Navigate  [Enter] View Profile  [n/p] Page           │
└─────────────────────────────────────────────────────────────┘
```

#### Screen 2.3: Author Profile

```
┌─────────────────────────────────────────────────────────────┐
│  Author Profile                                 [Esc] Back  │
│  ═══════════════════════════════════════════════════════════│
│                                                             │
│  Yann LeCun                                                 │
│  ─────────────                                              │
│  Total Papers: 127                                          │
│                                                             │
│  Recent Papers:                                             │
│  ───────────────                                            │
│  > A Path Towards Autonomous Machine Intelligence           │
│    2022-06-27 · cs.AI, cs.LG                                │
│    ─────────────────────────────────────────────────────    │
│    Self-Supervised Learning: The Dark Matter of Intelligence│
│    2021-03-04 · cs.LG, cs.AI                                │
│    ─────────────────────────────────────────────────────    │
│    Energy-Based Models for Continual Learning               │
│    2020-11-15 · cs.LG                                       │
│                                                             │
│  [↑/↓] Navigate papers  [Enter] View paper  [a] All papers  │
└─────────────────────────────────────────────────────────────┘
```

### Code Implementation

#### Additional Files for Phase 2

**src/api/authors.ts**

```typescript
import {apiClient} from './client';
import {AuthorSearchResponse, AuthorProfileResponse} from './types';

export const searchAuthors = async (
	authorName: string,
	page = 1,
	pageSize = 10,
): Promise<AuthorSearchResponse> => {
	const {data} = await apiClient.get('/authors', {
		params: {authorName, page, pageSize},
	});
	return data;
};

export const getAuthorProfile = async (
	genSlug: string,
): Promise<AuthorProfileResponse> => {
	const {data} = await apiClient.get(`/authors/${genSlug}`);
	return data;
};
```

**src/api/types.ts (additions)**

```typescript
export interface SimplifiedPaperInfo {
	title: string;
	summary: string;
	twoLineSummary: string | null;
	categories: string;
	paperId: string;
	genSlug: string;
	published: string;
}

export interface AuthorProfile {
	name: string;
	genSlug: string;
	paperCount: number;
	paperTitles: string[];
	papers: SimplifiedPaperInfo[];
}

export interface AuthorSearchResponse {
	authors: AuthorProfile[];
	totalCount: number;
	page: number;
	pageSize: number;
}

export type AuthorProfileResponse = AuthorProfile;
```

**src/components/authors/AuthorSearch.tsx**

```tsx
import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import TextInput from 'ink-text-input';

interface Props {
	onSearch: (query: string) => void;
	onBack: () => void;
}

const AuthorSearch: React.FC<Props> = ({onSearch, onBack}) => {
	const [query, setQuery] = useState('');

	useInput((input, key) => {
		if (key.escape) {
			onBack();
		} else if (key.return && query.trim()) {
			onSearch(query.trim());
		}
	});

	return (
		<Box flexDirection="column" padding={1}>
			<Box justifyContent="space-between">
				<Text bold color="cyan">
					Search Authors
				</Text>
				<Text dimColor>[Esc] Back</Text>
			</Box>

			<Box marginTop={1}>
				<Text>Author name: </Text>
				<TextInput
					value={query}
					onChange={setQuery}
					placeholder="Enter author name..."
				/>
			</Box>

			<Box marginTop={1}>
				<Text dimColor>[Enter] Search</Text>
			</Box>
		</Box>
	);
};

export default AuthorSearch;
```

**src/components/authors/AuthorProfile.tsx**

```tsx
import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import {
	AuthorProfile as AuthorProfileType,
	SimplifiedPaperInfo,
} from '../../api/types';
import {formatDate} from '../../utils/formatting';

interface Props {
	author: AuthorProfileType;
	onBack: () => void;
	onSelectPaper: (genSlug: string) => void;
	onViewAllPapers: () => void;
}

const AuthorProfile: React.FC<Props> = ({
	author,
	onBack,
	onSelectPaper,
	onViewAllPapers,
}) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const papers = author.papers || [];
	const displayPapers = papers.slice(0, 10);

	useInput((input, key) => {
		if (key.escape) {
			onBack();
		} else if (key.upArrow) {
			setSelectedIndex(prev => Math.max(0, prev - 1));
		} else if (key.downArrow) {
			setSelectedIndex(prev => Math.min(displayPapers.length - 1, prev + 1));
		} else if (key.return && displayPapers.length > 0) {
			onSelectPaper(displayPapers[selectedIndex].genSlug);
		} else if (input === 'a') {
			onViewAllPapers();
		}
	});

	return (
		<Box flexDirection="column" padding={1}>
			<Box justifyContent="space-between">
				<Text bold color="cyan">
					Author Profile
				</Text>
				<Text dimColor>[Esc] Back</Text>
			</Box>

			<Box marginTop={1} flexDirection="column">
				<Text bold>{author.name}</Text>
				<Text dimColor>Total Papers: {author.paperCount}</Text>
			</Box>

			<Box marginTop={1} flexDirection="column">
				<Text bold dimColor>
					Recent Papers:
				</Text>
				{displayPapers.map((paper, index) => (
					<Box key={paper.genSlug} flexDirection="column" marginTop={1}>
						<Text color={index === selectedIndex ? 'cyan' : 'white'}>
							{index === selectedIndex ? '> ' : '  '}
							{paper.title}
						</Text>
						<Text dimColor>
							{' '}
							{formatDate(paper.published)} · {paper.categories}
						</Text>
					</Box>
				))}
			</Box>

			<Box marginTop={2}>
				<Text dimColor>[↑/↓] Navigate [Enter] View paper [a] All papers</Text>
			</Box>
		</Box>
	);
};

export default AuthorProfile;
```

---

## Phase 3: Key Findings & Enhanced Paper Details ✅ COMPLETE

### Scope

Display AI-generated key findings, methodology, limitations, and future work suggestions.

### User Flows

**Flow 3.1: View Key Findings**

```
Paper Detail → [k] Key Findings → View Key Findings (loading if generating) → Navigate sections
```

### Screens

#### Screen 3.1: Key Findings View

```
┌─────────────────────────────────────────────────────────────┐
│  Key Findings                                   [Esc] Back  │
│  "Attention Is All You Need"                                │
│  ═══════════════════════════════════════════════════════════│
│                                                             │
│  [Methodology] [Results] [Significance] [Limitations] [Future]
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Methodology:                                               │
│  ─────────────                                              │
│  The authors propose the Transformer, a model architecture  │
│  eschewing recurrence and instead relying entirely on an    │
│  attention mechanism to draw global dependencies between    │
│  input and output. The model uses stacked self-attention    │
│  and point-wise, fully connected layers for both encoder    │
│  and decoder.                                               │
│                                                             │
│  Technical Contribution:                                    │
│  ───────────────────────                                    │
│  Multi-head attention mechanism allowing the model to       │
│  jointly attend to information from different representation│
│  subspaces at different positions.                          │
│                                                             │
│  [←/→] Switch tabs  [↑/↓] Scroll                            │
└─────────────────────────────────────────────────────────────┘
```

#### Screen 3.2: Key Findings Loading

```
┌─────────────────────────────────────────────────────────────┐
│  Key Findings                                   [Esc] Back  │
│  "Attention Is All You Need"                                │
│  ═══════════════════════════════════════════════════════════│
│                                                             │
│                                                             │
│                    ◐ Generating key findings...             │
│                                                             │
│                    This may take a few moments.             │
│                    Status: Processing paper content         │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Code Implementation

**src/api/keyFindings.ts**

```typescript
import {apiClient} from './client';
import {KeyFindingsResponse, KeyFindingsStatusResponse} from './types';

export const getKeyFindings = async (
	genSlug: string,
): Promise<KeyFindingsResponse | KeyFindingsStatusResponse> => {
	const {data, status} = await apiClient.get(`/papers/${genSlug}/key-findings`);
	return {...data, httpStatus: status};
};
```

**src/api/types.ts (additions)**

```typescript
export interface KeyFindings {
	methodology: string | null;
	keyResults: string[];
	significance: string | null;
	limitations: string[];
	futureWork: string[];
	technicalContribution: string | null;
	novelty: string | null;
}

export interface KeyFindingsResponse {
	status: string;
	generatedAt: string;
	llmModelVersion: string;
	findings: KeyFindings;
	httpStatus: number;
}

export interface KeyFindingsStatusResponse {
	status: string;
	message: string;
	retryCount: number;
	updatedAt: string;
	httpStatus: number;
}
```

**src/components/papers/KeyFindingsView.tsx**

```tsx
import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import {getKeyFindings} from '../../api/keyFindings';
import {
	KeyFindings,
	KeyFindingsResponse,
	KeyFindingsStatusResponse,
} from '../../api/types';
import Spinner from '../common/Spinner';

type Tab =
	| 'methodology'
	| 'results'
	| 'significance'
	| 'limitations'
	| 'future';

interface Props {
	paperTitle: string;
	genSlug: string;
	onBack: () => void;
}

const TABS: {key: Tab; label: string}[] = [
	{key: 'methodology', label: 'Methodology'},
	{key: 'results', label: 'Results'},
	{key: 'significance', label: 'Significance'},
	{key: 'limitations', label: 'Limitations'},
	{key: 'future', label: 'Future'},
];

const KeyFindingsView: React.FC<Props> = ({paperTitle, genSlug, onBack}) => {
	const [findings, setFindings] = useState<KeyFindings | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [status, setStatus] = useState<string>('Loading...');
	const [activeTab, setActiveTab] = useState<Tab>('methodology');

	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		const fetchFindings = async () => {
			try {
				const response = await getKeyFindings(genSlug);

				if (response.httpStatus === 200) {
					const data = response as KeyFindingsResponse;
					setFindings(data.findings);
					setLoading(false);
				} else if (response.httpStatus === 202) {
					const data = response as KeyFindingsStatusResponse;
					setStatus(data.message || 'Generating...');
					// Poll every 3 seconds
					intervalId = setTimeout(fetchFindings, 3000);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'Failed to load key findings',
				);
				setLoading(false);
			}
		};

		fetchFindings();

		return () => {
			if (intervalId) clearTimeout(intervalId);
		};
	}, [genSlug]);

	useInput((input, key) => {
		if (key.escape) {
			onBack();
		} else if (key.leftArrow) {
			const currentIndex = TABS.findIndex(t => t.key === activeTab);
			const newIndex = currentIndex > 0 ? currentIndex - 1 : TABS.length - 1;
			setActiveTab(TABS[newIndex].key);
		} else if (key.rightArrow) {
			const currentIndex = TABS.findIndex(t => t.key === activeTab);
			const newIndex = currentIndex < TABS.length - 1 ? currentIndex + 1 : 0;
			setActiveTab(TABS[newIndex].key);
		}
	});

	const renderTabContent = () => {
		if (!findings) return null;

		switch (activeTab) {
			case 'methodology':
				return (
					<Box flexDirection="column">
						<Text bold>Methodology:</Text>
						<Text>{findings.methodology || 'Not available'}</Text>
						{findings.technicalContribution && (
							<>
								<Text bold marginTop={1}>
									Technical Contribution:
								</Text>
								<Text>{findings.technicalContribution}</Text>
							</>
						)}
						{findings.novelty && (
							<>
								<Text bold marginTop={1}>
									Novelty:
								</Text>
								<Text>{findings.novelty}</Text>
							</>
						)}
					</Box>
				);
			case 'results':
				return (
					<Box flexDirection="column">
						<Text bold>Key Results:</Text>
						{findings.keyResults?.length ? (
							findings.keyResults.map((result, i) => (
								<Text key={i}>• {result}</Text>
							))
						) : (
							<Text dimColor>No key results available</Text>
						)}
					</Box>
				);
			case 'significance':
				return (
					<Box flexDirection="column">
						<Text bold>Significance:</Text>
						<Text>{findings.significance || 'Not available'}</Text>
					</Box>
				);
			case 'limitations':
				return (
					<Box flexDirection="column">
						<Text bold>Limitations:</Text>
						{findings.limitations?.length ? (
							findings.limitations.map((limitation, i) => (
								<Text key={i}>• {limitation}</Text>
							))
						) : (
							<Text dimColor>No limitations listed</Text>
						)}
					</Box>
				);
			case 'future':
				return (
					<Box flexDirection="column">
						<Text bold>Future Work:</Text>
						{findings.futureWork?.length ? (
							findings.futureWork.map((work, i) => (
								<Text key={i}>• {work}</Text>
							))
						) : (
							<Text dimColor>No future work suggestions</Text>
						)}
					</Box>
				);
		}
	};

	if (loading) {
		return (
			<Box flexDirection="column" padding={1}>
				<Box justifyContent="space-between">
					<Text bold color="cyan">
						Key Findings
					</Text>
					<Text dimColor>[Esc] Back</Text>
				</Box>
				<Text dimColor>"{paperTitle}"</Text>

				<Box marginTop={2} flexDirection="column" alignItems="center">
					<Spinner text="Generating key findings..." />
					<Text dimColor marginTop={1}>
						Status: {status}
					</Text>
				</Box>
			</Box>
		);
	}

	if (error) {
		return (
			<Box flexDirection="column" padding={1}>
				<Box justifyContent="space-between">
					<Text bold color="cyan">
						Key Findings
					</Text>
					<Text dimColor>[Esc] Back</Text>
				</Box>
				<Text color="red">Error: {error}</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" padding={1}>
			<Box justifyContent="space-between">
				<Text bold color="cyan">
					Key Findings
				</Text>
				<Text dimColor>[Esc] Back</Text>
			</Box>
			<Text dimColor>"{paperTitle}"</Text>

			<Box marginTop={1}>
				{TABS.map((tab, index) => (
					<React.Fragment key={tab.key}>
						<Text
							color={activeTab === tab.key ? 'cyan' : undefined}
							bold={activeTab === tab.key}
						>
							[{tab.label}]
						</Text>
						{index < TABS.length - 1 && <Text> </Text>}
					</React.Fragment>
				))}
			</Box>

			<Box marginTop={1} flexDirection="column">
				{renderTabContent()}
			</Box>

			<Box marginTop={2}>
				<Text dimColor>[←/→] Switch tabs [Esc] Back</Text>
			</Box>
		</Box>
	);
};

export default KeyFindingsView;
```

---

## Phase 4: Configuration & Polish ❌ NOT STARTED

### Scope

Settings management, keyboard shortcut help, themes, and UX improvements.

### User Flows

**Flow 5.1: Configure Settings**

```
Main Menu → Settings → Modify Settings → Save
```

**Flow 5.2: View Help**

```
Any Screen → [?] → View Keyboard Shortcuts Help → [Esc] Return
```

### Screens

#### Screen 5.1: Settings

```
┌─────────────────────────────────────────────┐
│  Settings                         [Esc] Back│
│  ════════                                   │
│                                             │
│  Display                                    │
│  ───────                                    │
│  > Results per page:    [10 ▼]              │
│    Default sort:        [Relevance ▼]       │
│    Show two-line summaries: [✓]             │
│    Compact mode:        [ ]                 │
│                                             │
│  Behavior                                   │
│  ────────                                   │
│    Open links in:       [Default browser ▼] │
│    Auto-refresh key findings: [✓]           │
│                                             │
│  Theme                                      │
│  ─────                                      │
│    Color scheme:        [Default ▼]         │
│                                             │
│  [↑/↓] Navigate  [Enter] Toggle  [r] Reset  │
└─────────────────────────────────────────────┘
```

#### Screen 5.2: Help Overlay

```
┌─────────────────────────────────────────────────────────────┐
│  Keyboard Shortcuts                             [Esc] Close │
│  ═══════════════════════════════════════════════════════════│
│                                                             │
│  Global                    Navigation                       │
│  ──────                    ──────────                       │
│  Esc    Go back            ↑/↓    Move selection            │
│  q      Quit app           Enter  Select/Confirm            │
│  ?      Show this help     n/p    Next/Previous page        │
│                            /      Quick search              │
│  Paper View                                                 │
│  ──────────                Collection View                  │
│  o      Open arXiv         ────────────────                 │
│  p      Open PDF           s      Search collections        │
│  a      View authors       o      Sort options              │
│  k      Key findings                                        │
│  s      Similar papers     Search View                      │
│  c      Copy citation      ───────────                      │
│  m      Toggle abstract    Tab    Next field                │
│                            Enter  Execute search            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Code Implementation

**src/config/settings.ts**

```typescript
import Conf from 'conf';

interface Settings {
	resultsPerPage: number;
	defaultSort: 'relevance' | 'created' | 'oldest' | 'citations';
	showTwoLineSummaries: boolean;
	compactMode: boolean;
	autoRefreshKeyFindings: boolean;
	colorScheme: 'default' | 'dark' | 'light' | 'high-contrast';
}

const defaults: Settings = {
	resultsPerPage: 10,
	defaultSort: 'relevance',
	showTwoLineSummaries: true,
	compactMode: false,
	autoRefreshKeyFindings: true,
	colorScheme: 'default',
};

const config = new Conf<Settings>({
	projectName: 'arxivlens-cli',
	defaults,
});

export const getSettings = (): Settings => {
	return {
		resultsPerPage: config.get('resultsPerPage'),
		defaultSort: config.get('defaultSort'),
		showTwoLineSummaries: config.get('showTwoLineSummaries'),
		compactMode: config.get('compactMode'),
		autoRefreshKeyFindings: config.get('autoRefreshKeyFindings'),
		colorScheme: config.get('colorScheme'),
	};
};

export const updateSetting = <K extends keyof Settings>(
	key: K,
	value: Settings[K],
): void => {
	config.set(key, value);
};

export const resetSettings = (): void => {
	config.clear();
};

export type {Settings};
```

**src/components/common/HelpOverlay.tsx**

```tsx
import React from 'react';
import {Box, Text, useInput} from 'ink';

interface Props {
	onClose: () => void;
}

const HelpOverlay: React.FC<Props> = ({onClose}) => {
	useInput((input, key) => {
		if (key.escape || input === '?') {
			onClose();
		}
	});

	return (
		<Box
			flexDirection="column"
			padding={1}
			borderStyle="double"
			borderColor="cyan"
		>
			<Box justifyContent="space-between">
				<Text bold color="cyan">
					Keyboard Shortcuts
				</Text>
				<Text dimColor>[Esc] Close</Text>
			</Box>

			<Box marginTop={1}>
				<Box flexDirection="column" width="50%">
					<Text bold>Global</Text>
					<Text>
						<Text color="yellow">Esc</Text> Go back
					</Text>
					<Text>
						<Text color="yellow">q</Text> Quit app
					</Text>
					<Text>
						<Text color="yellow">?</Text> Show help
					</Text>

					<Text bold marginTop={1}>
						Paper View
					</Text>
					<Text>
						<Text color="yellow">o</Text> Open arXiv
					</Text>
					<Text>
						<Text color="yellow">p</Text> Open PDF
					</Text>
					<Text>
						<Text color="yellow">a</Text> View authors
					</Text>
					<Text>
						<Text color="yellow">k</Text> Key findings
					</Text>
					<Text>
						<Text color="yellow">s</Text> Similar papers
					</Text>
					<Text>
						<Text color="yellow">m</Text> Toggle abstract
					</Text>
				</Box>

				<Box flexDirection="column" width="50%">
					<Text bold>Navigation</Text>
					<Text>
						<Text color="yellow">↑/↓</Text> Move selection
					</Text>
					<Text>
						<Text color="yellow">Enter</Text> Select/Confirm
					</Text>
					<Text>
						<Text color="yellow">n/p</Text> Next/Prev page
					</Text>
					<Text>
						<Text color="yellow">/</Text> Quick search
					</Text>

					<Text bold marginTop={1}>
						Collection View
					</Text>
					<Text>
						<Text color="yellow">s</Text> Search
					</Text>
					<Text>
						<Text color="yellow">o</Text> Sort options
					</Text>

					<Text bold marginTop={1}>
						Search View
					</Text>
					<Text>
						<Text color="yellow">Tab</Text> Next field
					</Text>
					<Text>
						<Text color="yellow">Enter</Text> Execute search
					</Text>
				</Box>
			</Box>
		</Box>
	);
};

export default HelpOverlay;
```

**src/context/AppContext.tsx**

```tsx
import React, {createContext, useContext, useReducer, ReactNode} from 'react';
import {SimplifiedPaper, AuthorProfile} from '../api/types';
import {Settings, getSettings} from '../config/settings';

type Screen =
	| {type: 'main-menu'}
	| {type: 'paper-search'}
	| {type: 'paper-list'; title: string}
	| {type: 'paper-detail'; paper: SimplifiedPaper}
	| {type: 'date-browser'}
	| {type: 'category-browser'}
	| {type: 'author-search'}
	| {type: 'author-list'; query: string}
	| {type: 'author-profile'; author: AuthorProfile}
	| {type: 'key-findings'; paper: SimplifiedPaper}
	| {type: 'settings'};

interface AppState {
	currentScreen: Screen;
	screenHistory: Screen[];
	settings: Settings;
	showHelp: boolean;
}

type Action =
	| {type: 'NAVIGATE'; screen: Screen}
	| {type: 'GO_BACK'}
	| {type: 'TOGGLE_HELP'}
	| {type: 'UPDATE_SETTINGS'; settings: Partial<Settings>};

const initialState: AppState = {
	currentScreen: {type: 'main-menu'},
	screenHistory: [],
	settings: getSettings(),
	showHelp: false,
};

function reducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		case 'NAVIGATE':
			return {
				...state,
				screenHistory: [...state.screenHistory, state.currentScreen],
				currentScreen: action.screen,
			};
		case 'GO_BACK':
			if (state.screenHistory.length === 0) return state;
			const newHistory = [...state.screenHistory];
			const previousScreen = newHistory.pop()!;
			return {
				...state,
				screenHistory: newHistory,
				currentScreen: previousScreen,
			};
		case 'TOGGLE_HELP':
			return {
				...state,
				showHelp: !state.showHelp,
			};
		case 'UPDATE_SETTINGS':
			return {
				...state,
				settings: {...state.settings, ...action.settings},
			};
		default:
			return state;
	}
}

const AppContext = createContext<{
	state: AppState;
	dispatch: React.Dispatch<Action>;
} | null>(null);

export const AppProvider: React.FC<{children: ReactNode}> = ({children}) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<AppContext.Provider value={{state, dispatch}}>
			{children}
		</AppContext.Provider>
	);
};

export const useApp = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useApp must be used within AppProvider');
	}
	return context;
};
```

**src/app.tsx**

```tsx
import React from 'react';
import {Box, useInput, useApp as useInkApp} from 'ink';
import {useApp, AppProvider} from './context/AppContext';
import MainMenu from './components/menu/MainMenu';
import PaperSearch from './components/papers/PaperSearch';
import PaperList from './components/papers/PaperList';
import PaperDetail from './components/papers/PaperDetail';
import DateBrowser from './components/papers/DateBrowser';
import CategoryBrowser from './components/papers/CategoryBrowser';
import AuthorSearch from './components/authors/AuthorSearch';
import AuthorList from './components/authors/AuthorList';
import AuthorProfile from './components/authors/AuthorProfile';
import KeyFindingsView from './components/papers/KeyFindingsView';
import SettingsScreen from './components/settings/SettingsScreen';
import HelpOverlay from './components/common/HelpOverlay';

const AppContent: React.FC = () => {
	const {state, dispatch} = useApp();
	const {exit} = useInkApp();

	useInput((input, key) => {
		if (input === 'q' && state.currentScreen.type === 'main-menu') {
			exit();
		} else if (input === '?') {
			dispatch({type: 'TOGGLE_HELP'});
		}
	});

	const navigate = (screen: Parameters<typeof dispatch>[0]['screen']) => {
		dispatch({type: 'NAVIGATE', screen});
	};

	const goBack = () => {
		dispatch({type: 'GO_BACK'});
	};

	const renderScreen = () => {
		const {currentScreen} = state;

		switch (currentScreen.type) {
			case 'main-menu':
				return <MainMenu onNavigate={navigate} />;
			case 'paper-search':
				return (
					<PaperSearch
						onBack={goBack}
						onResults={papers => {
							/* ... */
						}}
					/>
				);
			case 'paper-list':
				return <PaperList /* ... */ />;
			case 'paper-detail':
				return (
					<PaperDetail paper={currentScreen.paper} onBack={goBack} /* ... */ />
				);
			case 'date-browser':
				return <DateBrowser onBack={goBack} /* ... */ />;
			case 'category-browser':
				return <CategoryBrowser onBack={goBack} /* ... */ />;
			case 'author-search':
				return <AuthorSearch onBack={goBack} /* ... */ />;
			case 'author-profile':
				return (
					<AuthorProfile
						author={currentScreen.author}
						onBack={goBack} /* ... */
					/>
				);
			case 'key-findings':
				return (
					<KeyFindingsView
						paperTitle={currentScreen.paper.title}
						genSlug={currentScreen.paper.genSlug}
						onBack={goBack}
					/>
				);
			case 'settings':
				return <SettingsScreen onBack={goBack} />;
			default:
				return <MainMenu onNavigate={navigate} />;
		}
	};

	return (
		<Box flexDirection="column">
			{state.showHelp && (
				<HelpOverlay onClose={() => dispatch({type: 'TOGGLE_HELP'})} />
			)}
			{renderScreen()}
		</Box>
	);
};

const App: React.FC = () => (
	<AppProvider>
		<AppContent />
	</AppProvider>
);

export default App;
```

---

## Bug Fixes & Improvements

### Critical Issues Fixed

1. **Type Safety Issues**

   - Fixed type mismatch in Settings interface (added 'mr-robot' to colorScheme)
   - Fixed template literal type issues in Header component
   - Fixed array type declarations in useAnimations (changed to Array<T>)

2. **Navigation & State Management**

   - Fixed navigation edge case in app.tsx (added canGoBack check before calling goBack())
   - Fixed stale closure in AppContext updateSettings (now uses functional state updates)
   - Added settings to AppContext for global state management

3. **Error Handling Improvements**

   - Added comprehensive error handling for config operations (getSettings, updateSetting, updateSettings, resetSettings)
   - Added proper error handling in keyFindings API (throws descriptive errors for non-200/202 status codes)
   - Added error handling for open() calls in PaperDetail (arXiv/PDF links)
   - Wrapped pdfDocRef.current?.destroy() in usePdf try-catch

4. **Memory Leak Fixes**

   - Fixed potential memory leak in PdfViewer by adding cancellation token
   - Added cancelled flag to prevent state updates after cleanup
   - Fixed early return in useEffect to ensure proper cleanup execution

5. **Component Safety**

   - Fixed empty array index issue in PaperList (early return when papersList.length === 0)
   - Added null/undefined checks in various components
   - Fixed React hooks dependencies (changed from [api.execute] to [api])

6. **Code Quality**
   - Fixed import ordering in theme/index.ts (moved all imports to top)
   - Capitalized comments to follow code style guidelines
   - Fixed JSX comment placement in Header component
   - Changed Array.forEach to for...of loop in useAnimations

### Test Status

All tests passing:

- ✅ formatDate formats ISO date correctly
- ✅ truncate shortens long text
- ✅ truncate returns short text unchanged
- ✅ formatAuthors handles empty array
- ✅ formatAuthors handles single author
- ✅ formatAuthors handles multiple authors with limit
- ✅ getApiDateString returns correct format

Build status:

- ✅ TypeScript compilation successful
- ✅ Prettier formatting check passed
- ✅ XO linter passed (except non-blocking deprecation warnings)

---

## Summary: Phase Deliverables

| Phase | Status  | Features                                                              | Key Screens                                                                       |
| ----- | ------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **1** | ✅ Done | Paper search, browse by date, category browser, paper details         | Main Menu, Paper Search, Paper List, Paper Detail, Date Browser, Category Browser |
| **2** | ✅ Done | Author search, author profiles, browse author papers                  | Author Search, Author List, Author Profile                                        |
| **3** | ✅ Done | Key findings display, polling for generation status                   | Key Findings View                                                                 |
| **4** | ✅ Done | Settings, help overlay, keyboard shortcuts, configuration persistence | Settings, Help Overlay                                                            |

---

## package.json

```json
{
	"name": "arxivlens-cli",
	"version": "1.0.0",
	"description": "Terminal explorer for ArxivLens academic papers",
	"type": "module",
	"bin": {
		"arxivlens": "./dist/index.js"
	},
	"scripts": {
		"build": "tsc",
		"start": "node dist/index.js",
		"dev": "tsx src/index.tsx",
		"lint": "eslint src/**/*.tsx"
	},
	"dependencies": {
		"axios": "^1.6.0",
		"conf": "^12.0.0",
		"ink": "^4.4.1",
		"ink-select-input": "^5.0.0",
		"ink-spinner": "^5.0.0",
		"ink-text-input": "^5.0.1",
		"open": "^10.0.0",
		"react": "^18.2.0"
	},
	"devDependencies": {
		"@types/node": "^20.10.0",
		"@types/react": "^18.2.0",
		"typescript": "^5.3.0",
		"tsx": "^4.6.0"
	}
}
```
