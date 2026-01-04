// Mr. Robot inspired color palette - darker, subdued with strategic green accents
export const colors = {
	// Primary colors - the signature matrix green
	primary: '#00ff41', // Matrix green - main accent, selected items, headers
	secondary: '#008f11', // Darker green - secondary elements, hover states
	tertiary: '#00cc33', // Mid green - active states

	// Base colors
	foreground: '#b4b4b4', // Muted gray - body text
	background: '#0a0a0a', // Near black - background
	heading: '#ffffff', // Pure white - headings, important text

	// UI elements
	border: '#333333', // Subtle gray - default borders
	borderHighlight: '#00ff41', // Green - focused/active borders
	muted: '#555555', // Dimmed text
	caption: '#666666', // Dark gray - captions, timestamps

	// Status colors
	success: '#00ff41', // Green
	warning: '#ffcc00', // Amber
	error: '#ff0040', // Red
	info: '#0080ff', // Blue (rare accent)

	// Special
	highlight: '#1a1a1a', // Selection background
	scanline: '#00ff4120', // Transparent green for effects
} as const;

export type ColorKey = keyof typeof colors;
