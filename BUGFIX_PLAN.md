# Bug Fix Plan

Phased plan to address all bugs identified in the code review.

---

## Phase 1: Critical — Race Condition Fix

**Goal:** Eliminate the most impactful bug that causes user-visible misbehavior.

### 1.1 DownloadManager useEffect race condition

- **File:** `source/components/downloads/DownloadManager.tsx` (lines 25-31)
- **Problem:** `downloads` object in the useEffect dependency array gets a new reference every render, causing the effect to re-fire and add papers to the queue multiple times.
- **Fix:** Remove `downloads` from the dependency array. Extract `downloads.addToQueue` into a stable ref or use it directly without listing the parent object as a dependency.
- **Verify:** Trigger a multi-paper download and confirm papers are only queued once.

---

## Phase 2: API & Async — Prevent Redundant Calls and Unhandled Rejections

**Goal:** Stop wasted network requests and prevent unhandled promise crashes.

### 2.1 SearchResults redundant API calls

- **File:** `source/components/papers/SearchResults.tsx` (lines 38-53)
- **Problem:** `searchParams` is an object; a new reference with identical content triggers the useEffect and fires duplicate API calls.
- **Fix:** Memoize `searchParams` in the parent component (or serialize/compare primitive values in the dependency array).
- **Verify:** Navigate to search results repeatedly and confirm only one API call per unique query via console/network logging.

### 2.2 PaperList.handlePageChange unhandled rejection

- **File:** `source/components/papers/PaperList.tsx` (lines 43-65)
- **Problem:** `search()` is awaited without try-catch. If the API throws, the rejection is unhandled.
- **Fix:** Wrap the async body in try-catch. On error, either show an error state or silently handle (depending on whether `useApi` already surfaces errors).
- **Verify:** Simulate an API failure (e.g., disconnect network) during pagination and confirm no unhandled rejection crash.

---

## Phase 3: Settings Reliability — Validation and Error Feedback

**Goal:** Make settings updates robust and transparent to the user.

### 3.1 updateSettings silently swallows errors

- **File:** `source/config/settings.ts` (lines 154-163)
- **Problem:** The catch block discards all errors including validation failures. Users have no idea their settings weren't saved.
- **Fix:** Change `updateSettings` to return a `{ success: boolean; error?: string }` result. Update callers to handle the error case (e.g., show a flash message in the settings screen).
- **Verify:** Pass invalid settings and confirm the error is surfaced to the caller.

### 3.2 Download path not validated on settings update

- **File:** `source/context/AppContext.tsx` (lines 66-72)
- **Problem:** `downloadPath` is persisted without calling `validateDownloadPath()`, allowing dangerous or nonexistent paths.
- **Fix:** In the `updateSettings` callback, if `updates` contains `downloadPath`, call `validateDownloadPath()` before persisting. Reject invalid paths and notify the user.
- **Verify:** Attempt to set a download path to a nonexistent or restricted directory and confirm it is rejected with a message.

---

## Phase 4: UX & Resilience — Minor Polish

**Goal:** Improve edge-case behavior and surface failures that are currently hidden.

### 4.1 useCategoryCounts silent failures

- **File:** `source/hooks/useCategoryCounts.ts` (lines 56-103)
- **Problem:** `Promise.allSettled` silently drops rejected results. The UI shows no indication that some counts failed.
- **Fix:** Track failed category codes in a `failedCategories` set. Expose it from the hook so the UI can show a subtle indicator (e.g., "—" instead of a count) for categories whose count couldn't be loaded.
- **Verify:** Mock a failed API response for one category and confirm the UI shows a fallback indicator instead of nothing.

### 4.2 PaperSearch suggestion navigation UX

- **File:** `source/components/papers/PaperSearch.tsx` (lines 120-134)
- **Problem:** Pressing up arrow at suggestion index 0 dismisses the entire dropdown, which can be jarring.
- **Fix:** Change behavior so pressing up at index 0 keeps the dropdown open and stays at index 0 (no-op). Users can press Escape to dismiss instead.
- **Verify:** Open suggestions, navigate to the first item, press up, and confirm the dropdown stays open.

---

## Execution Notes

- **Testing:** After each phase, run `npm test` to ensure no regressions.
- **Commits:** One commit per phase to keep changes reviewable.
- **Priority:** Phases are ordered by impact. Phase 1 should be done first; Phase 4 can be deferred if needed.
