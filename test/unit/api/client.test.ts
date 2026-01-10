import axios from 'axios';

const API_BASE_URL = 'https://arxivlens.com/api/v1';

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
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

export default apiClient;
