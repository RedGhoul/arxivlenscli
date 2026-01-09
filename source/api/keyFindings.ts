import {apiClient} from './client.js';
import type {KeyFindingsResponse, KeyFindingsStatusResponse} from './types.js';

export type KeyFindingsResult =
	| {ready: true; data: KeyFindingsResponse}
	| {ready: false; data: KeyFindingsStatusResponse};

export async function getKeyFindings(
	paperId: string,
): Promise<KeyFindingsResult> {
	const response = await apiClient.get<
		KeyFindingsResponse | KeyFindingsStatusResponse
	>(`/papers/${paperId}/key-findings`);

	if (response.status === 200) {
		return {
			ready: true,
			data: response.data as KeyFindingsResponse,
		};
	}

	if (response.status === 202) {
		return {
			ready: false,
			data: response.data as KeyFindingsStatusResponse,
		};
	}

	const error = new Error(
		response.data &&
		typeof response.data === 'object' &&
		'message' in response.data
			? (response.data as {message: string}).message
			: 'Failed to fetch key findings',
	);
	(error as any).status = response.status;
	throw error;
}
