# Comprehensive Test Plan - 90% User Flow Coverage

## Phase 1: Migrate to Jest & Setup Infrastructure

**Goal:** Replace AVA with Jest and establish testing foundation

### 1.1 Jest Migration ✅ COMPLETE

- Install Jest and dependencies: `jest`, `@types/jest`, `ts-jest` ✅
- Create `jest.config.cjs` with ES module support ✅
- Update `package.json` scripts: `test`, `test:watch`, `test:coverage` ✅
- Migrate existing `test.tsx` to Jest format ✅
- Remove AVA and `ava` config from `package.json` ✅

### 1.2 Test Infrastructure ✅ COMPLETE

- Install dependencies: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/react-hooks`, `msw` ✅
- Create directory structure: `test/unit/`, `test/integration/`, `test/fixtures/` ✅
- Set up MSW mock handlers for all API endpoints ✅
- Create test helpers: `test/helpers/mockApi.ts` ✅
- Create fixture data: papers, authors, key findings, categories ✅
- Set up test configuration with XO overrides for test files ✅

**Deliverable:** ✅ Working Jest test suite with MSW mocks and fixtures

- All 15 formatting utility tests passing ✅

---

## Phase 2: Utility & API Layer Tests

**Goal:** 100% coverage of foundational logic

### 2.1 Complete Utility Tests ✅ COMPLETE

- ✅ Add tests for: `getPresetDate()`, `parseCategories()` in `source/utils/formatting.ts`
- ✅ Add tests for download utilities: `sanitizeFileName()`, `generateFileName()` in `source/api/downloads.ts`
- ✅ Add tests for settings utilities in `source/config/settings.ts`

### 2.2 API Client Tests ✅ COMPLETE

- ✅ Test `api/client.ts` - axios config, interceptors, error handling
- ✅ Test `api/papers.ts` - all 4 endpoints with various parameters, pagination
- ✅ Test `api/authors.ts` - search and profile endpoints
- ✅ Test `api/keyFindings.ts` - success (200) and polling (202) responses
- ✅ Test all error scenarios (404, 500, network errors, timeouts)

**Deliverable:** 100% coverage of utilities and API client (30+ tests)

---

## Phase 3: Core Hooks Tests

**Goal:** Test all business logic hooks that drive user flows

### 3.1 Generic API Hook ✅ COMPLETE

- ✅ Test `useApi.ts` - loading/error states, execute callback, cleanup (12 tests passing)

### 3.2 Paper Hooks ✅ COMPLETE

- ✅ Test `usePapers.ts` - search, by-date, detail, categories with mocked API
- ✅ Test pagination state, empty results, error recovery

### 3.3 Author Hooks ✅ COMPLETE

- ✅ Test `useAuthors.ts` - search, profile fetching
- ✅ Test loading/error states and data caching

### 3.4 Key Findings Hook ✅ COMPLETE

- ✅ Test `useKeyFindings.ts` - polling logic (202 → 200 transitions), timeout, retries

### 3.5 Download Hook ✅ COMPLETE

- ✅ Test `useDownloads.ts` - queue management (234 lines), concurrent limits, progress updates
- ✅ Test download history persistence and error handling

### 3.6 PDF Hook (NOT STARTED)

- Test `usePdf.ts` - caching logic, page navigation, text/image modes

**Deliverable:** ✅ Full coverage of all core business logic hooks (12 API tests + 12 hooks tests = 24 tests passing)

---

## Phase 4: Critical User Flow Components

**Goal:** Test primary user interaction screens

### 4.1 Paper Search & Results Flow

- Test `PaperSearch.tsx` - form inputs, validation, search trigger, keyboard navigation
- Test `SearchResults.tsx` - rendering papers, pagination, keyboard shortcuts
- **Integration test:** MainMenu → PaperSearch → search → SearchResults → select paper

### 4.2 Paper Detail Flow

- Test `PaperDetail.tsx` - full metadata display, abstract toggle, keyboard shortcuts
- Test all actions: [o] open arXiv, [p] open PDF, [a] authors, [k] key findings, [v] view PDF
- **Integration test:** SearchResults → select → PaperDetail → navigate back

### 4.3 Download Manager Flow

- Test `DownloadManager.tsx` - queue display, progress bars, keyboard controls (pause/resume/cancel)
- **Integration test:** SearchResults → select papers → [d] DownloadManager → queue processing → completion

**Deliverable:** 80% coverage of primary user flows

---

## Phase 5: Secondary Feature Flows

**Goal:** Test supporting user flows

### 5.1 Navigation & Context

- Test `AppContext.tsx` - navigation state, route transitions, back/forward
- Test `useNavigation.ts` - navigation helper hook

### 5.2 Author Exploration Flow

- Test `AuthorSearch.tsx` - search input and results
- Test `AuthorList.tsx` - author selection
- Test `AuthorProfile.tsx` - author details and paper list
- **Integration test:** MainMenu → AuthorSearch → select author → AuthorProfile → view paper

### 5.3 Key Findings Flow

- Test `KeyFindingsView.tsx` - tabbed view, loading states, keyboard navigation
- **Integration test:** PaperDetail → [k] KeyFindingsView → poll complete → view tabs (methodology/results/significance/limitations/future)

### 5.4 Settings Flow

- Test `SettingsScreen.tsx` - configuration navigation, toggle/select settings
- Test settings persistence to config file

**Deliverable:** 85% coverage of secondary features

---

## Phase 6: PDF Viewer & Browsing Flows

**Goal:** Test PDF viewing and date/category browsing

### 6.1 PDF Viewer

- Test `PdfViewer.tsx` - text/image mode switching, page navigation (n/p), back navigation
- Mock terminal graphics detection (sixel/kitty support)

### 6.2 Date Browsing Flow

- Test `DateBrowser.tsx` - preset selection, custom date input
- Test `DatePapers.tsx` - paper list for date, pagination
- **Integration test:** MainMenu → DateBrowser → select date → DatePapers → view paper

### 6.3 Category Browsing Flow

- Test `CategoryBrowser.tsx` - group selection → subcategory selection
- **Integration test:** MainMenu → CategoryBrowser → select category → SearchResults → view paper

**Deliverable:** 90% coverage of remaining flows

---

## Phase 7: End-to-End Integration Tests

**Goal:** Test complete user journeys with MSW

### 7.1 Critical Flow E2E Tests

**Test 1: Search and Explore**

```
MainMenu → [s] PaperSearch → enter query → [Enter] →
SearchResults → navigate list → [Enter] →
PaperDetail → [m] toggle abstract → [k] key findings → [Esc] back → [Esc] back
```

**Test 2: Browse by Date**

```
MainMenu → [d] DateBrowser → select preset → [Enter] →
DatePapers → select paper → [Enter] →
PaperDetail → [v] view PDF → navigate pages → [Esc] → [Esc] → [Esc]
```

**Test 3: Author Exploration**

```
MainMenu → [a] AuthorSearch → enter name → [Enter] →
AuthorList → select author → [Enter] →
AuthorProfile → select paper → [Enter] →
PaperDetail → [o] open arXiv → [Esc] → [Esc] → [Esc]
```

**Test 4: Download Papers**

```
MainMenu → [s] PaperSearch → search →
SearchResults → [space] select 3 papers → [d] →
DownloadManager → watch progress → completion → [Esc]
```

**Test 5: Key Findings with Polling**

```
MainMenu → [s] PaperSearch → search →
SearchResults → select paper → [k] →
KeyFindingsView → poll API (202 → 200) → view all tabs → [Esc] → [Esc]
```

**Test 6: Category Browsing**

```
MainMenu → [c] CategoryBrowser → select group → select subcategory →
SearchResults → select paper → [Enter] →
PaperDetail → [p] open PDF → [Esc] → [Esc] → [Esc]
```

### 7.2 Error Flow E2E Tests

- Network error during search → error display → retry
- Timeout during key findings polling → error message → back
- Download failure → error in queue → retry/skip
- Invalid paper ID → 404 error → back navigation

**Deliverable:** All 6 primary flows tested end-to-end

---

## Phase 8: Common Components & Polish

**Goal:** Test remaining UI components

### 8.1 Common Components

- Test `MainMenu.tsx` - navigation options, keyboard shortcuts
- Test `Spinner.tsx` - various spinner styles
- Test `ErrorMessage.tsx` - error display with retry option
- Test `ConfirmDialog.tsx` - yes/no interactions
- Test `InfoBox.tsx` - informational display

### 8.2 Coverage & CI

- Add coverage threshold to Jest config: `collectCoverageFrom` with 80% threshold
- Set up coverage reporting in CI pipeline
- Generate coverage badge for README

**Deliverable:** 90%+ user flow coverage with CI enforcement

---

## Dependencies to Install

```bash
npm install --save-dev \
  jest \
  @types/jest \
  ts-jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/react-hooks \
  msw \
  @testing-library/user-event
```

```bash
npm uninstall ava ink-testing-library
```

---

## Files Requiring Tests (Summary)

| Category              | Files                                                   | Priority    |
| --------------------- | ------------------------------------------------------- | ----------- |
| **Utils**             | `utils/formatting.ts`, `config/settings.ts`             | 🔴 Critical |
| **API**               | `api/*.ts` (6 files)                                    | 🔴 Critical |
| **Hooks**             | `hooks/*.ts` (8 files)                                  | 🔴 Critical |
| **Core Components**   | `components/papers/*.tsx`, `components/downloads/*.tsx` | 🔴 Critical |
| **Context**           | `context/AppContext.tsx`                                | 🟡 High     |
| **Author Components** | `components/authors/*.tsx`                              | 🟡 High     |
| **Settings**          | `components/settings/*.tsx`                             | 🟡 High     |
| **Common**            | `components/common/*.tsx`                               | 🟢 Medium   |
| **PDF**               | `utils/pdfRenderer.ts`                                  | 🟢 Medium   |

**Total:** ~35 files requiring test coverage
