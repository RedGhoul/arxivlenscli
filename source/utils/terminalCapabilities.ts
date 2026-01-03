import process from 'node:process';

export type TerminalCapabilities = {
	supportsKittyGraphics: boolean;
	supportsITerm2: boolean;
	supportsWezTerm: boolean;
	supportsSixel: boolean;
	hasGraphicsSupport: boolean;
	terminalName: string;
};

export function detectTerminalCapabilities(): TerminalCapabilities {
	const termProgram = process.env['TERM_PROGRAM'] ?? '';
	const kittyWindowId = process.env['KITTY_WINDOW_ID'];
	const weztermPane = process.env['WEZTERM_PANE'];
	const term = process.env['TERM'] ?? '';

	const supportsKittyGraphics = Boolean(kittyWindowId);
	const supportsITerm2 = termProgram.toLowerCase().includes('iterm');
	const supportsWezTerm = Boolean(weztermPane);

	// Sixel support detection (known terminals)
	const sixelTerminals = ['foot', 'mlterm', 'xterm'];
	const supportsSixel = sixelTerminals.some(t =>
		term.toLowerCase().includes(t),
	);

	return {
		supportsKittyGraphics,
		supportsITerm2,
		supportsWezTerm,
		supportsSixel,
		hasGraphicsSupport:
			supportsKittyGraphics ||
			supportsITerm2 ||
			supportsWezTerm ||
			supportsSixel,
		terminalName: termProgram || term || 'unknown',
	};
}
