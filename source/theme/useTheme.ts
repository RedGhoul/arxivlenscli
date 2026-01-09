import {useMemo} from 'react';
import {useApp} from '../context/AppContext.js';
import {colorSchemes} from './colors.js';
import {borders, separators, symbols} from './borders.js';
import {
	fonts,
	decorators,
	ASCII_LOGO,
	ASCII_LOGO_COMPACT,
} from './typography.js';

export function useTheme() {
	const {settings} = useApp();

	const theme = useMemo(() => {
		return {
			colors: colorSchemes[settings.colorScheme],
			borders,
			separators,
			symbols,
			fonts,
			decorators,
			logo: ASCII_LOGO,
			logoCompact: ASCII_LOGO_COMPACT,
		};
	}, [settings.colorScheme]);

	return theme;
}
