'use server';

import api from '@/utils/api';
import { revalidateTag } from 'next/cache';

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
