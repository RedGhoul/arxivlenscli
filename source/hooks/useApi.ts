import {useState, useCallback} from 'react';

interface UseApiState<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
}

interface UseApiReturn<T, P extends unknown[]> extends UseApiState<T> {
	execute: (...args: P) => Promise<T | null>;
	reset: () => void;
}

export function useApi<T, P extends unknown[] = []>(
	apiFunction: (...args: P) => Promise<T>,
): UseApiReturn<T, P> {
	const [state, setState] = useState<UseApiState<T>>({
		data: null,
		loading: false,
		error: null,
	});

	const execute = useCallback(
		async (...args: P): Promise<T | null> => {
			setState({data: null, loading: true, error: null});
			try {
				const result = await apiFunction(...args);
				setState({data: result, loading: false, error: null});
				return result;
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Unknown error';
				setState({data: null, loading: false, error: message});
				return null;
			}
		},
		[apiFunction],
	);

	const reset = useCallback(() => {
		setState({data: null, loading: false, error: null});
	}, []);

	return {...state, execute, reset};
}
