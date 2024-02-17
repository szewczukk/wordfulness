import { cookies } from 'next/headers';

export default async function api(
	path: string,
	config?: Omit<RequestInit, 'headers'>
) {
	let headers: HeadersInit = [['Content-Type', 'application/json']];

	const token = cookies().get('token')?.value;

	if (token) {
		headers = [...headers, ['Authorization', `Bearer ${token}`]];
	}

	const response = await fetch(`http://localhost:3001${path}`, {
		headers,
		...config,
	});

	const result = await response.json();

	return result;
}

export async function noContentTypeApi(path: string, config?: RequestInit) {
	let headers: HeadersInit = [];

	const token = cookies().get('token')?.value;

	if (token) {
		headers = [...headers, ['Authorization', `Bearer ${token}`]];
	}

	const response = await fetch(`http://localhost:3001${path}`, {
		headers: headers,
		...config,
	});

	const result = await response.json();

	return result;
}
