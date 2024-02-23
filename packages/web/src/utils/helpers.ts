'use server';

import api from './api';
import { userSchema } from './types';

export async function getCurrentUser() {
	let userResult: unknown;
	try {
		userResult = await api('/me', { next: { tags: ['current-user'] } });
	} catch {
		return undefined;
	}

	const currentUser = userSchema.parse(userResult);
	return currentUser;
}
