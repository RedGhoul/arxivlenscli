// Unicode box-drawing characters for Mr. Robot aesthetic
export const borders = {
	// Standard single-line box
	single: {
		topLeft: '\u250C', // ┌
		topRight: '\u2510', // ┐
		bottomLeft: '\u2514', // └
		bottomRight: '\u2518', // ┘
		horizontal: '\u2500', // ─
		vertical: '\u2502', // │
		teeLeft: '\u251C', // ├
		teeRight: '\u2524', // ┤
		teeTop: '\u252C', // ┬
		teeBottom: '\u2534', // ┴
		cross: '\u253C', // ┼
	},

	// Double-line box (for emphasis)
	double: {
		topLeft: '\u2554', // ╔
		topRight: '\u2557', // ╗
		bottomLeft: '\u255A', // ╚
		bottomRight: '\u255D', // ╝
		horizontal: '\u2550', // ═
		vertical: '\u2551', // ║
		teeLeft: '\u2560', // ╠
		teeRight: '\u2563', // ╣
		teeTop: '\u2566', // ╦
		teeBottom: '\u2569', // ╩
		cross: '\u256C', // ╬
	},

	// Heavy/bold box
	heavy: {
		topLeft: '\u250F', // ┏
		topRight: '\u2513', // ┓
		bottomLeft: '\u2517', // ┗
		bottomRight: '\u251B', // ┛
		horizontal: '\u2501', // ━
		vertical: '\u2503', // ┃
		teeLeft: '\u2523', // ┣
		teeRight: '\u252B', // ┫
		teeTop: '\u2533', // ┳
		teeBottom: '\u253B', // ┻
		cross: '\u254B', // ╋
	},

	// Rounded corners (modern look)
	rounded: {
		topLeft: '\u256D', // ╭
		topRight: '\u256E', // ╮
		bottomLeft: '\u2570', // ╰
		bottomRight: '\u256F', // ╯
		horizontal: '\u2500', // ─
		vertical: '\u2502', // │
		teeLeft: '\u251C', // ├
		teeRight: '\u2524', // ┤
		teeTop: '\u252C', // ┬
		teeBottom: '\u2534', // ┴
		cross: '\u253C', // ┼
	},
} as const;

// Decorative separators
export const separators = {
	single: (width: number) => '\u2500'.repeat(width),
	double: (width: number) => '\u2550'.repeat(width),
	heavy: (width: number) => '\u2501'.repeat(width),
	dots: (width: number) => '\u2504'.repeat(width),
	dashes: (width: number) => '\u2508'.repeat(width),
} as const;

// Special characters for UI elements
export const symbols = {
	arrow: '\u25B6', // ▶
	arrowRight: '\u25B8', // ▸
	arrowDown: '\u25BC', // ▼
	arrowUp: '\u25B2', // ▲
	bullet: '\u2022', // •
	diamond: '\u25C6', // ◆
	square: '\u25A0', // ■
	squareEmpty: '\u25A1', // □
	checkmark: '\u2713', // ✓
	cross: '\u2717', // ✗
	prompt: '\u276F', // ❯
	cursor: '\u2588', // █
	blockLight: '\u2591', // ░
	blockMedium: '\u2592', // ▒
	blockDark: '\u2593', // ▓
	blockFull: '\u2588', // █
} as const;

export type BorderStyle = keyof typeof borders;
