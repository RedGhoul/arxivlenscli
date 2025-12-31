import {useApp} from '../context/AppContext.js';

export function useNavigation() {
	const {navigation, navigate, goBack, canGoBack} = useApp();

	return {
		currentRoute: navigation.route,
		params: navigation.params,
		navigate,
		goBack,
		canGoBack,
	};
}
