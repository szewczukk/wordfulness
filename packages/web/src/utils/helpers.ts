'use server';

import api from './api';
import { userSchema } from './types';

export async function getCurrentUser() {
	let userResult: any;
	try {
		userResult = await api('/me');
	} catch {
		return undefined;
	}

	const currentUser = userSchema.parse(userResult);

	return currentUser;
}
