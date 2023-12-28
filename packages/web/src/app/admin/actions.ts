'use server';

import api from '@/utils/api';
import { revalidateTag } from 'next/cache';

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
