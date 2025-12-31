export interface Author {
	name: string;
	genSlug: string;
}

export interface PaperListItem {
	id: number;
	title: string;
	twoLineSummary: string;
	categories: string;
	paperId: string;
	genSlug: string;
	arxivLink: string;
	pdfLink: string;
	published: string;
	authors: Author[];
	thumbnailUrl: string | null;
	source: string;
}

export interface PaperDetail extends PaperListItem {
	summary: string;
	journalRef: string | null;
	doi: string | null;
	updated: string;
}

export interface PaperSearchResponse {
	papers: PaperListItem[];
	totalCount: number;
	page: number;
	pageSize: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface DatePagination {
	total: number;
	page: number;
	limit: number;
}

export interface PapersByDateResponse {
	papers: PaperListItem[];
	pagination: DatePagination;
}

export interface PaperDetailResponse {
	paper: PaperDetail;
}

export interface Category {
	code: string;
	name: string;
}

export interface CategoryGroup {
	name: string;
	categories: Category[];
}

export type CategoriesResponse = CategoryGroup[];

export interface SearchParams {
	query?: string;
	rankBy?: 'relevance' | 'date' | 'citations';
	page?: number;
	pageSize?: number;
	dateFrom?: string;
	dateTo?: string;
	categories?: string[];
	prioritizeRecent?: boolean;
	prioritizeCited?: boolean;
}

// Phase 2: Author types

export interface SimplifiedPaperInfo {
	title: string;
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
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export type AuthorProfileResponse = AuthorProfile;
