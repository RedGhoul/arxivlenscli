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

	// HTTP 200 means findings are ready
	// HTTP 202 means still generating
	if (response.status === 200) {
		return {
			ready: true,
			data: response.data as KeyFindingsResponse,
		};
	}

	return {
		ready: false,
		data: response.data as KeyFindingsStatusResponse,
	};
}
