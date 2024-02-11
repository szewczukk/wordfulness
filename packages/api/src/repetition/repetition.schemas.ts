import { z } from 'zod';

export const addFlashcardToDeckBodySchema = z.object({
	flashcardId: z.number(),
});

export const getNthFlashcardFromDeck = z.object({
	n: z.string(),
});
