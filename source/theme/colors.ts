export type ColorScheme =
	| 'default'
	| 'monochrome'
	| 'high-contrast'
	| 'mr-robot';

export interface ColorPalette {
	primary: string;
	secondary: string;
	tertiary: string;
	foreground: string;
	background: string;
	heading: string;
	border: string;
	borderHighlight: string;
	muted: string;
	caption: string;
	success: string;
	warning: string;
	error: string;
	info: string;
	highlight: string;
	scanline: string;
}

export const colorSchemes: Record<ColorScheme, ColorPalette> = {
	default: {
		primary: '#00bfff',
		secondary: '#0099cc',
		tertiary: '#0077b3',
		foreground: '#cccccc',
		background: '#0d1117',
		heading: '#ffffff',
		border: '#30363d',
		borderHighlight: '#00bfff',
		muted: '#8b949e',
		caption: '#8b949e',
		success: '#3fb950',
		warning: '#d29922',
		error: '#f85149',
		info: '#00bfff',
		highlight: '#161b22',
		scanline: '#00bfff20',
	},
	monochrome: {
		primary: '#ffffff',
		secondary: '#cccccc',
		tertiary: '#999999',
		foreground: '#cccccc',
		background: '#0d1117',
		heading: '#ffffff',
		border: '#30363d',
		borderHighlight: '#ffffff',
		muted: '#8b949e',
		caption: '#8b949e',
		success: '#e0e0e0',
		warning: '#c0c0c0',
		error: '#a0a0a0',
		info: '#d0d0d0',
		highlight: '#1c2128',
		scanline: '#ffffff10',
	},
	'high-contrast': {
		primary: '#ffff00',
		secondary: '#ffcc00',
		tertiary: '#ff9900',
		foreground: '#ffffff',
		background: '#000000',
		heading: '#ffffff',
		border: '#ffffff',
		borderHighlight: '#ffff00',
		muted: '#888888',
		caption: '#aaaaaa',
		success: '#00ff00',
		warning: '#ffff00',
		error: '#ff0000',
		info: '#00ffff',
		highlight: '#333333',
		scanline: '#ffff0030',
	},
	'mr-robot': {
		primary: '#00ff41',
		secondary: '#008f11',
		tertiary: '#00cc33',
		foreground: '#b4b4b4',
		background: '#0a0a0a',
		heading: '#ffffff',
		border: '#333333',
		borderHighlight: '#00ff41',
		muted: '#555555',
		caption: '#666666',
		success: '#00ff41',
		warning: '#ffcc00',
		error: '#ff0040',
		info: '#0080ff',
		highlight: '#1a1a1a',
		scanline: '#00ff4120',
	},
};

export const colors = colorSchemes.default;

export type ColorKey = keyof ColorPalette;
