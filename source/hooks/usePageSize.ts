import {useStdout} from 'ink';

const LINES_PER_ITEM = 4; // Title + authors/date + summary + margin
const HEADER_FOOTER_LINES = 6; // Header ~3 + footer ~2 + pagination ~1
const MIN_ITEMS = 3;
const DEFAULT_TERMINAL_HEIGHT = 24;

export function usePageSize(): number {
	const {stdout} = useStdout();
	const terminalHeight = stdout?.rows ?? DEFAULT_TERMINAL_HEIGHT;
	const availableLines = terminalHeight - HEADER_FOOTER_LINES;
	return Math.max(MIN_ITEMS, Math.floor(availableLines / LINES_PER_ITEM));
}
