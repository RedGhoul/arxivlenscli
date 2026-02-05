# AGENTS.md

This file provides guidance for agentic coding agents working on the arxivlenscli repository.

## Build & Test Commands

```bash
npm run build     # Compile TypeScript to dist/
npm run dev       # Watch mode - recompiles on file changes
npm test          # Run prettier check, xo linting, and ava tests
node dist/cli.js  # Run the CLI after building
```

**Run a single test:**

```bash
npx ava test.tsx --match='test name pattern'
```

**Important:** Always run `npm test` before submitting changes.

## Code Style Guidelines

### Project Overview

Terminal-based ArxivLens API explorer built with Ink 4.x, meow, TypeScript ES modules, xo linter with xo-react preset.

### Import Rules

**Always use `.js` extensions** - TypeScript ES modules require explicit extensions:

```typescript
import React from 'react';
import {Box, Text} from 'ink';
import {formatDate} from '../utils/formatting.js';
import type {Paper} from '../api/types.js'; // Use 'type' keyword for type-only imports
```

**Order:** External libs → Internal modules → Types (with `import type`)

### Naming Conventions

- **Components:** PascalCase with named exports (e.g., `PaperListItem`)
- **Hooks:** `use` prefix, camelCase (e.g., `useApi`, `usePaperSearch`)
- **Functions:** camelCase (e.g., `formatDate`, `searchPapers`)
- **Types/Interfaces:** PascalCase (e.g., `SearchParams`, `PaperListItem`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `DEFAULT_PAGE_SIZE`)

### Formatting & Style

**Indentation:** Tabs, **Line endings:** LF, **Line length:** ~80 chars

**Components:** Functional components with hooks only (no class components)

```typescript
interface Props {
	paper: Paper;
	isSelected: boolean;
}
export function PaperListItem({paper, isSelected}: Props) {
	return <Box>...</Box>;
}
```

**No comments** - Code should be self-documenting

### TypeScript Best Practices

**Null/undefined handling:** Use explicit checks

```typescript
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return 'Unknown date';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-US', {...});
}
```

**Type-only imports:** Use `import type` for type-only imports

```typescript
import type {Paper, Author, SearchParams} from '../api/types.js';
```

### Error Handling

**API errors:** Handle via `useApi` hook or try-catch

```typescript
// Using useApi hook (preferred)
const {data, loading, error, execute} = useApi(searchPapers);
if (error) return <ErrorMessage message={error} />;

// Using try-catch
try {
	const data = await searchPapers(params);
} catch (err) {
	const message = err instanceof Error ? err.message : 'Unknown error';
	<ErrorMessage message={message} />;
}
```

### React Hooks

**Custom hooks:** Extract logic into hooks for reusability

```typescript
export function usePaperSearch() {
	const api = useApi(searchPapers);
	const search = useCallback(
		(params: SearchParams) => api.execute(params),
		[api],
	);
	return {...api, search};
}
```

### Component Patterns

**Conditional rendering:** Short-circuit or ternary

```typescript
{
	loading && <Spinner text="Loading..." />;
}
{
	showFullAbstract ? <Text>{fullText}</Text> : <Text>{truncated}</Text>;
}
```

**Lists:** Always include unique key prop

```typescript
{
	papers.map((paper, index) => (
		<PaperListItem
			key={paper.id}
			paper={paper}
			isSelected={index === selectedIndex}
		/>
	));
}
```

**Event handling:** Use `useInput` hook from Ink for keyboard events

```typescript
useInput((input, key) => {
	if (key.escape) onBack();
	if (key.upArrow) setSelectedIndex(prev => Math.max(0, prev - 1));
	if (input === 'n') onNextPage();
});
```

### API Integration

**API client:** Use the configured `apiClient` from `api/client.ts`

```typescript
import {apiClient} from './client.js';

export async function searchPapers(
	params: SearchParams,
): Promise<PaperSearchResponse> {
	const response = await apiClient.get<PaperSearchResponse>('/papers', {
		params,
	});
	return response.data;
}
```

### State Management

**Global state:** Use AppContext for navigation, selected paper, etc.

```typescript
const {navigation, navigate, goBack, selectedPaper, setSelectedPaper} =
	useApp();
```

**Component state:** Use useState for local component state

**Complex state:** Consider useReducer for complex state transitions

### Testing

- Use AVA test runner with `ink-testing-library`
- Use `render()` and `lastFrame()` to assert output
- Use `chalk` to match colored output

### Common Patterns

**Loading state:** `if (loading) return <Spinner text="Loading..." />;`

**Empty state:** `if (!loading && papers.length === 0) return <Text color="muted">No papers found</Text>;`

**Pagination:**

```typescript
const onPrevPage = page > 1 ? () => onPageChange(page - 1) : undefined;
const onNextPage = page < totalPages ? () => onPageChange(page + 1) : undefined;
```

**Keyboard shortcuts:** Esc (back), q/Q (quit), Enter (select), Arrow keys (navigate), n/p (pagination)

## Key Files to Reference

- `package.json` - All scripts, dependencies, and xo config
- `tsconfig.json` - TypeScript configuration
- `source/api/types.ts` - All API type definitions
- `source/api/client.ts` - Axios configuration and interceptors
- `source/hooks/useApi.ts` - Generic API hook pattern
- `source/context/AppContext.tsx` - Global state management

## Before Submitting

1. Run `npm test` to ensure prettier, xo, and tests pass
2. Build with `npm run build` to verify TypeScript compilation
3. Ensure all imports use `.js` extensions
4. Verify no comments in code (unless user explicitly requested)
