'use server';

import api from '@/utils/api';
import { revalidateTag } from 'next/cache';

export default async function createSchoolFormAction(formData: FormData) {
	await api('/schools', {
		method: 'POST',
		body: JSON.stringify({ name: formData.get('name') }),
	});

	revalidateTag('admin-dashboard-schools');
}
