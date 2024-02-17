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
		avatarUrl: z.string(),
	})
	.or(
		z.object({
			id: z.number(),
			username: z.string(),
			role: z.literal('superuser'),
			avatarUrl: z.string(),
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

export const flashcardSchema = z.object({
	id: z.number(),
	front: z.string(),
	back: z.string(),
	lessonId: z.number(),
});

export type Flashcard = z.infer<typeof flashcardSchema>;
