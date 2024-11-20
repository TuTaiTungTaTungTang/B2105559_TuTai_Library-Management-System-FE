import tokenService from '../services/token.service';
import axios from 'axios';

export default function createHttp(resource: string = '') {
	const http = axios.create({
		baseURL: `http://localhost:3000/api/${resource}`,
	});

	http.interceptors.request.use((config) => {
		console.log("tokenService.authorization " + tokenService.authorization)
		// Check if there is a token in the local storage
		if (tokenService.isAuthorized) config.headers.Authorization = tokenService.authorization;
		return config;
	});

	http.interceptors.response.use(
		(res) => res.data,
		(error) => {
			throw error.response?.data || error;
		},
	);

	return http;
}