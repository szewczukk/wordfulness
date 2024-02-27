'use server';

import api from '@/utils/api';
import { userSchema } from '@/utils/types';
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

	const users = z.array(userSchema).parse(response);
	return users;
}
