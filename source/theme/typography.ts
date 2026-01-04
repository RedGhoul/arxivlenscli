// FIGlet font recommendations for Mr. Robot aesthetic
export const fonts = {
	logo: 'ANSI Shadow', // Main app logo
	title: 'Slant', // Screen titles
	subtitle: 'Small', // Subtitles
	minimal: 'Small Slant', // Compact headers
} as const;

// Text decorators for terminal aesthetic
export const decorators = {
	brackets: (text: string) => `[ ${text} ]`,
	angles: (text: string) => `< ${text} >`,
	slashes: (text: string) => `// ${text}`,
	comment: (text: string) => `/* ${text} */`,
	prompt: (text: string) => `> ${text}`,
	arrow: (text: string) => `>>> ${text}`,
	index: (n: number) => `[${String(n).padStart(2, '0')}]`,
} as const;

// Pre-generated ASCII art logo for performance (ANSI Shadow style)
export const ASCII_LOGO = `
    _    ____  __  _____ __     _     _____ _   _ ____
   / \\  |  _ \\ \\ \\/ /_ _|\\ \\   | |   | ____| \\ | / ___|
  / _ \\ | |_) | \\  / | |  \\ \\  | |   |  _| |  \\| \\___ \\
 / ___ \\|  _ <  /  \\ | |  / /  | |___| |___| |\\  |___) |
/_/   \\_\\_| \\_\\/_/\\_\\___|/_/   |_____|_____|_| \\_|____/
`.trimStart();

// Compact version for smaller screens
export const ASCII_LOGO_COMPACT = `
 ▄▀▄ █▀▄ ▀▄▀ █ █ █ █   █▀▀ █▄ █ ▄▀▀
 █▀█ █▀▄ █ █ █ ▀▄▀ █▄▄ ██▄ █ ▀█ ▄██
`.trimStart();
