import { z } from 'zod';

export const schoolSchema = z.object({
	id: z.number(),
	name: z.string(),
});

export type School = z.infer<typeof schoolSchema>;

export const currentUserSchema = z.object({
	id: z.number(),
	username: z.string(),
	role: z.enum(['superuser', 'admin', 'teacher', 'student']),
});

export type User = z.infer<typeof currentUserSchema>;
