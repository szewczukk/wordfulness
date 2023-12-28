import axios from 'axios';
import { cookies } from 'next/headers';

const api = axios.create({
	baseURL: 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
	const token = cookies().get('token')?.value;

	if (token) {
		config.headers.set('authorization', `Bearer ${token}`);
	}

	return config;
});

export default api;
