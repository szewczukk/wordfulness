import { z } from 'zod';

export const schoolSchema = z.object({
	id: z.number(),
	name: z.string(),
});

export type School = z.infer<typeof schoolSchema>;

export const userSchema = z
	.object({
		id: z.number(),
		username: z.string(),
		schoolId: z.number(),
		role: z.enum(['admin', 'teacher', 'student']),
	})
	.or(
		z.object({
			id: z.number(),
			username: z.string(),
			role: z.literal('superuser'),
		})
	);

export type User = z.infer<typeof userSchema>;

export const courseSchema = z.object({
	id: z.number(),
	name: z.string(),
	schoolId: z.number(),
});

export type Course = z.infer<typeof courseSchema>;

export const lessonSchema = z.object({
	id: z.number(),
	name: z.string(),
	courseId: z.number(),
	description: z.string(),
});

export type Lesson = z.infer<typeof lessonSchema>;
