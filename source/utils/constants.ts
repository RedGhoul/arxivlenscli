export const APP_NAME = 'ArxivLens CLI';
export const VERSION = '0.0.1';

export const DEFAULT_PAGE_SIZE = 20;

export const SORT_OPTIONS = [
	{label: 'Relevance', value: 'relevance'},
	{label: 'Date', value: 'date'},
	{label: 'Citations', value: 'citations'},
] as const;

export const DATE_PRESETS = [
	{label: 'Today', value: 'today'},
	{label: 'Yesterday', value: 'yesterday'},
	{label: 'Last Week', value: 'last-week'},
	{label: 'Custom Date', value: 'custom'},
] as const;

export type Route =
	| 'main-menu'
	| 'paper-search'
	| 'paper-list'
	| 'paper-detail'
	| 'key-findings'
	| 'date-browser'
	| 'category-browser'
	| 'author-search'
	| 'author-list'
	| 'author-profile'
	| 'settings';

export const MENU_ITEMS = [
	{label: 'Search Papers', value: 'paper-search' as Route},
	{label: 'Browse by Date', value: 'date-browser' as Route},
	{label: 'Browse Categories', value: 'category-browser' as Route},
	{label: 'Search Authors', value: 'author-search' as Route},
	{label: 'Settings', value: 'settings' as Route},
	{label: 'Exit', value: 'exit' as const},
] as const;
