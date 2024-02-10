import { z } from 'zod';

export const createUserBodySchema = z
	.object({
		username: z.string().min(1).max(20),
		password: z.string().min(1).max(20),
		role: z.literal('superuser'),
	})
	.or(
		z.object({
			username: z.string().min(1).max(20),
			password: z.string().min(1).max(20),
			role: z.enum(['admin', 'teacher', 'student']),
			schoolId: z.number(),
		})
	);
