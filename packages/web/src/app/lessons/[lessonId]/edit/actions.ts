'use server';

import api from '@/utils/api';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function editLessonFormAction(formData: FormData) {
	const lessonId = formData.get('lessonId');

	await api(`/lessons/${lessonId}`, {
		method: 'PATCH',
		body: JSON.stringify({
			name: formData.get('name'),
			description: formData.get('description'),
		}),
	});

	revalidateTag('lesson');
	redirect(`/lessons/${lessonId}`);
}

export async function deleteLesson(lessonId: number, courseId: number) {
	await api(`/lessons/${lessonId}`, {
		method: 'DELETE',
	});

	revalidateTag('course');
	redirect(`/courses/${courseId}`);
}
