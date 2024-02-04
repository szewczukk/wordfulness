'use server';

import api from '@/utils/api';
import { flashcardSchema } from '@/utils/types';

export async function increaseFlashcardScore(id: number) {
	const currentFlashcardResult = await api(`/deck/${id}/increase`, {
		method: 'POST',
	});
	const currentFlashcard = flashcardSchema.parse(currentFlashcardResult);

	return currentFlashcard;
}

export async function fetchNthFlashcardFromDeck(nth: number) {
	const flashcardResult = await api(`/deck/nth/${nth}`);
	const flashcard = flashcardSchema.parse(flashcardResult);

	return flashcard;
}
