'use server';

import api from '@/utils/api';
import { revalidateTag } from 'next/cache';

export async function addFlashcardToDeck(flashcardId: number) {
	await api(`/deck`, {
		method: 'POST',
		body: JSON.stringify({ flashcardId }),
		next: { tags: ['flashcards'] },
	});

	revalidateTag('deck');
}
