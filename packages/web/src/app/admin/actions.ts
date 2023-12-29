'use server';

import api from '@/utils/api';
import { currentUserSchema } from '@/utils/types';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

export async function createSchoolFormAction(formData: FormData) {
	await api('/schools', {
		method: 'POST',
		body: JSON.stringify({ name: formData.get('name') }),
	});

	revalidateTag('admin-dashboard-schools');
}

export async function deleteSchoolAction(id: number) {
	await api(`/schools/${id}`, {
		method: 'DELETE',
	});

	revalidateTag('admin-dashboard-schools');
}

export async function fetchUsers(schoolId: number) {
	const response = await api(`/schools/${schoolId}/users`);

	const users = z.array(currentUserSchema).parse(response);

	return users;
}

export async function createUserAction(formData: FormData) {
	const formSchoolId = formData.get('schoolId');

	if (!formSchoolId) {
		return;
	}

	const schoolId = parseInt(formSchoolId.toString());

	if (!schoolId) {
		return;
	}

	const result = await api('/users', {
		method: 'POST',
		body: JSON.stringify({
			username: formData.get('username'),
			password: formData.get('password'),
			schoolId,
			role: formData.get('role'),
		}),
	});

	const user = currentUserSchema.parse(result);

	return user;
}

export async function deleteUserAction(id: number) {
	const result = await api(`/users/${id}`, {
		method: 'DELETE',
	});

	const user = currentUserSchema.parse(result);

	return user;
}
