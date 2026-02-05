import axios from 'axios';
import {API_BASE_URL, API_TIMEOUT_MS} from '../config/constants.js';

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
		const message =
			error.response?.data?.message || error.message || 'Unknown error';
		return Promise.reject(new Error(message));
	},
);
