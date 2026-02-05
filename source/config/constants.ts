/**
 * Centralized configuration constants for the application.
 * These values can be overridden via environment variables where applicable.
 */

// Helper to safely access environment variables (works in both Node.js and Jest)
function getEnvVar(key: string, defaultValue: string): string {
	try {
		// Using globalThis.process for broader compatibility across environments
		// eslint-disable-next-line n/prefer-global/process
		const env = globalThis.process?.env;
		return env?.[key] ?? defaultValue;
	} catch {
		return defaultValue;
	}
}

// API Configuration
export const API_BASE_URL = getEnvVar(
	'ARXIVLENS_API_URL',
	'https://arxivlens.com/api/v1',
);
export const API_TIMEOUT_MS = 30_000; // 30 seconds

// Download Configuration
export const MAX_DOWNLOAD_RETRIES = 3;
export const DOWNLOAD_QUEUE_DELAY_MS = 100; // Delay between queue processing iterations
export const DOWNLOAD_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes per download

// PDF Cache Configuration
export const PDF_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Polling Configuration
export const KEY_FINDINGS_POLL_INTERVAL_MS = 3000; // 3 seconds
