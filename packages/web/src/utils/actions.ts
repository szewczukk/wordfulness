'use server';

import api from '@/utils/api';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { userSchema } from './types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addFlashcardToDeck(flashcardId: number) {
	await api('/deck', {
		method: 'POST',
		body: JSON.stringify({ flashcardId }),
		next: { tags: ['flashcards'] },
	});

	revalidateTag('deck');
}

export async function removeFlashcardFromDeck(flashcardId: number) {
	await api(`/deck/${flashcardId}`, {
		method: 'DELETE',
		next: { tags: ['flashcards'] },
	});

	revalidateTag('deck');
}

export async function fetchUsers(schoolId: number) {
	const response = await api(`/schools/${schoolId}/users`);

	const users = z.array(userSchema).parse(response);

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

	const user = userSchema.parse(result);

	return user;
}

export async function deleteUserAction(id: number) {
	const result = await api(`/users/${id}`, {
		method: 'DELETE',
	});

	const user = userSchema.parse(result);

	return user;
}

export async function logoutAction() {
	cookies().delete('token');
	redirect('/login');
}

export async function deleteFlashcard(flashcardId: number) {
	await api(`/flashcards/${flashcardId}`, { method: 'DELETE' });

	revalidateTag('flashcards');
}
