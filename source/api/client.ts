import axios from 'axios';
import {API_BASE_URL, API_TIMEOUT_MS} from '../config/constants.js';

/**
 * Sanitizes error messages to prevent terminal escape character injection.
 * Removes ANSI escape sequences and control characters that could manipulate
 * terminal output or hide malicious content.
 */
function sanitizeErrorMessage(message: string): string {
	return (
		message
			// Remove ANSI escape sequences (e.g., ESC[31m for colors)
			// eslint-disable-next-line no-control-regex
			.replace(/\u001B\[[\d;]*[A-Za-z]/g, '')
			// Remove other escape sequences (OSC, CSI, etc.)
			// eslint-disable-next-line no-control-regex
			.replace(/\u001B[PX^_\]\\][^\u001B]*(?:\u001B\\|\u0007)?/g, '')
			// Remove control characters except tab, newline, carriage return
			// eslint-disable-next-line no-control-regex
			.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
			// Limit length to prevent DoS via extremely long messages
			.slice(0, 500)
	);
}

// Axios 1.16+ also exports `create` as a named member; the default instance factory is intended here.
// eslint-disable-next-line import/no-named-as-default-member
export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: API_TIMEOUT_MS,
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.response.use(
	response => response,
	error => {
		const rawMessage =
			error.response?.data?.message || error.message || 'Unknown error';
		const message = sanitizeErrorMessage(String(rawMessage));
		return Promise.reject(new Error(message));
	},
);
