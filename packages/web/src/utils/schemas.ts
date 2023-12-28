import { z } from 'zod';

export const currentUserSchema = z.object({
	id: z.number(),
	username: z.string(),
	role: z.enum(['superuser', 'admin', 'teacher', 'student']),
});
