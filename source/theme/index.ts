export {colors, type ColorKey} from './colors.js';
export {borders, separators, symbols, type BorderStyle} from './borders.js';
export {
	fonts,
	decorators,
	ASCII_LOGO,
	ASCII_LOGO_COMPACT,
} from './typography.js';

import {colors} from './colors.js';
import {borders, separators, symbols} from './borders.js';
import {
	fonts,
	decorators,
	ASCII_LOGO,
	ASCII_LOGO_COMPACT,
} from './typography.js';

// Animation timing constants
export const timing = {
	typeSpeed: 30, // ms per character for typing effect
	blinkInterval: 500, // ms for blinking cursor
	pulseInterval: 1000, // ms for pulsing indicators
	bootDelay: 100, // ms delay between boot sequence lines
	spinnerSpeed: 80, // ms per spinner frame
} as const;

// Complete theme export
export const theme = {
	colors,
	borders,
	separators,
	symbols,
	fonts,
	decorators,
	timing,
	logo: ASCII_LOGO,
	logoCompact: ASCII_LOGO_COMPACT,
} as const;

export type Theme = typeof theme;
