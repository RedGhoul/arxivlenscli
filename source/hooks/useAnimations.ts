import {useState, useEffect} from 'react';
import {timing, symbols} from '../theme/index.js';

// Typing effect hook - reveals text character by character
export function useTypingEffect(text: string, enabled = true) {
	const [displayText, setDisplayText] = useState('');
	const [isComplete, setIsComplete] = useState(false);

	useEffect(() => {
		if (!enabled) {
			setDisplayText(text);
			setIsComplete(true);
			return;
		}

		setDisplayText('');
		setIsComplete(false);
		let index = 0;

		const interval = setInterval(() => {
			if (index < text.length) {
				setDisplayText(text.slice(0, index + 1));
				index++;
			} else {
				setIsComplete(true);
				clearInterval(interval);
			}
		}, timing.typeSpeed);

		return () => {
			clearInterval(interval);
		};
	}, [text, enabled]);

	return {displayText, isComplete};
}

// Blinking cursor hook
export function useBlinkingCursor(enabled = true) {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		if (!enabled) {
			setVisible(false);
			return;
		}

		const interval = setInterval(() => {
			setVisible(prev => !prev);
		}, timing.blinkInterval);

		return () => {
			clearInterval(interval);
		};
	}, [enabled]);

	return visible ? symbols.cursor : ' ';
}

// Pulsing block indicator hook
export function usePulsingIndicator(enabled = true) {
	const [intensity, setIntensity] = useState(0);
	const states = [
		symbols.blockLight,
		symbols.blockMedium,
		symbols.blockDark,
		symbols.blockFull,
		symbols.blockDark,
		symbols.blockMedium,
	];

	useEffect(() => {
		if (!enabled) return;

		const interval = setInterval(() => {
			setIntensity(prev => (prev + 1) % states.length);
		}, timing.pulseInterval / states.length);

		return () => {
			clearInterval(interval);
		};
	}, [enabled, states.length]);

	return states[intensity];
}

// Spinner animation hook with multiple styles
type SpinnerType = 'dots' | 'line' | 'blocks' | 'scanning';

const spinnerFramesMap: Record<SpinnerType, string[]> = {
	dots: ['\u2840', '\u2844', '\u2846', '\u2847', '\u2843', '\u2841'],
	line: ['\u2500', '\u2572', '\u2502', '\u2571'],
	blocks: ['\u2591', '\u2592', '\u2593', '\u2588', '\u2593', '\u2592'],
	scanning: [
		'[    ]',
		'[\u2588   ]',
		'[\u2588\u2588  ]',
		'[\u2588\u2588\u2588 ]',
		'[\u2588\u2588\u2588\u2588]',
		'[ \u2588\u2588\u2588]',
		'[  \u2588\u2588]',
		'[   \u2588]',
	],
};

export function useSpinner(type: SpinnerType = 'dots') {
	const [frame, setFrame] = useState(0);
	const spinnerFrames = spinnerFramesMap[type];

	useEffect(() => {
		const interval = setInterval(() => {
			setFrame(prev => (prev + 1) % spinnerFrames.length);
		}, timing.spinnerSpeed);

		return () => {
			clearInterval(interval);
		};
	}, [spinnerFrames.length]);

	return spinnerFrames[frame] ?? '';
}

// Boot sequence hook - reveals lines one by one
export function useBootSequence(lines: string[], enabled = true) {
	const [visibleLines, setVisibleLines] = useState<string[]>([]);
	const [isComplete, setIsComplete] = useState(false);

	useEffect(() => {
		if (!enabled) {
			setVisibleLines(lines);
			setIsComplete(true);
			return;
		}

		setVisibleLines([]);
		setIsComplete(false);

		// Track all timeouts for cleanup - use an object to allow mutation from callbacks
		const timeoutTracker = {
			lineTimeouts: [] as Array<ReturnType<typeof setTimeout>>,
			completionTimeout: null as ReturnType<typeof setTimeout> | null,
		};

		for (const [index, line] of lines.entries()) {
			const timeout = setTimeout(() => {
				setVisibleLines(prev => [...prev, line]);
				if (index === lines.length - 1) {
					// Track the completion timeout for proper cleanup
					timeoutTracker.completionTimeout = setTimeout(() => {
						setIsComplete(true);
					}, timing.bootDelay);
				}
			}, index * timing.bootDelay);
			timeoutTracker.lineTimeouts.push(timeout);
		}

		return () => {
			for (const timeout of timeoutTracker.lineTimeouts) {
				clearTimeout(timeout);
			}

			// Also clear the completion timeout if it was scheduled
			if (timeoutTracker.completionTimeout) {
				clearTimeout(timeoutTracker.completionTimeout);
			}
		};
	}, [lines, enabled]);

	return {visibleLines, isComplete};
}
