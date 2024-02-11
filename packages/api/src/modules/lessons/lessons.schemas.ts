import { z } from 'zod';

export const createLessonSchema = z.object({
	name: z.string(),
});

export const editLessonSchema = z.object({
	name: z.string(),
	description: z.string(),
});
