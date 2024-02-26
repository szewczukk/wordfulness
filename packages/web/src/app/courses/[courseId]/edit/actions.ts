'use server';

import api from '@/utils/api';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteCourse(courseId: number) {
	await api(`/courses/${courseId}`, { method: 'DELETE' });

	revalidateTag('courses');
	redirect('/');
}

export async function editCourseFormAction(formData: FormData) {
	const courseId = formData.get('courseId');

	await api(`/courses/${courseId}`, {
		method: 'PATCH',
		body: JSON.stringify({
			name: formData.get('name'),
			description: formData.get('description'),
		}),
	});

	revalidateTag('course');
	redirect(`/courses/${courseId}`);
}
