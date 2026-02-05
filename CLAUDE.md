# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

arxivlenscli is a terminal-based interactive explorer for browsing academic papers from the ArxivLens API. It uses React with Ink for rich terminal UI rendering.

## Commands

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

## Architecture

**Tech Stack:**

- **Ink 4.x** - React renderer for terminal output (use `<Text>`, `<Box>` components)
- **meow** - CLI argument parsing (defined in `cli.tsx`)
- **TypeScript** with ES modules (`"type": "module"`)

**Source Structure:**

- `source/cli.tsx` - Entry point, parses CLI flags, renders App
- `source/app.tsx` - Main App component
- `dist/` - Compiled output (do not edit)

**Testing:**

- AVA test runner with `ink-testing-library`
- Tests use `render()` from ink-testing-library and `lastFrame()` to assert output
- Use `chalk` to match colored output in test assertions

## Code Style

- **xo** linter with `xo-react` preset (Prettier integration enabled)
- `react/prop-types` rule is disabled - use TypeScript types instead
- Tabs for indentation, LF line endings

## PRD Reference

`PRD.md` contains detailed specifications for a 5-phase implementation plan including:

- Phase 1: Paper search, browse by date/category, paper details
- Phase 2: Author exploration
- Phase 3: Key findings & AI summaries
- Phase 4: Collections browsing
- Phase 5: Settings & configuration

The PRD includes API integration patterns, component structures, and screen mockups for each phase.
