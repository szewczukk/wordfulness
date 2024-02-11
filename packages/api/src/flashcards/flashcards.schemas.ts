import { z } from 'zod';

export const createFlashcardSchema = z.object({
	front: z.string(),
	back: z.string(),
});
