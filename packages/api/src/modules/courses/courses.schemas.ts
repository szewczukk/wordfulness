import { z } from 'zod';

export const createCourseBodySchema = z.object({
	name: z.string(),
});

export const updateCourseBodySchema = z.object({
	name: z.string().optional(),
});
